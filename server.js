require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const authRoutes = require("./routes/auth");

// Initialize Express
const app = express();
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Keep it secure
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);


const { isAdmin } = require("./middlewares/auth");
const User = require("./models/User"); // Assuming you have a User model

// Admin Panel Route (Only for Admins)
app.get("/admin", isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "name email role"); // Fetch all users
    res.render("admin", { users });
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
});


// Passport Config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public")); // Serve static files

// Routes
app.use("/auth", authRoutes);

// Home Route

app.get("/", (req, res) => {
    res.render("index", { user: req.session.user || null });
});


// Login Page
app.get("/login", (req, res) => {
    res.render("login"); // This renders views/login.ejs
});

// Signup Page
app.get("/signup", (req, res) => {
    res.render("signup"); // This renders views/signup.ejs
});

// Signup Page
app.get("/dashboard", (req, res) => {
    res.render("dashboard", { user: req.session.user || null }) // This renders views/dashboard.ejs
});

const profileRoutes = require("./routes/profile");
app.use("/", profileRoutes);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
