const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const swapSchema = new Schema({
  creationDate: { type: Date, required: true },
  status1: {type: Boolean, default: undefined},
  status2: {type: Boolean, default: undefined},
  status3: {type: Boolean, default: undefined},
  giverUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  takerUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  swapDuration: Number,
  giverAccept: { type: Boolean, default: undefined },
  giverAcceptTime: { type: Date, default: undefined },
  takerConfirmation: { type: Boolean, default: undefined },
  takerConfirmationTime: { type: Date, default: undefined },
  });

const Swap = mongoose.model("Swap", swapSchema);

module.exports = Swap;
