var _this = {
    attributes: {
        email: 'STRING',
        password: 'STRING'
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