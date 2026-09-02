const buildProviderController = require("./providerController");

const { getAll, getById, getByCity, rate } = buildProviderController("Hospital");

module.exports = {
    getAllHospitals: getAll,
    getHospitalById: getById,
    getHospitalsByCity: getByCity,
    rateHospital: rate,
};
