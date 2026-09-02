const Doctor = require("../models/Doctor");
const User = require("../models/User");

// =====================================
// PUBLIC — anyone can browse doctors. Only ever returns doctors whose
// hospital is actually approved, same rule as the hospital listing itself.
// =====================================
const getAllDoctors = async (req, res) => {
    try {
        const approvedHospitalIds = await User.find({ role: "Hospital", status: "approved" }).distinct("_id");
        const doctors = await Doctor.find({ hospitalId: { $in: approvedHospitalIds } }).populate("hospitalId", "hospitalName name city location");
        res.status(200).json({ message: "Doctors fetched successfully", total: doctors.length, doctors });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate("hospitalId", "hospitalName name city location");
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json({ message: "Doctor fetched successfully", doctor });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Doctors belonging to one hospital — used by both the public hospital
// profile page ("Doctors" tab) and the hospital's own dashboard.
const getDoctorsByHospital = async (req, res) => {
    try {
        const doctors = await Doctor.find({ hospitalId: req.params.hospitalId });
        res.status(200).json({ message: "Doctors fetched successfully", total: doctors.length, doctors });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// PROVIDER-ONLY — a hospital managing its own doctors
// =====================================
const createDoctor = async (req, res) => {
    try {
        const { name, image, specialty, qualification, experience, fee, available, languages, bio, schedule } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Doctor name is required" });
        }

        const doctor = await Doctor.create({
            hospitalId: req.user.userId,
            name, image: image || "", specialty: specialty || "", qualification: qualification || "",
            experience: experience || 0, fee: fee || 0, available: available !== false,
            languages: languages || "", bio: bio || "", schedule: schedule || {},
        });

        res.status(201).json({ message: "Doctor added", doctor });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        if (String(doctor.hospitalId) !== String(req.user.userId)) {
            return res.status(403).json({ message: "You can only edit your own doctors" });
        }

        const EDITABLE = ["name", "image", "specialty", "qualification", "experience", "fee", "available", "languages", "bio", "schedule"];
        EDITABLE.forEach((field) => {
            if (req.body[field] !== undefined) doctor[field] = req.body[field];
        });

        await doctor.save();
        res.status(200).json({ message: "Doctor updated", doctor });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        if (String(doctor.hospitalId) !== String(req.user.userId)) {
            return res.status(403).json({ message: "You can only remove your own doctors" });
        }

        await Doctor.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Doctor removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// =====================================
// PUBLIC — rate a doctor
// =====================================
const rateDoctor = async (req, res) => {
    try {
        const { rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        doctor.ratingSum += rating;
        doctor.ratingCount += 1;
        await doctor.save();

        res.status(200).json({ message: "Rating submitted", doctor });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getAllDoctors, getDoctorById, getDoctorsByHospital,
    createDoctor, updateDoctor, deleteDoctor, rateDoctor,
};
