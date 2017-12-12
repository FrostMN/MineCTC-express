var mysql = require('mysql');
// var User = require('/models/User');

var db_host = "localhost";
var db = process.env.MC_MYSQL_DB;
var db_user = process.env.MC_MYSQL_USER;
var db_pwrd = process.env.MC_MYSQL_PW;

var connection = mysql.createConnection({
    host     : db_host,
    user     : db_user,
    password : db_pwrd,
    database : db
});


function query(string) {
    var rs;
    connection.connect();
    rs = connection.query(string);
    connection.end();
    return rs;
}

function execute(string) {
    connection.connect();
    connection.query(string);
    connection.end();
}

// function userExists(uname) {
//     var count = 0;
//     connection.connect();
//     connection.query('SELECT COUNT(*) AS count FROM users WHERE UserName = ?', uname, function(err, results) {
//         if (err) throw err;
//         console.log(results[0]);
//
//         count = results[0]['count'];
//
//         if (count) {
//             console.log("exists");
//             return true;
//         } else {
//             console.log("nope");
//             return false;
//         }
//     });
//     connection.end();
// }



function userExists(uname) {
    var count = 0;
    connection.connect();
    var results = connection.query('SELECT COUNT(*) AS count FROM users WHERE UserName = ?', uname);



    console.log("results: ");
    console.log( results );
    console.log( results );

    connection.end();


    if (count) {
        console.log("exists");
        return true;
    } else {
        console.log("nope");
        return false;
    }
}



var test =
    "CREATE TABLE users (" +
    "    UserID int NOT NULL AUTO_INCREMENT, " +
    "    UserName varchar(255) NOT NULL, " +
    "    McUUID varchar(255) NOT NULL, " +
    "    Email varchar(255) NOT NULL, " +
    "    LastName varchar(255) NOT NULL, " +
    "    FirstName varchar(255) NOT NULL, " +
    "    Admin TINYINT NOT NULL DEFAULT 0, " +
    "    Banned TINYINT NOT NULL DEFAULT 0, " +
    "    RulesAccept TINYINT NOT NULL DEFAULT 0, " +
    "    EmailVerify TINYINT NOT NULL DEFAULT 0, " +
    "    salt varchar(255) NOT NULL, " +
    "    hash varchar(255) NOT NULL, " +
    "    PRIMARY KEY (UserID)" +
    ")";

// INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country)
// VALUES ('Cardinal', 'Tom B. Erichsen', 'Skagen 21', 'Stavanger', '4006', 'Norway');


var testUser = "INSERT INTO users (UserName, McUUID, Email, LastName, FirstName, Admin, Banned, RulesAccept, EmailVerify)" +
    "VALUES ('asouer','mc123','as@gm.c','aar','sou', 0, 0, 0, 0)";

// execute(test);
// execute(testUser);

console.log("before user exists");

console.log(userExists("asouer"));

module.exports =
{
    query: query,
    execute: execute
};

