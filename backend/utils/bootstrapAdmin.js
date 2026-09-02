const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

async function bootstrapAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.log(
            "ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin bootstrap."
        );
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Remove old admin accounts
        await Admin.deleteMany({
            email: { $ne: email }
        });

        // Create or update the current admin
        await Admin.findOneAndUpdate(
            { email },
            {
                name: "Platform Admin",
                email,
                password: hashedPassword
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );

        console.log(`Admin account ready for ${email}`);
    } catch (error) {
        console.log("Admin Bootstrap Error:", error.message);
    }
}

module.exports = bootstrapAdmin;