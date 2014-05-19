var passport = require('passport');
var request = require('superagent');

var _this = {

    google: function(req, res, next) {
        var reqToken = req.body['id_token'];
        return request.get('https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=' + reqToken).end(function(data) {
            // invalid token
            if (data.body.error) {
                return res.json({
                    status: 'error',
                    message: 'invalid token'
                });
            }

            // user info
            var email = data.body.email;

            // check user exists or not, if not create new account
            passport.authenticate('local', function(err, user, info) {
                User._findByEmail(email).then(function(data) {
                    return data;
                }).
                catch (function(err) {
                    return User._register(email, reqToken);

                }).then(function(user) {
                    var deferred = q.defer();
                    req.logIn(user, function(err) {
                        if (err) {
                            deferred.reject(err.message);
                        }
                        // get token
                        Token._create(user.id).then(function(data) {
                            deferred.resolve(data);
                        }).
                        catch (function(err) {
                            return deferred.reject(err.message);
                        });
                    });
                    return deferred.promise;

                }).then(function(token) {
                    return res.json({
                        status: 'ok',
                        data: token
                    });
                }).
                catch (function(err) {
                    return res.json({
                        status: 'error',
                        message: err.message
                    });
                });
            })(req, res, next);
        });
    }

};
module.exports = _this;