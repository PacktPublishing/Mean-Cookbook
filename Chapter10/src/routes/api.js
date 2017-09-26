var express = require('express');
var router = express.Router();
var posts = require('./api/posts');
var users = require('./api/users');
var auth = require('../middleware/auth');
var stripe = require('../middleware/stripe');
var login = require('./api/login');
var images = require('./api/images');
var enforceContentType = require('enforce-content-type');
var jwt = require('jwt-express');
var env = process.env.NODE_ENV || 'development';

router.options('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

router.use(enforceContentType({
  type: ['application/json', 'multipart/form-data', 'application/x-www-form-urlencoded']
}));

router.get('/', function (req, res) {
  res.send('API is running');
});

router.use('/login', login);
router.use('/donate', stripe.createCustomer, stripe.charge(500), function(req, res) {
  console.log(res.stripe);
  res.send('thank you');
});
router.use('/customers', jwt.active(), stripe.getCustomers);
router.use('/images', jwt.active(), jwt.require('role', '===', 'admin'), images);
router.use('/posts', jwt.active(), jwt.require('role', '===', 'admin'), posts);
router.use('/users', jwt.active(), jwt.require('role', '===', 'admin'), users);

router.get('/:param', function (req, res, next) {
  var params = req.params;
  var query = req.query;
  Object.assign(params, query);
  res.json(params);
});

if (env == 'production') {
  router.use(auth.unauthorized);
}

module.exports = router;
