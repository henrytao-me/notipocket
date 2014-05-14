module.exports = function(req, res, next) {

    var token = (req.headers.authorization || '').replace('BEARER ', '');
    Token.check(token).then(function(token) {
        req.token = token;
        return next();
    }).
    catch (function(e) {
        return res.json({
            status: 'error',
            message: 'Unauthorized'
        }, 401);
    });

};