var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config.json');
var scServices = require('./../local/Services_Db');

router.get('/', loginPage)
router.get('/logout', userLogout);
router.post('/authenticate', userLogin);
router.post('/authenticateADP', adp_UserLogin);

/* GET login page. */
function loginPage(req, res) {
  res.render('login');
};

/* Log user out */
function userLogout(req, res) {
	console.log("logging out user...");
	req.session.destroy(function(err){
        if(err){	
            console.log(err);
			return;
		}
        res.redirect('/login');
	});
}

function userLogin(req, res) {
	console.log("in authenticateUser controller "+req.body.username);
	var user = {
		User_Name: req.body.username,
		User_PWD: req.body.password
	}
	scServices.authenticatedUser(user).then(function (response) {
		if(response.data.token){
			console.log("token generated ", response);
			req.session.user = response.data.user;
			req.session.save();	
			res.status(200).json({"token": response.data.token}); 
		} else {
			res.status(200).json(response); 
		}          
	})
	.catch(function (err) {
		console.log("Error: login.js ", err);
		res.status(200).json({"message": err.message, "status":2});
	});
}
function adp_UserLogin(req, res) {
	console.log("in authenticateUser controller "+req.body.username);
	var user = {
		User_Name: req.body.username,
		User_PWD: req.body.password
	}
	scServices.authenticatedADPUser(user).then(function (response) {
		if(response.data.token){
			console.log("token generated ", response);
			req.session.user = response.data.user;	
			res.status(200).json({"token": response.data.token}); 
		} else {
			res.status(200).json(response); 
		}          
	})
	.catch(function (err) {
		console.log("Error: login.js ", err);
		res.status(200).json({"message": err.message, "status":2});
	});
}

module.exports = router;