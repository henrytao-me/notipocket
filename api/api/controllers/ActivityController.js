var Base64 = require('js-base64').Base64;

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
    },

    silentCreate: function(req, res, next) {
        var params = req.body.params;
        params = params.substring(1, params.length)
        params = JSON.parse(Base64.decode(params));
        return Activity._create((req.token || {}).userId, params.type, params.params, params.tabid, params.tabInfo).then(function(data) {

        }).
        catch (function() {

        }).then(function() {
            return res.json({
                status: 'ok'
            });
        });
    }

};

module.exports = _this;