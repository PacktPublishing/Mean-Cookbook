var express = require('express');
var router = express.Router();
var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var cloudinary = require('../../middleware/cloudinary');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var JSONAPIError = require('jsonapi-serializer').Error;

var images = [];

var serializer = new JSONAPISerializer('images', {
  id: 'public_id',
  attributes: ['url', 'secure_url', 'originalname', 'bytes', 'created_at', 'width', 'height', 'type']
});

var coverUpload = function(req, res, next) {
  upload.single('cover')(req, res, function (err) {
    if (err) {
      return res.status(422).json(new JSONAPIError({
        status: 422,
        title: 'Image Upload Error',
        detail: err.message
      }));
    }
    next();
  });
};

router.post('/', coverUpload, cloudinary.uploadFromFileBuffer, function(req,res) {
  var image = req.cloudinary;
  image.originalname = req.file.originalname;
  images.push(image);
  res.json(serializer.serialize(image));
});

router.get('/', cloudinary.getImages({type: "authenticated"}), function(req, res) {
  res.json(serializer.serialize((req.cloudinary)));
});

router.get('/:id', cloudinary.getTransformation, cloudinary.getSignedImageById, function(req, res) {
  console.log(req.cloudinary);
  res.redirect(req.cloudinary);
});

module.exports = router;