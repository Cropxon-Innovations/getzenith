import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
};

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSignature = Array.from(new Uint8Array(signatureBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return signature === expectedSignature;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const signature = req.headers.get("x-razorpay-signature");
    const body = await req.text();

    // Verify webhook signature
    if (signature && RAZORPAY_KEY_SECRET) {
      const isValid = await verifySignature(body, signature, RAZORPAY_KEY_SECRET);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response("Invalid signature", { status: 401 });
      }
    }

    const event = JSON.parse(body);
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    console.log("Razorpay webhook event:", event.event);

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;
        const notes = payment.notes || {};

        // Update subscription status
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            payment_id: payment.id,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
              Date.now() + (notes.billing_cycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("payment_id", orderId)
          .select()
          .single();

        if (subError) throw subError;

        // Update tenant plan
        await supabase
          .from("tenants")
          .update({ plan: notes.plan || subscription.plan })
          .eq("id", subscription.tenant_id);

        // Record payment in history
        await supabase.from("payment_history").insert({
          tenant_id: subscription.tenant_id,
          subscription_id: subscription.id,
          amount: payment.amount,
          currency: payment.currency,
          status: "captured",
          payment_provider: "razorpay",
          payment_id: payment.id,
        });

        // Create notification
        await supabase.from("notifications").insert({
          tenant_id: subscription.tenant_id,
          type: "success",
          title: "Payment Successful",
          message: `Your subscription to ${notes.plan} plan is now active!`,
        });

        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;

        // Update subscription status
        const { data: subscription } = await supabase
          .from("subscriptions")
          .update({ status: "failed" })
          .eq("payment_id", orderId)
          .select()
          .single();

        if (subscription) {
          // Record failed payment
          await supabase.from("payment_history").insert({
            tenant_id: subscription.tenant_id,
            subscription_id: subscription.id,
            amount: payment.amount,
            currency: payment.currency,
            status: "failed",
            payment_provider: "razorpay",
            payment_id: payment.id,
          });

          // Create notification
          await supabase.from("notifications").insert({
            tenant_id: subscription.tenant_id,
            type: "error",
            title: "Payment Failed",
            message: "Your payment could not be processed. Please try again.",
          });
        }
        break;
      }

      case "subscription.cancelled": {
        const subscription = event.payload.subscription.entity;
        
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("payment_id", subscription.id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
