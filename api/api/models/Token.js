var uuid = require('node-uuid');

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

        active: {
            type: 'boolean',
            defaultsTo: true
        }
    },

    _check: function(token) {
        var _this = this;
        return _this.findOne({
            token: token,
            active: true

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
            active: false
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