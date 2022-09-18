const mysql = require("mysql2");
require('dotenv').config()

const db_connection = mysql
  .createConnection({
    host     : 'localhost',
    user     : 'root', 
    password : '',
    database : 'game'
    // host     : process.env.DB_HOST,
    // user     : process.env.DB_USER,
    // password : process.env.DB_PASS,
    // database : process.env.DB_NAME
  })
  .on("error", (err) => {
    console.log("Failed to connect to Database - ", err);
  });

  // var sql = "CREATE TABLE usersHistoryrecord (id INT AUTO_INCREMENT PRIMARY KEY, won VARCHAR(255),loss VARCHAR(255))"
  
  // db_connection.query(sql, function(err,result){
  //   if(err){
  //     console.log("table is not created")
  //   }
  //   else{
  //     console.log("table has created")
  //   }
  // })
  

module.exports = db_connection;