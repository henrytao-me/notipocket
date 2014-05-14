module.exports = function(req, res, next) {
    
    if (req.isAuthenticated()) {
        return next();
    }
    return res.json({
        status: 'error',
        message: 'Forbidden'
    }, 403);

    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)
    // return res.forbidden('You are not permitted to perform this action.');
};