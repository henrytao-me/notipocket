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
    }

};

module.exports = _this;