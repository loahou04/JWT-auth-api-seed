var assert = require('chai').assert,
    userService = require('../../src/services/userservice'),
    User = require('../../src/models/users'),
    jwt = require('jsonwebtoken');

describe('UserService', function() {
	describe('#compareDevice(user, device)', function () {
		it('should return {isMatch: true} if the device is in user.devices', function () {
            var user = new User();
            user.devices = ['testdevice', 'testdevice2'];
			assert.isTrue(userService.compareDevice(user, 'testdevice').isMatch);
			assert.isFalse(userService.compareDevice(user, 'testdevice3').isMatch);
		});
	});

    describe('#comparePassword(user, pw)', function () {
		it('should return {isMatch: true} if the password matches', function () {
            var user = new User();
            var password = 'testpassword';
            var data = userService.hashPassword(password);
            userService.hashPassword(password).then(function(hash) {
                user.password = hash;
                assert.isTrue(userService.comparePassword(user, password).isMatch);
    			assert.isFalse(userService.comparePassword(user, password + '1').isMatch);
            });
		});
	});

    describe('#createToken(user)', function () {
		it('should return the token containing the user, with no password/device', function () {
            var user = new User();
            user.username = 'testuser'
            user.password = 'testpassword';
            user.devices = ['testdevice', 'testdevice2'];
            var token = userService.createToken(user).token.substring(4);
            var decode = jwt.decode(token);
            assert.equal(decode._doc.username, 'testuser');
			assert.equal(decode._doc.devices.length, 0);
			assert.equal(decode._doc.password, '');
		});
	});

    describe('#hashPassword(password)', function () {
		it('should return the hashed and salted password', function () {
            var password = 'testpassword';
            userService.hashPassword(password).then(function(hash) {
                assert.notEqual(password, hash);
            }, function(err) {
                assert.isNotOk(err);
            });
		});
	});
});
