var Base64 = require('js-base64').Base64;

var _this = {
    attributes: {
        userId: {
            type: 'string'
        },

        type: {
            type: 'string'
        },

        params: {
            type: 'json'
        },

        tabId: {
            type: 'string'
        },

        tabInfo: {
            type: 'json'
        }
    },

    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////

    _create: function(userId, type, params, tabId, tabInfo) {
        var _this = this;
        return q().then(function() {
            return _this.create({
                userId: userId,
                type: type,
                params: params || {},
                tabId: tabId,
                tabInfo: tabInfo || {}

            });
        });
    },

    _silentCreate: function(userId, options) {
        var _this = this;
        try {
            options = options.substring(1, options.length)
            options = JSON.parse(Base64.decode(options));
        } catch (ex) {
            return res.json({
                status: 'error'
            });
        }
        return _this._create(userId, options.type, options.params, options.tabId, options.tabInfo).then(function(data) {

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