const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sessionSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },
        session_start: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
    },
    {
        collection: "sessions",
        timestamps: true
    }
);

module.exports = mongoose.model("sessions", sessionSchema);
