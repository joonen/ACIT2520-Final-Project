const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controller/auth_controller");
const GitHubStrategy = require('passport-github').Strategy;
require("dotenv").config()

const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    console.log(user);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

const githubStrategy = new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  try {
    let user = userController.getUserByGithubIdOrCreate(profile.id, profile.username, profile.email) 
    return done(null, user);
  } catch (err) {
    throw err;
  }},
);

passport.use(localLogin).use(githubStrategy);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin); // Needed for Passport use.