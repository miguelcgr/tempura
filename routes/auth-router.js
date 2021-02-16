var express = require("express");
var router = express.Router();

const User = require("./../models/user.model");
const Service = require("./../models/service.model");
const errorMessage = {
  errorMessage: "Please provide correct username and password",
};

const { isLoggedIn } = require("../util/middleware");

const bcrypt = require("bcrypt");
const saltRounds = 10;

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

router.get("/", (req, res, next) => res.render("index", isLogNavFn(req)));

router.get("/login", (req, res, next) => res.render("login"));

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("login", errorMessage);
    return;
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("login", errorMessage);
        return;
      }
      const passwordCorrect = bcrypt.compareSync(password, user.password);
      if (passwordCorrect) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", errorMessage);
      }
    })
    .catch((err) => {
      res.render("login", errorMessage);
    });
});

router.get("/signup", (req, res, next) => res.render("signup"));

router.post("/signup", (req, res, next) => {
  const {
    username,
    password,
    fname,
    lname,
    email,
    phone,
    location,
    profilePic,
  } = req.body;
  if (username === "" || password === "") {
    res.render("signup", errorMessage);
    return;
  }

  User.findOne({ username: username }).then((user) => {
    if (user !== null) {
      res.render("signup", {
        errorMesage: errorMessage,
      });
      return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hiddenPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      username,
      fname,
      lname,
      email,
      password: hiddenPassword,
      phone,
      location,
      profilePic,
      joinDate: new Date(),
    };

    User.create(newUser)
      .then((user) => {
        console.log(user);
        req.session.currentUser = user;

        res.redirect("/");
      })
      .catch((err) => {
        res.render("signup", errorMessage);
      });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
