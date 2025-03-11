const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to protect profile route
const ensureAuthenticated = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  next();
};

// Render Profile Page
router.get("/profile", ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    const editMode = req.query.edit === "true"; // Check if edit mode is enabled
    res.render("profile", { user, editMode });
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
});

// Handle Profile Updates
router.post("/profile", ensureAuthenticated, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.session.user.id);

    if (user) {
      user.name = name;
      user.email = email;
      await user.save();

      // Update session data
      req.session.user.name = name;
      req.session.user.email = email;
    }

    res.redirect("/profile"); // Redirect back to profile view mode
  } catch (error) {
    console.error(error);
    res.send("Error updating profile");
  }
});

module.exports = router;
