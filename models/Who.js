const db = require('../connection/database');
const Sequelize = require('sequelize');

const Who = db.define('whos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {//group or one singer
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Who;