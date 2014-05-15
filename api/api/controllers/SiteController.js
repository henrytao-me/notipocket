var _this = {

    create: function(req, res, next){
        Site._create(req.body.url, req.body.title, req.body.tags).then(function(data){
            return res.json({
                status: 'ok',
                data: data
            });
        }).catch(function(err){
            return res.json({
                status: 'error',
                message: err.message
            });
        });
    }

};

module.exports = _this;