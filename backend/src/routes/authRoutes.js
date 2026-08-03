const express = require('express');
const router = express.Router();

const { register, login, getMe, verifyOtp, resendOtp } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema } = require('../validators/authValidator');
const validate = require('../middleware/validateMiddleware');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/resend-otp', validate(resendOtpSchema), resendOtp);
router.get('/me', authMiddleware, getMe);

module.exports = router;