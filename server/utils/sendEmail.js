const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sanskritiag04@gmail.com",
      pass: "ostx rujg jvno jdan"
    }
  });

  await transporter.sendMail({
    from: "sanskritiag04gmail.com",
    to,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`
  });
};

module.exports = sendEmail;