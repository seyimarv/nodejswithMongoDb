// using normal mysql

// const db = require('../util/Database')


// const Cart = require('./cart');


// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//    return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)', 
//     [this.title, this.price, this.description, this.imageUrl]) // allows you to insert Data into the sql Database
//   }
//   static deleteById(id) {
          
//   }
//   static fetchAll() {
//     return db.execute("SELECT * FROM products"); // fetching all the products from the database
//   }

//   static findById(id) {
//    return db.execute("SELECT * FROM products WHERE products.id = ?", [id])
   
//   }
// };

// using sequelize

const Sequelize = require('sequelize');
const sequelize = require('../util/Database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  }, 
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});  // defining a new model


module.exports = Product;
