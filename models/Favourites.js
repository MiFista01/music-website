const db = require('../connection/database');
const Sequelize = require('sequelize');

const Favourites = db.define('favourites', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	userid: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references:{
			model:"users",
			key:"id"
		}
	},
	trackid: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references:{
			model:"tracks",
			key:"id"
		}
	}
}, {
	timestamps: false
});

module.exports = Favourites;