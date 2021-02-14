require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./../models/user.model");
const Service = require("./../models/service.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const initialUsers = [
  {
    username: "javisastre",
    fname: "Javi",
    lname: "Sastre",
    email: "javisastre@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Sants",
    password: "javi123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 24),
  },
  {
    username: "miguelcalvo",
    fname: "Miguel",
    lname: "Calvo",
    email: "miguelcalvo@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Montjuic",
    password: "miguel123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
  },
];

const initialServices = [
  {
    name: "Gardening",
    description: "I can take care of your garden, no matter how big it is.",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Sants",
    duration: 1,
    category: "Construction & repair",
  },
  {
    name: "Babysitting",
    description: "I can take care of your baby while you work or relax.",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Sants",
    duration: 1,
    category: "Care",
  },
  {
    name: "Sailing theory lessons",
    description:
      "I have 10 years of sailing experience and I can teach you how to sail. Arrr!",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Montjuic",
    duration: 1,
    category: "Lessons",
  },
  {
    name: "Karate lessons",
    description:
      "I am a black-belt kyokushinkai karateka. Come and learn the path to martial arts.",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Montjuic",
    duration: 1,
    category: "Lessons",
  },
];

mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log("Connected to the DB");
    const pr = x.connection.dropDatabase();
    return pr;
  })
  .then(() => {
    initialUsers.forEach((user) => {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hiddenPassword = bcrypt.hashSync(user.password, salt);
      user.password = hiddenPassword;
    });

    const pr = User.create(initialUsers);
    return pr;
  })
  .then((users) => {
    console.log(`${initialUsers.length} users introduced in the DB.`);

    initialServices.forEach((service) => {
      service.giverUser = users[Math.floor(Math.random() * users.length)]._id;
    });

    const pr = Service.create(initialServices);
    console.log(`${initialServices.length} services introduced in the DB.`);
    return pr;
  })
  .then((createdServices) => {
    mongoose.connection.close();
  })
  .catch((err) => console.error("Error connecting to mongo", err));
