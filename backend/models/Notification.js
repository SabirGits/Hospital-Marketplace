const mongoose = require("mongoose");

// "recipient" is either "admin" or a provider's email — the frontend bell
// filters by whichever account is currently logged in.
const notificationSchema = new mongoose.Schema(
    {
        recipient: { type: String, required: true, index: true },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
