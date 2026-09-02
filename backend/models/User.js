const mongoose = require("mongoose");

// This is the one collection that holds every hospital/clinic/medical
// account — role tells you which kind, status gates whether they can log
// in yet. Role-specific fields (hospitalName, specialties, etc.) are only
// filled in for the role they apply to; the rest just stay empty for that
// document, which is simpler than three separate collections for now.
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },

        location: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        website: { type: String, default: "", trim: true },
        socialMedia: { type: String, default: "", trim: true },
        image: { type: String, default: "" }, // base64 data URI — no file storage service set up, so it lives directly on the document

        role: {
            type: String,
            required: true,
            enum: ["Hospital", "Medical", "Clinic"]
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        plan: { type: String, enum: ["basic", "verified", "premium"], default: "basic" },

        // Hospital-specific
        hospitalName: { type: String, default: "" },
        hospitalType: { type: String, default: "" },
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        mapLink: { type: String, default: "" },
        specialties: { type: String, default: "" }, // comma-separated, matches how the frontend form sends it
        emergency: { type: Boolean, default: false },
        description: { type: String, default: "" },

        // Clinic-specific
        clinicName: { type: String, default: "" },

        // Medical-specific
        businessName: { type: String, default: "" },
        medicalType: { type: String, default: "" },

        // Shared by clinic/medical
        services: { type: String, default: "" },

        // Patient ratings (hospital/clinic/medical listings can all be rated)
        ratingSum: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },

        // Password reset (demo-level — no email service wired up yet, see authController)
        resetCode: { type: String, default: null },
        resetCodeExpires: { type: Date, default: null },
    },
    { timestamps: true }
);

// Never let the password (or reset code) leak out in a JSON response.
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.resetCode;
    delete obj.resetCodeExpires;
    obj.rating = obj.ratingCount ? +(obj.ratingSum / obj.ratingCount).toFixed(1) : 0;
    obj.reviews = obj.ratingCount;
    return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
