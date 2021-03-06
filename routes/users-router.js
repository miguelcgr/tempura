var express = require("express");
var usersRouter = express.Router();
const fileUploader = require('../configs/cloudinary.config');

const User = require("./../models/user.model");
//const Service = require("./../models/service.model");

const { isLoggedIn } = require("../util/middleware");

function getNavUserData(req) {
  let data;
  if (req.session.currentUser) {
    data = req.session.currentUser;
  } else {
    data = false;
  }
  return data;
}

// already in /users/

//public profile
usersRouter.get("/profile/:id", (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .populate("services")
    .then((user) => {
      const data = {
        user: user,
        navUserData: getNavUserData(req),
      };
      res.render("user-profile-public", data);
    })
    .catch((err) => console.log("User not found"));
});

//private profile
usersRouter.get("/my-profile", isLoggedIn, (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .populate("services")
    .then((user) => {
      const data = {
        user: user,
        navUserData: getNavUserData(req),
      };
      res.render("user-profile-private", data);
    });
});

usersRouter.get("/my-profile/edit", isLoggedIn, (req, res, next) => {
  const data = {
    user: req.session.currentUser,
    navUserData: getNavUserData(req),
  };

  res.render("edit-profile", data);
});

usersRouter.post(
  "/edit-profile",
  isLoggedIn,
  fileUploader.single("picture"),
  (req, res, next) => {
    const { username, fname, lname, email, phone, location } = req.body;
    const updatedData = {
      username,
      fname,
      lname,
      email,
      phone,
      location,
      profilePic: req.file.path,
    };

    const userID = req.session.currentUser._id;
    User.findByIdAndUpdate(userID, updatedData, { new: true })
      .then((createdUser) => {
        req.session.currentUser = createdUser;
        res.redirect("/users/my-profile");
      })
      .catch((err) => console.log(err));
  }
);

module.exports = usersRouter;
/*
/////////
router.get('/movies/:id/edit', (req, res) => {
  const { id } = req.params;
  Movie.findById(id)
    .then(movieToEdit => res.render('movie-edit', movieToEdit))
    .catch(error => console.log(`Error while getting a single movie for edit: ${error}`));
});
*/