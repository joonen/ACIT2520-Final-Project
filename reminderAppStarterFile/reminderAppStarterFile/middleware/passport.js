const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controller/auth_controller");
const GitHubStrategy = require('passport-github').Strategy;

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

const githubStrategy = new GitHubStrategy(
  {
  clientID: '3a52d3a11592093f2f3f',
  clientSecret: '76ef0b545f7220f9bd76213d5a03c2d888c1cca8T',
  callbackURL: "http://localhost:3001/auth/github/callback"
  },

  async (accessToken, refreshToken, profile, done) => {
    const userImage = profile.photos[0].value
    try {
      const user = await userController.findOrCreateGithubUser(profile.id, profile.username, profile.email, userImage);
      return done(null, user);
    } catch (err) {
      throw err;
    }
  }
)

passport.use(localLogin).use(githubStrategy);

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