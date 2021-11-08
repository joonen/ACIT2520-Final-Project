let database = require("../database");

let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: database.cindy.reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: database.cindy.reminders });
    }
  },

  create: (req, res) => {
    let reminder = {
      id: database.cindy.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    database.cindy.reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
  });
  res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
  let reminderToFind = req.params.id;
  let searchResult = database.cindy.reminders.find(function (reminder){
    return reminder.id == reminderToFind;
  });
  res.render("reminder/update", {reminders: searchResult})
  },

  delete: (req, res) => {
  // Implement this code
  let reminderToFind = req.params.id;
  let searchResult = database.cindy.reminders.find(function (reminder) {
    return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/index", { reminders: database.cindy.reminders.splice() }); // Splice!
      res.redirect("/reminders");
    } else {
      res.render("reminder/index", { reminders: database.cindy.reminders });   // I honestly don't know why this is here.
     }
  },
};

module.exports = remindersController;
