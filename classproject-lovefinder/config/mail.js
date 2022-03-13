import nodemailer from "nodemailer"
var mail = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "a2a67198191b3e",
    pass: "13c2ac0b895572",
  },
});
export default mail;
