const { json } = require("body-parser");
let database = require("../database");
// let request = require('request');

let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: req.user.reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: req.user.reminders });
    }
  },

  create: (req, res) => {
    let reminder = {
      id: req.user.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    req.user.reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
  });
  res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    let reminderToFind = req.params.id;
    let foundReminder = {};
    let newReminders = []

    for (let reminder of req.user.reminders) {
      if (reminder.id != reminderToFind){
        newReminders.push(reminder);
      }
    }

    let completedValue = null;
    if (req.body.completed == 'true') {
      completedValue = true;
    } else {
      completedValue = false;
    }

    let newReminder = {
      id: req.user.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: completedValue,
    };

    newReminders.push(newReminder);
    req.user.reminders = [...newReminders];
    res.redirect("/reminders")
  },

  delete: (req, res) => {
  
    let reminderToFind = req.params.id;
    let newReminders = []

    for (let reminder of req.user.reminders) {
      if (reminder.id != reminderToFind){
        newReminders.push(reminder);
      }
    }

    req.user.reminders = [...newReminders];
    res.redirect("/reminders")
  },
};

module.exports = remindersController;
