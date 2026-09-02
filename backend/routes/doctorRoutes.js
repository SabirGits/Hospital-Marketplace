const express = require("express");

const {
    getAllDoctors, getDoctorById, getDoctorsByHospital,
    createDoctor, updateDoctor, deleteDoctor, rateDoctor,
} = require("../controllers/doctorController");
const { verifyToken, requireProvider } = require("../middleware/auth");

const router = express.Router();

// Public
router.get("/all", getAllDoctors);
router.get("/hospital/:hospitalId", getDoctorsByHospital);
router.post("/:id/rate", rateDoctor);
router.get("/:id", getDoctorById);

// A hospital managing its own doctors
router.post("/", verifyToken, requireProvider, createDoctor);
router.put("/:id", verifyToken, requireProvider, updateDoctor);
router.delete("/:id", verifyToken, requireProvider, deleteDoctor);

module.exports = router;
