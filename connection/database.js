const {Sequelize} = require('sequelize');
const mysql = require("mysql2");

async function createDB(db) {
    // Open the connection to MySQL server
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "", 
    });
    
    // Run create database statement
    connection.query(
        `CREATE DATABASE IF NOT EXISTS `+db,
        function (err, results) {
        console.log(results);
        console.log(err);
        }
    );
  
    // Close the connection
    connection.end();
}
createDB("music")
const sequelize = new Sequelize("music","root","",{host: "localhost", dialect:"mysql"})
module.exports = sequelize