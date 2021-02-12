var express = require('express');
var router = express.Router();
const User = require("./../models/user.model");

const bcrypt = require('bcrypt');
const saltRounds = 10;


router.get('/', (req, res, next) => res.render('index'));

router.get('/login', (req, res, next) => res.render('login'));

router.get('/signup', (req, res, next) => res.render('signup'));

router.get('/services/?search', (req, res, next) => {
  res.render('search-results');
});

//renders public page
router.get('/services/details/:id', (req, res, next) => {  
  res.render('service-profile');
});





module.exports = router;
