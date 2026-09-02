const Admin = require("../models/Admin");

// The admin editing their own name/image — separate from managing provider
// records, and deliberately doesn't touch email/password here.
const getMyProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (req.body.name !== undefined) admin.name = req.body.name;
        if (req.body.image !== undefined) admin.image = req.body.image;

        await admin.save();
        res.status(200).json({ message: "Profile updated", admin });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getMyProfile, updateMyProfile };
