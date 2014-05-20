$(function() {
    ////////////////////////////////////////////////
    // define $$
    ////////////////////////////////////////////////
    var $$ = window.$$ = {};

    // setInterval(function(){
    //     console.log('---', $.cookie('sample'));
    // }, 1000);

    ////////////////////////////////////////////////
    // toolbox
    ////////////////////////////////////////////////
    $$.main = (function() {
        var _this = {

            config: null,
            tab: null,
            $template: null,

            getUrl: function(url) {
                return _this.config.env.protocol + _this.config.env.host + (_this.config.env.port === 80 ? '' : ':' + _this.config.env.port) + url;
            },

            init: function() {
                return _this;
            },

            bindEvents: function() {
                _this.$template.find('.toolbar-star').click(function() {
                    _this.saveLink();
                });
                _this.$template.find('.toolbar-addTags').click(function() {

                });
                _this.$template.find('.toolbar-saveTags').click(function() {

                });
                _this.$template.find('.toolbar-viewList').click(function() {

                });
                _this.$template.find('.toolbar-closeList').click(function() {

                });
            },

            createTemplate: function() {
                return $.get(_this.config.resource.template).then(function($template) {
                    return $(_.template($template, {
                        logo: _this.config.resource.logo
                    }));
                });
            },

            handleError: function() {

            },

            hide: function() {
                _this.$template.remove();
                _this.$template = null;
            },

            saveLink: function() {
                return chrome.extension.sendMessage({
                    hello: 'from main'
                }, function(response) {
                    console.log('----------', arguments);
                });

                return $.ajax({
                    type: 'POST',
                    url: _this.getUrl('/api/link'),
                    dataType: 'json',
                    data: {
                        url: _this.tab.url,
                        title: _this.tab.title,
                        tags: []
                    }
                }).success(function(res) {
                    console.log('aaaaaaaaa', arguments);
                }).error(function(err) {
                    console.log('eeeeeeeee', arguments);
                });
            },

            show: function(config, tab) {
                if (_this.$template) {
                    return _this.hide();
                }

                _this.config = config;
                
                // _this.tab = tab;
                // _this.createTemplate().then(function($template) {
                //     // push template to the view
                //     $('body').append($template);

                //     // store template & init event
                //     _this.$template = $template;
                //     _this.bindEvents();
                // });

                var url = _this.getUrl('/login');
                var title = 'notipocket.com';
                var width = 640;
                var height = 550;

                windowId = window.open(url, title, 'width=' + width + ',height=' + height + ',left=' + ((window.outerWidth - width) / 2) + ',top=' + ((window.outerHeight - height) / 2) + '');
                
            }

        };
        return _this.init();
    }());

    // $$.main.show();

});

var hello = function(){
    alert('hello neeeeee');
}