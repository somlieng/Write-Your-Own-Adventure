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

    stmt.run("poe@gmail.com", "", s, "The Raven", "Chapter 1");
    stmt.finalize();

    var t = "A Child was standing on a street-corner. He leaned with " +
    "one shoulder against a high board-fence and swayed the other to and " +
    "fro, the while kicking carelessly at the gravel. Sunshine beat upon " +
    "the cobbles, and a lazy summer wind raised yellow dust which trailed " +
    "in clouds down the avenue. Clattering trucks moved with indistinctness " +
    "through it. The child stood dreamily gazing. After a time, a little " +
    "dark-brown dog came trotting with an intent air down the sidewalk. " +
    "A short rope was dragging from his neck. Occasionally he trod upon the "+
    " end of it and stumbled."
    var stmt = db.prepare("INSERT into stories VALUES(?,?,?,?,?)");
    stmt.run("crane@yahoo.com", "", t, "A Dark Brown Dog", "Chapter 1");
    stmt.finalize();

    console.log("Add two items to stories");
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

app.get('/new', function(req, res) {

  console.log('GET /new');

  res.sendFile(__dirname + '/static_files/newStory.html');

});

app.get('/profile', function(req, res) {

  console.log('GET /profile');

  res.sendFile(__dirname + '/static_files/profile.html');

});

app.get('/update', function(req, res) {

  console.log('GET /update');

  res.sendFile(__dirname + '/static_files/update.html');

});

app.get('/read', function(req, res) {

  console.log('GET /read');

  res.sendFile(__dirname + '/static_files/read.html');

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

app.post('/updatePassword', function (req, res) {
  var user = req.body;

  var email = user.email;
  var password = user.password;

  console.log(email);
  console.log(password);

  if (!password) {
    res.send("INCOMPLETE FIELDS");
    console.log('invalid in users');
    return;
  }

  else {
    var stmt = db.prepare("UPDATE users SET password=? WHERE email=?");
    stmt.run(password, email);
    console.log('password successfully updated');
    stmt.finalize();

    res.send('OK');
  }

});

app.post('/updateUsername', function (req, res) {
  var user = req.body;

  var email = user.email;
  var username = user.username;

  console.log(email);
  console.log(username);

  if (!username) {
    res.send("INCOMPLETE FIELDS");
    console.log('invalid in users');
    return;
  }

  else {
    var stmt = db.prepare("UPDATE users SET username=? WHERE email=?");
    stmt.run(username, email);
    console.log('username successfully updated');
    stmt.finalize();

    res.send('OK');
  }

});

app.post('/updateFirstname', function (req, res) {
  var user = req.body;

  var email = user.email;
  var firstname = user.firstname;

  console.log(email);
  console.log(firstname);

  if (!firstname) {
    res.send("INCOMPLETE FIELDS");
    console.log('invalid in users');
    return;
  }

  else {
    var stmt = db.prepare("UPDATE users SET firstname=? WHERE email=?");
    stmt.run(firstname, email);
    console.log('firstname successfully updated');
    stmt.finalize();

    res.send('OK');
  }

});


app.post('/updateLastname', function (req, res) {
  var user = req.body;

  var email = user.email;
  var lastname = user.lastname;

  console.log(email);
  console.log(lastname);

  if (!lastname) {
    res.send("INCOMPLETE FIELDS");
    console.log('invalid in users');
    return;
  }

  else {
    var stmt = db.prepare("UPDATE users SET lastname=? WHERE email=?");
    stmt.run(lastname, email);
    console.log('lastname successfully updated');
    stmt.finalize();

    res.send('OK');
  }

});

app.post('/getProfile', function (req, res) {

  var email = req.body.email;

  db.all("SELECT * FROM users WHERE email=?", [email], function(err,rows) {
    res.send({"user":[
      {email: rows[0].email, username: rows[0].username, firstname: rows[0].firstname, lastname: rows[0].lastname}
 
    ]});
  });
});

app.get('/profile', function(req, res) {

  console.log('GET /profile');

  res.sendFile(__dirname + '/static_files/profile.html');

});

app.post('/story/*', function (req, res) {
  var story = req.body;

  var title = story.title;
  var chapter = story.chapter;
  var email = story.email;

  db.all("SELECT * from stories WHERE title=\"" + title + "\" AND chapter=\"" + chapter + "\" AND email=\"" + email + "\"", function(err,row) {
    res.send({"story":[{email: row[0].email, parent: row[0].parent, content: row[0].content, title: row[0].title, chapter: row[0].chapter}]});
  });
});


app.get('/topstories', function (req, res) {

  db.all("SELECT * FROM stories WHERE parent=?", "", function(err,rows) {

    var jsonData = {"stories":[]};

    for (var i = 0; i < rows.length; i++) {
      var obj = {email: rows[i].email, parent: rows[i].parent, content: rows[i].content, title: rows[i].title, chapter: rows[i].chapter};
      jsonData.stories.push(obj);
    }
    res.send(jsonData);

    });

});

app.post('/childstories', function (req, res) {

  var story = req.body;
  var parent = story.parent;
  var title = story.title;

  db.all("SELECT * FROM stories WHERE parent=? AND title=?", [parent, title], function(err,rows) {

    var jsonData = {"stories":[]};

    for (var i = 0; i < rows.length; i++) {
      var obj = {email: rows[i].email, parent: rows[i].parent, content: rows[i].content, title: rows[i].title, chapter: rows[i].chapter};
      jsonData.stories.push(obj);
    }
    res.send(jsonData);

    });

});

app.post('/addStory/*', function (req, res) {
  var story = req.body;

  var email = story.email;
  var parent = story.parent;
  var content =story.content;
  var title = story.title;
  var chapter = story.chapter;

  if (content != "" && title != "" && chapter != "" && content != null && title != null && chapter != null) {
    if (parent == "") {
      db.all("SELECT * from stories WHERE title=?",[title], function(err,rows) {
        if (rows == undefined || rows.length == 0) {
          var stmt = db.prepare("INSERT into stories VALUES(?,?,?,?,?)");
          stmt.run(email, parent, content, title, chapter);
          stmt.finalize();
          console.log("Added: " + email + " " + parent + " " + content + " " + title + " " + chapter);
          res.send('OK');

        }
        else {
          res.send('TITLE_EXISTS');
        }
      });
    }
    else {
      db.all("SELECT * from stories WHERE title=? AND chapter=?", [title, chapter], function(err,rows) {
        if (rows == undefined || rows.length == 0) {
          var stmt = db.prepare("INSERT into stories VALUES(?,?,?,?,?)");
          stmt.run(email, parent, content, title, chapter);
          stmt.finalize();
          console.log("Added: " + email + " " + parent + " " + content + " " + title + " " + chapter);
          res.send('OK');
        }
        else {
          res.send('CHAPTER_EXISTS');
        }
      });

    }
  }
  else {
    res.send('NULL_CONTENT');
  }

});


app.post('/parent/*', function (req, res) {
  var story = req.body;

  var title = story.title;
  var chapter = story.parent;

  db.all("SELECT * from stories WHERE title=\"" + title + "\" AND chapter=\"" + chapter + "\"", function(err,row) {
    res.send({"story":[{email: row[0].email, parent: row[0].parent, content: row[0].content, title: row[0].title, chapter: row[0].chapter}]});
  });
});


// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});