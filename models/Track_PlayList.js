const db = require('../connection/database');
const Sequelize = require('sequelize');

const Track_genre = db.define('track_playlist', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    trackId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "tracks",
            key: 'id'
        }
    },
    playlistId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "playlists",
            key: 'id'
        }
    }
}, {
    timestamps: false
});

module.exports = Track_genre;