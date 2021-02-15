var express = require("express");
var usersRouter = express.Router();

const User = require("./../models/user.model");
const Service = require("./../models/service.model");

// already in /users/

usersRouter.get("/user-profile/:id", (req, res, next) => {
  const userId = req.params.id;

  User.findOne({ ObjectId: userId })
    .then((user) => {
      const data = {
        username: user.username,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        location: user.location,
        services: user.services,
        swaps: user.swaps,
        profilePic: user.profilePic,
        joinDate: user.joinDate,
      };
      res.render("user-profile-public", data);
    })
    .catch((err) => console.log("User not found"));
});

module.exports = usersRouter;