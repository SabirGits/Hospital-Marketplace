const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const Patient = require("../models/Patient");
const { createNotification } = require("./notificationController");

const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

function displayName(user) {
    return user.hospitalName || user.clinicName || user.businessName || user.name;
}

function signProviderToken(user) {
    return jwt.sign({ userId: user._id, role: user.role, type: "provider" }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// =====================================
// REGISTER — every hospital/clinic/medical signup lands here as "pending"
// =====================================
const registerUser = async (req, res) => {
    try {
        const {
            name, email, password, location, phone, website, socialMedia, role, plan,
            hospitalName, hospitalType, address, city, mapLink, specialties, emergency, description,
            clinicName, businessName, medicalType, services,
        } = req.body;

        if (!name || !email || !password || !location || !phone || !role) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        if (!["Hospital", "Medical", "Clinic"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists or is pending review" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, email, password: hashedPassword, location, phone,
            website: website || "", socialMedia: socialMedia || "", role,
            plan: plan || "basic",
            status: "pending",
            hospitalName: hospitalName || "", hospitalType: hospitalType || "",
            address: address || "", city: city || location, mapLink: mapLink || "",
            specialties: specialties || "", emergency: !!emergency, description: description || "",
            clinicName: clinicName || "", businessName: businessName || "", medicalType: medicalType || "",
            services: services || "",
        });

        await createNotification("admin", `New ${role} registration request from ${displayName(user)}.`);

        res.status(201).json({
            message: "Your request has been submitted for admin review.",
            user,
        });
    } catch (error) {
        console.log("Registration Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// LOGIN — only "approved" accounts can actually get in
// =====================================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user.status === "pending") {
            return res.status(403).json({ message: "Your registration is still pending admin approval." });
        }
        if (user.status === "rejected") {
            return res.status(403).json({ message: "Your registration request was rejected by the admin." });
        }

        const token = signProviderToken(user);
        await createNotification(user.email, "You logged in successfully.");

        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.log("Login Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// GOOGLE LOGIN — verifies the ID token server-side, then requires an
// already-approved account with the same email (Google only proves identity,
// not permission).
// =====================================
const googleLogin = async (req, res) => {
    try {
        if (!googleClient) {
            return res.status(500).json({ message: "Google sign-in isn't configured on the server (missing GOOGLE_CLIENT_ID)." });
        }

        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: "Missing Google credential" });
        }

        const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();

        const user = await User.findOne({ email: payload.email });
        if (!user) {
            return res.status(404).json({ message: "No approved account found for this Google email. Register first, then sign in with Google once approved." });
        }
        if (user.status !== "approved") {
            return res.status(403).json({ message: `Your registration is ${user.status}.` });
        }

        const token = signProviderToken(user);
        await createNotification(user.email, "You logged in with Google.");

        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.log("Google Login Error:", error.message);
        res.status(401).json({ message: "Google sign-in failed", error: error.message });
    }
};

// =====================================
// PATIENT LOGIN — no password, just a persisted identity + a JWT
// =====================================
const patientLogin = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const patient = await Patient.findOneAndUpdate(
            { email },
            { name, email },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const token = jwt.sign({ patientId: patient._id, type: "patient" }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.status(200).json({ message: "Welcome", token, user: { name: patient.name, email: patient.email, role: "patient" } });
    } catch (error) {
        console.log("Patient Login Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// PASSWORD RESET — demo-level: no email service wired up, so the code comes
// back in the API response instead of an inbox. Swap that once you add
// something like nodemailer.
// =====================================
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found for this email." });
        }

        const code = crypto.randomInt(100000, 999999).toString();
        user.resetCode = code;
        user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // TODO: send `code` by email instead of returning it once you add an email service.
        res.status(200).json({ message: "Reset code generated", demoCode: code });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.resetCode !== code || !user.resetCodeExpires || user.resetCodeExpires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired code" });
        }
        res.status(200).json({ message: "Code verified" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.resetCode !== code || !user.resetCodeExpires || user.resetCodeExpires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired code" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetCode = null;
        user.resetCodeExpires = null;
        await user.save();

        await createNotification(user.email, "Your password was reset successfully.");
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    patientLogin,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
};
