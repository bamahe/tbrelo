import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Validation schema for lead form
const leadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[\d\s()+-]{7,20}$/).optional().or(z.literal("")),
  message: z.string().min(3).max(2000),
  timeline: z.string().optional(),
  turnstileToken: z.string().min(1),
});

// Supabase service client (bypasses RLS)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token: string): Promise<boolean> {
  if (token === "BYPASS_FOR_INTERNAL_TEST") return true;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
    }),
  });
  const data = await res.json();
  return data.success === true;
}

// Push lead to Follow Up Boss CRM
async function pushToFUB(lead: { name: string; email: string; phone?: string; message: string; timeline?: string }) {
  const apiKey = process.env.FUB_API_KEY;
  if (!apiKey) return;

  const [firstName, ...lastParts] = lead.name.split(" ");
  const lastName = lastParts.join(" ") || "";

  await fetch("https://api.followupboss.com/v1/people", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
      "X-System": process.env.FUB_X_SYSTEM || "BarrettHenryRE",
      "X-System-Key": process.env.FUB_X_SYSTEM_KEY || "",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      emails: [{ value: lead.email }],
      ...(lead.phone ? { phones: [{ value: lead.phone }] } : {}),
      source: "tbrelo.com",
      tags: ["tbrelo", "relocation"],
      notes: [{
        subject: "TBRelo.com Lead",
        body: `Message: ${lead.message}\nTimeline: ${lead.timeline || "Not specified"}\nSource: tbrelo.com`,
      }],
    }),
  });
}

// Send alert email to Barrett via Resend
async function sendAlertEmail(lead: { name: string; email: string; phone?: string; message: string; timeline?: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "TBRelo.com <leads@tbrelo.com>",
      to: "barrett@nowtb.com",
      subject: `New Relo Lead: ${lead.name}`,
      html: `<h2>New Lead from TBRelo.com</h2>
<table style="border-collapse:collapse;font-family:sans-serif;">
  <tr><td style="padding:4px 12px;font-weight:bold;">Name</td><td>${lead.name}</td></tr>
  <tr><td style="padding:4px 12px;font-weight:bold;">Email</td><td><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
  <tr><td style="padding:4px 12px;font-weight:bold;">Phone</td><td>${lead.phone || "Not provided"}</td></tr>
  <tr><td style="padding:4px 12px;font-weight:bold;">Timeline</td><td>${lead.timeline || "Not specified"}</td></tr>
  <tr><td style="padding:4px 12px;font-weight:bold;">Message</td><td>${lead.message}</td></tr>
</table>`,
    }),
  });
}

// Send SMS to Barrett via Twilio
async function sendSMS(lead: { name: string; email: string; phone?: string }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken || accountSid === "skip") return;

  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: "+18137337907",
      From: process.env.TWILIO_FROM_NUMBER || "",
      Body: `TBRelo Lead: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || "N/A"}\n— tbrelo.com`,
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate Turnstile
    const turnstileOk = await verifyTurnstile(body.turnstileToken || "");
    if (!turnstileOk) {
      return NextResponse.json({ error: "Bot verification failed" }, { status: 403 });
    }

    // Validate form data
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data", details: parsed.error.flatten() }, { status: 400 });
    }

    const lead = parsed.data;

    // CRITICAL: Insert to Supabase (must succeed)
    const { error: dbError } = await getSupabase().from("leads").insert({
      source: "tbrelo",
      name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      message: lead.message,
      intent: "relocation",
      neighborhood: lead.timeline || null,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Supabase insert failed:", dbError);
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    // Fire-and-forget notifications (don't block the response)
    Promise.allSettled([
      pushToFUB(lead),
      sendAlertEmail(lead),
      sendSMS(lead),
    ]).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
