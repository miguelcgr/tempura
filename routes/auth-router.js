var express = require("express");
var router = express.Router();
const User = require("../models/user.model");
const Service = require("../models/service.model");
const errorMessage = {
  errorMessage: "Please provide correct username and password",
};

const { isLoggedIn } = require("../util/middleware");

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/", (req, res, next) => res.render("index"));

router.get("/login", (req, res, next) => res.render("login"));

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("/login", errorMessage);
    return;
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("/login", errorMessage);
        return;
      }
      const passwordCorrect = bcrypt.compareSync(password, user.password);
      if (passwordCorrect) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("/login", errorMessage);
      }
    })
    .catch((err) => {
      res.render("/signup", errorMessage);
    });
});

router.get("/signup", (req, res, next) => res.render("signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("/signup", errorMessage);
    return;
  }
  User.findOne({ username: username }).then((user) => {
    if (user !== null) {
      res.render("/signup", {
        errorMesage: errorMessage,
      });
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hiddenPassword = bcrypt.hashSync(password, salt);

    User.create({ username: username, password: hiddenPassword })
      .then((user) => {
        req.session.currentUser = user;
        res.redirect("/");
      })
      .catch((err) => {
        res.render("/signup", errorMessage);
      });
  });
});

router.get("/services/?search", (req, res, next) => {
  // /// // // // //
  const serviceSearch = req.query.search;

  Service.find({ name: serviceSearch });

  res.render("search-results", data);
});

router.get("/user-profile-public", (req, res, next) => {
  res.render("user-profile-public");
});

// router.get("/user-profile-private", isLoggedIn, (req, res, next) => {
//   res.render("user-profile-private");
// });

// //renders public service page (ficha)
// router.get("/services/details/:id", (req, res, next) => {
//   res.render("service-profile");
// });

// router.get("/edit-profile", isLoggedIn, (req, res, next) => {
//   res.render("edit-profile");
// });

// router.post("/edit-profile", isLoggedIn, (req, res, next) => {
//   res.render("edit-profile");
// });

// router.get("/create-service", isLoggedIn, (req, res, next) => {
//   res.render("create-service");
// });

// router.post("/create-service", isLoggedIn, (req, res, next) => {
//   res.render("create-service");
// });

// router.post("/delete-service", isLoggedIn, (req, res, next) => {
//   res.render("delete-service");
// });

// router.get("/activity-panel", isLoggedIn, (req, res, next) => {
//   res.render("activity-panel");
// });

// router.post("/activity-panel", isLoggedIn, (req, res, next) => {
//   res.render("activity-panel");
// });

module.exports = router;
