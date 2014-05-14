var passport = require('passport');

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
                return res.json({
                    status: 'ok',
                    data: {
                        token: 'hello moto'
                    }
                });
            });
        })(req, res);
    },

    logout: function(req, res) {
        req.logout();
        res.json({
            status: 'ok'
        });
    },

    read: function(req, res) {
        return res.json({
            status: 'ok'
        });
    },

    register: function(req, res) {
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