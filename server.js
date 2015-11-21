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
  console.log('server called');
  if (!exists) {
    db.run("create table users"
                + "(email TEXT, "
                + "password TEXT, "
                + "username TEXT, "
                + "firstname TEXT, "
                + "lastname TEXT)");
  }
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
    console.log('invalid');
    return; // return early!
  }

  else {
    db.each("SELECT * from users WHERE email="+email, function(err,row) {
      alreadyFound = true;
      console.log('email already in use!');
      res.send
    });
  }
  if (!alreadyFound) {
    var stmt = db.prepare("INSERT into users VALUES(?,?,?,?,?)");
    stmt.run(email, password, username, firstname, lastname);
    console.log('entered into database!');
    stmt.finalize();
    
  }

});


  // check if user's name is already in database; if so, send an error

app.post('/users/*', function (req, res) {
  var user = req.body;

  var email = user.email;
  var password = user.password;
  var username = user.username;
  var firstname = user.firstname;
  var lastname = user.lastname;

  var alreadyFound = false;

  console.log(email);
  console.log(password);
  console.log(username);
  console.log(firstname);
  console.log(lastname);


  // must have a name!
  if (!email || !password || !username || !firstname || !lastname) {
    res.send('ERROR, not all required information entered');
    console.log('invalid in users');
    return; // return early!
  }

  else {
    db.all("SELECT * from users WHERE email=?",[email], function(err,rows) {
      if (rows == undefined || rows.length == 0) {
        var stmt = db.prepare("INSERT into users VALUES(?,?,?,?,?)");
        stmt.run(email, password, username, firstname, lastname);
        console.log('user inserted into db');
        stmt.finalize();


        res.set({
          'Content-Type': 'text/plain',
          'Content-Length': '100',
          'email': email
        });

        res.get('/frontpage');
      }
      else {
        console.log('email already exists!');
      }
    });
  }

});

app.get('/frontpage', function(req, res) {

  console.log('GET /frontpage');

  res.sendFile(__dirname + '/static_files/frontpage.html');

});


app.get('/users', function (req, res) {
  var allUsers = ['something'];

  console.log('/users');

  db.each("SELECT email from users", function(err, row) {    
    allUsers.push(row.email); 
  });  
  res.send(allUsers); 

});


// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});