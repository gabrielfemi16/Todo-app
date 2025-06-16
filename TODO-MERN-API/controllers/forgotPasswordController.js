const validator = require("validator");
const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: "mail.codebadgertech.com",
  port: 465, //use out going server smtp port
  auth: {
    user: "training@codebadgertech.com",
    pass: "training@30",
  },
});

//Regular expressions for password complexity
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//function to encrypt password
const encryptPassword = (psw) => {
  return CryptoJS.AES.encrypt(psw, process.env.PASS_SEC).toString();
};

const sendResetPassword = (userEmail, resetLink) => {
  const mailOptions = {
    from: "training@codebadgertech.com",
    to: userEmail,
    subject: "Password Reset Request",
    text: `To reset your password, click on the following link: ${resetLink}`,
    html: `
           <div style="background-color:rgb(238, 237, 237); padding:20px;">
           <p style="color: black; background: white; padding:15px; line-height:2.0; 
           border-radius: 10px;"> You are receiving this email because you requested a password change.
           To reset your password, click the following link: ${resetLink}. this link expires in 3mins</p>
           <br/><b style="color: green;">Todo Mern App</b>
           </div>
          `,
  };

  //return transporter.sendMail(mailOptions)
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info.response);
    }
  });
};

const resetRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Your registered email is required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "email is not registered" });
    }

    const token = JWT.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "3m",
    });

    const resetLink = `http://localhost:5173/user/reset-password/${token}`;

    sendResetPassword(email, resetLink);
    res.status(200).json({ message: "Reset link sent,  check email" });
  } catch (err) {
    console.log(err);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (!validator.matches(password, PASSWORD_REGEX)) {
      return res.status(401).json({
        message:
          "Passwords minimun lenght is 8 characters and must contain at least one uppercase, one lowercase letters, one number and one special character(@$!%*?&)",
      });
    }

    const hashedPassword = encryptPassword(password);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    user.password = hashedPassword;

    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error! seems your reset link has expired",
    });
  }
};

module.exports = {
  resetRequest,
  resetPassword,
};
