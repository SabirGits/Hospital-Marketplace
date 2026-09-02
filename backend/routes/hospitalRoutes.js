const express = require("express");

const { getAllHospitals, getHospitalById, getHospitalsByCity, rateHospital } = require("../controllers/hospitalController");

const router = express.Router();

router.get("/city/:city", getHospitalsByCity);
router.get("/all", getAllHospitals);
router.post("/:id/rate", rateHospital);
router.get("/:id", getHospitalById);

module.exports = router;
