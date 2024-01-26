const cors = require('cors');
const express = require('express')
const app = express()
const routes = require('../routes/route.js')

app.use(express.json())
app.use(cors());

app.use('/', routes)

module.exports = app