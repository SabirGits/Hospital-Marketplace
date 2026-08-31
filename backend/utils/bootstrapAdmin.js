const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// Creates the admin account from .env the first time the server connects to
// a fresh database. Safe to run on every startup — it's a no-op once the
// admin already exists. This is how you avoid ever hardcoding admin
// credentials in the codebase itself.
async function bootstrapAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin bootstrap.");
        return;
    }

    const existing = await Admin.findOne({ email });
    if (existing) return;

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ name: "Platform Admin", email, password: hashedPassword });
    console.log(`Admin account created for ${email}`);
}

module.exports = bootstrapAdmin;
