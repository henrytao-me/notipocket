var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// for keep session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'

}, function(email, password, done) {
    return User.authenticateEmail(email, password).then(function(data) {
        return done(null, data);
    }).
    catch (function(err) {
        return done(null, false, {
            message: err.message
        });
    });
}));