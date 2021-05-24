const Sequelize = require('sequelize'); // sequelize constructor
const sequelize = require('../util/Database')



const Order = sequelize.define('Order', {
  id: {
     type: Sequelize.INTEGER,
     autoIncrement: true,
     allowNull: false,
     primaryKey: true
  },
})

module.exports = Order;