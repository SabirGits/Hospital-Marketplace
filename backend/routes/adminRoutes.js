const express = require("express");

const { adminLogin, getRequests, approveRequest, rejectRequest, deleteProvider } = require("../controllers/adminController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public
router.post("/login", adminLogin);

// Everything below requires a valid admin JWT
router.use(verifyToken, requireAdmin);

router.get("/requests", getRequests);
router.post("/requests/:id/approve", approveRequest);
router.post("/requests/:id/reject", rejectRequest);
router.delete("/requests/:id", deleteProvider);

module.exports = router;
