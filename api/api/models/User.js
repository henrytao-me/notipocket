var bcrypt = require('bcrypt');

var _this = {
    attributes: {
        email: {
            type: 'string',
            required: true,
            unique: true
        },

        password: {
            type: 'string',
            required: true
        },

        //Override toJSON method to remove password from API
        toJSON: function() {
            var obj = this.toObject();
            // Remove the password object value
            delete obj.password;
            // return the new object without password
            return obj;
        }
    },

    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////

    beforeCreate: function(user, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    cb(err);
                } else {
                    user.password = hash;
                    cb(null, user);
                }
            });
        });
    },

    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////

    _authenticateEmail: function(email, password) {
        var _this = this;
        return q().then(function() {
            return _this.findOne({
                email: email
            });

        }).then(function(data) {
            if (!data) {
                throw new Error('Invalid email and password');
            }
            return data;

        }).then(function(data) {
            // compare password
            if (!bcrypt.compareSync(password, data.password)) {
                throw new Error('Invalid email and password');
            }
            return data;
        });
    },

    _read: function(id) {
        var _this = this;
        return q().then(function() {
            if (!id) {
                throw new Error('Missing id');
            }
            return _this.findOne({
                id: id
            }).then(function(data) {
                if (!data) {
                    throw new Error('Not found');
                }
                return data;
            });
        });
    },

    _register: function(email, password) {
        var _this = this;
        return q().then(function() {
            if (!email || !password) {
                throw new Error('Missing email or password');
            }
            return _this.create({
                email: email,
                password: password
            });
        });
    }

};

module.exports = _this;