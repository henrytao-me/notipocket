var _this = {
    attributes: {
        userId: {
            type: 'string',
            required: true
        },

        linkId: {
            type: 'string',
            required: true
        },

        title: {
            type: 'string',
            required: true
        },

        desc: {
            type: 'string'
        },

        type: {
            type: 'string',
            defaultsTo: 'def'
        },

        isRead: {
            type: 'boolean',
            defaultsTo: false
        },

        isArchive: {
            type: 'boolean',
            defaultsTo: false
        },

        isActive: {
            type: 'boolean',
            defaultsTo: true
        },

        link: function() {
            var _this = this;
            return q().then(function() {
                return Link._read(_this.userId, _this.linkId);
            });
        },

        //Override toJSON method to remove password from API
        toJSON: function() {
            var obj = this.toObject();
            // Remove the password object value
            delete obj.userId;
            delete obj.linkId;
            delete obj.isActive;
            // return the new object without password
            return obj;
        }
    },

    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////

    _archive: function(userId, id) {
        var _this = this;
        return q().then(function() {
            if (!id) {
                throw new Error('Missing id');
            }
            return _this.update({
                userId: userId,
                id: id
            }, {
                isArchive: true
            }).then(function(data) {
                data = data[0];
                if (!data) {
                    throw new Error('Not found');
                }
                return data;
            });
        });
    },

    _create: function(userId, linkId, title, desc, type) {
        var _this = this;
        return q().then(function() {
            if (!linkId) {
                throw new Error('Missing link');
            }
            if (!title) {
                throw new Error('Missing title');
            }
            return _this.create({
                userId: userId,
                linkId: linkId,
                title: title,
                desc: desc,
                type: type

            }).then(function(data) {
                return data.link().then(function(link) {
                    data.link = link;
                    return data;
                });
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

    _markAsRead: function(userId, id) {
        var _this = this;
        return q().then(function() {
            if (!id) {
                throw new Error('Missing id');
            }
            return _this.update({
                userId: userId,
                id: id
            }, {
                isRead: true
            }).then(function(data) {
                data = data[0];
                if (!data) {
                    throw new Error('Not found');
                }
                return data;
            });
        });
    },

    _markAsReadAll: function(userId, ids){
        var _this = this;
        return q().then(function(){
            if(!ids || ids.length === 0){
                throw new Error('Missing ids');
            }
            return _this.update({
                id: ids
            }, {
                isRead: true
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
                isActive: true,
                isArchive: false

            }).then(function(data) {
                if (!data) {
                    throw new Error('Not found');
                }
                return data.link().then(function(link) {
                    data.link = link;
                    return data;
                });
            });
        });
    },

    _readAll: function(userId) {
        var _this = this;
        return q().then(function() {
            return _this.find({
                userId: userId,
                isActive: true

            }).then(function(notifications) {
                var deferred = q.defer();
                var max = notifications.length - 1;
                _.each(notifications, function(data, index) {
                    data.link().then(function(link) {
                        data.link = link;
                    }).
                    catch (function(err) {
                        deferred.reject(err);

                    }).then(function() {
                        if (index === max) {
                            deferred.resolve(notifications);
                        }
                    });
                });
                return deferred.promise;
            });
        });
    }









    // _update: function(userId, id, url, title, tags) {
    //     var _this = this;
    //     var newData = {};
    //     var args = arguments;
    //     _.each(['url', 'title', 'tags'], function(value, index) {
    //         if (args[index + 2] !== undefined) {
    //             newData[value] = args[index + 2];
    //         }
    //     });
    //     return q().then(function() {
    //         if (!id) {
    //             throw new Error('Missing id');
    //         }
    //         return _this.update({
    //             userId: userId,
    //             id: id
    //         }, newData).then(function(data) {
    //             data = data[0];
    //             if (!data) {
    //                 throw new Error('Not found');
    //             }
    //             return data;
    //         });
    //     });
    // }

};

module.exports = _this;