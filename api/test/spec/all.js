var _this = {
    user: {
        email: '_' + (new Date()).getTime() + '@notipocket.com',
        password: '123',
        token: null
    }
};

//////////////////////////////////////////
// before login
//////////////////////////////////////////

describe('before login', function() {

    it('should post /api/user/register', function(done) {
        request.post('/api/user/register').send({
            email: _this.user.email,
            password: _this.user.password

        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            done();
        });
    });

});

//////////////////////////////////////////
// login
//////////////////////////////////////////

describe('login', function() {

    it('should post /api/user/authenticate/email', function(done) {
        request.post('/api/user/authenticate/email').send({
            email: _this.user.email,
            password: _this.user.password

        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('token');

            // store
            _this.user.token = res.body.data.token;
            done();
        });
    });

});

//////////////////////////////////////////
// after login
//////////////////////////////////////////

describe('after login', function() {

    it('should get /api/user', function(done) {
        request.get('/api/user').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            done();
        });
    });

    // it('should get /api/user/refresh-token', function(done) {
    //     request.get('/api/user/refresh-token').end(function(res) {
    //         expect(res.body).to.have.property('status', 'ok');
    //         expect(res.body).to.have.property('data');
    //         expect(res.body.data).to.have.property('token');

    //         // store
    //         _this.user.token = res.body.data.token;
    //         done();
    //     });
    // });

});

//////////////////////////////////////////
// logout
//////////////////////////////////////////

describe('logout', function() {

    // it('should get /api/user/logout', function(done) {
    //     request.get('/api/user/logout').set({
    //         'Authorization': 'BEARER ' + _this.user.token
    //     }).end(function(res) {
    //         expect(res.body).to.have.property('status', 'ok');
    //         done();
    //     });
    // });

});

//////////////////////////////////////////
// after logout
//////////////////////////////////////////

describe('after logout', function() {


});