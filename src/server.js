const express = require('express');
const app = require('./config/express');
const PORT = process.env.PORT || 3332;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
