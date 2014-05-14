var passport = require('passport');
var uuid = require('node-uuid');

var _this = {

    authenticateEmail: function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (!user) {
                return res.json({
                    status: 'error',
                    message: info.message || err.message
                });
            }

            // use passport to log in the user using a local method
            req.logIn(user, function(err) {
                if (err) {
                    return res.json({
                        status: 'error',
                        message: err.message
                    });
                }
                // get token
                Token.create({
                    token: uuid.v1(),
                    userId: user.id

                }).then(function(token) {
                    return res.json({
                        status: 'ok',
                        data: {
                            token: token.token
                        }
                    });
                });
            });
        })(req, res, next);
    },

    logout: function(req, res, next) {
        req.logout();
        Token.clear(req.token.token).then(function() {
            return res.json({
                status: 'ok'
            });
        }).
        catch (function(err) {
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    },

    read: function(req, res, next) {
        return User.read(req.token.userId).then(function(data) {
            return res.json({
                status: 'ok',
                data: data
            });
        }).
        catch (function(err) {
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    },

    register: function(req, res, next) {
        return User.register(req.body.email, req.body.password).then(function(data) {
            return res.json({
                status: 'ok'
            });

        }).
        catch (function(err) {
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to CommentController)
     */
    _config: {}

};

module.exports = _this;