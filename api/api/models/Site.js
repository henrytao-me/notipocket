var _this = {
    attributes: {
        url: {
            type: 'string',
            required: true
        },

        title: {
            type: 'string'
        },

        tags: {
            type: 'array'
        },

        active: {
            type: 'boolean'
        }
    },

    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////

    _create: function(url, title, tags){
        var _this = this;
        return q().then(function(){
            if(!url){
                throw new Error('Missing URL');
            }
            return _this.create({
                url: url,
                title: title,
                tags: tags
            });
        });
    }

};

module.exports = _this;