var express = require("express");
var router = express.Router();

const User = require("./../models/user.model");
const Service = require("./../models/service.model");
const errorMessage = {
  errorMessage: "Please provide correct username and password",
};

router.get("/services", (req, res, next) => {
  const serviceSearch = req.query.search;
  Service.find(serviceSearch)
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

router.get("/services/:id", (req, res, next) => {});
