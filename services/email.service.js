require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");
const pug = require("pug");


const transporter = () => {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER_ID, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });
}

const sendMail = async (mail) => {
  const mailOptions = {
    from: `${mail.companyName} <${mail.from}>`, // sender address
    to: mail.to, // list of receivers
    subject: mail.subject, // Subject line
    text: mail.inviteLink, // plain text body
    html: pug.renderFile(path.resolve(__dirname,"../views/email-template.pug"),mail),
  }
  const msgRes =  await transporter().sendMail(mailOptions);
  return msgRes;
}

module.exports = {
  sendMail
}