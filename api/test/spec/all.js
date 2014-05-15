var _this = {
    user: {
        email: '_' + (new Date()).getTime() + '@notipocket.com',
        password: '123',
        token: null
    },
    link: {},
    notification: {},

    expect: {
        link: function(data) {
            expect(data).to.have.property('id');
            expect(data).to.have.property('url');
            expect(data).to.have.property('title');
            expect(data).to.have.property('tags');
        },
        notification: function(data) {
            expect(data).to.have.property('id');
            expect(data).to.have.property('title');
            expect(data).to.have.property('desc');
            expect(data).to.have.property('type');
            expect(data).to.have.property('isRead');
            expect(data).to.have.property('link');
            _this.expect.link(data.link);
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

    it('should post     /api/link', function(done) {
        request.post('/api/link').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).send({
            url: 'http:/notipocket.com',
            title: 'notipock',
            tags: ['a', 'b']

        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            _this.expect.link(res.body.data);

            // store
            _this.link = res.body.data;
            done();
        });
    });

    it('should get      /api/link/:id', function(done) {
        request.get('/api/link/' + _this.link.id).set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            _this.expect.link(res.body.data);
            done();
        });
    });

    it('should put      /api/link/:id', function(done) {
        request.put('/api/link/' + _this.link.id).set({
            'Authorization': 'BEARER ' + _this.user.token
        }).send({
            url: 'http://blog.notipocket.com'
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            _this.expect.link(res.body.data);

            // store
            _this.link = res.body.data;
            done();
        });
    });

    it('should get      /api/links', function(done) {
        request.get('/api/links').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            _.each(res.body.data, function(data) {
                _this.expect.link(data);
            });
            done();
        });
    });

    it('should post     /api/notification', function(done) {
        request.post('/api/notification').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).send({
            linkId: _this.link.id,
            title: 'abc',
            desc: 'sample desc'
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            _this.expect.notification(res.body.data);

            // store
            _this.notification = res.body.data;
            done();
        });
    });

    it('should get      /api/notification/:id', function(done) {
        request.get('/api/notification/' + _this.notification.id).set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            _this.expect.notification(res.body.data);
            done();
        });
    });

    it('should put      /api/notification/:id/mark-as-read', function(done) {
        request.put('/api/notification/' + _this.notification.id + '/mark-as-read').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            done();
        });
    });

    it('should get      /api/notifications', function(done) {
        request.get('/api/notifications').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            _.each(res.body.data, function(data) {
                _this.expect.notification(data);
            });
            done();
        });
    });

    it('should put      /api/notification/:id/archive', function(done) {
        request.put('/api/notification/' + _this.notification.id + '/archive').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            done();
        });
    });

    it('should put      /api/notifications/mark-as-read', function(done) {
        request.put('/api/notifications/mark-as-read').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).send({
            ids: [_this.notification.id, '537462e0646d8dd40541eb27']
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            done();
        });
    });

    //////////////////////////////////////////
    //////////////////////////////////////////
    //////////////////////////////////////////

    it('should delete   /api/notification/:id', function(done) {
        request.del('/api/notification/' + _this.notification.id).set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            done();
        });
    });

    it('should delete   /api/link/:id', function(done) {
        request.del('/api/link/' + _this.link.id).set({
            'Authorization': 'BEARER ' + _this.user.token
        }).end(function(res) {
            expect(res.body).to.have.property('status', 'ok');
            done();
        });
    });

    it('should post     /api/activity', function(done) {
        request.post('/api/activity').set({
            'Authorization': 'BEARER ' + _this.user.token
        }).send({
            type: 'hello',
            params: {
                hello: 'moto'
            },
            tabId: 'moto',
            tabInfo: {
                moto: 'hello'
            }

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