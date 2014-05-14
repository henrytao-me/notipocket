var _this = {

    attributes: {
        token: {
            type: 'STRING',
            required: true,
            unique: true
        },

        userId: {
            type: 'STRING',
            required: true
        },

        clientId: {
            type: 'STRING',
            // required: true
        },

        scope: {
            type: 'STRING'
        },

        status: {
            type: 'STRING',
            defaultsTo: 'active'
        }
    },

    check: function(token) {
        var _this = this;
        return _this.findOne({
            token: token,
            status: 'active'

        }).then(function(data) {
            if (!data) {
                throw new Error('Invalid token');
            }
            return data;
        });
    },

    clear: function(token) {
        var _this = this;
        return _this.update({
            token: token
        }, {
            status: 'deactive'
        });
    }

};

module.exports = _this;