import * as uuid from "uuid";
import { createTransport } from "nodemailer";

/** A variable representing whether the mail function is available. */
let canMail = true;

/** The mailer used to send messages. */
let mailer = createTransport({
  host: process.env.EMAIL_HOST,
  port: +(process.env.EMAIL_PORT ?? 0),
  secure: true,
  pool: true,
  auth: {
    user: process.env.EMAIL_ADDR,
    pass: process.env.EMAIL_PASSWD,
  },
});

mailer.verify((err) => {
  if (err) {
    canMail = false;
  }
});

/**
 * Sends an email.
 * @param to The address to send the email to.
 * @param subject The subject of the email.
 * @param text A plaintext version of the email.
 * @param obj An object containing additional information about the email, such as an HTML version.
 * @returns A promise resolving once the email has been sent.
 */
async function send(
  to: string,
  subject: string,
  text: string,
  { html }: { html: string }
) {
  if (canMail) {
    try {
      await mailer.sendMail({
        to,
        subject,
        text,
        html,
        from: `zSnout <${process.env.EMAIL_ADDR}>`,
        inReplyTo: uuid.v4(),
        messageId: uuid.v4(),
      });
    } catch {}
  }
}

export default send;
