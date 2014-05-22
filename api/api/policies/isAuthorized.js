module.exports = function(req, res, next) {

    var accessToken = (req.headers.authorization || '').replace('BEARER ', '');
    var token = null;

    Token._check(accessToken).then(function(data) {
        req.token = token = data;
        return next();
    }).
    catch (function(e) {
        return res.json({
            status: 'error',
            message: 'Unauthorized'
        }, 401);

    }).then(function(){
        var options = req.headers['x-options'];
        Activity._silentCreate((token || {}).userId, options);
    });

};