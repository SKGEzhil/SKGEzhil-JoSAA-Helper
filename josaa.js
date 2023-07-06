var mysql = require('mysql');

var con = mysql.createConnection({
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

// ------------------------------------------------------------------
//     -----------------------------------------------------------

const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');


// Server configuration and routes will be added here

// Start the server
const port = 80; // or any other port number
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//To serve stylesheet
app.use(express.static(__dirname + '/public'));

// Set up middleware to parse form data
app.use(express.urlencoded({extended: false}));

app.use(bodyParser.urlencoded({extended: true}));
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
        Institute_type_f: req.body.inst_type,
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

var recieved_drop = {}
app.post('/send/dropdown', (req, res) => {
    console.log("dropdown recieved")
    console.log(req.body.value)
    recieved_drop = req.body
    if (recieved_drop.drop_type == 'institute_type') {
        res.json({message: 'dropdown sent', drop_val: 'institutes'})
    }
    if (recieved_drop.drop_type == 'institute') {
        res.json({message: 'dropdown sent', drop_val: 'programs'})
    }


})

app.get('/dropdown/institutes', (req, res) => {
    let inst_q = ''
    console.log(recieved_drop)
    switch (recieved_drop.value) {
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
    if(recieved_drop.value == 'any'){
        var query = `select distinct program from institutes`
    }
    else {
        var query = `select distinct program
                 from institutes
                 where institute = "${recieved_drop.value}"`
    }


    con.query(query, function (err, result) {
        if (err) throw err;
        console.log(result)
        console.log("success")
        res.json(result)
    });
})

// Get all items
app.get('/api/items', (req, res) => {
    console.log("hello")
    console.log(form_data)
    let program_q = '';
    let institute_q = '';
    let sql_100 = '';
    let sql_97 = ''
    let sql_95 = ''
    let sql_93 = ''
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

    console.log(query)

    switch (form_data.Category_f) {
        case "OPEN":
            sql_100 = `select *
                       from institutes ${query} ${form_data.Commor_rank_f} < (close_rank - 300); `
            break
        default:
            sql_100 = `select *
                       from institutes ${query} ${form_data.Category_rank_f} < (close_rank - 300); `
    }

    switch (form_data.Category_f) {
        case "OPEN":
            sql_97 = `select *
                       from institutes ${query} ${form_data.Commor_rank_f} < (close_rank - 200) and close_rank < (${form_data.Commor_rank_f} +300); `
            break
        default:
            sql_97 = `select *
                       from institutes ${query} ${form_data.Category_rank_f} < (close_rank - 200) and close_rank < (${form_data.Category_rank_f} +300); `
    }

    switch (form_data.Category_f) {
        case "OPEN":
            sql_95 = `select *
                       from institutes ${query} ${form_data.Commor_rank_f} < (close_rank - 100) and close_rank < (${form_data.Commor_rank_f} +200); `
            break
        default:
            sql_95 = `select *
                       from institutes ${query} ${form_data.Category_rank_f} < (close_rank - 100) and close_rank < (${form_data.Category_rank_f} +200); `
    }

    switch (form_data.Category_f) {
        case "OPEN":
            sql_93 = `select *
                       from institutes ${query} ${form_data.Commor_rank_f} < close_rank and close_rank < (${form_data.Commor_rank_f} +100); `
            break
        default:
            sql_93 = `select *
                       from institutes ${query} ${form_data.Category_rank_f} < close_rank and close_rank < (${form_data.Category_rank_f} +100); `
    }

    let final_result = {}
    let result_100 = {}
    let result_97 = {}
    let result_95 = {}
    let result_93 = {}

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







