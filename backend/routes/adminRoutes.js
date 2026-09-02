const express = require("express");

const { adminLogin, getRequests, approveRequest, rejectRequest, deleteProvider, updateProvider } = require("../controllers/adminController");
const { getMyProfile, updateMyProfile } = require("../controllers/adminProfileController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public
router.post("/login", adminLogin);

// Everything below requires a valid admin JWT
router.use(verifyToken, requireAdmin);

router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);

router.get("/requests", getRequests);
router.post("/requests/:id/approve", approveRequest);
router.post("/requests/:id/reject", rejectRequest);
router.put("/requests/:id", updateProvider);
router.delete("/requests/:id", deleteProvider);

module.exports = router;
