import md5 from "js-md5";

interface Env {
  MAILCHIMP_API_KEY: string;
  MAILCHIMP_SERVER_PREFIX: string;
  MAILCHIMP_AUDIENCE_ID: string;
  ALLOWED_ORIGIN: string;
}

interface RequestBody {
  formType: "waitlist" | "newsletter" | "contact";
  email: string;
  name?: string;
  subject?: string;
  message?: string;
}

function corsHeaders(origin: string, allowed: string): Record<string, string> {
  const isAllowed =
    origin === allowed || origin === "http://localhost:4321";
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  origin: string,
  allowed: string
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin, allowed),
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        { error: "Method not allowed" },
        405,
        origin,
        env.ALLOWED_ORIGIN
      );
    }

    let body: RequestBody;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        { error: "Invalid JSON" },
        400,
        origin,
        env.ALLOWED_ORIGIN
      );
    }

    // Validate required fields
    const { formType, email, name, subject, message } = body;

    if (!formType || !["waitlist", "newsletter", "contact"].includes(formType)) {
      return jsonResponse(
        { error: "Invalid formType" },
        400,
        origin,
        env.ALLOWED_ORIGIN
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse(
        { error: "Invalid email address" },
        400,
        origin,
        env.ALLOWED_ORIGIN
      );
    }

    if (formType === "contact" && (!message || message.trim().length < 10)) {
      return jsonResponse(
        { error: "Message is required (minimum 10 characters)" },
        400,
        origin,
        env.ALLOWED_ORIGIN
      );
    }

    // Mailchimp API setup
    const dc = env.MAILCHIMP_SERVER_PREFIX;
    const listId = env.MAILCHIMP_AUDIENCE_ID;
    const apiKey = env.MAILCHIMP_API_KEY;
    const subscriberHash = md5(email.toLowerCase());
    const baseUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;
    const authHeader = "Basic " + btoa(`anystring:${apiKey}`);

    // Build merge fields
    const mergeFields: Record<string, string> = {};
    if (name) mergeFields.FNAME = name;
    if (formType === "contact") {
      if (subject) mergeFields.SUBJECT = subject;
      if (message) mergeFields.MESSAGE = message.substring(0, 255);
    }

    // Upsert subscriber via PUT
    const upsertBody: Record<string, unknown> = {
      email_address: email,
      status_if_new: "subscribed",
      merge_fields: mergeFields,
    };

    const upsertRes = await fetch(baseUrl, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upsertBody),
    });

    if (!upsertRes.ok) {
      const err = await upsertRes.json<{ detail?: string }>();
      return jsonResponse(
        { error: err.detail || "Failed to subscribe" },
        upsertRes.status,
        origin,
        env.ALLOWED_ORIGIN
      );
    }

    // Tag the subscriber
    const tagName =
      formType === "waitlist"
        ? "waitlist"
        : formType === "newsletter"
          ? "newsletter"
          : "contact";

    await fetch(`${baseUrl}/tags`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: [{ name: tagName, status: "active" }],
      }),
    });

    // For contact form: add note if message is longer than 255 chars
    if (formType === "contact" && message && message.length > 255) {
      await fetch(`${baseUrl}/notes`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note: `[Contact Form — ${subject || "general"}]\n\n${message}`,
        }),
      });
    }

    return jsonResponse(
      { ok: true, message: "Subscribed successfully" },
      200,
      origin,
      env.ALLOWED_ORIGIN
    );
  },
};
