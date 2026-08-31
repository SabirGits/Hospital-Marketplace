const express = require("express");

const {
    getAllHospitals,
    getHospitalById,
    getHospitalsByCity,
} = require("../controllers/hospitalController");

const router = express.Router();

// Get hospitals by city
router.get("/city/:city", getHospitalsByCity);

// Get all hospitals
router.get("/all", getAllHospitals);

// Get one hospital by ID
router.get("/:id", getHospitalById);

module.exports = router;
