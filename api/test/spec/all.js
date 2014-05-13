describe('all', function(){

    it('should be ok', function(done){

        request.post('/api/user/register').send({
            email: '_' + (new Date()).getTime() + '@notipocket.com',
            password: 'abc'

        }).end(function(res){
            expect(res.body).to.have.property('status', 'ok');
            done();
        });

    });

});