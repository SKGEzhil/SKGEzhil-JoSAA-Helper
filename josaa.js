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

con.query(sql, function (err, result) {
    if (err) throw err;
    for(var i=0; i< result.length; i++){
        console.log(result[i].Institute + " " + result[i].Program)
    }


});
