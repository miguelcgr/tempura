var express = require("express");
var servicesRouter = express.Router();

const User = require("./../models/user.model");
const Service = require("./../models/service.model");

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
  const serviceSearch = req.query.search;

  Service.find({ name: serviceSearch })
    .then((servicesArr) => {
      const data = {
        isLogNav: isLogNavFn,
        servicesArr: servicesArr,
      };
      res.render("services-results", data);
    })
    .catch((err) => console.log(err));
});

servicesRouter.get("/:id", (req, res, next) => {
  const serviceId = req.params.id;
  Service.findById(serviceId)
    .then((foundService) => {
      const data = {
        isLogNav: isLogNavFn(req),
        service: foundService,
      };
      res.render("service-profile", data);
    })
    .catch((err) => console.log(err));
});

module.exports = servicesRouter;
