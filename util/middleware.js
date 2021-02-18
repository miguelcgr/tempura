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
        res.locals.userData = myUser;
      })
      .catch((err) => console.log(err));
  }
  next();
}

module.exports = {
  isLoggedIn,
  setLocals,
};
