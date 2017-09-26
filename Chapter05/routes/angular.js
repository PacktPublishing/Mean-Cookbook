var path = require('path');
var fs = require('fs');

var express = require('express');
var router = express.Router();

var cheerio = require('cheerio');
var angularBuildPath = path.resolve(__dirname,
  '../../my-angular4-project/dist');
var angularIndexFile = cheerio.load(
  fs.readFileSync(
    path.join(angularBuildPath, 'index.html'),
    {encoding: "utf8"}
  )
);

router.use(express.static(angularBuildPath));

router.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  var acceptLanguage = req.get('Accept-Language') || 'en-us,en';
  var locale = acceptLanguage.split(',')[0];
  angularIndexFile('head script').html('document.locale = "' + locale + '"');
  res.contentType('text/html; charset=UTF-8');
  res.send(angularIndexFile.html());
});

module.exports = router;