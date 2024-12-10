const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('warehouse', 'root', 'Vitali77', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
