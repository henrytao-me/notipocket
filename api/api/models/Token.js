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

        type: {
            type: 'string',
            defaultsTo: 'web'
        },

        isActive: {
            type: 'boolean',
            defaultsTo: true
        },

        //Override toJSON method to remove password from API
        toJSON: function() {
            var obj = this.toObject();
            // Remove the password object value
            delete obj.isActive;
            // return the new object without password
            return obj;
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

    _clearByUserId: function(userId, type){
        type = type || 'web';
        var _this = this;
        q().then(function(){
            if(!userId){
                throw new Error('User not found');
            }
        }).then(function(){
            return _this.update({
                userId: userId,
                type: type 
            }, {
                isActive: false
            });
        });
    },

    _create: function(userId) {
        var _this = this;
        return _this.create({
            token: uuid.v4(),
            userId: userId
        });
    }

};

module.exports = _this;