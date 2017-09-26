var fs = require('fs');
var path = require('path');

module.exports = {

  logger: function(morgan, filename) {
    if (!filename) filename = 'admin.log';
    var adminLogFilePath = path.resolve(__dirname, "../", filename);
    var adminLogStream = fs.createWriteStream(adminLogFilePath, {flags: 'a'});

    morgan.token('role', function (req, res) {
      return req.session.role;
    });
    morgan.token('session', function (req, res) {
      return req.session.id;
    });

    return morgan(':role :session - :method :status :url', {stream: adminLogStream});
  },

  setRole: function (role) {
    return function (req, res, next) {
      req.session.role = role;
      req.session.save(function (err) {
        next();
      });
    }
  },
  requireRole: function (role) {
    return function (req, res, next) {
      if (req.session.role && req.session.role === role) {
        next();
      } else {
        var error = new Error("Requires Admin");
        res.status(403).json({
          status: 403,
          message: error.message,
          name: error.name
        });
      }
    }
  }
};