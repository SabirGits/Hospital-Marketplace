const express = require("express");

const {
    registerUser,
    loginUser,
    googleLogin,
    patientLogin,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/patient-login", patientLogin);

router.post("/forgot-password", requestPasswordReset);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

module.exports = router;
