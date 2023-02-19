const db = require('../connection/database');
const Sequelize = require('sequelize');

const PlayList = db.define('playlist', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    img:{
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = PlayList;