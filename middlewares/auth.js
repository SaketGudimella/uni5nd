function isAdmin(req, res, next) {
    // console.log("User session data:", req.session.user); // Debugging
    if (req.session.user && req.session.user.role === "admin") {
      return next(); // Allow access
    }
    res.status(403).send("Access Denied. Admins Only."); // Block access
  }
  
  module.exports = { isAdmin };
  