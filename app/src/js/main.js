$(function() {
    ////////////////////////////////////////////////
    // define $$
    ////////////////////////////////////////////////
    var $$ = window.$$ = {};

    ////////////////////////////////////////////////
    // toolbox
    ////////////////////////////////////////////////
    $$.main = (function() {
        var _this = {

            config: null,

            init: function() {
                return _this;
            },

            createTemplate: function() {
                return $.get(_this.config.resource.template).then(function($template) {
                    return $(_.template($template, {
                        logo: _this.config.resource.logo
                    }));
                });
            },

            show: function(config) {
                _this.config = config;
                _this.createTemplate().then(function($template) {
                    $('body').append($template);
                });

            }

        };
        return _this.init();
    }());

    // $$.main.show();

});