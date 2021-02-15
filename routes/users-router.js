var express = require("express");
var router = express.Router();

const User = require("./../models/user.model");
const Service = require("./../models/service.model");
const errorMessage = {
  errorMessage: "Please provide correct username and password",
};

router.get("/user-profile/:id", (req, res, next) => {
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