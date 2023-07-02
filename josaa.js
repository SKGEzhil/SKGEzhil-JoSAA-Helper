var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "EzHiL2005&&",
    database: "josaa"
});

// var general_rank = 12301
// var category_rank = 2923
// var institute = "any"
// var program = "any"
// var gender = "Gender-Neutral"
// var quota = "AI"
// var category = "OBC-NCL"
//
// if(program == "any"){
//     var program_q = ""
// }
// else {
//     var program_q = ` Program = "${program}" and`
// }
//
// if(institute == "any"){
//     var institute_q = ""
// }
// else {
//     var institute_q = ` Institute like "${institute}%" and`
// }
//
// var query = "where" + program_q + institute_q + ` Gender = "${gender}" and` + ` Category = "${category}" and` + ` Quota = "${quota}" and`

// switch (category) {
//     case "OPEN":
//         var sql = `select * from institutes ${query} ${general_rank} < close_rank; `
//         break
//     default:
//         var sql = `select * from institutes ${query} ${category_rank} < close_rank; `
//         console.log(sql)
// }

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
const bodyParser = require('body-parser');

// const {result, a} = require('../JOSAA/josaa.js')

// console.log(a)

// Server configuration and routes will be added here

// Start the server
const port = 3000; // or any other port number
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//To serve stylesheet
app.use(express.static(__dirname + '/public'));

// Set up middleware to parse form data
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, '/public/index.html');
    res.sendFile(htmlPath);
});

var form_data = {}

// Define a route to handle the form submission
app.post('/submit-form', (req, res) => {

    console.log("submited")
    // Process the form data (e.g., store it in a database, send an email, etc.)

    const form = {
        Institute_f: req.body.inst,
        Program_f: req.body.prog,
        Gender_f: req.body.gender,
        Quota_f: req.body.quota,
        Category_f: req.body.category,
        Commor_rank_f: req.body.Common_rank,
        Category_rank_f: req.body.Category_rank
    }
    console.log(req.body)
    console.log(form)
    form_data = form

    const response = {
        message: 'Form submitted successfully!',
    };
    res.json(response);

});

var inst_type_drop = {}
app.post('/send/dropdown', (req, res) => {
    console.log("dropdown recieved")
    console.log(req.body.value)
    res.json('dropdown sent')
    inst_type_drop = req.body
})

app.get('/dropdown/institutes', (req, res) => {
    let inst_q = ''
    console.log(inst_type_drop)
    switch (inst_type_drop.value){
        case 'IIT':
            inst_q = 'where institute like "Indian Institute  of Technology%"'
            break
        case 'NIT':
            inst_q = 'where institute like "National Institute of Technology%"'
            break
        case 'IIIT':
            inst_q = 'where institute like "Indian Institute of Information Technology%"'
            break
        case 'GFTI':
            inst_q = 'WHERE institute NOT LIKE "National Institute of Technology%" AND institute NOT LIKE "Indian Institute  of Technology%" AND institute NOT LIKE "Indian Institute of Information Technology%";'
            break
        default:
            inst_q = ''
    }
    console.log(inst_q)
    let query = 'select distinct institute from institutes ' + inst_q
    console.log(query)
    con.query(query, function (err, result) {
        if (err) throw err;
        console.log(result)
        res.json(result)
    });

})



// Get all items
app.get('/api/items', (req, res) => {

    console.log("hello")
    console.log(form_data)
    if(form_data.Program_f == "any"){
        var program_q = ""
    }
    else {
        var program_q = ` Program = "${form_data.Program_f}" and`
    }

    if(form_data.Institute_f == "any"){
        var institute_q = ""
    }
    else {
        var institute_q = ` Institute like "${form_data.Institute_f}%" and`
    }

    var query = "where" + program_q + institute_q + ` Gender = "${form_data.Gender_f}" and` + ` Category = "${form_data.Category_f}" and` + ` Quota = "${form_data.Quota_f}" and`

    console.log(query)

    switch (form_data.Category_f) {
        case "OPEN":
            var sql = `select * from institutes ${query} ${form_data.Commor_rank_f} < close_rank; `
            break
        default:
            var sql = `select * from institutes ${query} ${form_data.Category_rank_f} < close_rank; `
    }


    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        console.log("success")
        res.json(result)
    });
});







