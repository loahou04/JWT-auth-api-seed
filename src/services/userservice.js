'use strict';

let bcrypt = require('bcrypt'),
	User = require('../models/users'),
	jwt = require('jsonwebtoken'),
	config = require('config');

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
		const userToken = {
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			_id: user._id
		};
		var token = jwt.sign(userToken, config.authConfig.secret, {
			expiresIn: 10080 // in seconds
		});
		return {
			token: 'JWT ' + token
		};
	}
};
