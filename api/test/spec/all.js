var _this = {
    user: {
        email: '_' + (new Date()).getTime() + '@notipocket.com',
        password: '123',
        token: null
    },
    site: {},

    expect: {
        site: function(data) {
            expect(data).to.have.property('id');
            expect(data).to.have.property('url');
            expect(data).to.have.property('title');
            expect(data).to.have.property('tags');
        }
    }
};

//////////////////////////////////////////
// before login
//////////////////////////////////////////

describe('before login', function() {

    it('should post     /api/user/register', function(done) {
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

    it('should post     /api/user/authenticate/email', function(done) {
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

    it('should get      /api/user', function(done) {
        request.get('/api/user').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            done();
        });
    });

    it('should post     /api/site', function(done) {
        request.post('/api/site').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).send({
            url: 'http:/notipocket.com',
            title: 'notipock',
            tags: ['a', 'b']

        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            _this.expect.site(res.body.data);

            // store
            _this.site = res.body.data;
            done();
        });
    });

    it('should get      /api/site/:id', function(done) {
        request.get('/api/site/' + _this.site.id).set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            _this.expect.site(res.body.data);
            done();
        });
    });

    it('should put      /api/site/:id', function(done) {
        request.put('/api/site/' + _this.site.id).set({
            'Authorization': 'BEARER ' + _this.user.token
        }).send({
            url: 'http://blog.notipocket.com'
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            _this.expect.site(res.body.data);

            // store
            _this.site = res.body.data;
            done();
        });
    });

    it('should get      /api/sites', function(done) {
        request.get('/api/sites').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res){
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            _.each(res.body.data, function(data){
                _this.expect.site(data);
            });
            done();
        });
    });

    it('should delete   /api/site/:id', function(done) {
        request.del('/api/site/' + _this.site.id).set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            done();
        });
    });

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