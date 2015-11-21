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



app.set('view engine', 'jade');
app.use(express.static('static_files'));

db.all("SELECT * from users", function(err,rows) {
  for (i = 0; i < rows.length; i++) {
    print(rows[i]);
  }
});
