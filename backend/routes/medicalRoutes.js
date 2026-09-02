const express = require("express");

const { getAllMedical, getMedicalById, getMedicalByCity, rateMedical } = require("../controllers/medicalController");

const router = express.Router();

router.get("/city/:city", getMedicalByCity);
router.get("/all", getAllMedical);
router.post("/:id/rate", rateMedical);
router.get("/:id", getMedicalById);

module.exports = router;
