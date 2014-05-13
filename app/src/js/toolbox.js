$(function() {
    ////////////////////////////////////////////////
    // define $$
    ////////////////////////////////////////////////
    var $$ = window.$$ = {};

    ////////////////////////////////////////////////
    // toolbox
    ////////////////////////////////////////////////
    $$.toolbox = (function() {
        var _this = {

            init: function() {
                return _this;
            },

            createTemplate: function(){
                var $template = $('<div class="watchlist-toolbox">hello moto</div>');
                return $template;
            },

            show: function() {
                $('body').append(_this.createTemplate());
                
            }

        };
        return _this.init();
    }());

    // $$.toolbox.show();


});