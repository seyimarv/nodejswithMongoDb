// user demo model
const Sequelize = require('sequelize'); // sequelize constructor
const sequelize = require('../util/Database')


const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: Sequelize.STRING,
      email: Sequelize.STRING
      
})

module.exports = User;