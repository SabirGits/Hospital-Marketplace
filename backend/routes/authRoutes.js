const express = require("express");

const {
    registerUser,
    loginUser,
    googleLogin,
    patientLogin,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    getMe,
    updateMe,
} = require("../controllers/authController");
const { verifyToken, requireProvider } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/patient-login", patientLogin);

router.post("/forgot-password", requestPasswordReset);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

// A provider viewing/editing their own listing
router.get("/me", verifyToken, requireProvider, getMe);
router.put("/me", verifyToken, requireProvider, updateMe);

module.exports = router;
