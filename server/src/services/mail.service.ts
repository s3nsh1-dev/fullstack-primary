import nodemailer, { type Transporter, type SendMailOptions } from "nodemailer";
import env from "../utils/dotenvHelper";

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
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined,
      },
      logger: env.NODE_ENV === "development",
      debug: env.NODE_ENV === "development",
    });
  }
  async verifyMailConnection() {}
  async sendContactFormEmail() {}
  async close() {}
}

const mailService = new NodemailerClass();
export { mailService };
