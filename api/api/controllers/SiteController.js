var _this = {

    create: function(req, res, next) {
        return Site._create(req.token.userId, req.body.url, req.body.title, req.body.tags).then(function(data) {
            return res.json({
                status: 'ok',
                data: data
            });
        }).
        catch (function(err) {
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    },

    'delete': function(req, res, next) {
        return Site._delete(req.token.userId, req.params.id).then(function(data) {
            return res.json({
                status: 'ok',
                data: data
            });
        }).
        catch (function(err) {
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    },

    read: function(req, res, next) {
        return Site._read(req.token.userId, req.params.id).then(function(data) {
            return res.json({
                status: 'ok',
                data: data
            });
        }).
        catch (function(err) {
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    },

    readAll: function(req, res, next) {
        return Site._readAll(req.token.userId).then(function(data) {
            return res.json({
                status: 'ok',
                data: data
            });
        }).
        catch (function(err) {
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    },

    update: function(req, res, next) {
        return Site._update(req.token.userId, req.params.id, req.body.url, req.body.title, req.body.tags).then(function(data) {
            return res.json({
                status: 'ok',
                data: data
            });
        }).
        catch (function(err) {
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    }

};

module.exports = _this;