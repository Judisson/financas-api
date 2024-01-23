const dotenv = require("dotenv").config();
const express = require('express');
const connectMongoDB = require('./db/mongoDB');
const app = require('./config/express');
const PORT = process.env.PORT || 3332;

connectMongoDB()
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});