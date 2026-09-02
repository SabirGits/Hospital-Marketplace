const express = require("express");

const { getAllClinics, getClinicById, getClinicsByCity, rateClinic } = require("../controllers/clinicController");

const router = express.Router();

router.get("/city/:city", getClinicsByCity);
router.get("/all", getAllClinics);
router.post("/:id/rate", rateClinic);
router.get("/:id", getClinicById);

module.exports = router;
