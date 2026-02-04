import env from "../utils/dotenvHelper";
import { logService } from "./logger.service";

// this version bypasses the installation of resend and uses the HTTP API directly

class HttpMailService {
  // Minimal "verify" that checks configuration; HTTP providers often don't expose a cheap verify endpoint.
  verifyMailConnection = async () => {
    const value = {
      providerUrl: env.EMAIL_PROVIDER_API_URL,
      from: env.EMAIL_FROM_ADDRESS,
      hasApiKey: Boolean(env.EMAIL_PROVIDER_API_KEY),
    };

    if (!env.EMAIL_PROVIDER_API_KEY || !env.EMAIL_FROM_ADDRESS) {
      logService.error("Email provider configuration incomplete", value);
      throw new Error(
        "Email provider configuration incomplete. Please set EMAIL_PROVIDER_API_KEY and EMAIL_FROM_ADDRESS."
      );
    }

    logService.info("Email provider configuration looks valid", value);
  };

  async sendContactFormEmail(data: ContactFormData): Promise<void> {
    const subject = `Contact Form Submission from ${data.name}`;
    const text = `
New contact form submission:

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

---
You can reply directly to this email to respond to ${data.name}.
    `.trim();

    const payload = {
      from: env.EMAIL_FROM_ADDRESS,
      to: [env.RECIPIENT_MAIL_ID],
      subject,
      text,
      reply_to: data.email,
    };

    try {
      if (!env.EMAIL_PROVIDER_API_KEY || !env.EMAIL_FROM_ADDRESS) {
        throw new Error(
          "Email provider not configured. Missing EMAIL_PROVIDER_API_KEY or EMAIL_FROM_ADDRESS."
        );
      }

      const response = await fetch(env.EMAIL_PROVIDER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.EMAIL_PROVIDER_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "<unreadable>");
        logService.error("Email provider responded with error", {
          status: response.status,
          statusText: response.statusText,
          body: errorBody,
        });
        throw new Error(
          `Email provider error: ${response.status} ${response.statusText}`
        );
      }

      const info = await response.json().catch(() => ({}));

      logService.info("Email sent successfully", {
        providerResponse: info,
        to: env.RECIPIENT_MAIL_ID,
        subject,
        from: env.EMAIL_FROM_ADDRESS,
        replyTo: data.email,
      });
    } catch (error) {
      logService.error("Failed to send email", error, {
        to: env.RECIPIENT_MAIL_ID,
        subject,
        from: data.email,
      });
      throw new Error("Failed to send email. Please try again later.");
    }
  }

  async close(): Promise<void> {
    // No-op for HTTP-based provider, kept for API compatibility if needed later
    logService.info("Email provider close called (no-op for HTTP API)");
  }
}

const mailService = new HttpMailService();
export { mailService };

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
