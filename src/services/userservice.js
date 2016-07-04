'use strict';

let bcrypt = require('bcrypt'),
	User = require('../models/users'),
	UserSchema = require('../models/users').model('users').schema,
	jwt = require('jsonwebtoken'),
	config = require('config');

// Saves the user's password hashed
UserSchema.pre('validate', function(next) {
	var user = this;
	if (!user.password) {
		return next(new Error('password required'));
	}
	if (user.password && (this.isModified('password') || this.isNew)) {
		module.exports.hashPassword(user.password).then(function(hash) {
			user.password = hash;
			return next();
		}, function(err) {
			return next(new Error(err));
		});
	} else {
		return next();
	}
});

module.exports = {

	insertUser: function(userObj) {
		let promise = new Promise(function(resolve, reject) {
			new User(userObj).save(function(err, result) {
				if (err) {
					reject({
						message: 'error in insertUser',
						stack: err
					});
					return;
				}
				resolve(result);
			});
		});

		return promise;
	},

	findUserById: function(id) {

		let promise = new Promise(function(resolve, reject) {
			User.findOne({
				'_id': id
			}, {}, {}, function(err, result) {
				if (err) {
					reject({
						message: 'error in findUserById',
						stack: err
					});
					return;
				}
				resolve(result);
			});
		});

		return promise;
	},

	findUserByUsername: function(username) {
		let promise = new Promise(function(resolve, reject) {
			User.findOne({
				'username': username
			}, {}, {}, function(err, result) {
				if (err) {
					reject({
						message: 'error in findUserByUsername',
						stack: err
					});
					return;
				}
				if (result) {
					resolve(result);
				} else {
					resolve();
				}
			});
		});

		return promise;
	},

	comparePassword: function(user, pw) {
		let promise = new Promise(function(resolve, reject) {
			bcrypt.compare(pw, user.password, function(err, isMatch) {
				if (err) {
					return reject({
						err: err
					});
				}
				resolve({
					isMatch: isMatch
				});
			});
		});
		return promise;
	},

	createToken: function(user) {
		// Create token if the password matched and no error was thrown
		user.password = '';
		var token = jwt.sign(user, config.authConfig.secret, {
			expiresIn: 10080 // in seconds
		});
		return {
			token: 'JWT ' + token
		};
	},

	hashPassword: function(password) {
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
};
