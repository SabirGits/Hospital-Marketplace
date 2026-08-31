const Notification = require("../models/Notification");

// Called directly from other controllers (register, login, approve, etc.)
// whenever something notification-worthy happens — not itself an HTTP route.
async function createNotification(recipient, message) {
    try {
        await Notification.create({ recipient, message });
    } catch (error) {
        console.log("Notification creation failed:", error.message);
    }
}

// =====================================
// GET — everything for one recipient ("admin" or a provider's email)
// =====================================
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.params.recipient }).sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// DELETE ONE
// =====================================
const deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// CLEAR ALL for one recipient
// =====================================
const clearNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.params.recipient });
        res.status(200).json({ message: "Notifications cleared" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createNotification, getNotifications, deleteNotification, clearNotifications };
