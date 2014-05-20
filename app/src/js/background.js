$(function() {

    var _this = {
        config: {
            env: {
                protocol: 'http://',
                host: 'dev.notipocket.com',
                port: 1337
            },
            resource: {
                template: chrome.extension.getURL('html/main.html'),
                logo: chrome.extension.getURL('image/notipocket.icon.full.png')
            }
        },
        getUrl: function(url) {
            return _this.config.env.protocol + _this.config.env.host + (_this.config.env.port === 80 ? '' : ':' + _this.config.env.port) + url;
        }
    };

    chrome.tabs.onUpdated.addListener(function(tabId, params, tabInfo) {
        $.ajax({
            type: 'PUT',
            url: _this.getUrl('/api/notification/check'),
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
            url: _this.getUrl('/api/notification/check'),
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
            url: _this.getUrl('/api/notification/check'),
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

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.executeScript({
            code: '$$.main.show(' + JSON.stringify(_this.config) + ', ' + JSON.stringify(tab) + ')'
        });
    });

    chrome.extension.onMessage.addListener(function(req, sender, res) {
        console.log('aaaaaaaaaaaaaaa', arguments);
        res({
            hello: 'moto'
        });
    });

});