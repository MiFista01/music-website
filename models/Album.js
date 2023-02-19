const db = require('../connection/database');
const Sequelize = require('sequelize');

const Album = db.define('album', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING
    },
    performerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "performers",
            key: 'id'
        }
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    count_clicks:{
        type: Sequelize.INTEGER,
    },
    img:{
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Album;