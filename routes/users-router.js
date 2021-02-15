var express = require("express");
var usersRouter = express.Router();

const User = require("./../models/user.model");
//const Service = require("./../models/service.model");

const { isLoggedIn } = require("../util/middleware");

function isLogNavFn(req) {
  let data;
  if (req.session.currentUser) {
    data = {
      isLogNav: true,
    };
  } else {
    data = {
      isLogNav: false,
    };
  }
  return data;
}

// already in /users/

//public profile
usersRouter.get("/:id", (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
  .populate('services')
    .then((user) => {
      const data = {
      user:user, 
      isLogNav: isLogNavFn(req)
      };
      res.render("user-profile-public", data);
    })
    .catch((err) => console.log("User not found"));
});

//private profile
usersRouter.get("/my-profile", (req, res, next) => {
       const data = {
        isLogNav: isLogNavFn(req),
        user: req.session,
      };
      res.render("user-profile-private", data);
    })



usersRouter.get("/edit-profile", isLoggedIn, (req, res, next) => {
  res.render("edit-profile");
});

usersRouter.post("/edit-profile", isLoggedIn, (req, res, next) => {
  res.render("edit-profile");
});


module.exports = usersRouter;
