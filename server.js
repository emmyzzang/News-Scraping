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

const db = mongoose.connection;

// ROUTES
// ==============================================

// Default endpoint
app.get('/', function(req, res) {
  res.send(index.html);
});

// GET: Site -> DB
app.get('/scrape', function(req, res) {
  // Grab the body of the request and ask for a call back
  request('https://www.nytimes.com/', function (error, response, html) {

  // HTML gets loaded into cheerio and stored in $ so we can use it
  const $ = cheerio.load(html);

  // Grab every element with an a tag
  $('a h3').each(function(i, element) {

  let result = {};

    result.title = $(this).children('a').text();
    result.link = $(this).children('a').attr('href');
    /// Def entry + save entry to the db
    let entry = new Article(result);
    entry.save(function(error, doc) {

      if (err) {
        console.log(err);
      }
      else {
        console.log(doc);
        }
      });
    });
  });
  res.send('scrape happened');
});

// GET DB -> Browser
app.get('articles', function(req, res) {
  Article.find({}, function(error, doc) {
    if (err) {
      console.log('you do not get articles from the db');
    }
    else {
      console.log('here have articles');
      res.json(doc);
    }
  });
});



// TODO - still do this
// POST request
// Do something to data

app.listen(3000, function() {
  console.log('Server insomnia activities on port 3000');
});
