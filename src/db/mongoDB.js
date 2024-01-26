const mongoose = require('mongoose');
const configDB = require('./configDB');
// const logger = require("pino")();
// console.log('cofing.moongose', configDB.moongoose.enabled)

const connectMongoDB = async () => {
  if (configDB.moongoose.enabled) {
    await mongoose
      .connect(configDB.moongoose.url)
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.error('Error connecting to MongoDB: ', err);
        mongoose.connection.close();
      });
  }
};

// mongoose.connection.on('connected', () => {
//   console.log('Mongoose connected to DB.');
// });

// mongoose.connection.on('error', err => {
//   console.error(`Mongoose connection error: ${err}`);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('Mongoose disconnected.');
// });

// const gracefulExit = () => {
//   mongoose.connection.close(() => {
//     console.log('Mongoose connection closed through app termination.');
//     // process.exit(0);
//   });
// };

// // // Para encerramento da aplicação e nodemon restarts
// // process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

// // Captura exceções não tratadas
// process.on('uncaughtException', err => {
//   console.error('Uncaught Exception:', err);
//   gracefulExit();
// });

module.exports = connectMongoDB;
