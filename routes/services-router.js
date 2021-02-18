var express = require("express");
var servicesRouter = express.Router();

const fileUploader = require('../configs/cloudinary.config');

const User = require("./../models/user.model");
const Service = require("./../models/service.model");

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

// already in /services/

servicesRouter.get("/", (req, res, next) => {
  const serviceSearch = req.query.search.split(" ");
  const regexStr = serviceSearch.join("|");

  Service.find({ name: { $regex: regexStr, $options: "i" } })
    .populate("giverUser")
    .then((servicesArr) => {
      const data = {
        isLogNav: isLogNavFn(req),
        servicesArr: servicesArr,
      };
      res.render("services-results", data);
    })
    .catch((err) => console.log(err));
});

servicesRouter.get("/profile/:id", (req, res, next) => {
  const serviceId = req.params.id;

  if (req.session.currentUser) {
    const { currentUser } = req.session;
    const asTakerServices = currentUser.swaps.asTaker.map(
      (swap) => swap.service
    );
    if (req.session.currentUser.services.includes(serviceId)) {
      Service.findById(serviceId)
        .then((foundService) => {
          const data = {
            isLogNav: isLogNavFn(req),
            service: foundService,
          };
          res.render("service-profile-own", data);
        })
        .catch((err) => console.log(err));
    } else if (asTakerServices.includes(serviceId)) {
      Service.findById(serviceId)
        .populate("giverUser")
        .then((foundService) => {
          const data = {
            isLogNav: isLogNavFn(req),
            service: foundService,
          };
          res.render("service-profile-logged-in-requested", data);
        })
        .catch((err) => console.log(err));
    } else {
      Service.findById(serviceId)
        .populate("giverUser")
        .then((foundService) => {
          const data = {
            isLogNav: isLogNavFn(req),
            service: foundService,
          };
          res.render("service-profile-logged-in", data);
        })
        .catch((err) => console.log(err));
    }
  } else {
    Service.findById(serviceId)
      .populate("giverUser")
      .then((foundService) => {
        const data = {
          isLogNav: isLogNavFn(req),
          service: foundService,
        };
        res.render("service-profile-public", data);
      })
      .catch((err) => console.log(err));
  }
});

servicesRouter.get("/create", isLoggedIn, (req, res, next) => {
  res.render("service-create", { isLogNav: isLogNavFn(req) });
});

servicesRouter.post("/create", fileUploader.single('service-picture'),(req, res, next) => {
  const { name, description, location, duration, category } = req.body;
  const newService = {
    name,
    description,
    giverUser: req.session.currentUser._id,
    location,
    duration,
    category,
    picture: req.file.path,
    dateAdded: new Date(),
  };
  Service.create(newService)
    .then((data) => {
      res.render("/users/my-profile");
    })
    .catch((err) => console.log(err));
});

servicesRouter.get("/profile/:id/edit", isLoggedIn, (req, res, next) => {
  const serviceId = req.params.id;
  Service.findById(serviceId)
    .then((foundService) => {
      const data = {
        isLogNav: isLogNavFn(req),
        service: foundService,
      };
      res.render("service-profile-edit", data);
    })
    .catch((err) => console.log(err));
});

servicesRouter.post("/edit/:id", isLoggedIn, (req, res, next) => {
  const serviceId = req.params.id;
  const { name, description, location, duration, category } = req.body;
  const incomingData = { name, description, location, duration, category };
  Service.findByIdAndUpdate(serviceId, incomingData, { new: true })
    .then(() => {
      res.redirect(`/services/profile/${serviceId}`);
    })
    .catch((err) => console.log(err));
});

servicesRouter.get("/delete/:id", (req, res, next) => {
  const serviceId = req.params.id;

  Service.findByIdAndRemove(serviceId).then(() => {
    res.redirect("/users/my-profile");
  });
});

module.exports = servicesRouter;
