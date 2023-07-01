var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "EzHiL2005&&",
    database: "josaa"
});

var general_rank = 12301
var category_rank = 2923
var institute = "Indian Institute  of Technology"
var program = "any"
var gender = "Gender-Neutral"
var quota = "AI"
var category = "OBC-NCL"

if(program == "any"){
    var program_q = ""
}
else {
    var program_q = ` Program = "${program}" and`
}

if(institute == "any"){
    var institute_q = ""
}
else {
    var institute_q = ` Institute like "${institute}%" and`
}

var query = "where" + program_q + institute_q + ` Gender = "${gender}" and` + ` Category = "${category}" and` + ` Quota = "${quota}" and`

switch (category) {
    case "OPEN":
        var sql = `select * from institutes ${query} ${general_rank} < close_rank; `
        break
    default:
        var sql = `select * from institutes ${query} ${category_rank} < close_rank; `
        console.log(sql)
}

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});



// con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log(result)
// });


// ------------------------------------------------------------------
//     -----------------------------------------------------------

const express = require('express');
const path = require('path');
const app = express();
// const {result, a} = require('../JOSAA/josaa.js')

// console.log(a)

// Server configuration and routes will be added here

// Start the server
const port = 3000; // or any other port number
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, '/public/index.html');
    res.sendFile(htmlPath);
});


// Get all items
app.get('/api/items', (req, res) => {

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        res.json(result)
    });
});

// Get a single item by ID
app.get('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = items.find(item => item.id === itemId);

    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});





