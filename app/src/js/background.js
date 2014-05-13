$(function() {

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        console.log('update---------', tabId, changeInfo);
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:1111/push',
            data: {
                data: [(new Date()), tabId, changeInfo, tab]
            }
        });
    });

    chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
        console.log('remove---------', tabId, removeInfo);
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:1111/push',
            data: {
                data: [(new Date()), tabId, removeInfo]
            }
        });
    });

    chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
        console.log('selection------', tabId, selectInfo);
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:1111/push',
            data: {
                data: [(new Date()), tabId, selectInfo]
            }
        }).success(function() {}).error(function() {});
    });

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.executeScript({
            code: '$$.toolbox.show()'
        });
    });

});