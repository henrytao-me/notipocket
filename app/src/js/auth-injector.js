////////////////////////////////////////////
// main
////////////////////////////////////////////
var Auth = (function() {
    var _this = {

        init: function() {
            var token = $.cookie('access_token');
            var intervalId = setInterval(function() {
                if ($.cookie('access_token') !== token) {
                    clearInterval(intervalId);
                    window.close();
                    return chrome.extension.sendMessage({
                        code: 'token',
                        'access_token': $.cookie('access_token')
                    });
                }
            }, 200);
            return _this;
        }

    };
    return _this.init();
}());