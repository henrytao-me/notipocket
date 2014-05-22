////////////////////////////////////////////
// main
////////////////////////////////////////////
var Main = (function() {
    var _this = {

        resource: {
            template: chrome.extension.getURL('html/main.html'),
            logo: chrome.extension.getURL('image/notipocket.icon.full.png'),
            wait: chrome.extension.getURL('image/wait_icon.gif')
        },

        $template: null,
        $header: null,
        $notification: {
            id: null,
            $removed: null,
            $saved: null,
            $wait: null,
            showRemoved: function() {
                _this.$notification.$removed.show();
                _this.$notification.$saved.hide();
                _this.$notification.$wait.hide();
                clearTimeout(_this.$notification.id);
                _this.$notification.id = setTimeout(function() {
                    _this.$notification.$removed.hide();
                }, 3000);
            },
            showSaved: function() {
                _this.$notification.$removed.hide();
                _this.$notification.$saved.show();
                _this.$notification.$wait.hide();
                clearTimeout(_this.$notification.id);
                _this.$notification.id = setTimeout(function() {
                    _this.$notification.$saved.hide();
                }, 3000);
            },
            showWait: function() {
                _this.$notification.$removed.hide();
                _this.$notification.$saved.hide();
                _this.$notification.$wait.show();
                clearTimeout(_this.$notification.id);
                _this.$notification.id = null;
            }
        },
        $toolbar: {
            $star: null,
            $tags: null,
            $addTags: null,
            $saveTags: null,
            $viewList: null,
            $closeList: null
        },

        init: function() {
            return _this;
        },

        bindEvents: function() {
            _this.$template.click(function(e){
                _this.hide();
            });
            _this.$header.click(function(e){
                e.stopPropagation();
            });

            _this.$toolbar.$star.click(function() {
                _this.saveLink();
            });
            _this.$toolbar.$addTags.click(function() {
                _this.$toolbar.$tags.show();
                _this.$toolbar.$addTags.hide();
                _this.$toolbar.$saveTags.show();
            });
            _this.$toolbar.$tags.bind('keypress', function(e) {
                var code = e.keyCode || e.which;
                if (code == 13) { //Enter keycode
                    _this.$toolbar.$saveTags.trigger('click');
                }
            });
            _this.$toolbar.$saveTags.click(function() {
                _this.$toolbar.$tags.hide();
                _this.$toolbar.$addTags.show();
                _this.$toolbar.$saveTags.hide();
                _this.saveTags();
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
            _this.$notification.showWait();

            var isActive = !_this.$toolbar.$star.hasClass('active');
            if (isActive === true) {
                _this.$toolbar.$star.addClass('active');
            } else {
                _this.$toolbar.$star.removeClass('active');
            }

            return chrome.extension.sendMessage({
                code: 'saveLink',
                data: {
                    isActive: isActive,
                    url: window.location.href,
                    title: document.title
                }
            });
        },

        saveTags: function() {
            _this.$notification.showWait();
            return chrome.extension.sendMessage({
                code: 'saveLink',
                data: {
                    isActive: true,
                    url: window.location.href,
                    title: document.title,
                    tags: _this.$toolbar.$tags.val()
                }
            });
        },

        show: function() {
            _this.createTemplate().then(function($template) {
                // push template to the view
                $('body').append($template);

                // store template & init event
                _this.$template = $template;
                _this.$header = _this.$template.find('.main-header');

                _this.$toolbar.$star = _this.$template.find('.toolbar-star');
                _this.$toolbar.$tags = _this.$template.find('.toolbar-tags');
                _this.$toolbar.$addTags = _this.$template.find('.toolbar-addTags');
                _this.$toolbar.$saveTags = _this.$template.find('.toolbar-saveTags');
                _this.$toolbar.$viewList = _this.$template.find('.toolbar-viewList');
                _this.$toolbar.$closeList = _this.$template.find('.toolbar-closeList');

                _this.$notification.$removed = _this.$template.find('.notification > .removed');
                _this.$notification.$saved = _this.$template.find('.notification > .saved');
                _this.$notification.$wait = _this.$template.find('.notification > .wait');
                _this.$notification.$wait.attr('src', _this.resource.wait);

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
        if (!req.data) {
            Main.$toolbar.$star.removeClass('active');
            Main.$toolbar.$tags.val('');

            // default save link
            Main.saveLink();
        } else {
            Main.$toolbar.$star.addClass('active');
            Main.$toolbar.$tags.val(req.data.tags.join(', '));
        }
    }

    // saveLink
    if (req.code === 'saveLink') {
        if (!req.data) {
            Main.$toolbar.$star.removeClass('active');
            Main.$toolbar.$tags.val('');
            Main.$notification.showRemoved();
        } else {
            Main.$toolbar.$star.addClass('active');
            Main.$toolbar.$tags.val(req.data.tags.join(', '));
            Main.$notification.showSaved();
        }
    }
});