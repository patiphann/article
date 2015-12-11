'use strict';

module.exports = function (app, passport, multipartMiddleware, ArticleController, EditProfileController) {
    // index
    app.get('/',function(req, res){
        res.render('./modules/core/client/views/index.client.view.html');
    });

    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect : '/', // redirect to the secure profile section
    //     failureRedirect : '/', // redirect back to the signup page if there is an error
    //     failureFlash : true // allow flash messages
    // }));

    // signup
	app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) { return next(err); }
            // if (!user) { return res.redirect('/signup'); }
            var msgError = '';
            var reqFlash = req.flash('signupMessage');

            if(reqFlash.length > 0){
                for(var key in reqFlash){
                    msgError += reqFlash[key]+'\n';
                }

                return res.status(888).json(msgError);
            }else if(user._id === undefined){
            	return res.status(888).send('Error save!');
            }else{
            	req.logIn(user, function(err) {
	                if (err) {
	                	return res.status(888).send('Signup fail!');
	                }else{
	                	return res.json({
                            _id: user._id,
                            email: user.email,
                            image: user.image,
                            name: user.name,
                            surname: user.surname,
                            create_date: user.create_date
                        });
	                }
	            });
            }            
        })(req, res, next);
    });

    // login
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err); }
            // if (!user) { return res.redirect('/signup'); }
            var msgError = '';
            var reqFlash = req.flash('loginMessage');

            if(reqFlash.length > 0){
                for(var key in reqFlash){
                    msgError += reqFlash[key]+'\n';
                }

                return res.status(888).json(msgError);
            }

            req.logIn(user, function(err) {
                // if (err) { return next(err); }
                if (err) {
                	return res.status(888).send('Login fail!');
                	// return res.json({ message: 'Login fail' });
                }else{
                	return res.json({
                        _id: user._id,
                        email: user.email,
                        image: user.image,
                        name: user.name,
                        surname: user.surname,
                        create_date: user.create_date
                    });
                }
            });
        })(req, res, next);
    });

    // logout
    app.get('/logout', function(req, res){
    	req.logout();
    	res.json({ status: 'success' });
    });

    // edit profile no image change
    app.post('/edit-profile', multipartMiddleware, EditProfileController.editProfile);

    // edit profile image change
    app.post('/edit-profile-img', multipartMiddleware, EditProfileController.editProfileImage);

    // save article
    app.post('/save-article', isLoggedIn, ArticleController.saveArticle);

    // list article
    app.post('/list-article', ArticleController.listArticle);

    // select article
    app.post('/data-article', ArticleController.dataArticle);

    // edit article
    app.post('/edit-article', isLoggedIn, ArticleController.editArticle);

    // delete article
    app.post('/del-article', isLoggedIn, ArticleController.delArticle);

    // check login
    app.get('/check-auth', function(req, res){
    	var val = {};

    	if(req.user !== undefined){
    		val = {
                _id: req.user._id,
                email: req.user.email,
                image: req.user.image,
                name: req.user.name,
                surname: req.user.surname,
                create_date: req.user.create_date
            };
    	}

    	res.json(val);
    	// res.json(req.user);
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // res.redirect('/');
    // res.json({ status: 'fail-login' });
	res.status(888).send('Please Login!');
}