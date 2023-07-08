
//MySQL connection
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "josaa"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


//Server Variables and Requirements
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 443;
let form_data = {};
let received_drop = {};

// Server configuration and routes will be added here

// Start the server

const fs = require('fs'),
    http = require('http'),
    https = require('https');

const options = {
    key: fs.readFileSync('certificate/private.pem'),
    cert: fs.readFileSync('certificate/certificate.pem'),
};

https.createServer(options, app).listen(port, function(){
    console.log("Server listening on port " + port);
});


//To serve stylesheet
app.use(express.static(__dirname + '/public'));

// Set up middleware to parse form data
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Server Root
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, '/public/index.html');
    res.sendFile(htmlPath);
});


// Form Submission
app.post('/submit-form', (req, res) => {

    console.log("submited")
    // Process the form data (e.g., store it in a database, send an email, etc.)

    const form = {
        Institute_type_f: req.body.inst_type,
        Institute_f: req.body.inst,
        Program_f: req.body.prog,
        Gender_f: req.body.gender,
        Quota_f: req.body.quota,
        Category_f: req.body.category,
        Common_rank_f: req.body.Common_rank,
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

// Received Dropdown menu manipulation
app.post('/send/dropdown', (req, res) => {
    console.log("dropdown received")
    console.log(req.body.value)
    received_drop = req.body
    if (received_drop.drop_type === 'institute_type') {
        res.json({message: 'dropdown sent', drop_val: 'institutes'})
    }
    if (received_drop.drop_type === 'institute') {
        res.json({message: 'dropdown sent', drop_val: 'programs'})
    }


})

// Route to send dropdown menu
app.get('/dropdown/institutes', (req, res) => {
    let inst_q
    console.log(received_drop)
    switch (received_drop.value) {
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

app.get('/dropdown/programs', (req, res) => {
    let query
    if (received_drop.value === 'any') {
        query = `select distinct program
                 from institutes`
    } else {
        query = `select distinct program
                 from institutes
                 where institute = "${received_drop.value}"`
    }


    con.query(query, function (err, result) {
        if (err) throw err;
        console.log(result)
        console.log("success")
        res.json(result)
    });
})

// Get all results (Send list of data from server to client)
app.get('/result', (req, res) => {

    // Declaration of Variables
    let program_q;
    let institute_q;
    let sql_100
    let sql_97
    let sql_95
    let sql_93
    let result_100 = {}
    let result_97 = {}
    let result_95 = {}
    let result_93 = {}

    if (form_data.Program_f === "any") {
        program_q = ""
    } else {
        program_q = ` Program = "${form_data.Program_f}" and`
    }

    if (form_data.Institute_f === "any") {
        switch (form_data.Institute_type_f) {
            case 'IIT':
                institute_q = ' Institute like "Indian Institute  of Technology%" and'
                break
            case 'NIT':
                institute_q = ' Institute like "National Institute of Technology%" and'
                break
            case 'IIIT':
                institute_q = ' Institute like "Indian Institute of Information Technology%" and'
                break
            default:
                institute_q = ""
        }

    } else {
        institute_q = ` Institute like "${form_data.Institute_f}%" and`
    }

    const query = "where" + program_q + institute_q + ` Gender = "${form_data.Gender_f}" and` + ` Category = "${form_data.Category_f}" and` + ` Quota = "${form_data.Quota_f}" and`;

    switch (form_data.Category_f) {
        case 'OPEN':
            sql_100 = `select *
                       from institutes ${query} ${form_data.Common_rank_f} < (close_rank - 300); `
            sql_97 = `select *
                      from institutes ${query} ${form_data.Common_rank_f} < (close_rank - 200) and close_rank < (${form_data.Common_rank_f} +300); `
            sql_95 = `select *
                      from institutes ${query} ${form_data.Common_rank_f} < (close_rank - 100) and close_rank < (${form_data.Common_rank_f} +200); `
            sql_93 = `select *
                      from institutes ${query} ${form_data.Common_rank_f} < close_rank and close_rank < (${form_data.Common_rank_f} +100); `
            break

        default:
            sql_100 = `select *
                       from institutes ${query} ${form_data.Category_rank_f} < (close_rank - 300); `
            sql_97 = `select *
                      from institutes ${query} ${form_data.Category_rank_f} < (close_rank - 200) and close_rank < (${form_data.Category_rank_f} +300); `
            sql_95 = `select *
                      from institutes ${query} ${form_data.Category_rank_f} < (close_rank - 100) and close_rank < (${form_data.Category_rank_f} +200); `
            sql_93 = `select *
                      from institutes ${query} ${form_data.Category_rank_f} < close_rank and close_rank < (${form_data.Category_rank_f} +100); `


    }

    con.query(sql_100, function (err, result) {
        if (err) throw err;
        result_100 = result
        result_100.forEach(obj => {
            obj.chances = 100
        })
    });

    con.query(sql_97, function (err, result) {
        if (err) throw err;
        result_97 = result
        result_97.forEach(obj => {
            obj.chances = 97
        })
    });

    con.query(sql_95, function (err, result) {
        if (err) throw err;
        result_95 = result
        result_95.forEach(obj => {
            obj.chances = 95
        })
    });

    con.query(sql_93, function (err, result) {
        if (err) throw err;
        result_93 = result
        result_93.forEach(obj => {
            obj.chances = 93
        })
        let final_result = result_100.concat(result_97, result_95, result_93)
        res.json(final_result)
        console.log(final_result)
    });

});

// 404 Error handling
app.use((req, res, next) => {
    res.status(404);
    res.sendFile(path.join(__dirname, 'public/404.html')); // Replace '404.html' with your actual file name and path
});

