const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
// const bodyParser = require('body-parser');
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller").authController;
const passport = require("./middleware/passport");
const authRoute = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");
const { ensureAuthenticated, forwardAuthenticated } = require("./middleware/checkAuth");

const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Middleware for express
app.use(passport.initialize());
app.use(passport.session()); // Indicates desire to use sessions.

// app.use(express.json());
// // app.use(expressLayouts);
// app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(ejsLayouts);

app.set("view engine", "ejs");
// Routes start here

// ensure authenticated forwards our user to our functions
app.get("/reminders", ensureAuthenticated, reminderController.list);

app.get("/reminder/new", ensureAuthenticated, reminderController.new);

app.get("/reminder/:id", ensureAuthenticated, reminderController.listOne);

app.get("/reminder/:id/edit", ensureAuthenticated, reminderController.edit);

app.post("/reminder/", ensureAuthenticated, reminderController.create);

// Implement this yourself
app.post("/reminder/update/:id", ensureAuthenticated, reminderController.update);

// Implement this yourself
app.post("/reminder/delete/:id", ensureAuthenticated, reminderController.delete);

// Fix this to work with passport! The registration does not need to work, you can use the fake database for this.
// app.get("/register", authController.register);
// app.get("/login", authController.login);

app.get("/login", forwardAuthenticated, (req, res) => {
  res.render("auth/login");
});

app.post("/register", authController.registerSubmit);
// app.post("/login", authController.loginSubmit);

app.post("/login", passport.authenticate("local", {
  // req.body
  successRedirect: "/templogin",
  failureRedirect: "/login",
}));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// make another post request from github
// app.post("/githublogin");

app.get("/templogin", ensureAuthenticated, (req, res) => {
  res.render("../templogin/templogin", { user: req.user });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.use("/", indexRoute);
app.use("/auth", authRoute);

app.listen(3001, function () {
  console.log(
    "Server running. Visit: localhost:3001/ in your browser 🚀"
  );
});
