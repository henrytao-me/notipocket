$(function() {

    // console.log('aaaaaaeeeeeeeee    bbb', localStorage);

    var _this = {
        config: {
            url: 'http://dev.notipocket.com:1337',
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

        // var url = _this.url.get('/login');
        // var title = 'notipocket.com';
        // var width = 640;
        // var height = 550;

        // windowId = window.open(url, title, 'width=' + width + ',height=' + height + ',left=' + ((screen.outerWidth - width) / 2) + ',top=' + ((screen.outerHeight - height) / 2) + '');

        // setInterval(function(){
        //     console.log('------', windowId.hello);    
        // }, 1000);        
    });

    chrome.extension.onMessage.addListener(function(req, sender, res) {
        console.log('aaaaaaaaaaaaaaa', arguments);
        res({
            hello: 'moto'
        });
    });

});

