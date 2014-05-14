var _this = {
    attributes: {
        email: 'STRING',
        password: 'STRING'
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