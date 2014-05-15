var uuid = require('node-uuid');

var _this = {

    attributes: {
        token: {
            type: 'string',
            required: true,
            unique: true
        },

        userId: {
            type: 'string',
            required: true
        },

        clientId: {
            type: 'string',
            // required: true
        },

        scope: {
            type: 'string'
        },

        isActive: {
            type: 'boolean',
            defaultsTo: true
        }
    },

    _check: function(token) {
        var _this = this;
        return _this.findOne({
            token: token,
            isActive: true

        }).then(function(data) {
            if (!data) {
                throw new Error('Invalid token');
            }
            return data;
        });
    },

    _clear: function(token) {
        var _this = this;
        return _this.update({
            token: token
        }, {
            isActive: false
        });
    },

    _create: function(userId) {
        var _this = this;
        return _this.create({
            token: uuid.v1(),
            userId: userId
        });
    }

};

module.exports = _this;