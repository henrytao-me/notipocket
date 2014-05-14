var _this = {
    user: {
        email: '_' + (new Date()).getTime() + '@notipocket.com',
        password: '123'
    }
};

describe('all', function() {

    it('should post /api/user/register', function(done) {
        request.post('/api/user/register').send({
            email: _this.user.email,
            password: _this.user.password

        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            done();
        });
    });

    it('should post /api/user/authenticate/email', function(done) {
        request.post('/api/user/authenticate/email').send({
            email: _this.user.email,
            password: _this.user.password

        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('token');
            done();
        });
    });

});