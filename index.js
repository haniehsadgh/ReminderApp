const express = require("express")
const session = require("express-session");
const ejsLayouts = require("express-ejs-layouts");
const reminderController = require("./controllers/reminder_controller");
const socialController = require("./controllers/socialController");
const reminder = require("./controllers/userController");



// returns a web server so we could use
const app = express(); 

app.use(express.static(__dirname + "/public"));
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
const passport = require("./middleware/passport");
// this allows express to get the user's data from form and put it in the webserver
// use it everywhere 
app.use(express.urlencoded({extended: false}))
app.use(ejsLayouts);
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})
// case 1: user goes to localhost:8080 -> hompage/marketing page
app.get("/", function(req, res) {
    res.send("Welcome to our landing page. Marketing content goes here")
})

app.get("/login", reminder.login)

app.post("/login",  passport.authenticate("local", {
    successRedirect: "/reminder",
    failureRedirect: "/login",
  }))

app.post('/logout', reminder.logout);
// casw 2: user goes to localost:8080/remincer -> show list of reminders
app.get("/reminder", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, reminderController.list)

// case 3: user goes to localhost:8081/reminder/new -> show a create reminder page
app.get("/reminder/new", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, reminderController.new)

// case 4: user sends new reminder data to us (creating a reminder) 
app.post("/reminder", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, reminderController.create)

// case 5: user wants to SEE an individual reminder
app.get("/reminder/:id", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, reminderController.listOne)

// case 6: user wants to edit an individual reminder
app.get("/reminder/:id/edit", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, reminderController.edit)

// case 6.5: create subtask
app.get("/reminder/:id/subtask", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, reminderController.subtask)

// case 6.6: add the dubtask
app.post("/reminder/:id/subtask", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, reminderController.add)

// case 6.7: create tag
app.get("/reminder/:id/tag", reminderController.tag)

// case 6.8: add the tag
app.post("/reminder/:id/tag", reminderController.addtag)

// case 7: user clicks the update button from case 6 and expects their reminder to be updated
app.post("/reminder/:id/edit", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, reminderController.update)

// case 8: user clicks the delete button and weexpect the reminder to be delited
app.post("/reminder/delete/:id", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, reminderController.delete)
  
app.post("/reminder/close/:id/:tagid", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, reminderController.close)

// case 9: user goes to the friends page
app.get("/friends", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, socialController.list)

// case 10: user adds a friend 
app.post("/friends", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }}, socialController.findAndAddFriend)

// to acess server we need to go to this url:
// localhost:8081
app.listen(8081, () => {
  console.log(`🚀 Server has started on port 8081`);
});