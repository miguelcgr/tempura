var express = require("express");
var router = express.Router();
const fileUploader = require('../configs/cloudinary.config');

const User = require("./../models/user.model");
const Service = require("./../models/service.model");
const errorMessage = {
  errorMessage: "Please provide correct username and password",
};

const { isLoggedIn } = require("../util/middleware");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// function that chooses which navbar to show
function getNavUserData(req) {
  let data;
  if (req.session.currentUser) {
    data = req.session.currentUser;
  } else {
    data = false;
  }
  return data;
}

// General routes: index, log in, sign up & log out
router.get("/", (req, res, next) => {
  const injectData = {
    navUserData: getNavUserData(req),
  };
  res.render("index", injectData);
});

router.get("/login", (req, res, next) => res.render("login"));

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  const injectData = {
    errorMessage: errorMessage,
    navUserData: getNavUserData(req),
  };

  if (username === "" || password === "") {
    res.render("login", injectData);
    return;
  }
  User.findOne({ username })
    .populate("swaps.asTaker")
    .then((user) => {
      if (!user) {
        res.render("login", injectData);
        return;
      }
      const passwordCorrect = bcrypt.compareSync(password, user.password);
      if (passwordCorrect) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", injectData);
      }
    })
    .catch((err) => {
      res.render("login", injectData);
    });
});

router.get("/signup", (req, res, next) => res.render("signup"));

router.post(
  "/signup",
  fileUploader.single("picture"),
  // fileUploader.single("profilePic"),
  (req, res, next) => {
    const {
      username,
      password,
      fname,
      lname,
      email,
      phone,
      location,
      profilePic,
      name,
      description,
      servLocation,
      duration,
      category,
      picture,
    } = req.body;

    const injectData = {
      errorMessage: errorMessage,
    };

    if (username === "" || password === "") {
      res.render("signup", injectData);
      return;
    }

    User.findOne({ username: username }).then((user) => {
      if (user !== null) {
        res.render("signup", injectData);
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
        profilePic: req.file.path,
        joinDate: new Date(),
      };

      User.create(newUser)
        .then((user) => {
          const pr = User.findById(user._id).populate("swaps.asTaker");
          return pr;
        })
        .then((populatedUser) => {
          req.session.currentUser = populatedUser;
          res.render("service-create", {
            welcomeMessage: true,
          });
        })
        .catch((err) => {
          res.render("signup", injectData);
        });
    });
  }
);

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
