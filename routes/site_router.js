'use strict';
/*******************************************************************************
 * Copyright (c) 2015 IBM Corp.
 *
 * All rights reserved. 
 *
 * Contributors:
 *   David Huffman - Initial implementation
 *******************************************************************************/
var express = require('express');
var router = express.Router();
var setup = require('../setup.js');

// Load our modules.
var Ibc1 	= require('hyperledger-fabric-js');

// ============================================================================================================================
// Home
// ============================================================================================================================
router.route('/').get(function(req, res){
	res.redirect('/cci');
});

// ============================================================================================================================
// Chaincode Investigator
// ============================================================================================================================
router.route('/cci').get(function(req, res){
	res.render('investigate', {title: 'Chaincode Investigator', bag: {setup: setup}} );
});

// ============================================================================================================================
// POST /chaincode
// ============================================================================================================================
router.route('/chaincode').post(function(req, res){
	var ibc = new Ibc1();
	var chaincode = {};
	console.log('received post to /chaincode');
	ibc.load(req.body, cb_ready);																//parse/load chaincode

	function cb_ready(err, cc){																	//response has chaincode functions
		if(err != null){
			console.log('! looks like an error loading the chaincode, app will fail\n', err);
			res.status(err.code).json(err);
		}
		else{
			chaincode = cc;
			if(!cc.details.deployed_name || cc.details.deployed_name === ''){					//decide if i need to deploy
				cc.deploy(req.body.deploy_function, req.body.deploy_arg, null, cb_deployed);
			}
			else{
				console.log('chaincode summary file indicates chaincode has been previously deployed');
				cb_deployed();
			}
		}
	}
	
	function cb_deployed(err, d){
		if(err != null){
			console.log('! looks like a deploy error', err);
			res.status(err.code).json(err);
		}
		else{
			console.log('------------------------------------------ Deployed ------------------------------------------');
			res.status(200).json({details: chaincode.details});
		}
	}
});


module.exports = router;
