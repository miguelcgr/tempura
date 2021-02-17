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
        status1: true,
        status2: false,
        status3: false,
        creationDate: new Date(),
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
      ).populate("swaps.asTaker");
      return pr;
    })
    .then((updatedTakerUser) => {
      req.session.currentUser = updatedTakerUser;

      const pr = User.findByIdAndUpdate(
        giverUserId,
        {
          $push: { "swaps.asGiver": newSwapId },
        },
        { new: true }
      );
      return pr;
    })
    .then((updatedGiver) => {
      const newNotification = updatedGiver.notifications + 1;
      const pr = User.findByIdAndUpdate(giverUserId, {
        notifications: newNotification,
      });
      return pr;
    })
    .then(() => {
      const data = {
        request: "You requested this service!",
      };
      res.redirect(`/services/profile/${serviceId}`);
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
      const data = {
        isLogNav: isLogNavFn(req),
        user: myUser,
      };
      res.render("activity-panel", data);
    })
    .catch((err) => console.log(err));
});

swapsRouter.get("/:id/accept", (req, res, next) => {
  const swapId = req.params.id;
  Swap.findByIdAndUpdate(swapId, {
    giverAccept: true,
    giverAcceptTime: new Date(),
  })
    .then(() => {
      res.redirect("/swaps/activity-panel");
    })
    .catch((err) => console.log(err));
});

swapsRouter.get("/:id/reject", (req, res, next) => {
  const swapId = req.params.id;
  Swap.findByIdAndUpdate(swapId, {
    giverAccept: false,
    giverAcceptTime: new Date(),
  })
    .then(() => {
      res.redirect("/swaps/activity-panel");
    })
    .catch((err) => console.log(err));
});

module.exports = swapsRouter;
