var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

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

            console.log('aaaaaaeeeeeeeeeeeeeeeeeee');
            app.all('/*', function(req, res, next) {
                console.log('aaaaaaaaaaaa');
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', '*');
                res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
                return next();
            });

            app.use(passport.initialize());
            app.use(passport.session());


        }
    }
};