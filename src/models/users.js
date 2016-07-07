'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let config = require('config');
let uri = 'mongodb://' + config.dbConfig.user + ':' + config.dbConfig.password + '@' + config.dbConfig.host + ':' + config.dbConfig.port + '/' + config.dbConfig.dbName;
let mongoConnection = mongoose.createConnection(uri);
let bcrypt = require('bcrypt');

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

function hashPassword(password) {
	let promise = new Promise(function(resolve, reject) {
		bcrypt.hash(password, 10, function(err, hash) {
			if (err) {
				reject(err);
			}
			resolve(hash);
		});
	});
	return promise;
}

// Saves the user's password hashed
UserSchema.pre('validate', function(next) {
	var user = this;
	if (!user.password) {
		return next(new Error('password required'));
	}
	if (user.password && (this.isModified('password') || this.isNew)) {
		hashPassword(user.password).then(function(hash) {
			user.password = hash;
			return next();
		}, function(err) {
			return next(new Error(err));
		});
	} else {
		return next();
	}
});

module.exports = mongoConnection.model('users', UserSchema);
