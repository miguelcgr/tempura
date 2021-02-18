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

function getNavUserData(req) {
  let data;
  if (req.session.currentUser) {
    data = req.session.currentUser;
  } else {
    data = false;
  }
  return data;
}

// already in /swaps

// load the activity panel with all the swap information of the user

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
      const injectData = {
        isLogNav: isLogNavFn(req),
        navUserData: getNavUserData(req),
        user: myUser,
      };
      req.session.currentUser = myUser;
      res.render("activity-panel", injectData);
    })
    .catch((err) => console.log(err));
});

// swap creation

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

// giver actions
swapsRouter.get("/:id/accept", (req, res, next) => {
  const swapId = req.params.id;
  Swap.findByIdAndUpdate(swapId, {
    giverAccept: true,
    giverAcceptTime: new Date(),
    status1: false,
    status2: true,
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
    status1: false,
    status3: true,
  })
    .then(() => {
      res.redirect("/swaps/activity-panel");
    })
    .catch((err) => console.log(err));
});

swapsRouter.get("/:id/reconsider", (req, res, next) => {
  const swapId = req.params.id;
  Swap.findByIdAndUpdate(swapId, {
    giverAccept: undefined,
    giverAcceptTime: undefined,
    status1: true,
    status3: false,
  })
    .then(() => {
      res.redirect("/swaps/activity-panel");
    })
    .catch((err) => console.log(err));
});

// taker actions
swapsRouter.get("/:id/complete", (req, res, next) => {
  const swapId = req.params.id;
  let giverId;
  let takerId;
  let swapHours;

  Swap.findByIdAndUpdate(
    swapId,
    {
      takerConfirmation: true,
      takerConfirmationTime: new Date(),
    },
    { new: true }
  )
    .then((updatedSwap) => {
      giverId = updatedSwap.giverUser;
      takerId = updatedSwap.takerUser;
      swapHours = updatedSwap.swapDuration;
      const pr = User.findById(takerId);
      return pr;
    })
    .then((takerUser) => {
      const asTakerSwapsArr = takerUser.swaps.asTaker;
      const pastSwapsArr = takerUser.swaps.pastSwaps;
      const updatedBalance = takerUser.balance - swapHours;

      const updatedAsTakerSwapsArr = asTakerSwapsArr.filter(
        (swap) => swap != swapId
      );

      const updatedPastSwapsArr = [...pastSwapsArr];
      updatedPastSwapsArr.push(swapId);

      const pr = User.findByIdAndUpdate(
        takerId,
        {
          "swaps.asTaker": updatedAsTakerSwapsArr,
          "swaps.pastSwaps": updatedPastSwapsArr,
          balance: updatedBalance,
        },
        { new: true }
      );
      return pr;
    })
    .then((updatedTaker) => {
      req.session.currentUser = updatedTaker;

      const pr = User.findById(giverId);
      return pr;
    })
    .then((giverUser) => {
      const asGiverSwapsArr = giverUser.swaps.asGiver;
      const pastSwapsArr = giverUser.swaps.pastSwaps;

      const updatedBalance = giverUser.balance + swapHours;
      const updatedAsGiverSwapsArr = asGiverSwapsArr.filter(
        (swap) => swap != swapId
      );

      const updatedPastSwapsArr = [...pastSwapsArr];
      updatedPastSwapsArr.push(swapId);

      const pr = User.findByIdAndUpdate(
        giverId,
        {
          "swaps.asGiver": updatedAsGiverSwapsArr,
          "swaps.pastSwaps": updatedPastSwapsArr,
          balance: updatedBalance,
        },
        { new: true }
      );
      return pr;
    })
    .then(() => {
      res.redirect("/swaps/activity-panel");
    })

    .catch((err) => console.log(err));
});

// common action giver & taker
swapsRouter.get("/:id/delete-as-taker", (req, res, next) => {
  const swapId = req.params.id;
  let giverId;
  let takerId;
  Swap.findById(swapId)
    .then((swapInfo) => {
      giverId = swapInfo.giverUser;
      takerId = swapInfo.takerUser;
      const pr = User.findById(giverId);
      return pr;
    })
    .then((giverUser) => {
      const asGiverArr = giverUser.swaps.asGiver;

      const updatedGiverArr = asGiverArr.filter((swap) => swap !== swapId);

      const pr = User.findByIdAndUpdate(
        giverId,
        {
          "swaps.asGiver": updatedGiverArr,
        },
        { new: true }
      );
      return pr;
    })
    .then(() => {
      const pr = User.findById(takerId);
      return pr;
    })
    .then((takerUser) => {
      const asTakerArr = takerUser.swaps.asTaker;

      const updatedTakerArr = asTakerArr.filter((swap) => swap !== swapId);
      const pr = User.findByIdAndUpdate(
        takerId,
        {
          "swaps.asTaker": updatedTakerArr,
        },
        { new: true }
      );
      return pr;
    })
    .then((updatedTaker) => {
      req.session.currentUser = updatedTaker;
      const pr = Swap.findByIdAndDelete(swapId);
      return pr;
    })
    .then(() => {
      res.redirect("/swaps/activity-panel");
    })
    .catch((err) => console.log(err));
});

swapsRouter.get("/:id/delete-as-giver", (req, res, next) => {
  const swapId = req.params.id;
  let giverId;
  let takerId;
  Swap.findById(swapId)
    .then((swapInfo) => {
      giverId = swapInfo.giverUser;
      takerId = swapInfo.takerUser;
      const pr = User.findById(giverId);
      return pr;
    })
    .then((giverUser) => {
      const asGiverArr = giverUser.swaps.asGiver;

      const updatedGiverArr = asGiverArr.filter((swap) => swap !== swapId);

      const pr = User.findByIdAndUpdate(
        giverId,
        {
          "swaps.asGiver": updatedGiverArr,
        },
        { new: true }
      );
      return pr;
    })
    .then((updatedGiver) => {
      req.session.currentUser = updatedGiver;

      const pr = User.findById(takerId);
      return pr;
    })
    .then((takerUser) => {
      const asTakerArr = takerUser.swaps.asTaker;

      const updatedTakerArr = asTakerArr.filter((swap) => swap !== swapId);
      const pr = User.findByIdAndUpdate(
        takerId,
        {
          "swaps.asTaker": updatedTakerArr,
        },
        { new: true }
      );
      return pr;
    })
    .then((updatedTaker) => {
      const pr = Swap.findByIdAndDelete(swapId);
      return pr;
    })
    .then(() => {
      res.redirect("/swaps/activity-panel");
    })
    .catch((err) => console.log(err));
});

module.exports = swapsRouter;
