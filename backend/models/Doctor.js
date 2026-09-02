const mongoose = require("mongoose");

// A doctor always belongs to the hospital (User with role: "Hospital") that
// added them. Public listings only ever show doctors whose hospital is
// approved — see doctorController.
const doctorSchema = new mongoose.Schema(
    {
        hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        name: { type: String, required: true, trim: true },
        image: { type: String, default: "" }, // base64 data URI, same approach as User.image
        specialty: { type: String, default: "" },
        qualification: { type: String, default: "" },
        experience: { type: Number, default: 0 },
        fee: { type: Number, default: 0 },
        available: { type: Boolean, default: true },
        languages: { type: String, default: "" }, // comma-separated, matches how the frontend collects it
        bio: { type: String, default: "" },
        // Sitting schedule — one time (or blank for "off") per day of the week.
        schedule: {
            Sunday: { type: String, default: "" },
            Monday: { type: String, default: "" },
            Tuesday: { type: String, default: "" },
            Wednesday: { type: String, default: "" },
            Thursday: { type: String, default: "" },
            Friday: { type: String, default: "" },
            Saturday: { type: String, default: "" },
        },
        ratingSum: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

doctorSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.rating = obj.ratingCount ? +(obj.ratingSum / obj.ratingCount).toFixed(1) : 0;
    obj.reviews = obj.ratingCount;
    return obj;
};

module.exports = mongoose.model("Doctor", doctorSchema);
