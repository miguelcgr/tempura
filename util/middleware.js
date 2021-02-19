const User = require("./../models/user.model");

function isLoggedIn(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

function setLocals(req, res, next) {
  if (req.session.currentUser) {
    User.findById(req.session.currentUser._id)
      .then((myUser) => {
        req.session.currentUser = myUser;
      })
      .catch((err) => console.log(err));
  }
  next();
}

module.exports = {
  isLoggedIn,
  setLocals,
};
