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

        hasMoreQueue: function() {
            return _this.queues.length === 0 ? false : true;
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
            // start queue
            _this.startQueue();
            // promise
            return deferred.promise;
        },

        retryQueue: function() {
            while (_this.hasMoreQueue()) {
                _this.queues.shift().retry();
            }
        },

        startQueue: function() {
            if (_this.queues.length === 0) {
                return false;
            }
            chrome.tabs.query({
                active: true,
                windowType: "normal",
                currentWindow: true

            }, function(tabs) {
                var tab = tabs[0];
                if (tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        code: 'auth',
                        data: {
                            url: _this.getUrl('/login')
                        }
                    });
                }
            });
        },

        request: function(type, url, data, dataType, headers, retry) {
            retry = retry === false ? false : true;

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
                if (err.code === 401 && retry === true) {
                    return _this.refresToken(args);
                }
                throw new Error(err.message);
            });
        },

        ////////////////////////////////////
        // extend
        ////////////////////////////////////
        checkNotification: function(options) {
            return _this.request('get', '/api/notifications', {}, null, {
                'Authorization': 'BEARER ' + Token.get(),
                'x-options': 'p' + Base64.encode(JSON.stringify(options))
            }, false);
        },

        getLink: function(url) {
            return _this.request('post', '/api/link/find-by-url', {
                url: url
            });
        },

        removeLink: function(url) {
            return _this.request('post', '/api/link/delete-by-url', {
                url: url
            });
        },

        saveLink: function(url, title, tags) {
            tags = tags || '';
            tags = tags.split(',');
            _.each(tags, function(tag, index) {
                tags[index] = tag.trim();
            });
            return _this.request('post', '/api/link/save', {
                url: url,
                title: title,
                tags: tags
            });
        }
    };
    return _this.init();
}());

////////////////////////////////////////////
// notification
////////////////////////////////////////////
var Notification = (function() {
    var _this = {

        init: function() {
            return _this;
        },

        show: function(tabId, notifications) {
            chrome.browserAction.setBadgeText({
                text: notifications.length === 0 ? '' : notifications.length.toString()
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: '#666'
            });
        }

    };
    return _this.init();
}());

////////////////////////////////////////////
// event
////////////////////////////////////////////
// browser action click
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, {
        code: 'show'
    }, function(res) {
        if (res.code === 'show') {
            ServiceManager.getLink(tab.url).then(function(data) {
                chrome.tabs.sendMessage(tab.id, {
                    code: 'getLink',
                    data: data.data
                });
            }).
            catch (function(err) {
                chrome.tabs.sendMessage(tab.id, {
                    code: 'getLink',
                    data: null
                });
            });
        }
    });
});

// run time listener
chrome.runtime.onMessage.addListener(function(req, sender, res) {
    // token
    if (req.code === 'token') {
        Token.set(req.data['access_token']);
        ServiceManager.retryQueue();
    }

    // saveLink
    if (req.code === 'saveLink') {
        var promise = null;
        if (req.data.isActive === true) {
            promise = ServiceManager.saveLink(req.data.url, req.data.title, req.data.tags);
        } else {
            promise = ServiceManager.removeLink(req.data.url);
        }
        promise.then(function(data) {
            return data.data;
        }).
        catch (function(err) {
            return null;
        }).then(function(data) {
            chrome.tabs.sendMessage(sender.tab.id, {
                code: 'saveLink',
                data: data
            });
            return data;

        }).then(function(data) {
            if (!data) { // remove
                chrome.browserAction.setIcon({
                    path: '/image/icon-19.png'
                });
            } else {
                chrome.browserAction.setIcon({
                    path: '/image/icon-19-active.png'
                });
            }
        });
    }
});

// on update listener
chrome.tabs.onUpdated.addListener(function(tabId, params, tabInfo) {
    ServiceManager.checkNotification({
        type: 'update',
        params: params,
        tabId: tabId,
        tabInfo: tabInfo
    }).then(function(res) {
        return res.data;
    }).
    catch (function(err) {
        return [];

    }).then(function(data) {
        Notification.show(tabId, data);
    });;
});

// on remove listener
chrome.tabs.onRemoved.addListener(function(tabId, params) {
    ServiceManager.checkNotification({
        type: 'remove',
        params: params,
        tabId: tabId
    });
});

// on select listener
chrome.tabs.onSelectionChanged.addListener(function(tabId, params) {
    chrome.tabs.get(tabId, function(tab) {
        // check notification
        ServiceManager.checkNotification({
            type: 'select',
            params: params,
            tabId: tabId,
            tabInfo: tab
        }).then(function(res) {
            return res.data;
        }).
        catch (function(err) {
            return [];

        }).then(function(data) {
            Notification.show(tabId, data);
        });

        // change icon
        ServiceManager.getLink(tab.url).then(function(data) {
            chrome.browserAction.setIcon({
                path: '/image/icon-19-active.png'
            });
        }).
        catch (function(err) {
            chrome.browserAction.setIcon({
                path: '/image/icon-19.png'
            });
        });
    });
});