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
  const { username, password } = req.body;
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

    User.create({ username: username, password: hiddenPassword })
      .then((user) => {
        req.session.currentUser = user;
        //        res.render("index", { isLogNav: true });
        res.redirect("/");
      })
      .catch((err) => {
        res.render("signup", errorMessage);
      });
  });
});

router.get("/services", (req, res, next) => {
  const serviceSearch = req.query.search;
  Service.find()
    .then((servicesArr) => {
      const data = {
        isLogNav: isLogNavFn,
        servicesArr: servicesArr,
      };
      console.log("servicesArr", servicesArr);
      res.render("services-results", data);
    })
    .catch((err) => console.log(err));
});

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

// Destroys the existing session
// GET     /auth/logout
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
