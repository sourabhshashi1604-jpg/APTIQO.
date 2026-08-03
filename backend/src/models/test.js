const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Test", TestSchema);