const Sequelize = require('sequelize'); // sequelize constructor
const sequelize = require('../util/Database')



const OrderItem = sequelize.define('OrderItem', {
  id: {
     type: Sequelize.INTEGER,
     autoIncrement: true,
     allowNull: false,
     primaryKey: true
  },
  Quantity: Sequelize.INTEGER
})

module.exports = OrderItem