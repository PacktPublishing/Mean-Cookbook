var cloudinary = require('cloudinary');
var JSONAPIError = require('jsonapi-serializer').Error;
var _pick = require('lodash/pick');

cloudinary.config({
  cloud_name: process.env.cloudinaryCloudName,
  api_key: process.env.cloudinaryAPIKey,
  api_secret: process.env.cloudinaryAPISecret
});

var self = module.exports = {
  upload: function(image, options) {
    if (!options) options = {};
    options.type = "authenticated";
    return function(req, res, next) {
      cloudinary.v2.uploader.upload(image, options, function(error, result) {
        if (error) {
          return res.status(error.http_code).json(new JSONAPIError({
            status: error.http_code,
            title: 'Cloudinary Upload Error',
            detail: error.message
          }));
        }
        req.cloudinary = result;
        next();
      });
    }
  },

  uploadFromFilePath: function(req, res, next) {
    if (req.file && req.file.path) {
      let path = req.file.path;
      return self.upload(path)(req, res, next);
    } else {
      return res.status(500).json(new JSONAPIError({
        status: 500,
        title: 'Invalid File Path',
        detail: 'There is no file path available to upload to Cloudinary.'
      }));
    }
  },

  uploadBuffer: function(buffer, options) {
    if (!options) options = {};
    options.type = "authenticated";
    options.discard_original_filename = true;
    return function(req, res, next) {
      cloudinary.v2.uploader.upload_stream(options, function(error, result) {
        if (error) {
          return res.status(error.http_code).json(new JSONAPIError({
            status: error.http_code,
            title: 'Cloudinary Upload Error',
            detail: error.message
          }));
        }
        req.cloudinary = result;
        next();
      }).end(buffer);
    }
  },

  uploadFromFileBuffer: function(req, res, next) {
    if (req.file && req.file.buffer) {
      let buffer = req.file.buffer;
      return self.uploadBuffer(buffer)(req, res, next);
    } else {
      return res.status(500).json(new JSONAPIError({
        status: 500,
        title: 'Invalid File Buffer',
        detail: 'There is no file buffer available to upload to Cloudinary.'
      }));
    }
  },

  getImages: function(options) {
    return function(req, res, next) {
      cloudinary.v2.api.resources(options, function(error, result) {
        if (error) {
          return res.status(error.http_code).json(new JSONAPIError({
            status: error.http_code,
            title: 'Cloudinary Error',
            detail: error.message
          }));
        } else {
          req.cloudinary = result.resources;
          next();
        }
      })
    };
  },

  getTransformation: function(req, res, next) {
    let transforms = _pick(req.query, ['width', 'height', 'crop', 'radius', 'gravity', 'format']);
    req.transformation = transforms;
    next();
  },

  getSignedImage: function(name, options) {
    if (!options) options = {};
    options.sign_url = true;
    options.type = "authenticated";
    return function(req, res, next) {
      var image = cloudinary.url(name, options);
      req.cloudinary = image;
      next();
    }
  },

  getSignedImageById: function(req, res, next) {
    if (req.params && req.params.id) {
      let name = req.params.id;
      let options = req.transformation;
      return self.getSignedImage(name, options)(req, res, next);
    } else {
      return res.status(500).json(new JSONAPIError({
        status: 500,
        title: 'Invalid Image Request',
        detail: 'There is no Cloudinary public_id provided.'
      }));
    }
  }
};