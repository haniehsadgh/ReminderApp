const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// each strategy should have it's own handler
// const GithubStrategy = require("passport-github").Strategy
// go to github.come and see what they need for login
const userController = require("../controllers/userController");

// const githybLogin = new GithubStrategy({})
// const facebookLogin = new FacebookStrategy({})

const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  // second argument of the localstrategy function
  // it would take the usernameField to email and passwordField to password
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
    // creates a session if user exist
      ? done(null, user)
      // else the user doesn't exist
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);
// stores the session but only the id
// why we don't store the whole information: security reasons 
// there might be more than one person with the same name and they could get access to other peoples information

// this would attach the user to req.user to store it so we have the user information inside the req.user variable 
passport.serializeUser(function (user, done) {
  // user.id -> comes from req.user
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

module.exports = passport.use(localLogin);
