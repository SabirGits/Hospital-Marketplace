const express = require("express");

const { getNotifications, deleteNotification, clearNotifications } = require("../controllers/notificationController");

const router = express.Router();

router.get("/:recipient", getNotifications);
router.delete("/clear/:recipient", clearNotifications);
router.delete("/:id", deleteNotification);

module.exports = router;
