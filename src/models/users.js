'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let config = require('config');
let uri = 'mongodb://' + config.dbConfig.user + ':' + config.dbConfig.password + '@' + config.dbConfig.host + ':' + config.dbConfig.port + '/' + config.dbConfig.dbName;
let mongoConnection = mongoose.createConnection(uri);

let UserSchema = new Schema({
	userType: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	DOB: {
		type: Date,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	email: String,
	password: String,
	createdDate: {
		type: Date,
		default: Date.now
	},
	updatedDate: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoConnection.model('users', UserSchema);
