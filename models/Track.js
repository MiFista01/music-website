const db = require('../connection/database');
const Sequelize = require('sequelize');

const Track = db.define('track', {
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
    link: {
        type: Sequelize.STRING,
        allowNull: false
    },
    albumId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "albums",
            key: 'id'
        }
    },
    count:{
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
});

module.exports = Track;