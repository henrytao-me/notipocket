/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller
    if (req.isAuthenticated()) {
        return next();
    }
    return res.json({
        status: 'error',
        message: 'Unauthorized'
    }, 401);

    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)
    // return res.forbidden('You are not permitted to perform this action.');
};