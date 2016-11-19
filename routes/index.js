var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/', function (req, res) {
  if (!req.user) return res.redirect(301, '/login');
  res.render('home', {user: req.user});
});

router.get('/changepassword', function (req, res) {
  if (!req.user) return res.redirect(301, '/login');
  res.render('changepassword', {user: req.user});
});

router.get('/register', function(req, res) {
  res.render('register', { });
});

router.post('/changepassword', function(req, res) {
  if (!req.user) return res.redirect(301, '/login');

  var user = req.user;

  user.setPassword(req.body.newPassword, function (err, model, passwordErr) {
    if(!err){
      user.save(function(err){
        if (err) { next(err) }
        else {
          res.redirect(301, '/home');
        }
      })
    }
  });
});

router.post('/register', function(req, res) {
  try {
      Account.register(new Account({ username : req.body.username, role: req.body.role }), req.body.password, function(err, account) {
          if (err) {
              return res.render('register', { account : account });
          }
          passport.authenticate('local')(req, res, function () {
              res.redirect('/');
          });
      });
  }catch (err){
    console.log(err);
  }

});

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res){
  res.status(200).send("pong!");
});

module.exports = router;
