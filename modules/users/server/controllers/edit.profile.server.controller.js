'use strict';

var User = require('../models/users.server.model'),
    Article = require('../../../articles/server/models/article.server.model'),
	fs = require('fs-extra'),
	path = require('path');

// bluebird
var Promise = require('bluebird');
var Article = Promise.promisifyAll(Article);

var updateCreateNameArticle = function(data){
    return Article.update({ create_by: data._id }, { $set : { create_name: data.name+' '+data.surname }}, { multi: true });
};

var updateUpdateNameArticle = function(data){
    return Article.update({ update_by: data._id }, { $set : { update_name: data.name+' '+data.surname }}, { multi: true });
};

module.exports.editProfileImage = function(req, res){

    // console.log(req.files.file);
    // console.log(req.body);

	var file = req.files.file;
    var userId = req.body._id;
    
    // console.log("User " + userId + " is submitting " , file);
    var uploadDate = new Date().getTime();
    
    // console.log(uploadDate);

    var tempPath = file.path;
    var targetPath = path.join( __dirname, '../../uploads/' + userId + '.jpg'  );
    var savePath = "/users/uploads/" + userId + '.jpg';

    var is = fs.createReadStream(tempPath);
    var os = fs.createWriteStream(targetPath);

    is.pipe(os);
    // is.on('end',function() {
    //     fs.unlinkSync(tempPath);
    // });

    fs.rename(tempPath, targetPath, function(err){
    	// if(err){
    	// 	console.log(err);
    	// }else{
    		User.findByIdAndUpdate(userId, { image: savePath, name: req.body.name, surname: req.body.surname }, { new: true },
			function(err, docs){
				if (err){
					res.status(888).send('Edit profile fail!');
			    }else{
			    	// delete old image
                    // fs.remove( '../..' + docs.image, function (err) {
					//   if (err) return console.error(err)
					//   console.log('remove success!')
					// });

                    // update create_name articles
                    updateCreateNameArticle(docs)
                    .then(function(create){
                        // update update_name articles
                        updateUpdateNameArticle(docs)
                        .then(function(update){
                            console.log(update);
                        });
                    });

                    res.json({ _id: userId, email: docs.email, image: savePath, name: docs.name, surname: docs.surname });
			   	}
			});
    	// }
    });
};

module.exports.editProfile = function(req, res){
    var userId = req.body._id;

    User.findByIdAndUpdate(userId, { name: req.body.name, surname: req.body.surname }, { new: true },
    function(err, docs){
        if (err){
            res.status(888).send('Edit profile fail!');
        }else{

            // update create_name articles
            updateCreateNameArticle(docs)
            .then(function(create){
                // update update_name articles
                updateUpdateNameArticle(docs)
                .then(function(update){
                    console.log(update);
                });
            });

            res.json({ _id: userId, email: docs.email, image: docs.image, name: docs.name, surname: docs.surname });
        }
    });
};