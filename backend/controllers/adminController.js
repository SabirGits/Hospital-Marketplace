const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/User");
const { createNotification } = require("./notificationController");

// =====================================
// ADMIN LOGIN — completely separate from provider accounts. Admins are
// never created through /register; see utils/bootstrapAdmin.js.
// =====================================
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Invalid admin credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        const token = jwt.sign({ adminId: admin._id, type: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
        await createNotification("admin", "Admin logged in successfully.");

        res.status(200).json({ message: "Login successful", token, admin });
    } catch (error) {
        console.log("Admin Login Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// GET ALL REQUESTS — every provider account regardless of status, newest first
// =====================================
const getRequests = async (req, res) => {
    try {
        const requests = await User.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Requests fetched", requests });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// APPROVE — flips status to approved so they can log in and (if a
// hospital) start showing up in the public listing.
// =====================================
const approveRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Request not found" });
        }

        user.status = "approved";
        await user.save();

        await createNotification(user.email, "Your registration was approved — you can now log in.");
        res.status(200).json({ message: "Provider approved", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// REJECT — deletes the request outright, per your spec: anything not
// accepted should not stick around. The person is notified before the
// record disappears (notifications are keyed by email, not by their
// deleted user id, so this still reaches them if they ever register again
// or you look them up by email).
// =====================================
const rejectRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Request not found" });
        }

        await createNotification(user.email, "Your registration request was rejected by the admin.");
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Request rejected and removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// DELETE — lets the admin remove ANY record on demand, approved or not.
// This is the "keep it or take it down later" option separate from reject.
// =====================================
const deleteProvider = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({ message: "Record deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// EDIT — admin can correct/update any provider's record, image included.
// Deliberately separate from approve/reject: this doesn't touch status.
// =====================================
const EDITABLE_FIELDS = [
    "name", "email", "phone", "location", "website", "socialMedia", "image", "plan",
    "hospitalName", "hospitalType", "address", "city", "mapLink", "specialties", "emergency", "description",
    "clinicName", "businessName", "medicalType", "services",
];

const updateProvider = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Record not found" });
        }

        EDITABLE_FIELDS.forEach((field) => {
            if (req.body[field] !== undefined) user[field] = req.body[field];
        });

        await user.save();
        res.status(200).json({ message: "Record updated", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { adminLogin, getRequests, approveRequest, rejectRequest, deleteProvider, updateProvider };
