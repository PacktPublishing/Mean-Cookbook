var express = require('express');
var router = express.Router();

router.options('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

router.get('/', function (req, res, next) {
  res.send('API is running');
});

router.get('/:param', function (req, res, next) {
  var params = req.params;
  var query = req.query;
  Object.assign(params, query);
  res.json(params);
});

module.exports = router;
