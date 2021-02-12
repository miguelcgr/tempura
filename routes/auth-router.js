var express = require('express');
var router = express.Router();
const User = require("../models/user.model");
const Service = require("../models/service.model");

const { isLoggedIn } = require('../util/middleware');

const bcrypt = require('bcrypt');
const saltRounds = 10;


router.get('/', (req, res, next) => res.render('index'));

router.get('/login', (req, res, next) => res.render('login'));

router.post('/login', (req, res, next) => res.render('login'));

router.get('/signup', (req, res, next) => res.render('signup'));

router.post('/signup', (req, res, next) => res.render('signup'));

router.get('/services/?search', (req, res, next) => {           // /// // // // // 
  const serviceSearch = req.query.search;
  
  Service.find({name: serviceSearch})
   
  res.render('search-results', data);
});

router.get('/user-profile-public', (req, res, next) => {  
  res.render('user-profile-public');  
});

router.get('/user-profile-private', isLoggedIn, (req, res, next) => {  
  res.render('user-profile-private');  
});


//renders public service page (ficha)
router.get('/services/details/:id', (req, res, next) => {  
  res.render('service-profile');  
});

router.get('/edit-profile', isLoggedIn, (req, res, next) => {  
  res.render('edit-profile');  
});

router.post('/edit-profile', isLoggedIn, (req, res, next) => {  
  res.render('edit-profile');  
});

router.get('/create-service', isLoggedIn, (req, res, next) => {  
  res.render('create-service');  
});

router.post('/create-service', isLoggedIn, (req, res, next) => {
  res.render('create-service')
});

router.post('/delete-service', isLoggedIn, (req, res, next) => {
  res.render('delete-service')
});

router.get('/activity-panel', isLoggedIn, (req, res, next) => {  
  res.render('activity-panel');  
});

router.post('/activity-panel', isLoggedIn, (req, res, next) => {  
  res.render('activity-panel');  
});







module.exports = router;
