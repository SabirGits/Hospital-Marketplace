const buildProviderController = require("./providerController");

const { getAll, getById, getByCity, rate } = buildProviderController("Clinic");

module.exports = {
    getAllClinics: getAll,
    getClinicById: getById,
    getClinicsByCity: getByCity,
    rateClinic: rate,
};
