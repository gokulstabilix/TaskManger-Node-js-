const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes — require valid session cookie
router.get('/me', authController.protect, authController.getMe);

module.exports = router;

