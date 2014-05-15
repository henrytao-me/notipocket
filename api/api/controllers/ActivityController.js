var _this = {

    create: function(req, res, next) {
        return Activity._create((req.token || {}).userId, req.body.type, req.body.params, req.body.tabId, req.body.tabInfo).then(function(data) {

        }).
        catch (function(err) {

        }).then(function() {
            return res.json({
                status: 'ok'
            });
        });
    }

};

module.exports = _this;