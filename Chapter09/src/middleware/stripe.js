var JSONAPIError = require('jsonapi-serializer').Error;
const keyPublishable = process.env.stripeAPIPublishableKey;
const keySecret = process.env.stripeAPISecretKey;
const stripe = require("stripe")(keySecret);

var self = module.exports = {

  errorHandler: function(error) {
    return function(req, res) {
      res.status(500).json(new JSONAPIError({
        status: 500,
        title: error.type,
        detail: error.message
      }));
    };
  },

  createCustomer: function(req, res, next) {
    return stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    }).then(function(customer) {
      res.stripe = { customer: customer };
      next();
    }).catch(function(error) {
      return self.errorHandler(error)(req, res);
    });
  },

  getCustomers: function(req, res, next) {
    stripe.customers.list()
      .then(function(customers) {
        res.json(customers);
      })
      .catch(function(error) {
        return self.errorHandler(error)(req, res);
      });
  },

  charge: function(amount) {
    return function(req, res, next) {
      if (res.stripe && res.stripe.customer) {
        var customer = res.stripe.customer;
        stripe.charges.create({
          amount,
          description: "Donation",
          currency: "usd",
          customer: customer.id
        }).then(function (charge) {
          res.stripe.charge = charge;
          next();
        }).catch(function(error) {
          return self.errorHandler(error)(req, res);
        });
      } else {
        var error = new Error("Must provide customer for purchase transaction");
        return self.errorHandler(error)(req, res);
      }
    };
  }
};