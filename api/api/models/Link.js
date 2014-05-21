var _this = {
    attributes: {
        userId: {
            type: 'string',
            required: true
        },

        url: {
            type: 'string',
            required: true,
            unique: true
        },

        title: {
            type: 'string'
        },

        tags: {
            type: 'array'
        },

        isActive: {
            type: 'boolean',
            defaultsTo: true
        },

        //Override toJSON method to remove password from API
        toJSON: function() {
            var obj = this.toObject();
            // Remove the password object value
            delete obj.userId;
            delete obj.isActive;
            // return the new object without password
            return obj;
        }
    },

    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////

    _create: function(userId, url, title, tags) {
        var _this = this;
        return q().then(function() {
            if (!url) {
                throw new Error('Missing url');
            }
            return _this.create({
                userId: userId,
                url: url,
                title: title,
                tags: tags
            });
        });
    },

    _delete: function(userId, id) {
        var _this = this;
        return q().then(function() {
            if (!id) {
                throw new Error('Missing id');
            }
            return _this.update({
                userId: userId,
                id: id
            }, {
                isActive: false
            }).then(function(data) {
                data = data[0];
                if (!data) {
                    throw new Error('Not found');
                }
                return data;
            });
        });
    },

    _findByUrl: function(userId, url){
        var _this = this;
        return q().then(function(){
            if(!url){
                throw new Error('Missing url');
            }
            return _this.findOne({
                userId: userId, 
                url: url
            }).then(function(data) {
                if (!data) {
                    throw new Error('Not found');
                }
                return data;
            });
        });
    },

    _read: function(userId, id) {
        var _this = this;
        return q().then(function() {
            if (!id) {
                throw new Error('Missing id');
            }
            return _this.findOne({
                userId: userId,
                id: id,
                isActive: true
            }).then(function(data) {
                if (!data) {
                    throw new Error('Not found');
                }
                return data;
            });
        });
    },

    _readAll: function(userId) {
        var _this = this;
        return q().then(function() {
            return _this.find({
                userId: userId
            })
        });
    },

    _update: function(userId, id, url, title, tags) {
        var _this = this;
        var newData = {};
        var args = arguments;
        _.each(['url', 'title', 'tags'], function(value, index) {
            if (args[index + 2] !== undefined) {
                newData[value] = args[index + 2];
            }
        });
        return q().then(function() {
            if (!id) {
                throw new Error('Missing id');
            }
            return _this.update({
                userId: userId,
                id: id
            }, newData).then(function(data) {
                data = data[0];
                if (!data) {
                    throw new Error('Not found');
                }
                return data;
            });
        });
    }

};

module.exports = _this;