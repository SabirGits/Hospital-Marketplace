const mongoose = require("mongoose");

// Deliberately its own collection, not just another User with role="Admin" —
// admins are never created through the public /register endpoint, only
// bootstrapped from .env on server start (see utils/bootstrapAdmin.js).
const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        image: { type: String, default: "" },
    },
    { timestamps: true }
);

adminSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model("Admin", adminSchema);
