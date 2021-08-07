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

function send(options) {
  return mailer.sendMail({
    from: `zSnout <${process.env.EMAIL_ADDR}>`,
    inReplyTo: uuid.v4() + Math.random(),
    messageId: uuid.v4() + Math.random(),
    ...options
  });
}

module.exports = { send };