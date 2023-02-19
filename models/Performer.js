const db = require('../connection/database');
const Sequelize = require('sequelize');

const Performer = db.define('performers', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    des: {
        type: Sequelize.TEXT
    },
    who:{//group or one singer
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
            model:"whos",
            key:"id"
        }
    }
}, {
    timestamps: false
});

module.exports = Performer;