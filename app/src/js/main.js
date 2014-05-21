$(function() {

    ////////////////////////////////////////////
    // define $$
    ////////////////////////////////////////////
    var $$ = window.$$ = {};

    ////////////////////////////////////////////
    // main
    ////////////////////////////////////////////
    $$.main = (function() {
        var _this = {

            resource: {
                template: chrome.extension.getURL('html/main.html'),
                logo: chrome.extension.getURL('image/notipocket.icon.full.png')
            },

            $template: null,

            init: function() {
                chrome.runtime.onMessage.addListener(function(req, sender, res) {
                    // show event
                    if (req.code === 'show') {
                        // check $template
                        if (_this.$template) {
                            _this.hide();
                            return res({
                                status: 'hide'
                            });
                        } else {
                            _this.show();
                            return res({
                                status: 'show'
                            });
                        }
                    }
                });
                return _this;
            },

            bindEvents: function() {
                _this.$template.find('.toolbar-star').click(function() {

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
                return $.get(_this.resource.template).then(function($template) {
                    return $(_.template($template, {
                        logo: _this.resource.logo
                    }));
                });
            },

            // handleError: function() {

            // },

            hide: function() {
                _this.$template.remove();
                _this.$template = null;
            },

            // saveLink: function() {
            //     return chrome.extension.sendMessage({
            //         hello: 'from main'
            //     }, function(response) {
            //         console.log('----------', arguments);
            //     });

            //     return $.ajax({
            //         type: 'POST',
            //         url: _this.getUrl('/api/link'),
            //         dataType: 'json',
            //         data: {
            //             url: _this.tab.url,
            //             title: _this.tab.title,
            //             tags: []
            //         }
            //     }).success(function(res) {
            //         console.log('aaaaaaaaa', arguments);
            //     }).error(function(err) {
            //         console.log('eeeeeeeee', arguments);
            //     });
            // },

            show: function() {
                _this.createTemplate().then(function($template) {
                    // push template to the view
                    $('body').append($template);

                    // store template & init event
                    _this.$template = $template;
                    _this.bindEvents();
                });

                // var url = _this.getUrl('/login');
                // var title = 'notipocket.com';
                // var width = 640;
                // var height = 550;

                // windowId = window.open(url, title, 'width=' + width + ',height=' + height + ',left=' + ((window.outerWidth - width) / 2) + ',top=' + ((window.outerHeight - height) / 2) + '');

                // return chrome.extension.sendMessage({
                //     hello: 'from main from content script'
                // }, function(response) {
                //     console.log('----------', arguments);
                // });

            }

        };
        return _this.init();
    }());

});