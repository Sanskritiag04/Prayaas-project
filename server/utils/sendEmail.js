const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "prayaas59@gmail.com",
      pass: "fpox hbop ikai qsqm"
    }
  });

  await transporter.sendMail({
    from: "prayaas59@gmail.com",
    to,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`
  });
};

module.exports = sendEmail;