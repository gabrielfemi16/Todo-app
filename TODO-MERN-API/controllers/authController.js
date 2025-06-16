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

//function to send Registration Email
const sendRegistrationEmail = (userEmail) => {
  const mailOptions = {
    from: "training@codebadgertech.com",
    to: userEmail,
    subject: "Welcome to Task App",
    html: `
         <h1 style="color:red;">Welcome to my task app</h1>
         <p>Thank you for registering</p>
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

//Regular expressions for password complexity
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//function to encrypt password
const encryptPassword = (psw) => {
  return CryptoJS.AES.encrypt(psw, process.env.PASS_SEC).toString();
};

//function to Decrypt User Password
const decryptPassword = (psw) => {
  return CryptoJS.AES.decrypt(psw, process.env.PASS_SEC).toString(
    CryptoJS.enc.Utf8
  );
};

const registerPost = async (req, res) => {
  try {
    const { username, email, password, cPassword } = req.body;
    //check if all field were filled
    if (!username || !email || !password || !cPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //check if email is valid
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }
    //if password matches password regex
    if (!validator.matches(password, PASSWORD_REGEX)) {
      return res.status(401).json({
        message:
          "Passwords minimun lenght is 8 characters and must contain at least one uppercase, one lowercase letters, one number and one special character(@$!%*?&)",
      });
    }
    //check if password matches confirm password
    if (password !== cPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    //check database if email is already existing
    const isEmailExisting = await User.findOne({ email: email });
    if (isEmailExisting) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({
      username: username,
      email: email,
      password: encryptPassword(password),
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    //send a verification email to user
    sendRegistrationEmail(email);

    res.status(200).json({ message: "signup successful, pls login" });
  } catch (err) {
    console.log(err);
  }
};

const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "email is not registered" });
    }

    const decryptedPassword = decryptPassword(user.password);
    if (decryptedPassword !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const accessToken = JWT.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        email: user.email,
        username: user.username,
        image: user.image
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const maxAge = 86400;
    res.cookie("jwtToken", accessToken, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.log(err);
  }
};

const fetchAuthenticatedUser = (req, res) => {
  const token = req.cookies.jwtToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    res.status(200).json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwtToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production", //true in production
  });
  res.status(200).json({ message: "Logged out" });
};

module.exports = {
  loginPost,
  registerPost,
  fetchAuthenticatedUser,
  logout,
};

// 12345AB@ab

// An HttpOnly cookie is a type of web cookie that is specifically marked with the "httpOnly" flag, which prevents client side scripts like javascript from accessing its data, meaning only the server can read and modify the cookie
