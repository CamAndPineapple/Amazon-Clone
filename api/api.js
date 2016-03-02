const router = require('express').Router();
const async = require('async');
const faker = require('faker');
const Category = require('../app/models/category');
const Product = require('../app/models/product');

// :name is equal to any category you enter
router.get('/:name', function(req, res, next) {

  async.waterfall([
    function(callback) {
      // req.params.name will be the same category that you enter for :name
      Category.findOne({ name: req.params.name }, function(err, category) {
        if (err) return next(err);
        callback(null, category);
      });
    },

    function(category, callback) {
      for (var i = 0; i < 30; i++) {
        var product = new Product();
        product.category = category._id;
        product.name = faker.commerce.productName();
        product.price = faker.commerce.price();
        product.image = faker.image.image();

        product.save();
      }
    }
  ]);

  res.json({ message: 'Success' });

});

module.exports = router;
