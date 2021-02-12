const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const swapSchema = new Schema({
  giverUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  takerUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  swapDuration: Number,
  giverAccept: { type: Boolean, default: false },
  giverAcceptTime: { type: Date, default: undefined },
  takerConfirmation: { type: Boolean, default: false },
  takerConfirmationTime: { type: Date, default: undefined },
});

const Swap = mongoose.model("Swap", swapSchema);

module.exports = Swap;
