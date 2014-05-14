var expect = GLOBAL.expect = require('expect.js');
var request = GLOBAL.request = require('superagent');
var _ = GLOBAL._ = require('underscore');

var _this = {
    api: {
        host: 'http://localhost',
        port: 1111
    },
    method: {
        head: request.head,
        get: request.get,
        put: request.put,
        post: request.post,
        del: request.del,
    }
};

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

request.url = function(url) {
    if (url.indexOf('http') !== 0) {
        url = _this.api.host + ':' + _this.api.port + url;
    }
    return url;
};
request.uri = request.url;

_.each(['head', 'get', 'put', 'post', 'del'], function(method) {
    request[method] = function(url) {
        arguments[0] = request.url(url);
        return _this.method[method].apply(request, arguments);
    };
});


////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
describe('config', function() {

    it('should init', function(done) {
        process.env.PORT = _this.api.port;
        process.env.LOG = 'error';

        require('sails').lift(require('optimist').argv, function() {
            done();
        });

        // disable timeout
        this.timeout(0);
    });

});