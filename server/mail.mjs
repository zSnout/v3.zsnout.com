import * as uuid from "uuid";
import { createTransport } from "nodemailer";

let mailer = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  pool: true,
  auth: {
    user: process.env.EMAIL_ADDR,
    pass: process.env.EMAIL_PASSWD,
  },
});

function send({ to, subject, text, html }) {
  if (process.env.MODE == "DEV") return test({ to, subject, text });

  return mailer.sendMail({
    to,
    subject,
    text,
    html,
    from: `zSnout <${process.env.EMAIL_ADDR}>`,
    inReplyTo: uuid.v4(),
    messageId: uuid.v4(),
  });
}

function test({ to, subject, text }) {
  console.log(`
EMAIL
=====
To: ${to}
Subject: ${subject}
${text}
`);
}

console.debug("mail", "Initialized mailserver...");
export { send };
