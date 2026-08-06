const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // Authentication
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            default: null,
        },

        role: {
            type: String,
            enum: ["admin", "recruiter", "candidate"],
            default: "candidate",
        },

        // Account Status
        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },

        // Authentication Provider
        authProvider: {
            type: String,
            enum: ["email", "google"],
            default: "email",
        },

        googleId: {
            type: String,
            default: null,
        },

        googleEmail: {
            type: String,
            default: null,
        },

        // Session
        refreshTokenHash: {
            type: String,
            default: null,
        },

        lastLoginAt: {
            type: Date,
            default: null,
        },

        lastPasswordChangedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index(
    { googleId: 1 },
    {
        unique: true,
        sparse: true,
    }
);

module.exports = mongoose.model("User", userSchema);