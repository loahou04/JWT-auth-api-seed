'use strict';

let express = require('express'),
	router = express.Router(),
	userService = require('../services/userservice'),
	passport = require('passport');

router.get('/', passport.authenticate('jwt', {session: false}), function(req, res) {
	req.user.password = '';
	res.status(200).send(req.user);
});

router.post('/register', function(req, res) {
	userService.insertUser(req.body).then(function(user) {
		// respond without a password so that we have no chance of exposing it to the end user
		user.password = '';
		res.status(201).send(user);
	}, function(err) {
		if (!err.stack.code) {
			res.status(400).send({
				message: 'Bad Request validation failed',
				stack: String(err.stack)
			});
			return;
		} else if (err.stack.code === 11000) {
			res.status(400).send({
				message: 'Bad Request username must be unique'
			});
			return;
		}
		res.status(500).send({
			message: 'Internal Server Error'
		});
	});

});

router.post('/authenticate', function(req, res) {
	var serverError = function(err) {
		console.log(err);
		res.status(500).send({
			message: 'Internal Server Error'
		});
	};

	userService.findUserByUsername(req.body.username).then(function(user) {
		var tokencreate = function(data) {
			if (data.isMatch) {
				res.status(200).send(userService.createToken(user));
			} else if (data.err) {
				serverError(data.err);
			} else {
				res.status(403).send({
					message: 'Forbidden incorrect password'
				});
			}
		};
		if (req.body.password) {
			// Check if password matches
			userService.comparePassword(user, req.body.password).then(tokencreate, serverError);
		} else {
			res.status(403).send({
				message: 'Forbidden no password'
			});
		}
	}, function(err) {
		res.status(403).send(err);
	});
});

module.exports = router;
