'use strict';
 
var Article = require('../models/article.server.model');
// var User = require('../../../users/server/models/users.server.model');

// bluebird
// var Promise = require('bluebird');
// var Users = Promise.promisifyAll(User);

var self = {
	saveArticle: function(req, res){
		var val = req.body;
		var name = req.user.name + ' '+ req.user.surname;

		val.create_by = req.user._id;
		val.create_name = name;
		// val.update = { by: req.user._id };
		val.update_by = req.user._id;
		val.update_name = name;

		Article.create(val, function(err, docs){
			if(err){
				res.status(888).send('Save article fail!');
			}else{
				var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
				socketio.sockets.emit('article.created', docs); // emit an event for all connected clients

				res.json(req.body);
			}
		});
	},
	listArticle: function(req, res){
		Article.find({})
		.sort({ 'update_date': -1 })
		.limit(100)
		.exec(function(err, docs){
			if(err){
				res.status(888).send('List article fail!');
			}else{
				/* // bluebird
				var chkUser = { id: [], name: [], surname: []};

				Promise.each(docs, function(data, key, length){
					if(chkUser.id[data.update_by] !== undefined){
						docs[key].update_name = chkUser.name[data.update_by] + ' ' + chkUser.surname[data.update_by];
					}else{
						return Users.findOneAsync({'_id': data.update_by})
				        .then(function(doc){
				        	// check select
				        	chkUser.id[data.update_by] = data.update_by;
				        	chkUser.name[data.update_by] = doc.name;
				        	chkUser.surname[data.update_by] = doc.surname;

				        	// set value
				            docs[key].update_name = doc.name + ' ' + doc.surname;
				        });
					}
				}).finally(function() {
			    	// console.log(docs);
			    	res.json(docs);
			    }); */

				res.json(docs);
			}
		});
	},
	dataArticle: function(req, res){
		Article.findById(req.body._id, function(err, article){
			if(err){
				res.status(888).send('Select article fail!');
			}else{
				res.json( article );
			}
		});
	},
	editArticle: function(req, res){

		var idUp = req.body._id;
		var name = req.user.name + ' '+ req.user.surname;
		var dateNow = new Date().getTime();
		var valUp = {
						title: req.body.title,
						content: req.body.content,
						update_by: req.user._id,
						update_name: name,
						update_date: dateNow
					};

		Article.findByIdAndUpdate(idUp, valUp, { new: true },
		function(err, docs){
			if (err){
				res.status(888).send('Edit article fail!');
		    }else{
		    	if(docs === null){
		    		res.status(888).send('Data could not be found!');
		    	}else{
		    		var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
					socketio.sockets.emit('article.show', docs); // emit an event for all connected clients

	                res.json( docs );
		    	}
		   	}
		});
	},
	delArticle: function(req, res){
		Article.remove({ _id: req.body._id }, function(err){
			if(err){
				res.status(888).send('Del article fail!');
			}else{
				var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
				socketio.sockets.emit('article.remove', req.body); // emit an event for all connected clients

				res.json( req.body );
			}
		});
	}
}

module.exports = self;