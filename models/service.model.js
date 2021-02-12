const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  giverUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: String,
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
      default:
        "https://www.publicdomainpictures.net/pictures/300000/velka/empty-white-room.jpg",
    },
  ],
  dateAdded: { type: Date, default: Date.now },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
