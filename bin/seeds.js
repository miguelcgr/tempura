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
    servLocation: "Sants",
    password: "javi123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C4E03AQEPZdRIHptvjA/profile-displayphoto-shrink_800_800/0/1610815715110?e=1619049600&v=beta&t=iSFomBACqWkP7SQ6pNFW6Eojca3sM2Nocj7xSIKhGq4",
    notifications: 0,
    joinDate: new Date(2018, 11, 24),
  },
  {
    username: "miguelcalvo",
    fname: "Miguel",
    lname: "Calvo",
    email: "miguelcalvo@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Montjuic",
    password: "miguel123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C5603AQHKIDmZfoNahQ/profile-displayphoto-shrink_800_800/0/1517527204463?e=1619049600&v=beta&t=xpVFWsXyIHgok-Mhyyb9ooyClPnSrAbC0QG3-wtmgsQ",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
  {
    username: "carlotapinol",
    fname: "Carlota",
    lname: "Pinol",
    email: "carlotapinol@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Hospitalet",
    password: "carlota123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "data:image/jpeg;base64,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",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
  {
    username: "fedemuniente",
    fname: "Fede",
    lname: "Muniente",
    email: "fedemuniente@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Sagrada Familia",
    password: "fede123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C5603AQETvTz34Vkn8w/profile-displayphoto-shrink_800_800/0/1516893111552?e=1619049600&v=beta&t=Z403OGNVOob3NO5_dLCQNQ6TTItAi2tYbPoPYmFLnTU",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
  {
    username: "clementvallat",
    fname: "Clement",
    lname: "Vallat",
    email: "clementvallat@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Born",
    password: "clement123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C5603AQEfZEpHTU9UAA/profile-displayphoto-shrink_800_800/0/1535295465091?e=1619049600&v=beta&t=uZpLfYrOVdH1zbK3tR0Yp_0OUsTFbwhsvoeGe1MeARA",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
  {
    username: "davidcastejon",
    fname: "David",
    lname: "Castejon",
    email: "davidcastejon@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Arc de triumf",
    password: "david123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C4D03AQGNGMJOl4csWQ/profile-displayphoto-shrink_800_800/0/1516957158024?e=1619049600&v=beta&t=8pByDoGU9R67Cw2bONTIQXjzB_ELmj63Af6-0phLuKU",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
  {
    username: "sotidialeti",
    fname: "Soti",
    lname: "Dialeti",
    email: "sotidialeti@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Gracia",
    password: "soti123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C4D03AQG9mm7hlTAhYA/profile-displayphoto-shrink_800_800/0/1611217790689?e=1619049600&v=beta&t=nDF3LFsCXkik4BqllzYvLOzUlLbRcfCIUMDayijVYfs",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
  {
    username: "annamazurek",
    fname: "Anna",
    lname: "Mazurek",
    email: "annamazurek@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Barceloneta",
    password: "fede123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C5603AQGzx_TKMkYGAw/profile-displayphoto-shrink_800_800/0/1563732796542?e=1619049600&v=beta&t=Y0crP4zMe9XATo52jYET5aOnPGQ-6g3si8loaEpWDsM",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
  {
    username: "georgiaadams",
    fname: "Georgia",
    lname: "Adams",
    email: "georgiaadams@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Marina",
    password: "georgia123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C4D03AQF_CwsmhbHZoA/profile-displayphoto-shrink_800_800/0/1538427378355?e=1619049600&v=beta&t=SZFyP28zZcYp2q1qDeulo7D1Y6hWzPDsexRqtuwsEIg",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
  {
    username: "mattweber",
    fname: "Matt",
    lname: "Weber",
    email: "mattweber@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Eixample",
    password: "matt123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C4D03AQFUAp5qCXTYXQ/profile-displayphoto-shrink_800_800/0/1547587186929?e=1619049600&v=beta&t=4UEV9HRIGWFwXhRnN9lqnpa51zWOqYW3RgUegdVbEfk",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
  {
    username: "aleixbadia",
    fname: "Aleix",
    lname: "Badia",
    email: "aleixbadia@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Terrassa",
    password: "aleix123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_256,w_256,f_auto,g_faces,z_0.7,q_auto:eco/bjexslppbfejeueyxxu0",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },

  {
    username: "arslanegharout",
    fname: "Arslane",
    lname: "Gharout",
    email: "arslanegharaout@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Eixample",
    password: "arslane23",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C4D03AQFRLIyYSOqn3w/profile-displayphoto-shrink_400_400/0/1594037967065?e=1619049600&v=beta&t=zgY9x700J8DudK8tQumXs_Fei0yMsbNOC5Qc0IrgKks",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
  {
    username: "isabelmartinez",
    fname: "Isabel",
    lname: "Martinez",
    email: "isabelmartinez@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Huesca",
    password: "isabel123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C4D35AQF9id74To9jFw/profile-framedphoto-shrink_400_400/0/1609246731270?e=1613671200&v=beta&t=PFKCF3Uilzr36S37JBtxn_4jqWsJSIWPKraGq1_Xteo",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
  {
    username: "dimitrijdugan",
    fname: "Dimitrij",
    lname: "Dugan",
    email: "dimitrijdugan@tempura.org",
    phone: 612345678,
    balance: 10,
    servLocation: "Poblenou",
    password: "dimitrij123",
    services: [],
    swaps: {
      asTaker: [],
      asGiver: [],
      pastSwaps: [],
    },
    profilePic:
      "https://media-exp1.licdn.com/dms/image/C4D03AQFxokx51hyqSA/profile-displayphoto-shrink_400_400/0/1596513455630?e=1619049600&v=beta&t=wmR_OmJ2JrtJXpWqZgrwWOAkqDhl_VmHf45TF5odiHY",
    notifications: 0,
    joinDate: new Date(2018, 11, 22),
  },
];

const initialServices = [
  {
    name: "Gardening",
    description: "I can take care of your garden, no matter how big it is.",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Sants",
    duration: 1,
    picture: "https://live.staticflickr.com/65535/48746741652_cf7220d6bc_b.jpg",
    category: "Construction & repair",
  },
  {
    name: "Babysitting",
    description: "I can take care of your baby while you work or relax.",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Sants",
    duration: 1,
    picture: "https://live.staticflickr.com/8569/15860479493_8ee1dcddea_b.jpg",
    category: "Care",
  },
  {
    name: "Sailing theory lessons",
    description:
      "I have 10 years of sailing experience and I can teach you how to sail. Arrr!",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Montjuïc",
    duration: 1,
    picture: "https://live.staticflickr.com/5758/30253362611_3b2847dafa_b.jpg",
    category: "Lessons",
  },
  {
    name: "Karate lessons",
    description:
      "I am a black-belt kyokushinkai karateka. Strike first, strike hard, no mercy.",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Montjuïc",
    duration: 1,
    picture: "https://live.staticflickr.com/3468/5725893654_fecd9d8e29_b.jpg",
    category: "Lessons",
  },
  {
    name: "Pole dance class",
    description: "I am a world champion pole dancer, come learn with me",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Hospitalet",
    duration: 1,
    picture: "https://live.staticflickr.com/2210/2093511196_c3a1978942_b.jpg",
    category: "Lessons",
  },
  {
    name: "Cow walking",
    description: "I can walk your cow when you are away",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Hospitalet",
    duration: 1,
    picture: "https://live.staticflickr.com/2441/3559372899_523101b797_b.jpg",
    category: "Care",
  },
  {
    name: "Code review session",
    description: "I can share with you my coding knowledge",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Sagrada Família",
    duration: 1,
    picture: "https://live.staticflickr.com/3708/14102205140_d25a5588ea_b.jpg",
    category: "Digital services",
  },
  {
    name: "Wall painting session",
    description: "I can paint any wall any color",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Sagrada Família",
    duration: 1,
    picture:
      "https://i.pinimg.com/originals/df/26/62/df266292f6fb09798fe9965a6b01aa71.jpg",
    category: "Construction & repair",
  },
  {
    name: "Guitar Lessons",
    description: "Become the next Jimi Hendrix",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "El Born",
    duration: 1,
    picture: "https://live.staticflickr.com/3575/3412278914_e526bb27d0_b.jpg",
    category: "Lessons",
  },
  {
    name: "French lessons",
    description:
      "You will learn to speak French in no time with my  French lessons",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "El Born",
    duration: 1,
    picture:
      "https://2.bp.blogspot.com/-q0OooaMxa2I/XENAwabjSOI/AAAAAAAAG-g/mlQ1wpfbudQwFvseYYXfD_8Ox1UkukY6wCK4BGAYYCw/s1600/France%2BFlag.png",
    category: "Lessons",
  },
  {
    name: "Text correction sessions",
    description:
      "I have a degree in literature and can help you correct your texts",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Arc de Triomf",
    duration: 1,
    picture: "https://live.staticflickr.com/2273/2188024526_8d690f8f3a_o.jpg",
    category: "Lessons",
  },
  {
    name: "Greek lessons",
    description:
      "You will learn to speak Greek in no time with my  Greek lessons",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Gràcia",
    duration: 1,
    picture:
      "https://cdn1.iconfinder.com/data/icons/international-glossy-flags/512/greece_greek_national_country_flag-512.png",
    category: "Lessons",
  },
  {
    name: "Ballet Lessons",
    description: "Become the next Billy Elliot with my ballet lessons",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Gràcia",
    duration: 1,
    picture: "https://live.staticflickr.com/4142/4809399513_b285594886_o.jpg",
    category: "Lessons",
  },
  {
    name: "Ski training sessions",
    description:
      "I am a qualified ski instructor and can teach how to ski or snowboard",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "El Gòtic",
    duration: 1,
    picture: "https://live.staticflickr.com/8659/16414631171_e89899d295_b.jpg",
    category: "Lessons",
  },
  {
    name: "Piano Lessons",
    description: "Become the next Elton John",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Marina",
    duration: 1,
    picture: "https://live.staticflickr.com/4034/4675634006_5efb3d664a_b.jpg",
    category: "Lessons",
  },
  {
    name: "Bakery Lessons",
    description: "I will teach you how to make all kinds of desserts",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Marina",
    duration: 1,
    picture: "https://live.staticflickr.com/1844/43421789945_e83f6891e9_b.jpg",
    category: "Food",
  },

  {
    name: "IKEA furniture installation",
    description: "I am very handy and can help you with your furniture",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Arc de Triomf",
    duration: 1,
    picture:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjsdGVDkkI0JjWiyH0SoN6xPSwtg9sLS8nQw&usqp=CAU",
    category: "Construction & repair",
  },
  {
    name: "Dog walk",
    description: "I can take care of your best friend when you are away",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Terrassa",
    duration: 1,
    picture:
      "https://blog.currentcatalog.com/wp-content/uploads/2018/10/dog-walking.jpg",
    category: "Care",
  },
  {
    name: "Marketing consultancy",
    description: "Marketing help for your small business.",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Arc de Triomf",
    duration: 1,
    picture: "https://www.apm.org.uk/media/7968/gantt-chart1.jpg",
    category: "Digital services",
  },
  {
    name: "Bicycle repair",
    description: "I am very handy and can help you with your bike",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Arc de Triomf",
    duration: 1,
    picture: "https://live.staticflickr.com/4002/4179179019_b256eac6a2_b.jpg",
    category: "Construction & repair",
  },
  {
    name: "House repairments",
    description: "I can help you with all kinds of house repairments",
    giverUser: "6026b09ada76808f8e5fe556",
    servLocation: "Arc de Triomf",
    duration: 1,
    picture: "https://live.staticflickr.com/216/456414048_4347ab5a1f_o.jpg",
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
    console.log("Dropped previous DB");
    initialUsers.forEach((user) => {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hiddenPassword = bcrypt.hashSync(user.password, salt);
      user.password = hiddenPassword;
    });

    const pr = User.create(initialUsers);
    return pr;
  })
  .then((users) => {
    console.log(`${users.length} users introduced in the DB.`);

    initialServices.forEach((service) => {
      let randomNum = Math.floor(Math.random() * users.length);
      service.giverUser = users[randomNum]._id;
    });

    const pr = Service.create(initialServices);
    return pr;
  })
  .then((createdServices) => {
    console.log(`${createdServices.length} services introduced in the DB.`);

    const updatePrs = createdServices.map((serv) => {
      return User.findByIdAndUpdate(serv.giverUser, {
        $push: { services: serv._id },
      })
        .then(() => {})
        .catch((err) => console.log(err));
    });

    const bigPr = Promise.all(updatePrs);

    return bigPr;
  })
  .then((updatedUsers) => {
    mongoose.connection.close();
  })
  .catch((err) => console.error("Error connecting to mongo", err));
