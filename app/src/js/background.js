$(function() {

    var _this = {
        config: {
            url: 'http://127.0.0.1:1337',
            resource: {
                template: chrome.extension.getURL('html/main.html'),
                logo: chrome.extension.getURL('image/notipocket.icon.full.png')
            }
        },
        url: {
            get: function(url) {
                return _this.config.url + url;
            }
        }
    };

    chrome.tabs.onUpdated.addListener(function(tabId, params, tabInfo) {
        $.ajax({
            type: 'PUT',
            url: _this.url.get('/api/notification/check'),
            dataType: 'json',
            data: {
                params: 'p' + Base64.encode(JSON.stringify({
                    type: 'update',
                    params: params,
                    tabId: tabId,
                    tabInfo: tabInfo
                }))
            }
        });
    });

    chrome.tabs.onRemoved.addListener(function(tabId, params) {
        $.ajax({
            type: 'PUT',
            url: _this.url.get('/api/notification/check'),
            dataType: 'json',
            data: {
                params: 'p' + Base64.encode(JSON.stringify({
                    type: 'remove',
                    params: params,
                    tabId: tabId
                }))
            }
        });
    });

    chrome.tabs.onSelectionChanged.addListener(function(tabId, params) {
        $.ajax({
            type: 'PUT',
            url: _this.url.get('/api/notification/check'),
            dataType: 'json',
            data: {
                params: 'p' + Base64.encode(JSON.stringify({
                    type: 'selection',
                    params: params,
                    tabId: tabId
                }))
            }
        });
    });

    $.cookie('domain', chrome.runtime.id, {
        path: '/',
        domain: 'localhost'
    });

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.executeScript({
            code: '$$.main.show(' + JSON.stringify(_this.config) + ', ' + JSON.stringify(tab) + ')'
        });

        $.cookie('domain', chrome.runtime.id, {
            domain: 'localhost'
        });

        var url = _this.url.get('/login');
        var title = 'notipocket.com';
        var width = 640;
        var height = 550;

        windowId = window.open(url, title, 'width=' + width + ',height=' + height + ',left=' + ((window.outerWidth - width) / 2) + ',top=' + ((window.outerHeight - height) / 2) + '');

        var stopId = setInterval(function() {
            console.log($.cookie('login'));
        }, 1000);

    });

    chrome.extension.onMessage.addListener(function(req, sender, res) {
        console.log('aaaaaaaaaaaaaaa', arguments);
        res({
            hello: 'moto'
        });
    });

});