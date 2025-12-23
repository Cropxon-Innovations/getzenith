import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MeetingInviteRequest {
  meetingId: string;
  meetingTitle: string;
  meetingLink: string;
  scheduledAt: string;
  durationMinutes: number;
  hostName: string;
  participants: string[]; // emails or phone numbers
  tenantPlan: string;
}

const PLAN_LIMITS: Record<string, number> = {
  free: 2,
  pro: 100,
  enterprise: 100,
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      meetingId,
      meetingTitle,
      meetingLink,
      scheduledAt,
      durationMinutes,
      hostName,
      participants,
      tenantPlan,
    }: MeetingInviteRequest = await req.json();

    console.log("Sending meeting invite for:", meetingTitle);
    console.log("Participants:", participants);
    console.log("Tenant Plan:", tenantPlan);

    // Check participant limits
    const limit = PLAN_LIMITS[tenantPlan] || 2;
    if (participants.length > limit) {
      return new Response(
        JSON.stringify({
          error: `Your ${tenantPlan} plan allows up to ${limit} participants. Please upgrade or contact CropXon/Zenith team.`,
          contactInfo: {
            email: "enterprise@cropxon.com",
            phone: "+91-XXXXXXXXXX",
            landline: "+91-XX-XXXXXXXX",
          },
          limitExceeded: true,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const scheduledDate = new Date(scheduledAt);
    const formattedDate = scheduledDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = scheduledDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const emailResults: any[] = [];
    const smsResults: any[] = [];

    for (const participant of participants) {
      const isEmail = participant.includes("@");

      if (isEmail) {
        // Send email using Resend API directly
        try {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Zenith Meetings <meetings@resend.dev>",
              to: [participant],
              subject: `You're invited: ${meetingTitle}`,
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 24px;">Meeting Invitation</h1>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                      <h2 style="color: #1f2937; margin-top: 0;">${meetingTitle}</h2>
                      
                      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>📅 Date:</strong> ${formattedDate}</p>
                        <p style="margin: 10px 0;"><strong>🕐 Time:</strong> ${formattedTime}</p>
                        <p style="margin: 10px 0;"><strong>⏱️ Duration:</strong> ${durationMinutes} minutes</p>
                        <p style="margin: 10px 0;"><strong>👤 Host:</strong> ${hostName}</p>
                      </div>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${meetingLink}" 
                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                          Join Meeting
                        </a>
                      </div>
                      
                      <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                        Or copy this link: <a href="${meetingLink}" style="color: #667eea;">${meetingLink}</a>
                      </p>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                      <p>Powered by Zenith by CropXon</p>
                      <p>Need help? Contact us at support@cropxon.com</p>
                    </div>
                  </body>
                </html>
              `,
            }),
          });

          const emailData = await emailResponse.json();
          
          if (emailResponse.ok) {
            emailResults.push({ email: participant, success: true, data: emailData });
            console.log("Email sent to:", participant);
          } else {
            emailResults.push({ email: participant, success: false, error: emailData.message || "Failed to send" });
            console.error("Email error for", participant, ":", emailData);
          }
        } catch (emailError: any) {
          console.error("Email error for", participant, ":", emailError);
          emailResults.push({ email: participant, success: false, error: emailError.message });
        }
      } else {
        // Log SMS attempt (actual SMS would need Twilio/other provider)
        console.log("SMS invite for:", participant);
        smsResults.push({
          phone: participant,
          success: true,
          message: `SMS would be sent: You're invited to "${meetingTitle}" on ${formattedDate} at ${formattedTime}. Join: ${meetingLink}`,
          note: "SMS requires additional provider setup (Twilio, etc.)",
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailResults,
        smsResults,
        totalInvited: participants.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-meeting-invite function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);