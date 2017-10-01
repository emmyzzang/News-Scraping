// ===============================================
// DEPENDENCIES
// ===============================================
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const express = require('express');
const mongoose = require('mongoose');
const request = require('request');
const logger = require('morgan');

var PORT = process.env.PORT || 3000;

// ===============================================
// EXPRESS SERVER
// ===============================================

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

// ===============================================
// MONGOOSE DATABASE CONFIGURATION
// ===============================================

// Local mdb
var databaseuri = "mongodb://localhost/";

// If mLab exists, use Heroku app
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}
// Else, use local machine
else {
  mongoose.connect(databaseuri);
}
// ======================= end database configuration =======================
