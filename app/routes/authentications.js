const express = require('express');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User   = require('../models/user');
const config = require('../../config'); // get our config file

const authenticationsRoutes = express.Router(); 

authenticationsRoutes.post('/', async function(req, res) {

	// find the user
	var user = await User.findOne( { name: req.body.name } )

	if (!user) {
		// user not found
		res.json({ success: false, message: 'Authentication failed. User not found.' });
		
	} else {

		// check if password matches
		if (user.password != req.body.password) {
			// wrong password
			res.json({ success: false, message: 'Authentication failed. Wrong password.' });

		} else {

			// if user is found and password is right
			// create a token
			var payload = {
				id: user.id,
				name: user.name,
			}
			var options = {
				expiresIn: 86400 // expires in 24 hours
			}
			var token = jwt.sign(payload, config.superSecret, options);

			// signed in
			res.json({ success: true, message: 'Enjoy your token!', token: token });
		}

	}

});

module.exports = authenticationsRoutes;