var _this = {

    archive: function(req, res, next) {
        return Notification._archive(req.token.userId, req.params.id).then(function(data) {
            return res.json({
                status: 'ok'
            });
        }).
        catch (function(err) {
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    },

    create: function(req, res, next) {
        return Notification._create(req.token.userId, req.body.linkId, req.body.title, req.body.desc, req.body.type).then(function(data) {
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
        return Notification._delete(req.token.userId, req.params.id).then(function(data) {
            return res.json({
                status: 'ok'
            });
        }).
        catch (function(err) {
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    },

    markAsRead: function(req, res, next) {
        return Notification._markAsRead(req.token.userId, req.params.id).then(function(data) {
            return res.json({
                status: 'ok'
            });
        }).
        catch (function(err) {
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    },

    markAsReadAll: function(req, res, next) {
        return Notification._markAsReadAll(req.token.userId, req.body.ids).then(function(data) {
            return res.json({
                status: 'ok'
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
        return Notification._read(req.token.userId, req.params.id).then(function(data) {
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
        return Notification._readAll(req.token.userId).then(function(data) {
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