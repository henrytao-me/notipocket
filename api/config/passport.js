var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

// for keep session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User._findById(id, function(err, user) {
        done(err, user);
    });
});

/*
 * LocalStrategy
 */
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'

}, function(email, password, done) {
    return User._authenticateEmail(email, password).then(function(data) {
        return done(null, data);
    }).
    catch (function(err) {
        return done(null, false, {
            message: err.message
        });
    });
}));

/*
 * Export middleware
 */
module.exports = {
    express: {
        customMiddleware: function(app) {
            app.use(passport.initialize());
            app.use(passport.session());
        }
    }
};