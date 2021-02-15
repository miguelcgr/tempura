var express = require("express");
var servicesRouter = express.Router();

const User = require("./../models/user.model");
const Service = require("./../models/service.model");

// already in /services/

servicesRouter.get("/", (req, res, next) => {
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

servicesRouter.get("/:id", (req, res, next) => {});

module.exports = servicesRouter;
