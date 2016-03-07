module.exports = {
    "development": {
      db: "mongodb://crudisill11:change@ds049631.mongolab.com:49631/ecommerce-amazon-clone",
      port: 8080,
      secret: "johnnyappleseed"
    },
    "production": {
        db: process.env.MONGOLAB_URI,
        port: 8080,
        secret: "johnnyappleseed"
    }
}
