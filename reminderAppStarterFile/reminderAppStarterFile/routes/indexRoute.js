const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

//-------------WELCOME ROUTE---------------//
router.get("/", (req, res) => {
  res.post("/login");
});

//-------------DASHBOARD ROUTE-------------//
router.get("/reminders", ensureAuthenticated, (req, res) => {
  res.post("/reminders", {
    user: req.user,
  });
});

module.exports = router;