const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const defaultImgUrl =
  "https://lh3.googleusercontent.com/proxy/EYQ18Q48i6GmWkZ1oK5kMTUfqzBKc5SVrlOk5PAZcIwrJI4gyzos6at6Eyn_Vniqag63GDc-8nzyPxAfBADuEB7BRiKK-o-YcrRDyZqYgZRX9pj7d1Yjdnaruj9CftQlka2IM24FIxOLz3g";

const serviceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  giverUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  servLocation: String,
  duration: Number, //hours
  category: {
    type: String,
    enum: [
      "Lessons",
      "Construction & repair",
      "Care",
      "Digital services",
      "Sports & Health",
      "Food",
      "Other",
    ],
    default: "Other",
  },
  picture: [
    {
      type: String,
      default: defaultImgUrl,
    },
  ],
  dateAdded: { type: Date, default: new Date()},
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
