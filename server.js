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


 
 
db.serialize(function() {
  console.log('server called');
  if (!exists) {
    db.run("create table users"
                + "(email TEXT, "
                + "password TEXT, "
                + "username TEXT, "
                + "firstname TEXT, "
                + "lastname TEXT)");
    db.run("create table stories"
                + "(email TEXT, "
                + "parent TEXT, "
                + "content TEXT, "
                + "title TEXT,"
                + "chapter TEXT)");
    var stmt = db.prepare("INSERT into stories VALUES(?,?,?,?,?)");
    var s = "Once upon a midnight dreary, while I pondered, weak and weary, <br>" +
      "Over many a quaint and curious volume of forgotten lore,  <br>" +
      "While I nodded, nearly napping, suddenly there came a tapping,  <br>" +
      "As of some one gently rapping, rapping at my chamber door.  <br>" +
      "Tis some visitor, I muttered, tapping at my chamber door-  <br>" +
      "Only this, and nothing more."

    stmt.run("poe@gmail.com", "root", s, "The Raven", "Chapter 1");
    stmt.finalize();

    var t = "A Child was standing on a street-corner. He leaned with one shoulder against a high board-fence and swayed the other to and fro, the while kicking carelessly at the gravel. Sunshine beat upon the cobbles, and a lazy summer wind raised yellow dust which trailed in clouds down the avenue. Clattering trucks moved with indistinctness through it. The child stood dreamily gazing. After a time, a little dark-brown dog came trotting with an intent air down the sidewalk. A short rope was dragging from his neck. Occasionally he trod upon the end of it and stumbled."
    var stmt = db.prepare("INSERT into stories VALUES(?,?,?,?,?)");
    stmt.run("crane@yahoo.com", "root", t, "A Dark Brown Dog", "Chapter 1");
    stmt.finalize();
    var stmt = db.prepare("INSERT into stories VALUES(?,?,?,?,?)");
    stmt.run("email3", "parent3", "content3", "title3", "chapter3");
    stmt.finalize();
    var stmt = db.prepare("INSERT into stories VALUES(?,?,?,?,?)");
    stmt.run("email4", "parent4", "content4", "title4", "chapter4");
    stmt.finalize();
    var stmt = db.prepare("INSERT into stories VALUES(?,?,?,?,?)");
    stmt.run("email5", "parent5", "content5", "title5", "chapter5");
    stmt.finalize();
    var stmt = db.prepare("INSERT into stories VALUES(?,?,?,?,?)");
    stmt.run("email6", "parent6", "content6", "title6", "chapter6");
    stmt.finalize();
    console.log("Add six items to stories");
  }

});



// CREATE a new user
//
// To test with curl, run:
//   curl -X POST --data "name=Carol&job=scientist&pet=dog.jpg" http://localhost:3000/users

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
    res.send("INCOMPLETE FIELDS");
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


        res.send("OK");
      }
      else {
        console.log('email already exists!');
        res.send("USER ALREADY EXISTS");
      }
    });
  }

});

app.get('/frontpage', function(req, res) {

  console.log('GET /frontpage');

  res.sendFile(__dirname + '/static_files/frontpage.html');

});

app.get('/', function(req, res) {

  console.log('GET /frontpage');

  res.sendFile(__dirname + '/static_files/login.html');

});

app.get('/login', function(req, res) {

  console.log('GET /login');

  res.sendFile(__dirname + '/static_files/login.html');

});

app.get('/register', function(req, res) {

  console.log('GET /register');

  res.sendFile(__dirname + '/static_files/Signup.html');

});

app.post('/delete/*', function(req, res){

  var email = req.body.email;

  var stmt = db.prepare("DELETE FROM users WHERE email=?");
  stmt.run(email);


  stmt.finalize();

  res.send("OK");

  
});

app.post('/login/*', function (req, res) {

  var user = req.body;

  var email = user.email;
  var password = user.password;


  console.log('/users');
  db.each("SELECT * from users WHERE email=?",[email], function(err,row) {
    if (password == row.password) {
      res.send("OK");
    }
    else {
      console.log("invalid password");
      res.send("BAD_PASSWORD")
    }
  });


});

app.post('/update/*', function (req, res) {
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
    res.send("INCOMPLETE FIELDS");
    console.log('invalid in users');
    return; // return early!
  }

  else {
    db.each("SELECT * from users WHERE email=?",[email], function(err,row) {
        var stmt = db.prepare("UPDATE users VALUES(?,?,?,?,?)");
        stmt.run(email, password, username, firstname, lastname);
        console.log('user inserted into db');
        stmt.finalize();


      res.send("OK");
    });
  }

});

app.post('/story/*', function (req, res)) {
  var story = req.body;

  var title = story.title;
  var content = story.chapter;
  var email = story.email;

  db.each("SELECT * from stories WHERE title=? AND chapter=? AND email=?",[title, chapter, email], function(err,row) {
    res.send
  }
}

app.get('/topstories', function (req, res) {

  db.all("SELECT * FROM stories LIMIT 6", function(err,rows) {
    res.send({"stories":[
  {email: rows[0].email, parent: rows[0].parent, content: rows[0].content, title: rows[0].title, chapter: rows[0].chapter},
  {email: rows[1].email, parent: rows[1].parent, content: rows[1].content, title: rows[1].title, chapter: rows[1].chapter},
  {email: rows[2].email, parent: rows[2].parent, content: rows[2].content, title: rows[2].title, chapter: rows[2].chapter},
  {email: rows[3].email, parent: rows[3].parent, content: rows[3].content, title: rows[3].title, chapter: rows[3].chapter},
  {email: rows[4].email, parent: rows[4].parent, content: rows[4].content, title: rows[4].title, chapter: rows[4].chapter},
  {email: rows[5].email, parent: rows[5].parent, content: rows[5].content, title: rows[5].title, chapter: rows[5].chapter}
]});
  });

  

});


// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});