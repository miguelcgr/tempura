const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  balance: { type: Number, default: 0 },
  location: String,
  password: { type: String, required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  swaps: {
    asTaker: [{ type: mongoose.Schema.Types.ObjectId, ref: "Swap" }],
    asGiver: [{ type: mongoose.Schema.Types.ObjectId, ref: "Swap" }],
    pastSwaps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Swap" }],
  },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Swap" }],
  profilePic: {
    type: String,
    default: "https://cdn.onlinewebfonts.com/svg/img_329115.png",
  },
  joinDate: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
