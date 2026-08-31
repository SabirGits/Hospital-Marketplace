const mongoose = require("mongoose");

// Patients don't need approval or a password — this just gives them a
// persistent identity so their name/email is on record if you build
// favorites or booking history against it later.
const patientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
