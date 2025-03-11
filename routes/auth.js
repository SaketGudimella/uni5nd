const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });
    res.redirect("/login");
  } catch (err) {
    res.send("Error creating user");
  }
});

// Login Route
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect("/error"); // If authentication fails
  
      req.logIn(user, (err) => {
        if (err) return next(err);
  
        // 🔹 Save user details in session
        req.session.user = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, // Store role for admin panel access
        };
  
        // console.log("User session data after login:", req.session.user); // Debugging
  
        return res.redirect("/dashboard");
      });
    })(req, res, next);
  });
  


// Logout Route
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
