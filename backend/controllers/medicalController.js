const buildProviderController = require("./providerController");

const { getAll, getById, getByCity, rate } = buildProviderController("Medical");

module.exports = {
    getAllMedical: getAll,
    getMedicalById: getById,
    getMedicalByCity: getByCity,
    rateMedical: rate,
};
