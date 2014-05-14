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

    authenticateEmail: function(email, password) {
        var _this = this;
        return q().then(function() {
            return _this.findOne({
                email: email,
                password: password

            }).then(function(data) {
                if (!data) {
                    throw new Error('Invalid email and password');
                }
                return data;
            });
        });
    },

    register: function(email, password) {
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