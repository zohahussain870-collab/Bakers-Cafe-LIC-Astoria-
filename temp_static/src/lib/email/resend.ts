import type { ContactEmailRequest } from "../validations/chat";

export interface SendEmailResult {
  success: boolean;
  notConfigured?: boolean;
  id?: string;
  message: string;
  mailtoUrl?: string;
}

/**
 * Escapes HTML entities to prevent injection in email clients.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sends a contact inquiry email via the Resend API.
 * If RESEND_API_KEY is not configured, provides a safe mailto fallback.
 */
export async function sendContactEmail(
  data: ContactEmailRequest
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail =
    process.env.HOME_BAKERY_CONTACT_EMAIL || "contact@homebakery.pk";
  const fromEmail =
    process.env.EMAIL_FROM || "Home Bakery <onboarding@resend.dev>";

  const mailtoBody = `Name: ${data.customerName || "Customer"}\nEmail: ${data.customerEmail}\n\nMessage:\n${data.message}`;
  const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(
    `[Home Bakery] ${data.subject}`
  )}&body=${encodeURIComponent(mailtoBody)}`;

  // If Resend API key is not configured, return safe unconfigured status with mailto fallback
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-resend-api-key-here") {
    return {
      success: false,
      notConfigured: true,
      message:
        "Direct email sending is not yet configured with an active provider (RESEND_API_KEY). You can send your inquiry via WhatsApp or click below to open your email client.",
      mailtoUrl,
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E6DCce; border-radius: 12px; background-color: #FAF7F2;">
        <h2 style="color: #211510; border-bottom: 2px solid #B87D4B; padding-bottom: 8px;">New Customer Inquiry — Home Bakery</h2>
        <p><strong>Customer Name:</strong> ${escapeHtml(data.customerName || "Customer")}</p>
        <p><strong>Reply-to Email:</strong> <a href="mailto:${escapeHtml(data.customerEmail)}">${escapeHtml(data.customerEmail)}</a></p>
        <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #E6DCce; margin-top: 16px;">
          <h4 style="margin-top: 0; color: #8E7C72;">Message:</h4>
          <p style="white-space: pre-wrap; color: #211510; line-height: 1.6;">${escapeHtml(data.message)}</p>
        </div>
        <p style="font-size: 11px; color: #8E7C72; margin-top: 24px;">Received via Home Bakery Karachi customer portal.</p>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipientEmail],
        reply_to: data.customerEmail,
        subject: `[Home Bakery Inquiry] ${data.subject}`,
        text: mailtoBody,
        html: htmlContent,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn(`[Resend API] Email dispatch failed with status ${response.status}`, {
        status: response.status,
        code: errorData?.name || "UNKNOWN_ERROR",
      });

      return {
        success: false,
        message:
          "Email delivery service rejected the request. Please connect via WhatsApp or your email app.",
        mailtoUrl,
      };
    }

    const result = await response.json();
    return {
      success: true,
      id: result?.id,
      message: "Your message has been sent successfully! Our kitchen will reply shortly.",
    };
  } catch (err: unknown) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    console.warn(`[Resend API] Dispatch error (${isAbort ? "timeout" : "network"})`);

    return {
      success: false,
      message:
        "Unable to reach the email server right now. Please message us on WhatsApp or use the email link below.",
      mailtoUrl,
    };
  }
}
