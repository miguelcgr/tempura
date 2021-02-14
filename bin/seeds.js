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
  {
    username: "carlotapinol",
    fname: "Carlota",
    lname: "Pinol",
    email: "carlotapinol@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Hospitalet",
    password: "carlota123",
    services: [],
    swaps: {
    asTaker: [],
    asGiver: [],
    pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
    },
    {
    username: "fedemuniente",
    fname: "Fede",
    lname: "Muniente",
    email: "fedemuniente@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Sagrada Familia",
    password: "fede123",
    services: [],
    swaps: {
    asTaker: [],
    asGiver: [],
    pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
    },
    {
    username: "clementvallat",
    fname: "Clement",
    lname: "Vallat",
    email: "clementvallat@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Born",
    password: "clement123",
    services: [],
    swaps: {
    asTaker: [],
    asGiver: [],
    pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
    },
    {
    username: "davidcastejon",
    fname: "David",
    lname: "Castejon",
    email: "davidcastejon@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Arc de triumf",
    password: "david123",
    services: [],
    swaps: {
    asTaker: [],
    asGiver: [],
    pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
    },
    {
    username: "sotidialeti",
    fname: "Soti",
    lname: "Dialeti",
    email: "sotidialeti@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Gracia",
    password: "soti123",
    services: [],
    swaps: {
    asTaker: [],
    asGiver: [],
    pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
    },
    {
    username: "annamazurek",
    fname: "Anna",
    lname: "Mazurek",
    email: "annamazurek@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Barceloneta",
    password: "fede123",
    services: [],
    swaps: {
    asTaker: [],
    asGiver: [],
    pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
    },
    {
    username: "georgiaadams",
    fname: "Georgia",
    lname: "Adams",
    email: "georgiaadams@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Marina",
    password: "georgia123",
    services: [],
    swaps: {
    asTaker: [],
    asGiver: [],
    pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
    },
    {
    username: "mattweber",
    fname: "Matt",
    lname: "Weber",
    email: "mattweber@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Eixample",
    password: "matt123",
    services: [],
    swaps: {
    asTaker: [],
    asGiver: [],
    pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
    },
    {
    username: "aleixbadia",
    fname: "Aleix",
    lname: "Badia",
    email: "aleixbadia@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Terrassa",
    password: "aleix123",
    services: [],
    swaps: {
    asTaker: [],
    asGiver: [],
    pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
    },
    
    {
    username: "arslanegharout",
    fname: "Arslane",
    lname: "Gharout",
    email: "arslanegharaout@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Eixample",
    password: "arslane23",
    services: [],
    swaps: {
    asTaker: [],
    asGiver: [],
    pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
    },
    {
    username: "isabelmartinez",
    fname: "Isabel",
    lname: "Martinez",
    email: "isabelmartinez@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Huesca",
    password: "isabel123",
    services: [],
    swaps: {
    asTaker: [],
    asGiver: [],
    pastSwaps: [],
    },
    notifications: [],
    joinDate: new Date(2018, 11, 22),
    },
    {
    username: "dimitrijdugan",
    fname: "Dimitrij",
    lname: "Dugan",
    email: "dimitrijdugan@tempura.org",
    phone: 612345678,
    balance: 10,
    location: "Poblenou",
    password: "dimitrij123",
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
      "I am a black-belt kyokushinkai karateka. Strike first, strike hard, no mercy.",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Montjuic",
    duration: 1,
    category: "Lessons",
  },
  {
    name: "Pole dance class",
    description:
    "I am a world champion pole dancer, come elarn with me",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Hospitalet",
    duration: 1,
    category: "Lessons",
    },
    {
    name: "Cow walking",
    description:
    "I can walk your cow when you are away",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Hospitalet",
    duration: 1,
    category: "Care",
    },
    {
    name: "Code review session",
    description:
    "I can share with you my coding knowledge",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Sagrada Familia",
    duration: 1,
    category: "Digital services",
    },
    {
    name: "Wall painting session",
    description:
    "I can paint any wall any color",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Sagrada Familia",
    duration: 1,
    category: "Construction & repair",
    },
    {
    name: "Guitar Lessons",
    description:
    "Become the next Jimi Hendrix",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "El Born",
    duration: 1,
    category: "Lessons",
    },
    {
    name: "French lessons",
    description:
    "You will learn to speak French in no time with my  French lessons",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "El Born",
    duration: 1,
    category: "Lessons",
    },
    {
    name: "Text correction sessions",
    description:
    "I have a degree in literature and can help you correct your texts",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Arc de Triumf",
    duration: 1,
    category: "Lessons",
    },
    {
    name: "Greek lessons",
    description:
    "You will learn to speak Greek in no time with my  Greek lessons",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Gracia",
    duration: 1,
    category: "Lessons",
    },
    {
    name: "Ballet Lessons",
    description:
    "Become the next Billy Elliot with my ballet lessons",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Gracia",
    duration: 1,
    category: "Lessons",
    },
    {
    name: "Ski training sessions",
    description:
    "I am a qualified ski instructor and can teach how to ski or snowboard",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "El Gotico",
    duration: 1,
    category: "Lessons",
    },
    {
    name: "Piano Lessons",
    description:
    "Become the next Elton John",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Marina",
    duration: 1,
    category: "Lessons",
    },
    {
    name: "Bakery Lessons",
    description:
    "I will teach you how to make all kinds of desserts",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Marina",
    duration: 1,
    category: "Food",
    },
    
    {
    name: "IKEA furniture installation",
    description:
    "I am very handy and can help you with your furniture",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Arc de Triumf",
    duration: 1,
    category: "Construction & repair",
    },
    {
    name: "Dog walk",
    description:
    "I can take care of your best friend when you are away",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Terrassa",
    duration: 1,
    category: "Care",
    },
    {
    name: "Marketing consultancy",
    description:
    "Marketing help for your small business.",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Arc de Triumf",
    duration: 1,
    category: "Digital services
    },
    {
    name: "Bicycle repair",
    description:
    "I am very handy and can help you with your bike",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Arc de Triumf",
    duration: 1,
    category: "Construction & repair",
    },
    {
    name: "House repairments",
    description:
    "I can help you with all kinds of house repairments",
    giverUser: "6026b09ada76808f8e5fe556",
    location: "Arc de Triumf",
    duration: 1,
    category: "Construction & repair",
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
