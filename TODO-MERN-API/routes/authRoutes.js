const express = require("express");
const router = express.Router();

const {
  loginPost,
  registerPost,
  fetchAuthenticatedUser,
  logout
} = require("../controllers/authController");

router.post("/login", loginPost);

router.post("/register", registerPost);

router.get("/me", fetchAuthenticatedUser);

router.post("/logout", logout)

module.exports = router;
