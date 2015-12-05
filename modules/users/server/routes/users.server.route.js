'use strict';

module.exports = function (app, passport) {
    // app.get('/signup', function(req, res){
    //     res.sendfile('./modules/core/client/views/index.client.view.html');
    // });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect : '/', // redirect to the secure profile section
    //     failureRedirect : '/signup', // redirect back to the signup page if there is an error
    //     failureFlash : true // allow flash messages
    // }), function(req, res){
    //     console.log(req);
    //     console.log(res);
    //     res.json('success');
    // });
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err); }
            // if (!user) { return res.redirect('/signup'); }

            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.json({ _id: user._id, email: user.email });
            });
        })(req, res, next);
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}