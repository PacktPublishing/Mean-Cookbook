var express = require('express');
var router = express.Router();

router.all('*', function(req, res, next) {
  var hasSession = req.signedCookies.session;
  if (hasSession) {
    req.session = hasSession;
  } else {
    var newSession = Math.floor(Math.random() * 1000000000);
    res.cookie('session', newSession, { signed: true });
    req.session = newSession;
  }
  next();
});

router.get('/admin', function(req, res, next) {
  var adminId = 'super_secret_session';
  res.cookie('session', adminId, { signed: true });
  req.session = adminId;
  res.redirect('/');
});

module.exports = router;