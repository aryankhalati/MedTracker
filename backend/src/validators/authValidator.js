const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

const verifyOtpSchema = z.object({
    email: z.string().trim().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be 6 digits')
});

const resendOtpSchema = z.object({
    email: z.string().trim().email('Invalid email address')
});

module.exports = { registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema };