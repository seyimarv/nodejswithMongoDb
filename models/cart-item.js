const Sequelize = require('sequelize'); // sequelize constructor
const sequelize = require('../util/Database')



const CartItem = sequelize.define('CartItem', {
  id: {
     type: Sequelize.INTEGER,
     autoIncrement: true,
     allowNull: false,
     primaryKey: true
  },
  Quantity: Sequelize.INTEGER

})

module.exports = CartItem