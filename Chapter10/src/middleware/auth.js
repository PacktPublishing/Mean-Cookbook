var fs = require('fs');
var path = require('path');
var JSONAPIError = require('jsonapi-serializer').Error;

module.exports = {
  logger: function(morgan, filename) {
    if (!filename) filename = 'admin.log';
    var adminLogFilePath = path.resolve(__dirname, filename);
    var adminLogStream = fs.createWriteStream(adminLogFilePath, { flags: 'a' });

    morgan.token('role', function (req, res) {
      return req.session.user.role;
    });

    morgan.token('email', function (req, res) {
      return req.session.user.email;
    });

    return morgan(':email :role - :method :status :url', {
      skip: function (req, res) {
        return !req.session.user
      },
      stream: adminLogStream
    });
  },

  requireRole: function (role) {
    return function (req, res, next) {
      var user = req.session.user;
      if (user && user.role && user.role === role) {
        next();
      } else {
        res.status(403).json(new JSONAPIError({
          status: 403,
          title: 'Requires ' + role + ' Role',
          detail: 'You do not have the correct authorization to access this resource.'
        }));
      }
    }
  },

  unauthorized: function (err, req, res, next) {
    return res.status(401).json(new JSONAPIError({
      status: 401,
      title: 'Requires Authentication',
      detail: err.message
    }));
  }
};