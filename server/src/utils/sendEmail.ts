import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, html: string) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    auth: {
      pass: "G$yXB.NKk|)+p.o0D@[~",
      user: "philip@codeamigo.dev",
    },
    from: "philip@codeamigo.dev",
    service: "gmail",
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"codeamigo.dev" <philip@codeamigo.dev>',
    html,

    subject: "Change password",
    // sender address
    to,
    // html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
