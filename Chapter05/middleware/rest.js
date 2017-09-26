var resource = require('resource-router-middleware');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
var JSONAPIError = require('jsonapi-serializer').Error;

module.exports = function(resourceId, store, serialize, deserialize) {
  var serializer = new JSONAPISerializer(resourceId, serialize);
  var deserializer = new JSONAPIDeserializer(deserialize);

  var error = function(status, title, description) {
    return new JSONAPIError({
      status: status,
      title: title,
      detail: description
    });
  };

  var fileNotFound = function() {
    return error(404, 'Not found', 'Resource does not exist.');
  };

  var find = function(id, callback) {
    var itemPosition = store.map(function(item) {
      return item.id;
    }).indexOf(id);
    var item = store[itemPosition];
    if (item) {
      callback(item, itemPosition);
    } else {
      callback(false);
    }
  };

  return resource({
    id : resourceId,

    load : function(req, id, callback) {
      find(id, function(item) {
        if (!item) {
          callback(fileNotFound());
        } else {
          callback(null, item);
        }
      });
    },

    list : function(req, res) {
      res.json(serializer.serialize(store));
    },

    read : function(req, res) {
      res.json(serializer.serialize(req[resourceId]));
    },

    create : function(req, res) {
      deserializer.deserialize(req.body).then(function(item) {
        item.id = store.length.toString(36);
        store.push(item);
        res.json(item);
      });
    },

    update : function(req, res) {
      var id = req.params[resourceId];
      find(id, function(item, i) {
        if (item) {
          deserializer.deserialize(req.body).then(function(itemReplace) {
            store.splice(i, 1);
            itemReplace.id = id;
            store.push(itemReplace);
            return res.status(204).send('Replaced');
          });
        } else {
          res.status(404).json(fileNotFound());
        }
      });
    },

    modify: function(req, res) {
      var id = req.params[resourceId];
      find(id, function(item, i) {
        if (item) {
          deserializer.deserialize(req.body).then(function(itemUpdates) {
            Object.assign(store[i], itemUpdates);
            return res.status(204).send('Accepted');
          });
        } else {
          res.status(404).json(fileNotFound());
        }
      });
    },

    delete : function(req, res) {
      var id = req.params[resourceId];
      find(id, function(item, i) {
        if (item) {
          store.splice(i, 1);
          return res.status(200).send('Deleted');
        } else {
          res.status(404).json(fileNotFound());
        }
      });
    }
  });
};