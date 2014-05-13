var _this = {

    register: function(req, res) {
        return User.register(req.body.email, req.body.password).then(function(data) {
            return res.json({
                status: 'ok'
            });

        }).catch(function(e){
            return res.json({
                status: 'error',
                message: e.message
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