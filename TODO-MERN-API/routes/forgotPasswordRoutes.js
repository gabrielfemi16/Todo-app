const express = require("express");
const {
  resetRequest,
  resetPassword,
} = require("../controllers/forgotPasswordController");
const router = express.Router();

router.post("/request-reset", resetRequest);
router.post("/reset-password", resetPassword);

module.exports = router;
