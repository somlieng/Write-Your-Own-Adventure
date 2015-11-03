// StoryTree server.js

//   first...
//   npm install express
//   npm install body-parser
//   npm install mongodb
//   npm install mongoose


// then run:
//   node server.js


var express = require('express');
var app = express();
var mongodb = require('mongodb');

//create mongoclient to connect db with server
var MongoClient = mongodb.MongoClient;

var userdb = 'mongodb://localhost:3000/userbase.db';




// required to support parsing of POST request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// put all of your static files (e.g., HTML, CSS, JS, JPG) in the static_files/
// sub-directory, and the server will serve them from there. e.g.,:

// will send the file static_files/cat.jpg to the user's Web browser

app.use(express.static('static_files'));




// CREATE a new user
//
// To test with curl, run:
//   curl -X POST --data "name=Carol&job=scientist&pet=dog.jpg" http://localhost:3000/users
app.post('/users', function (req, res) {
  var postBody = req.body;
  var myName = postBody.name;

  // must have a name!
  if (!myName) {
    res.send('ERROR');
    return; // return early!
  }

  // check if user's name is already in database; if so, send an error
 
  MongoClient.connect(userdb, function (err, db) {
    if (err) {
      console.log('Cant connect to mongoDB', err);
      return;
    }
    else {

      console.log('Connected to mongoDB');

      var users = db.collection('users');

      for (var i = 0; i < users.length; i++) {
        var e = users[i];
        if (e.name == myName) {
          res.send('ERROR');
          return; // return early!
        }
      }
      collection.insert(postBody, function (err, result) {
        if (err) {
          console.log(err);
        }
        else {
          console.log('inserted into users collection"');
        }
        
      });

      res.send('OK');

      db.close();

    }
  });



// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});