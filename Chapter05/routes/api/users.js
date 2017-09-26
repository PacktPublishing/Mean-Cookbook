var express = require('express');
var router = express.Router();
var restFactory = require('../../middleware/rest');

router.use(auth.requireRole('admin'));
router.use(restFactory('users', users, serialize));

module.exports = router;