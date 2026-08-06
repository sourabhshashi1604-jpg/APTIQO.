const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        // Candidate Type
        userType: {
            type: String,
            enum: [
                "student",
                "fresher",
                "experienced",
            ],
            default: "student",
        },

        domain: {
            type: String,
            enum: [
                "technical",
                "non-technical",
            ],
            default: "technical",
        },

        employmentStatus: {
            type: String,
            enum: [
                "student",
                "internship",
                "full-time",
                "freelance",
                "seeking",
            ],
            default: "student",
        },

        // Personal
        fullName: {
            type: String,
            default: "",
        },

        headline: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            default: "",
        },

        profilePhotoUrl: {
            type: String,
            default: "",
        },

        // Career
        education: {
            type: Array,
            default: [],
        },

        experience: {
            type: Array,
            default: [],
        },

        skills: {
            type: Array,
            default: [],
        },

        projects: {
            type: Array,
            default: [],
        },

        resumes: {
            type: Array,
            default: [],
        },

        careerPreferences: {
            type: Object,
            default: {},
        },

        // CES
        opportunityReadiness: {
            overallScore: {
                type: Number,
                default: 0,
            },

            lastUpdated: {
                type: Date,
                default: Date.now,
            },
        },

        weeklyMission: {
            weekStart: Date,

            tasks: {
                type: Array,
                default: [],
            },

            completedCount: {
                type: Number,
                default: 0,
            },

            rewardScore: {
                type: Number,
                default: 0,
            },
        },

        careerTimeline: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Profile",
    profileSchema
);