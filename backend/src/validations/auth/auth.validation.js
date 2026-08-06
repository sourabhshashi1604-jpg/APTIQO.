const Joi = require("joi");

// Register Validation
const registerSchema = Joi.object({
    fullName: Joi.string()
        .min(3)
        .max(100)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .required(),

    role: Joi.string()
        .valid("candidate", "recruiter")
        .default("candidate"),
});

// Login Validation
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required(),
});

// Forgot Password Validation
const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
});

// Reset Password Validation
const resetPasswordSchema = Joi.object({
    password: Joi.string()
        .min(8)
        .required(),

    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
        }),
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};