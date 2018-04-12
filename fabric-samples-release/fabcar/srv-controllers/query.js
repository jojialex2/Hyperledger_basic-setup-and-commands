'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode query
 */

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('mychannel');
var peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);

//
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;

// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
	// assign the store to the fabric client
	fabric_client.setStateStore(state_store);
	var crypto_suite = Fabric_Client.newCryptoSuite();
	// use the same location for the state store (where the users' certificate are kept)
	// and the crypto store (where the users' keys are kept)
	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	crypto_suite.setCryptoKeyStore(crypto_store);
	fabric_client.setCryptoSuite(crypto_suite);

	// get the enrolled user from persistence, this user will sign all requests
	return fabric_client.getUserContext('user4', true);
}).then((user_from_store) => {
	if (user_from_store && user_from_store.isEnrolled()) {
		console.log('Successfully loaded user4 from persistence');
		member_user = user_from_store;
	} else {
		throw new Error('Failed to get user4.... run registerUser.js');
	}

	// queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
	// queryAllCars chaincode function - requires no arguments , ex: args: [''],
	var Project_input = [];	
				
	
	Project_input.push("Projo projo id 1"); Project_input.push("Forest creation"); Project_input.push("Forest creation wild life");Project_input.push("2018-01-02T00:00:00+05:30"); Project_input.push("2018-01-11T00:00:00+05:30"); Project_input.push(" "); Project_input.push("1"); Project_input.push(" "); Project_input.push("5a39eb09d5515c1d3045e7b5");

	Project_input.push(JSON.stringify({"SAA":[{"subCatId":"RS","subCatName":"RealEstate","subCatStatus":"Active"},{"subCatId":"AGR", "subCatName":"Agriculture","subCatStatus":"Active"}], "SF":[{"subCatId":"II","subCatName":"Impact Investing","subCatStatus":"Active"}]}));
	Project_input.push(JSON.stringify({"RS":[{"key":"LD","subCatId":"RS","value":"Land","status":"Active","lang":"EN","rows":[{"role":"LO", "name":"dfeafaf","email":"sse@rdhdrh.reef","phone":24242}],"selectedDoc":["POA","NOC"],"tableModel":"RS3"}], "AGR":[{"key":"LD","subCatId":"AGR","value":"Land","status":"Active","lang":"EN","rows":[{"role":"LO","name":"dffgr", "email":"srgesg@rgrgdww.dgrg","phone":3535434}],"selectedDoc":["TC","NOC"],"tableModel":"AGR0"}],"II":[{"key":"EQ","subCatId":"II", "value":"Equity","status":"Active","lang":"EN","rows":[{"role":"EQO","name":"dfef","email":"efwafaf@fef.dffg","phone":22242}],"selectedDoc":["POA","NOC"],"tableModel":"II1"},{"key":"DB","subCatId":"II","value":"Debt","status":"Active","lang":"EN","rows":[{"role":"DO", "name":"s","email":"sdff@fe","phone":3344}],"selectedDoc":["TPD","NOC"],"tableModel":"II2"}]}));
	
	Project_input.push(JSON.stringify([{"role":"TNCC", "name":"Promojos","email":"Promojos5@dsgdr.dd", "phone":353535}]));
	Project_input.push("2017-12-31T15:15:53+05:30");
	Project_input.push("5a39eb09d5515c1d3045e7b5");
	Project_input.push(""); Project_input.push(" "); 
	
	const request = {
		//targets : --- letting this default to the peers assigned to the channel
		chaincodeId: 'Crediss02',
		//fcn: 'getAllStkHolderByEntityID',
		fcn: 'getSinglePOProject',
		//fcn: 'getStkholderList',
		//fcn: 'InitiatePOProject_Creation',
		//args: ["3cfa5950-f135-11e7-b718-356f5ff88880"]
		//fcn: 'getSinglePOProject',
		args: ["1300295828"]
		//args: [Project_input]
	};

	// send the query proposal to the peer
	return channel.queryByChaincode(request);
}).then((query_responses) => {
	console.log("Query has completed, checking results");
	// query_responses could have more than one  results if there multiple peers were used as targets
	if (query_responses && query_responses.length == 1) {
		if (query_responses[0] instanceof Error) {
			console.error("error from query = ", query_responses[0]);
		} else {
			console.log("Response is ", query_responses[0].toString());
		}
	} else {
		console.log("No payloads were returned from query");
	}
}).catch((err) => {
	console.error('Failed to query successfully :: ' + err);
});
