$(function() {

    var _this = {
        config: {
            url: 'http://127.0.0.1:1337'
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

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.executeScript({
            code: '$$.toolbox.show(' + JSON.stringify(_this.config) + ')'
        });
    });

});