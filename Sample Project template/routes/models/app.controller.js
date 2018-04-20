var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config.json');
var uuid = require('uuid');
var localServices = require('./../local/Services_Db');
var adminSetup = require('./admin-setup');
var streamReader = require('./stream-reader');

router.get('/masterdata_Chain', ChainMasterData);
router.get('/masterdata_Stream', StreamMasterData);
router.get('/masterdata_OpenStream', OpenStreamMasterData);
router.get('/masterdata_User', UserMasterData);
router.get('/readStreamsInit', readStreamsInit);
router.get('/keyListInit', keyListInit);
router.get('/publisherListInit', publisherListInit);
router.get('/publishedStreams', publishedStreams);
router.get('/streamListForSubscription', streamListForSubscription);
router.get('/streamListForUnSubscription', streamListForUnSubscription);
router.get('/getStreamPermissions', getStreamPermissions);
router.get('/GetAcknowledgent_Details', GetAcknowledgent_Details);
router.post('/createStream', createStream);
router.post('/subscribeStream', subscribeStream);
router.post('/unsubscribeStream', unsubscribeStream);
router.post('/publishToSingleStreams', publishToSingleStreams);
router.post('/publishToMultipleStreams', publishToMultipleStreams);
router.post('/sendAcknowledgement', sendAcknowledgement);
router.put('/updatePassword', updatePassword);
router.put('/streamPermission', streamPermission);


module.exports = router;

function ChainMasterData(req, res) {
	try {
		localServices.getChainData().then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}          
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		});
	}
	catch (err) {
     res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }
}

function StreamMasterData(req, res) {
	try {
		localServices.getStreamsData().then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}            
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		}); 
	}	
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }
}

function OpenStreamMasterData(req, res) {
	try {
		localServices.getOpenStreamList().then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}            
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		}); 
	}	
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }
}

function UserMasterData(req, res) {
	try {
		localServices.getUsersData().then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}         
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		});
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }	
}

function createStream(req, res) {
	try{
		var s_id_old = uuid.v1();
		var passkey_old = uuid.v1();
		
		s_id=s_id_old.replace(/-/g, "");
		passkey=passkey_old.replace(/-/g, "");
		var param = {
			Stream_Name: req.body.stream,
			Stream_Type_Id : "1",
		    Passkey : passkey,
			IsOpen: req.body.isOpenToPublish,
			User_Role : req.session.user.userRole,
			User_ID :  req.session.user.userID,
			Vm_Port :  req.session.user.vmPort,
			Vm_Host :    req.session.user.vmIP,
			Chain_User_Name: req.session.user.chainUserName,
			Chain_PWD: req.session.user.chainPassword,
			Stream_Id: s_id
					
		};
		if(req.session.user.userRole === "1"){
			adminSetup.creates(param).then(function (response) {
				if(response){
					res.status(200).json(response);
				} else {
					res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
				}         
			})
			.catch(function (err) {
				res.status(200).json({"data": 'null',"message": err.message, "status":-1});
			}); 
		}	
		else{
			res.status(200).json({"data":"null", "message": "user is not authorised to create the stream", "status":-1});
		}
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }
}

function streamPermission(req, res) {
	try{
		var is_Allowed = false;
		var is_Publisher = false;
		if(req.body.permission.indexOf("Read")>-1){
			is_Allowed = true;
		}
		if(req.body.permission.indexOf("Publish")>-1){
			is_Publisher = true;
		}
		if(req.session.user.userRole === "1"){
			localServices.getUserAddress(req.body.sec_userID).then(function (response) {
				if(response){
					var param = {
					Stream_Name: req.body.stream.STREAM_NAME,
					Stream_Type_Id: "1",
					User_Role: req.session.user.userRole,
					User_ID :  req.session.user.userID,
					Vm_Port :  req.session.user.vmPort,
					Vm_Host :    req.session.user.vmIP,
					Chain_User_Name: req.session.user.chainUserName,
					Chain_PWD: req.session.user.chainPassword,
					Stream_Id: req.body.stream.STREAM_ID,
					Sec_UserID: req.body.sec_userID,
					IsAllowed : is_Allowed,
					IsPublisher : is_Publisher,
					User_Address : response.data
					
							
				   };
					adminSetup.permission(param).then(function (response) {
						if(response){
							res.status(200).json(response);
						} else {
							res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
						}         
					})
					.catch(function (err) {
						res.status(200).json({"data": 'null',"message": err.message, "status":-1});
					});
				}
				else{
				  res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3});
				}
			}).catch(function (err) {
				res.status(200).json({"data": 'null',"message": err.message, "status":-1});
			});	
		}	
		else{
			res.status(200).json({"data":"null", "message": "user is not authorised to give the permission to stream", "status":-1});
		}
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }
}

function readStreamsInit(req, res) {
	try{
		var myreq = JSON.parse(req.query.stream);
		
				switch (req.query.value) {
					
				case "io":
				
					var param = {
						Stream_Name: myreq.STREAM_NAME,
						Stream_Id: myreq.STREAM_ID,
						User_Role: req.session.user.userRole,
						User_ID: req.session.user.userID,
						Sec_UserID: req.session.user.userID,
						Vm_Port :  req.session.user.vmPort,
						Vm_Host :    req.session.user.vmIP,
						Chain_User_Name: req.session.user.chainUserName,
						Chain_PWD: req.session.user.chainPassword
								
					};
					streamReader.streamDataByOrder(param).then(function (response) {
								if(response){
									res.status(200).json(response);
								} else {
									res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
								}          
							})
							.catch(function (err) {
								res.status(200).json({"data": 'null',"message": err.message, "status":-1});
							});  
					 
					break;
					
				case "bk":
					var param = {
					Key_ID: JSON.parse(req.query.readKey),
					Stream_Name: myreq.STREAM_NAME,
					Stream_Id: myreq.STREAM_ID,
					User_ID: req.session.user.userID,
					Sec_UserID: req.session.user.userID,
					User_Role: req.session.user.userRole,
					Vm_Port :  req.session.user.vmPort,
					Vm_Host :    req.session.user.vmIP,
					Chain_User_Name: req.session.user.chainUserName,
					Chain_PWD: req.session.user.chainPassword
							
					};
					streamReader.streamDataByKey(param).then(function (response) {
						if(response){
							res.status(200).json(response);
						} else {
							res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
						}          
					})
					.catch(function (err) {
							res.status(200).json({"data": 'null',"message": err.message, "status":-1});
					});
					break;
				case "pid":
				if(req.session.user.userRole === "1"){
					req.query.pubID = JSON.parse(req.query.pubID);
					var param = {
						Publisher_Address: req.query.pubID.ADDRESS,
						Stream_Name: myreq.STREAM_NAME,
						Stream_Id: myreq.STREAM_ID,
						User_Role: req.session.user.userRole,
						Vm_Port :  req.session.user.vmPort,
						Vm_Host :    req.session.user.vmIP,
						Chain_User_Name: req.session.user.chainUserName,
						Chain_PWD: req.session.user.chainPassword
								
					};
					streamReader.streamDataByPublishers(param).then(function (response) {
						if(response){
							res.status(200).json(response);
						} else {
							res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
						}          
					})
					.catch(function (err) {
						res.status(200).json({"data": 'null',"message": err.message, "status":-1});
					});
					}
					else{
						res.status(200).json({"data":"null", "message": "user is not authorised to read stream data", "status":-1});
					}
					break;
					
				case "lk":
					var param = {
					Stream_Name: myreq.STREAM_NAME,
					Stream_Id: myreq.STREAM_ID,
					User_Role: req.session.user.userRole,
					Vm_Port :  req.session.user.vmPort,
					Vm_Host :    req.session.user.vmIP,
					Chain_User_Name: req.session.user.chainUserName,
					Chain_PWD: req.session.user.chainPassword		
					};
					streamReader.keyList(param).then(function (response) {
						if(response){
							res.status(200).json(response);
						} else {
							res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
						}           
					})
					.catch(function (err) {
							res.status(200).json({"data": 'null',"message": err.message, "status":-1});
					});
					break;
				case "lp":
					if(req.session.user.userRole === "1"){
					 var param = {
					Stream_Name: myreq.STREAM_NAME,
					Stream_Id: myreq.STREAM_ID,
					User_Role: req.session.user.userRole,
					Vm_Port :  req.session.user.vmPort,
					Vm_Host :    req.session.user.vmIP,
					Chain_User_Name: req.session.user.chainUserName,
					Chain_PWD: req.session.user.chainPassword		
					};
					streamReader.publisherList(param).then(function (response) {
						if(response){
							res.status(200).json(response);
						} else {
							res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
						}           
					})
					.catch(function (err) {
							res.status(200).json({"data": 'null',"message": err.message, "status":-1});
					});
					}
					else{
						res.status(200).json({"data":"null", "message": "user is not authorised to read stream data", "status":-1});
					}
					
					break;
				}
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }
  
}

function keyListInit(req, res) {
	try{
		var param = {
			Stream_Name: req.query.STREAM_NAME,
			Stream_Id: req.query.STREAM_ID,
			User_Role: req.session.user.userRole,
			Vm_Port :  req.session.user.vmPort,
			Vm_Host :    req.session.user.vmIP,
			Chain_User_Name: req.session.user.chainUserName,
			Chain_PWD: req.session.user.chainPassword
			
		};
		streamReader.keyList(param).then(function (response) {
				if(response){
					res.status(200).json(response);
				} else {
					res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
				}           
		})
		.catch(function (err) {
				res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		}); 
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }
}

function publisherListInit(req, res) {
	try{
		var param = {
				
			Stream_Name: req.query.STREAM_NAME,
			Stream_Id: req.query.STREAM_ID,
			User_Role: req.session.user.userRole,
			Vm_Port :  req.session.user.vmPort,
			Vm_Host :    req.session.user.vmIP,
			Chain_User_Name: req.session.user.chainUserName,
			Chain_PWD: req.session.user.chainPassword		
		};
		if(req.session.user.userRole === "1"){
			streamReader.getpublisherNames(param).then(function (response) {
				if(response){
					res.status(200).json(response);
				} else {
					res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
				}           
			})
			.catch(function (err) {
				res.status(200).json({"data": 'null',"message": err.message, "status":-1});
			});        
		}
		else{
			res.status(200).json({"data":"null", "message": "user is not authorised to read publisher list", "status":-1});
		}
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }
}

function streamListForSubscription(req, res) {
	try{
		var param = {
			User_ID :  req.session.user.userID
		}
		streamReader.streamListDataForSubscription(param).then(function (response) {
				if(response){
					res.status(200).json(response);
				} else {
					res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
				}           
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		}); 
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }	
}

function streamListForUnSubscription(req, res) {
	try{
		var param = {
			User_ID :  req.session.user.userID
		}
		streamReader.streamListDataForUnSubscription(param).then(function (response) {
				if(response){
					res.status(200).json(response);
				} else {
					res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
				}           
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		}); 
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }
}

function publishToSingleStreams(req, res) {
	try{
		console.log("publishToSingleStreams hits ", req.body);
		var message = req.body.content;
		var param = {
			Stream_Name: req.body.stream.STREAM_NAME,
			Stream_Id: req.body.stream.STREAM_ID,
			Key_ID : req.body.key,
			Payload : message,
			User_ID :  req.session.user.userID,
			User_Role : req.session.user.userRole,
			Address : req.session.user.Address,
			Vm_Port :  req.session.user.vmPort,
			Vm_Host :    req.session.user.vmIP,
			Chain_User_Name: req.session.user.chainUserName,
			Chain_PWD: req.session.user.chainPassword
		};
		streamReader.publishSingleStreams(param).then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}           
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		});
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }	
}
function publishToMultipleStreams(req, res) {
	try{
		console.log("publishToMultipleStreams hits ", req.body);
		var message = req.body.content;
		var param = {
			Stream: req.body.stream,
			Key_ID : req.body.key,
			Payload : message,
			User_ID :  req.session.user.userID,
			User_Role : req.session.user.userRole,
			Address : req.session.user.Address,
			Vm_Port :  req.session.user.vmPort,
			Vm_Host :    req.session.user.vmIP,
			Chain_User_Name: req.session.user.chainUserName,
			Chain_PWD: req.session.user.chainPassword
		};
		streamReader.publishMultipleStreams(param).then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}           
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		});
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }	
}

function subscribeStream(req, res) {
	try{
		var param = {
			Stream_List: req.body.streamList,
			isSubscribed : true,
			User_ID :  req.session.user.userID,
			Vm_Port :  req.session.user.vmPort,
			Vm_Host :    req.session.user.vmIP,
			Chain_User_Name: req.session.user.chainUserName,
			Chain_PWD: req.session.user.chainPassword
		};
		streamReader.subscribeStream(param).then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}          
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		}); 
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }	
}

function unsubscribeStream(req, res) {	
	try{
		var param = {
			Stream_List: req.body.streamList,
			isSubscribed : false,
			User_ID :  req.session.user.userID,
			Vm_Port :  req.session.user.vmPort,
			Vm_Host :    req.session.user.vmIP,
			Chain_User_Name: req.session.user.chainUserName,
			Chain_PWD: req.session.user.chainPassword
		};
		streamReader.unsubscribeStream(param).then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}           
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		}); 
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }	
}

function getStreamPermissions(req, res) {	
	try{
		var param = {
			Stream_Id: req.query.Stream_ID,
			Sec_UserID: req.query.Sec_UserID
		};
		adminSetup.getStreamPermissionsData(param).then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}           
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		}); 
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }	
}
function publishedStreams(req, res) {	
	try{
		var param = {
			User_ID :  req.session.user.userID
		};
		streamReader.getPublishedStreams(param).then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}           
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		}); 
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }	
}

function sendAcknowledgement(req, res) {	
	try{
		localServices.getAcknowledgementStreamID(req.body.pubAddress).then(function (response) {
			if(response.data != 'null'){
				var param = {
					Stream_ID : req.body.streamID,
					Key_ID : req.body.key,
					Timestamp : req.body.blockTime,
					Pub_Address: req.body.pubAddress,
					Ack_Stream_ID : response.data.ACK_STREAM_ID,
					User_ID :  req.session.user.userID,
					Vm_Port :  req.session.user.vmPort,
					Vm_Host :    req.session.user.vmIP,
					Chain_User_Name: req.session.user.chainUserName,
					Chain_PWD: req.session.user.chainPassword
				};
				streamReader.sendAcknowledgement(param).then(function (response) {
					if(response){
						res.status(200).json(response);
					} else {
						res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
					}           
				})
				.catch(function (err) {
					res.status(200).json({"data": 'null',"message": err.message, "status":-1});
				}); 
			}
			else{
				res.status(200).json({"data":"null", "message": "Acknowledgement data not found", "status":2});
			}
		})
		
		
	}
	catch (err) {
      res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }	
}

function GetAcknowledgent_Details(req, res) {
	try{
		var stream = JSON.parse(req.query.stream);
		var param = {
			Stream_Id: stream.STREAM_ID,
			Key_ID : req.query.key,
			Timestamp: req.query.blockTime,
			Pub_Address: req.query.pubAddress,
			User_ID :  req.session.user.userID,
			Address : req.session.user.Address,
			Vm_Port :  req.session.user.vmPort,
			Vm_Host :    req.session.user.vmIP,
			Chain_User_Name: req.session.user.chainUserName,
			Chain_PWD: req.session.user.chainPassword
		};
		streamReader.GetAcknowledgent_Details(param).then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}           
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		});
	}
	catch (err) {
		res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }	
}

function updatePassword(req, res) {
	try{

		var param = {
			UserID : req.session.user.userID,
			UserName : req.session.user.userName,
			New_Password : req.body.newPassword,
			Old_Password : req.body.oldPassword,
		};

		adminSetup.updatePassword(param).then(function (response) {
			if(response){
				res.status(200).json(response);
			} else {
				res.status(204).json({"data":"null", "message": "Some Error Occured", "status":3}); 
			}           
		})
		.catch(function (err) {
			res.status(200).json({"data": 'null',"message": err.message, "status":-1});
		});
	}
	catch (err) {
		res.status(200).json({"data": 'null',"message": err.message, "status":-1});
    }	
}
