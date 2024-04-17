// Create Web server
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'comments'
});

// Connect to MySQL
connection.connect(function(error) {
    if(!!error) {
        console.log('Error');
    } else {
        console.log('Connected');
    }
});

// Create table
app.get('/createTable', function(req, res) {
    var createTable = "CREATE TABLE comments (id int AUTO_INCREMENT, PRIMARY KEY(id), name VARCHAR(100), comment TEXT)";
    connection.query(createTable, function(error, result) {
        if(!!error) {
            console.log('Error in the query');
        } else {
            console.log('Table created');
        }
    });
});

// Get all comments
app.get('/comments', function(req, res) {
    connection.query("SELECT * FROM comments", function(error, rows, fields) {
        if(!!error) {
            console.log('Error in the query');
        } else {
            console.log('Successful query');
            res.json(rows);
        }
    });
});

// Insert a comment
app.post('/comments', function(req, res) {
    var name = req.body.name;
    var comment = req.body.comment;
    connection.query("INSERT INTO comments (name, comment) VALUES (?, ?)", [name, comment], function(error, result) {
        if(!!error) {
            console.log('Error in the query');
        } else {
            console.log('Comment added');
            res.json(result);
        }
    });
});

// Update a comment
app.put('/comments', function(req, res) {
    var id = req.body.id;
    var comment = req.body.comment;
    connection.query("UPDATE comments SET comment = ? WHERE id = ?", [comment, id], function(error, result) {
        if(!!error) {
            console.log('Error in the query');
        } else {
            console.log('Comment updated');
            res.json(result);
        }
    });
});

// Delete a comment
app.delete('/comments', function(req, res) {
    var id = req.body.id;
    connection.query("DELETE FROM comments WHERE
