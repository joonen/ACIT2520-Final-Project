let database = require("../database").Database;
let userModel = require("../database").userModel;

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },

  loginSubmit: (req, res) => {
    res.redirect("/templogin");
  },

  registerSubmit: (req, res) => {

  },
};

const getUserByGithubIdOrCreate = (userid, username, useremail) => {
  user = {
    id: userid,
    name: username,
    email: useremail,
    role: "user",
    reminders: []
  }
  database.push(user);
  return user;
}

const getUserByEmailIdAndPassword = (email, password) => {
  let user = userModel.findOne(email);
  if (user) {
    if (isUserValid(user, password)) {
      return user;
    }
  }
  return null;
};
const getUserById = (id) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user, password) {
  return user.password === password;
}

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
  authController,
  getUserByGithubIdOrCreate,
};
