var passport = require('passport');

// for keep session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User._read(id).then(function(data) {
        done(null, data);
    }).
    catch (function(err) {
        done(err, null);
    });
});

/*
 * LocalStrategy
 */
var LocalStrategy = require('passport-local').Strategy;
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