const mongoose = require("mongoose");
const configDB = require("./configDB");
// const logger = require("pino")();
console.log('cofing.moongose', configDB.moongoose.enabled)


const connectMongoDB = async () => {
  if (configDB.moongoose.enabled) {
    await mongoose
      .connect(configDB.moongoose.url)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => console.error("Error connecting to MongoDB: ", err));
  }
};

module.exports = connectMongoDB