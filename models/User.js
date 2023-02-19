const db = require('../connection/database');
const Sequelize = require('sequelize');

const User = db.define('user', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	nick: {
		type: Sequelize.STRING,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	},
	salt: {
		type: Sequelize.STRING,
		allowNull: false
	}
}, {
	timestamps: false
});

module.exports = User;