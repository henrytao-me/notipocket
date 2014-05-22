////////////////////////////////////////////
// main
////////////////////////////////////////////
var Main = (function() {
    var _this = {

        resource: {
            template: chrome.extension.getURL('html/main.html'),
            logo: chrome.extension.getURL('image/notipocket.icon.full.png')
        },

        $template: null,
        $toolbar: {
            $star: null,
            $addTags: null,
            $saveTags: null,
            $viewList: null,
            $closeList: null
        },

        init: function() {
            return _this;
        },

        bindEvents: function() {
            _this.$toolbar.$star.click(function() {
                _this.saveLink();
            });
            _this.$toolbar.$addTags.click(function() {

            });
            _this.$toolbar.$saveTags.click(function() {

            });
            _this.$toolbar.$viewList.click(function() {

            });
            _this.$toolbar.$closeList.click(function() {

            });
        },

        createTemplate: function() {
            return $.get(_this.resource.template).then(function($template) {
                return $(_.template($template, {
                    logo: _this.resource.logo
                }));
            });
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

        show: function() {
            _this.createTemplate().then(function($template) {
                // push template to the view
                $('body').append($template);

                // store template & init event
                _this.$template = $template;
                _this.$toolbar.$star = _this.$template.find('.toolbar-star');
                _this.$toolbar.$addTags = _this.$template.find('.toolbar-addTags');
                _this.$toolbar.$saveTags = _this.$template.find('.toolbar-saveTags');
                _this.$toolbar.$viewList = _this.$template.find('.toolbar-viewList');
                _this.$toolbar.$closeList = _this.$template.find('.toolbar-closeList');

                _this.bindEvents();
            });
        }

    };
    return _this.init();
}());

////////////////////////////////////////////
// event
////////////////////////////////////////////
chrome.runtime.onMessage.addListener(function(req, sender, res) {
    // show event
    if (req.code === 'show') {
        // check $template
        if (Main.$template) {
            Main.hide();
            return res({
                code: 'hide'
            });
        } else {
            Main.show();
            return res({
                code: 'show'
            });
        }
    }

    // auth
    if (req.code === 'auth') {
        var url = req.data.url;
        var title = 'notipocket.com';
        var width = 420;
        var height = 560;

        window.open(url, title, 'width=' + width + ',height=' + height + ',left=' + ((window.outerWidth - width) / 2) + ',top=' + ((window.outerHeight - height) / 2) + '');
    }

    // getLink
    if (req.code === 'getLink') {
        console.log('-------------------', req);
    }
});