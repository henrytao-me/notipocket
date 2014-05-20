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
                // get token
                Token._create(user.id).then(function(data) {
                    return res.json({
                        status: 'ok',
                        data: data
                    });
                });
            });
        })(req, res, next);
    },

    logout: function(req, res, next) {
        var userId = (req.user || {}).id;

        // logout session
        req.logout();

        // start clear token
        return q().then(function() {
            if (!userId) {
                throw new Error('User not found');
            }
            return userId;

        }).then(function(userId) {
            return Token._clearByUserId(userId);
        }).
        catch (function(err) {

        }).then(function(){
            return res.json({
                status: 'ok'
            });
        });
    },

    read: function(req, res, next) {
        return User._read(req.token.userId).then(function(data) {
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

    refreshToken: function(req, res, next) {
        return Token._create(req.user.id).then(function(data) {
            return res.json({
                status: 'ok',
                data: {
                    token: data.token
                }
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
        return User._register(req.body.email, req.body.password).then(function(data) {
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