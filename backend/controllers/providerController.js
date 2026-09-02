const User = require("../models/User");

// Hospitals, clinics and medical providers are all the same User collection,
// just a different `role`. Rather than write three near-identical
// controllers, this builds one for whichever role a route needs.
function buildProviderController(role) {
    const getAll = async (req, res) => {
        try {
            const providers = await User.find({ role, status: "approved" });
            res.status(200).json({
                message: `All ${role.toLowerCase()}s fetched successfully`,
                total: providers.length,
                providers,
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };

    const getById = async (req, res) => {
        try {
            const provider = await User.findOne({ _id: req.params.id, role, status: "approved" });
            if (!provider) {
                return res.status(404).json({ message: `${role} not found` });
            }
            res.status(200).json({ message: `${role} fetched successfully`, provider });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };

    const getByCity = async (req, res) => {
        try {
            const city = req.params.city;
            const providers = await User.find({
                role, status: "approved",
                $or: [{ city: { $regex: city, $options: "i" } }, { location: { $regex: city, $options: "i" } }],
            });
            res.status(200).json({ message: `${role}s found in ${city}`, city, total: providers.length, providers });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };

    // Anyone (patient or otherwise) can leave a 1-5 rating — no login
    // required, so this stays simple: no duplicate-vote prevention yet.
    const rate = async (req, res) => {
        try {
            const { rating } = req.body;
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({ message: "Rating must be between 1 and 5" });
            }

            const provider = await User.findOne({ _id: req.params.id, role, status: "approved" });
            if (!provider) {
                return res.status(404).json({ message: `${role} not found` });
            }

            provider.ratingSum += rating;
            provider.ratingCount += 1;
            await provider.save();

            res.status(200).json({ message: "Rating submitted", provider });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };

    return { getAll, getById, getByCity, rate };
}

module.exports = buildProviderController;
