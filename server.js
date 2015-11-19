// StoryTree server.js

//   first...
//   npm install express
//   npm install sqlite3


// then run:
//   node server.js


var express = require('express');
var app = express();

var fs = require("fs");
var file = "storytree.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);


// required to support parsing of POST request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// put all of your static files (e.g., HTML, CSS, JS, JPG) in the static_files/
// sub-directory, and the server will serve them from there. e.g.,:

// will send the file static_files/cat.jpg to the user's Web browser
app.set('view engine', 'jade');
app.use(express.static('static_files'));


// public void addUser(User u) {
//     mDB.insert(
//             Users,
//             null,
//             getUserContentValues(u)
//     );
// }
 
db.serialize(function() {
  if (!exists) {
    db.run("create table Users"
                + "(email TEXT, "
                + "password TEXT, "
                + "username TEXT, "
                + "firstname TEXT, "
                + "lastname TEXT)");
  }
});
 
var stmt = db.prepare("INSERT INTO users VALUES (?)");
for (var i = 0; i < 10; i++) {
    stmt.run("Ipsum " + i);
}
stmt.finalize();

db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
    console.log(row.id + ": " + row.info);
});




// CREATE a new user
//
// To test with curl, run:
//   curl -X POST --data "name=Carol&job=scientist&pet=dog.jpg" http://localhost:3000/users
app.post('/Signup', function (req, res) {
  var user = req.body;

  var email = user.inputEmail;
  var password = user.inputPassword;
  var username = user.inputuserName;
  var firstname = user.inputfirstName;
  var lastname = user.inputlastName;

  var alreadyFound = false;



  // must have a name!
  if (!email || !password || !username || !firstname || !lastname) {
    res.send('ERROR, not all required information entered');
    return; // return early!
  }

  else {
    db.all("SELECT * from users WHERE email="+email, function(err,rows) {
      if (rows.length > 0) {
        alreadyFound = true;
      }
    });
  }
  if (!alreadyFound) {
    var stmt = db.prepare("INSERT into users VALUES(?,?,?,?,?)");
    stmt.run(email, password, username, firstname, lastname);
    stmt.finalize();
    
  }

});


  // check if user's name is already in database; if so, send an error

app.get('/users/*', function (req, res) {
  var nameToLookup = req.params[0]; // this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
  for (var i = 0; i < fakeDatabase.length; i++) {
    var e = fakeDatabase[i];
    if (e.name == nameToLookup) {
      res.send(e);
      return; // return early!
    }
  }

  res.send('{}'); // failed, so return an empty JSON object!
});


app.get('/users', function (req, res) {
  var allUsernames = [];

  res.send(allUsernames);
});


// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});