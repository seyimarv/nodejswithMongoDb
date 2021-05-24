// const mysql = require('mysql2'); //import mysql database 

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'Tomilayo1!'
// })     // creating a new connection pool, alllow to run multiple queries


// module.exports = pool.promise() //allows us to use promises to handle asynchronus task instead of callbacks

//using sequelize instead
const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-complete', 'root', 'Tomilayo1!', 
{dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;