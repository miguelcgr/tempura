require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) =>
    console.log(`Connected to Tempura DB on port ${process.env.PORT}!`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));
