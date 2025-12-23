import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderRequest {
  plan: 'starter' | 'professional' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  tenantId: string;
}

const PLANS = {
  starter: { monthly: 99900, yearly: 999900, name: 'Starter' },      // ₹999/mo or ₹9,999/yr
  professional: { monthly: 249900, yearly: 2499900, name: 'Professional' }, // ₹2,499/mo or ₹24,999/yr
  enterprise: { monthly: 499900, yearly: 4999900, name: 'Enterprise' },     // ₹4,999/mo or ₹49,999/yr
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { plan, billingCycle, tenantId }: OrderRequest = await req.json();

    // Validate plan
    if (!PLANS[plan]) {
      throw new Error("Invalid plan selected");
    }

    const amount = PLANS[plan][billingCycle];
    const planName = PLANS[plan].name;

    // Get tenant details
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("name, slug")
      .eq("id", tenantId)
      .single();

    if (tenantError) throw tenantError;

    // Create Razorpay order
    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `order_${tenantId}_${Date.now()}`,
        notes: {
          tenant_id: tenantId,
          plan,
          billing_cycle: billingCycle,
        },
      }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      console.error("Razorpay error:", error);
      throw new Error("Failed to create order");
    }

    const order = await orderResponse.json();

    // Store pending order in subscriptions table
    await supabase.from("subscriptions").upsert({
      tenant_id: tenantId,
      plan,
      status: "pending",
      payment_provider: "razorpay",
      payment_id: order.id,
      amount,
      currency: "INR",
      billing_cycle: billingCycle,
    });

    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: RAZORPAY_KEY_ID,
        prefill: {
          name: tenant.name,
        },
        notes: {
          plan: planName,
          billingCycle,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
