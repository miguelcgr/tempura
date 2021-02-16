var express = require("express");
var swapsRouter = express.Router();

const User = require("../models/user.model");
const Service = require("../models/service.model");
const Swap = require("../models/swap.model");

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

// already in /swaps

swapsRouter.post("/create/:id", (req, res, next) => {
  const serviceId = req.params.id;
  const takerUserId = req.session.currentUser._id;
  let giverUserId;
  let newSwapId;
  const requestedSessions = req.body.duration;

  Service.findById(serviceId)
    .then((returnedService) => {
      giverUserId = returnedService.giverUser;
      const serviceDuration = returnedService.duration;
      const totalDuration = requestedSessions * serviceDuration;

      const newSwap = {
        giverUser: giverUserId,
        takerUser: takerUserId,
        service: serviceId,
        swapDuration: totalDuration,
      };

      const pr = Swap.create(newSwap);
      return pr;
    })
    .then((createdSwap) => {
      newSwapId = createdSwap._id;
      const pr = User.findByIdAndUpdate(
        takerUserId,
        {
          $push: { "swaps.asTaker": newSwapId },
        },
        { new: true }
      );
      return pr;
    })
    .then((updatedTakerUser) => {
      req.session.currentUser = updatedTakerUser;

      const pr = User.findByIdAndUpdate(giverUserId, {
        $push: { "swaps.asGiver": newSwapId },
      });
      return pr;
    })
    .then(() => {
      res.render("swap-requested");
    })
    .catch((err) => console.log(err));
});

swapsRouter.get("/activity-panel", isLoggedIn, (req, res, next) => {
  User.findById(req.session.currentUser._id)
    //.populate("swaps.asTaker swaps.asGiver swaps.pastSwaps")
    .populate({
      path: "swaps",
      populate: [
        {
          path: "asTaker",
          model: "Swap",
          populate: "giverUser takerUser service",
        },
        {
          path: "asGiver",
          model: "Swap",
          populate: "giverUser takerUser service",
        },
        {
          path: "pastSwaps",
          model: "Swap",
          populate: "giverUser takerUser service",
        },
      ],
    })
    .then((myUser) => {
      console.log(myUser.swaps);
      const data = {
        isLogNav: isLogNavFn(req),
        user: myUser,
      };
      res.render("activity-panel", data);
    })
    .catch((err) => console.log(err));
});

module.exports = swapsRouter;
