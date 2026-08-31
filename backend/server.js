const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const bootstrapAdmin = require("./utils/bootstrapAdmin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to server"
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/notifications", notificationRoutes);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB Connected Successfully");
        await bootstrapAdmin();

        app.listen(process.env.PORT, () => {
            console.log(`Welcome to server`);
            console.log(
                `Server running on http://localhost:${process.env.PORT}`
            );
        });
    })
    .catch((error) => {
        console.log(
            "MongoDB Connection Error:",
            error.message
        );
    });
