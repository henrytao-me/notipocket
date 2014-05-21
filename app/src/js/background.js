$(function() {

    ////////////////////////////////////////////
    // token
    ////////////////////////////////////////////
    var Token = (function() {
        var _this = {

            init: function() {
                return _this;
            },

            get: function() {
                var token = localStorage['access_token'] || 'blank';
                _this.set(token);
                return token;
            },

            set: function(token) {
                localStorage['access_token'] = token;
            }
        };
        return _this.init();
    }());

    ////////////////////////////////////////////
    // service manager
    ////////////////////////////////////////////

    var ServiceManager = (function() {
        var _this = {
            env: {
                protocol: 'http://',
                host: 'dev.notipocket.com',
                port: 1337
            },

            queues: [],

            init: function() {
                return _this;
            },

            getUrl: function(url) {
                return _this.env.protocol + _this.env.host + (_this.env.port === 80 ? '' : ':' + _this.env.port) + url;
            },

            refresToken: function(args) {
                var deferred = Q.defer();
                _this.queues.push({
                    retry: function() {
                        return _this.request.apply(_this, args).then(function(res) {
                            deferred.resolve(res);
                        }).
                        catch (function(err) {
                            deferred.reject(err);
                        });
                    },
                    cancel: function() {
                        return deferred.reject({
                            status: 'cancel'
                        });
                    }
                });
                // retry queue
                _this.retryQueue();
                // promise
                return deferred.promise;
            },

            retryQueue: function() {
                if (_this.queues.length === 0) {
                    return false;
                }
                chrome.tabs.getCurrent(function(tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        code: 'auth'
                    }, function(res) {
                        
                    });
                });
            },

            request: function(type, url, data, dataType, headers) {
                var args = arguments;
                var deferred = Q.defer();
                $.ajax({
                    headers: _.extend({}, headers || {
                        'Authorization': 'BEARER ' + Token.get()
                    }),
                    type: type,
                    url: _this.getUrl(url),
                    data: data || {},
                    dataType: dataType || 'json'

                }).done(function(res, status, xhr) {
                    if (res.status !== 'ok') {
                        return deferred.reject(_.extend({}, res, {
                            code: xhr.status
                        }));
                    }
                    return deferred.resolve(_.extend({}, res, {
                        code: xhr.status
                    }));

                }).fail(function(xhr) {
                    return deferred.reject({
                        status: 'error',
                        code: xhr.status,
                        message: xhr.statusText
                    });
                });
                return deferred.promise.
                catch (function(err) {
                    // refresh token
                    if (err.code === 401) {
                        return _this.refresToken(args);
                    }
                    throw new Error(err.message);
                });
            },

            ////////////////////////////////////
            // extend
            ////////////////////////////////////
            getLink: function(url) {
                return _this.request('post', '/api/link/find-by-url', {
                    url: url
                }).then(function(res) {
                    console.log('--------- then', res);
                });
            }
        };
        return _this.init();
    }());

    ////////////////////////////////////////////
    // event
    ////////////////////////////////////////////

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendMessage(tab.id, {
            code: 'show'
        }, function(res) {
            ServiceManager.getLink(tab.url);
        });
    });

    // chrome.extension.onMessage.addListener(function(req, sender, res) {
    //     console.log('aaaaaaaaaaaaaaa', arguments);
    //     res({
    //         hello: 'moto'
    //     });
    // });

    // chrome.tabs.onUpdated.addListener(function(tabId, params, tabInfo) {
    //     $.ajax({
    //         type: 'PUT',
    //         url: _this.getUrl('/api/notification/check'),
    //         dataType: 'json',
    //         data: {
    //             params: 'p' + Base64.encode(JSON.stringify({
    //                 type: 'update',
    //                 params: params,
    //                 tabId: tabId,
    //                 tabInfo: tabInfo
    //             }))
    //         }
    //     });
    // });

    // chrome.tabs.onRemoved.addListener(function(tabId, params) {
    //     $.ajax({
    //         type: 'PUT',
    //         url: _this.getUrl('/api/notification/check'),
    //         dataType: 'json',
    //         data: {
    //             params: 'p' + Base64.encode(JSON.stringify({
    //                 type: 'remove',
    //                 params: params,
    //                 tabId: tabId
    //             }))
    //         }
    //     });
    // });

    // chrome.tabs.onSelectionChanged.addListener(function(tabId, params) {
    //     $.ajax({
    //         type: 'PUT',
    //         url: _this.getUrl('/api/notification/check'),
    //         dataType: 'json',
    //         data: {
    //             params: 'p' + Base64.encode(JSON.stringify({
    //                 type: 'selection',
    //                 params: params,
    //                 tabId: tabId
    //             }))
    //         }
    //     });
    // });



});