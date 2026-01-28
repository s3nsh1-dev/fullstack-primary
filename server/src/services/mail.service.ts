import nodemailer, { type Transporter, type SendMailOptions } from "nodemailer";
import env from "../utils/dotenvHelper";
import { logService } from "./logger.service";

class NodemailerClass {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      port: env.GMAIL_SMTP_PORT,
      host: env.GMAIL_SMTP_HOST,
      secure: env.GMAIL_SMTP_SECURE,
      requireTLS: !env.GMAIL_SMTP_SECURE,
      auth: {
        user: env.GMAIL_AUTH_USER_PROVIDER,
        pass: env.GMAIL_PASSWORD,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      // Force IPv4 as some cloud providers (Render) hang on IPv6
      family: 4,
      tls: {
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined,
      },
      logger: true,
      debug: true,
    } as any);
  }
  verifyMailConnection = async () => {
    const value = {
      host: env.GMAIL_SMTP_HOST,
      port: env.GMAIL_SMTP_PORT,
      user: env.GMAIL_AUTH_USER_PROVIDER,
    };
    try {
      await this.transporter.verify();
      logService.info("SMTP CONNECTION VERIFIED SUCCESSFULLY", value);
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      const errorCode = error?.code || "UNKNOWN";
      logService.error("SMTP connection failed", {
        ...value,
        error: errorMessage,
        code: errorCode,
        stack: error?.stack,
      });
      if (
        errorMessage.includes("Connection closed") ||
        errorMessage.includes("ECONNRESET")
      ) {
        throw new Error(
          `SMTP connection was closed by server. Possible causes:\n` +
            `  1. Invalid credentials (check GMAIL_PASSWORD is a valid App Password)\n` +
            `  2. Gmail account security settings blocking the connection\n` +
            `  3. Try using port 465 with secure: true instead of 587\n` +
            `  4. Check that 2-Factor Authentication is enabled and App Password is correct`
        );
      } else if (
        errorMessage.includes("Invalid login") ||
        errorMessage.includes("authentication")
      ) {
        throw new Error(
          `SMTP authentication failed. Make sure:\n` +
            `  1. You're using a Gmail App Password (not your regular password)\n` +
            `  2. The email address matches the account that generated the App Password\n` +
            `  3. 2-Factor Authentication is enabled on your Google account`
        );
      } else {
        throw new Error(
          `Failed to connect to SMTP server: ${errorMessage}\n` +
            `Check your configuration in env.ts and ensure GMAIL_PASSWORD is set correctly.`
        );
      }
    }
  };
  async sendContactFormEmail(data: ContactFormData): Promise<void> {
    const mailOptions: SendMailOptions = {
      from: env.GMAIL_AUTH_USER_PROVIDER,
      to: env.RECIPIENT_MAIL_ID,
      replyTo: data.email,
      subject: `Contact Form Submission from ${data.name}`,
      text: `
New contact form submission:

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

---
You can reply directly to this email to respond to ${data.name}.
      `.trim(),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logService.info("Email sent successfully", {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject,
        from: data.email,
      });
    } catch (error) {
      logService.error("Failed to send email", error, {
        to: mailOptions.to,
        subject: mailOptions.subject,
        from: data.email,
      });
      throw new Error("Failed to send email. Please try again later.");
    }
  }
  async close(): Promise<void> {
    try {
      this.transporter.close();
      logService.info("SMTP transporter closed");
    } catch (error) {
      logService.error("Error closing SMTP transporter", error);
    }
  }
}

const mailService = new NodemailerClass();
export { mailService };

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
