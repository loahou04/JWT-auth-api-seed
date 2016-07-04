'use strict';

let express = require('express');
let app = express();
let config = require('config');
let bodyParser = require('body-parser');
let usersController = require('./src/controllers/usercontroller');
let passport = require('passport');

app.use(bodyParser.json());

app.use(express.static('public'));
app.get('/', function(req, res) {
	res.sendFile('/public/index.html');
});

app.use(passport.initialize())
require('./config/passport')(passport);

app.use('/user', usersController);


app.listen(config.appConfig.port, function() {
	console.log('Example app listening on port ' + config.appConfig.port + '!');
});
