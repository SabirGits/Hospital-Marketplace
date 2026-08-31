const User = require("../models/User");

// Every one of these only ever returns role: "Hospital" AND status: "approved"
// — pending or rejected signups should never be visible on the public site.

const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await User.find({ role: "Hospital", status: "approved" });
        res.status(200).json({
            message: "All hospitals fetched successfully",
            totalHospitals: hospitals.length,
            hospitals,
        });
    } catch (error) {
        console.log("Get All Hospitals Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getHospitalById = async (req, res) => {
    try {
        const hospital = await User.findOne({ _id: req.params.id, role: "Hospital", status: "approved" });
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }
        res.status(200).json({ message: "Hospital fetched successfully", hospital });
    } catch (error) {
        console.log("Get Hospital By ID Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getHospitalsByCity = async (req, res) => {
    try {
        const city = req.params.city;
        const hospitals = await User.find({
            role: "Hospital",
            status: "approved",
            $or: [
                { city: { $regex: city, $options: "i" } },
                { location: { $regex: city, $options: "i" } },
            ],
        });

        res.status(200).json({
            message: `Hospitals found in ${city}`,
            city,
            totalHospitals: hospitals.length,
            hospitals,
        });
    } catch (error) {
        console.log("Get Hospitals By City Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getAllHospitals, getHospitalById, getHospitalsByCity };
