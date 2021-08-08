let uuid = require("uuid");
let mailer = require("nodemailer").createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  pool: true,
  auth: {
    user: process.env.EMAIL_ADDR,
    pass: process.env.EMAIL_PASSWD,
  }
});

function send({to, subject, text, html}) {
  return mailer.sendMail({
    to, subject, text, html,
    from: `zSnout <${process.env.EMAIL_ADDR}>`,
    inReplyTo: uuid.v4() + Math.random(),
    messageId: uuid.v4() + Math.random(),
  });
}

function test({to, subject, text}) {
  console.log(`
To: ${to}
Email: ${subject}
${"=".repeat(`Email: ${subject}`.length)}
${text}
`);
}

if ("TESTMODE" in process.env) module.exports = { send: test };
else module.exports = { send };