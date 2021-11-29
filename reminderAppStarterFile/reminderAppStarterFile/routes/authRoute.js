const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");


const router = express.Router();

// Shows Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

// Login Button
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/reminders",
    failureRedirect: "/auth/login",
  }),
  passport.authenticate("github", {
    successRedirect: "/reminders",
    failureRedirect: "/auth/login",
  })
);

// Logout Button
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;