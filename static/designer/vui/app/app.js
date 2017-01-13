$(function() {

    if (document.domain != 'localhost') {
        document.domain = 'gospely.com';
    }

    jQuery.fn.isChildOf = function(b) {
        return (this.parents(b).length > 0);
    };

    //判断:当前元素是否是被筛选元素的子元素或者本身
    jQuery.fn.isChildAndSelfOf = function(b) {
        return (this.closest(b).length > 0);
    };

    var jq = jQuery.noConflict();

    function traversalDOMTree(dom) {
        for (var i = 0; i < jq(dom).length; i++) {
            var currentElement = jq(jq(dom)[i]);

            if (currentElement.children().length > 0) {
                traversalDOMTree(currentElement.children());
            }

            // console.log(currentElement.data('controller'));
        };
    }

    var pageManager = {
        $container: jq('#container'),
        _pageStack: [],
        _configs: [],
        _pageAppend: function() {},
        _defaultPage: null,
        _pageIndex: 1,
        setDefault: function(defaultPage) {
            this._defaultPage = this._find('name', defaultPage);
            location.hash = this._defaultPage.url;
            return this;
        },
        setPageAppend: function(pageAppend) {
            this._pageAppend = pageAppend;
            return this;
        },
        init: function() {
            var self = this;

            jq(window).on('hashchange', function() {
                var state = history.state || {};
                var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
                var page = self._find('url', url) || self._defaultPage;

                url = url.indexOf('page-app') != -1 ? '#page-home' : url;

                if (state._pageIndex <= self._pageIndex || self._findInStack(url)) {
                    self._back(page);
                } else {
                    self._go(page);
                }
            });

            if (history.state && history.state._pageIndex) {
                this._pageIndex = history.state._pageIndex;
            }

            this._pageIndex--;

            var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
            var page = self._find('url', url) || self._defaultPage;
            this._go(page);
            return this;
        },
        push: function(config) {
            this._configs.push(config);
            return this;
        },
        go: function(to) {
            var config = this._find('name', to);
            if (!config) {
                return;
            }
            location.hash = config.url;
        },
        _go: function(config) {
            this._pageIndex++;

            history.replaceState && history.replaceState({ _pageIndex: this._pageIndex }, '', location.href);

            var html = jq(config.template).find('.page').clone(true);

            var $html = jq(html).addClass('slideIn').addClass(config.name);
            $html.on('animationend webkitAnimationEnd', function() {
                $html.removeClass('slideIn').addClass('js_show');
            });

            if (jq('.' + config.name).length <= 0) {
                this.$container.append($html);
            }

            this._pageAppend.call(this, $html);
            this._pageStack.push({
                config: config,
                dom: $html
            });

            if (!config.isBind) {
                this._bind(config);
            }

            return this;
        },
        back: function() {
            history.back();
        },
        _back: function(config) {
            this._pageIndex--;

            var stack = this._pageStack.pop();
            if (!stack) {
                return;
            }

            var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
            var found = this._findInStack(url);

            if (!found) {
                var html = jq(config.template).find('.page').clone(true);
                var $html = jq(html).addClass('js_show').addClass(config.name);

                $html.insertBefore(stack.dom);

                if (!config.isBind) {
                    this._bind(config);
                }

                this._pageStack.push({
                    config: config,
                    dom: $html
                });
            }

            stack.dom.addClass('slideOut').on('animationend webkitAnimationEnd', function() {
                stack.dom.remove();
            });

            return this;
        },
        _findInStack: function(url) {
            var found = null;
            for (var i = 0, len = this._pageStack.length; i < len; i++) {
                var stack = this._pageStack[i];
                if (stack.config.url === url) {
                    found = stack;
                    break;
                }
            }
            return found;
        },
        _find: function(key, value) {
            var page = null;
            for (var i = 0, len = this._configs.length; i < len; i++) {
                if (this._configs[i][key] === value) {
                    page = this._configs[i];
                    page.index = i;
                    break;
                }
            }
            return page;
        },
        _bind: function(page) {
            var events = page.events || {};
            for (var t in events) {
                for (var type in events[t]) {
                    this.$container.on(type, t, events[t][type]);
                }
            }
            page.isBind = true;
        },
        remove: function(page) {
            jq('.' + page.data.key).remove();

            if(!page.keepTpl) {
                jq('script[id="' + page.data.key + '"]').remove();
            }

            this._configs.splice(page.index, 1);
            this._pageStack.splice(page.index, 1);
            this._pageIndex = page.index--;
        }
    };

    function fastClick() {
        var supportTouch = function() {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        }();
        var _old$On = $.fn.on;

        $.fn.on = function() {
            if (/click/.test(arguments[0]) && typeof arguments[1] == 'function' && supportTouch) { // 只扩展支持touch的当前元素的click事件
                var touchStartY, callback = arguments[1];
                _old$On.apply(this, ['touchstart', function(e) {
                    touchStartY = e.changedTouches[0].clientY;
                }]);
                _old$On.apply(this, ['touchend', function(e) {
                    if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) return;

                    e.preventDefault();
                    callback.apply(this, [e]);
                }]);
            } else {
                _old$On.apply(this, arguments);
            }
            return this;
        };
    }

    function preload() {
        jq(window).on("load", function() {
            var imgList = [
                "./images/layers/content.png",
                "./images/layers/navigation.png",
                "./images/layers/popout.png",
                "./images/layers/transparent.gif"
            ];
            for (var i = 0, len = imgList.length; i < len; ++i) {
                new Image().src = imgList[i];
            }
        });
    }

    function androidInputBugFix() {
        // .container 设置了 overflow 属性, 导致 Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
        // 相关 issue: https://github.com/weui/weui/issues/15
        // 解决方法:
        // 0. .container 去掉 overflow 属性, 但此 demo 下会引发别的问题
        // 1. 参考 http://stackoverflow.com/questions/23757345/android-does-not-correctly-scroll-on-input-focus-if-not-body-element
        //    Android 手机下, input 或 textarea 元素聚焦时, 主动滚一把
        if (/Android/gi.test(navigator.userAgent)) {
            window.addEventListener('resize', function() {
                if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                    window.setTimeout(function() {
                        document.activeElement.scrollIntoViewIfNeeded();
                    }, 0);
                }
            })
        }
    }

    function getPageConfig(name, url, id) {
        return {
            name: name,
            url: '#' + url,
            template: '#' + id
        }
    }

    function setPageManager(def) {

        def = def || 'page-home';

        var pages = {},
            tpls = jq('script[type="text/html"]');
        var winH = jq(window).height();

        if (tpls.length === 0) {
            return false;
        }

        for (var i = 0, len = tpls.length; i < len; ++i) {
            var tpl = tpls[i],
                name = tpl.id.replace(/tpl_/, '');
            // traversalDOMTree(tpl);
            pages[name] = getPageConfig(name, name, tpl.id)
        }

        pages[def].url = '#' + def;

        for (var page in pages) {
            pageManager.push(pages[page]);
        }

        pageManager
            .setPageAppend(function($html) {
                var $foot = $html.find('.page__ft');
                if ($foot.length < 1) return;

                if ($foot.position().top + $foot.height() < winH) {
                    $foot.addClass('j_bottom');
                } else {
                    $foot.removeClass('j_bottom');
                }
            })
            .setDefault(def)
            .init();
    }

    function init() {
        preload();
        fastClick();
        androidInputBugFix();
    }

    init();

    var dndHandlder = function() {

        var postMessageToFather = {

            ctrlClicked: function(c) {
                parent.parent.postMessage({ 'ctrlClicked': c }, "*");
            },

            generateCtrl: function(c) {
                parent.parent.postMessage({ 'generateCtrl': c }, "*");
            },

            ctrlToBeAdded: function(c) {
                parent.parent.postMessage({ 'ctrlToBeAdded': c }, "*");
            },

            ctrlUpdated: function(c) {
                parent.parent.postMessage({ 'ctrlUpdated': c }, "*");
            },

            ctrlRemoved: function(c) {
                parent.parent.postMessage({ 'ctrlRemoved': c }, "*");
            },

            pageSelected: function(c) {
                parent.parent.postMessage({ 'pageSelected': c }, "*");
            },

            makeComponentsDraggable: function(c) {
                parent.parent.postMessage({ 'makeComponentsDraggable': c }, "*");
            },

            attrChangeFromDrag: function(c) {
                parent.parent.postMessage({ 'attrChangeFromDrag': c }, "*")
            },

            tabBarAdded: function(c) {
                parent.parent.postMessage({ 'tabBarAdded': c }, '*');
            },

            ctrlExchanged: function(c) {
                parent.parent.postMessage({ 'ctrlExchanged': c }, '*');
            },
            deleteError: function() {
                parent.parent.postMessage({ 'deleteError': true }, '*');
            },

            startRouting: function() {
                parent.postMessage({
                    'startRouting': true
                }, '*');
            },

            stopRouting: function() {
                parent.postMessage({
                    'stopRouting': true
                }, '*');
            }

        }

        var controllerState = {
                currentActiveCtrlDOM: ''
            },

            removeBtn = jq('i.control-box.remove'),

            dragY = jq('.spacerBottomBorder');

        removeBtn.click(function(e) {
            e.stopPropagation();
            var self = controllerState.currentActiveCtrlDOM,
                dataControl = self.data('controller'),
                baseClassName = self.attr('class');

            if (baseClassName) {
                var componentCantBeRemoved = ['page__bd', 'page__hd', 'page__ft'];
                baseClassName = baseClassName.split(' ')[0];

                for (var i = 0; i < componentCantBeRemoved.length; i++) {
                    var CCBR = componentCantBeRemoved[i],
                        pos = baseClassName.indexOf(CCBR);
                    if (pos != -1) {
                        postMessageToFather.deleteError();
                        return false;
                    }
                };
            }
            postMessageToFather.ctrlRemoved(dataControl);
            self.remove();
            controllerOperations.hideDesignerDraggerBorder();
        });

        //点击其他区域隐藏border和i
        jq("body").on("click", function() {
            controllerOperations.hideDesignerDraggerBorder();
            postMessageToFather.pageSelected({
                key: location.hash.split('#')[1] || 'page-home'
            });
        });

        //点击组件
        jq(document).on("click", function(e) {
            e.stopPropagation();
            var target = jq(e.target),
                isController = target.data('is-controller'),
                dataControl = target.data("controller");
            if (!dataControl) {
                if (target.attr('tabbar')) {

                    var tpls = jq('script[id]');

                    for (var i = 0; i < tpls.length; i++) {
                        var tpl = jq(tpls[i]);
                        if (tpl.attr('router') == target.attr('router')) {
                            postMessageToFather.startRouting();
                            pageManager.go(tpl.attr('id'));
                            controllerOperations.hideDesignerDraggerBorder();
                            postMessageToFather.pageSelected({
                                key: tpl.attr('id')
                            });
                            break;
                        }
                    };
                }
                return false;
            }

            if (isController) {
                //触发控件被点击事件
                controllerOperations.select(dataControl);
                //阻止事件，比如 a 标签的跳转
                if(target.attr('url')){
                    var tpls = jq('script[id]');
                    for (var i = 0; i < tpls.length; i++) {
                        var tpl = jq(tpls[i]);
                        if (tpl.attr('router') == target.attr('url')) {
                            postMessageToFather.startRouting();
                            pageManager.go(tpl.attr('id'));
                            controllerOperations.hideDesignerDraggerBorder();
                            postMessageToFather.pageSelected({
                                key: tpl.attr('id')
                            });
                            break;
                        }
                    };
                }
                if(target.attr('href')){
                    var tpls = jq('script[id]');
                    for (var i = 0; i < tpls.length; i++) {
                        var tpl = jq(tpls[i]);
                        if (tpl.attr('router') == target.attr('href')) {
                            postMessageToFather.startRouting();
                            pageManager.go(tpl.attr('id'));
                            controllerOperations.hideDesignerDraggerBorder();
                            postMessageToFather.pageSelected({
                                key: tpl.attr('id')
                            });
                            break;
                        }
                    };
                }
                e.preventDefault();
            }
        });

        var controllerOperations = {
                select: function(controller, isSentByParent) {

                    if (!controller) {
                        return false;
                    }

                    isSentByParent = isSentByParent || false;

                    var target = jq('#' + controller.key);

                    controllerState.currentActiveCtrlDOM = target;

                    if (!isSentByParent) {
                        postMessageToFather.ctrlClicked(controller);
                    }

                    controllerOperations.showDesignerDraggerBorder(target);

                },

                showDesignerDraggerBorder: function(self) {
                    controllerOperations.hideDesignerDraggerBorder();
                    removeBtn.show();

                    if (!self) {
                        return false;
                    }

                    if (!self.offset()) {
                        return false;
                    }

                    removeBtn.css({
                        top: self.offset().top + 'px',
                        left: self.offset().left + 'px'
                    });

                    self.addClass("hight-light");

                    //使其可拖动，且其子元素不可拖动
                    self.attr('draggable', true);
                    self.find("*").attr('draggable', false);

                    //空白分隔符
                    if (self[0].id.split('-')[0] == 'spacer') {
                        dragY.show();
                        dragY.css({
                            top: self.offset().top + self.height() + 'px',
                            width: self.width()
                        })
                        jq(dragY[0]).on('mousedown', function(e) {
                            this.isMouseDown = true;
                            this.orginY = e.pageY;
                            this.orginTop = parseInt(jq(e.target).css('top'));
                            this.orginHeight = parseInt(self.height());
                            this.tar = jq(e.target);
                        })
                        jq(dragY[0]).on('mouseup', function(e) {

                            this.isMouseDown = false;
                            postMessageToFather.attrChangeFromDrag({
                                changeId: [self[0].id],
                                changeValue: [e.pageY - this.orginY + this.orginHeight + 'px'],
                                changeAttr: ['height']
                            });

                        })
                        jq(window).on('mousemove', function(e) {
                            if (dragY[0].isMouseDown) {
                                dragY[0].tar.css({
                                    top: e.pageY - dragY[0].orginY + dragY[0].orginTop
                                })
                                self.height(e.pageY - dragY[0].orginY + dragY[0].orginHeight + 'px');

                            }
                        })
                    }
                },

                hideDesignerDraggerBorder: function() {
                    jq("i.control-box.remove").hide();
                    jq(".hight-light").removeClass("hight-light");
                    jq(".hight-light").attr("draggable", false);
                    jq(".spacerBottomBorder").hide();
                },

                refresh: function(controller, page) {

                    var ctrlID = controller.key,
                        target = jq('#' + ctrlID);
                    ctrlRefresher = new ComponentsGenerator({
                        controller: controller,
                        page: page
                    });
                    ctrlRefresher.setAttribute();
                    controllerOperations.showDesignerDraggerBorder(target)
                }
            },

            pageOperations = {
                app: {},

                refreshApp: function(data) {
                    var attr = {};

                    this.app = data;

                    if (data.attr.window) {
                        attr = data.attr.window._value;
                    } else {
                        attr = data.attr;
                    }

                    this.changeBackgroundColor(attr.backgroundColor._value);
                    this.changeBackgroundTextStyle(attr.backgroundTextStyle._value);

                    this.tabBar.refreshTabBarStyle(data);

                    if (data.attr.routingURL) {
                        //页面路由发生变化，script模版路由属性跟着变化
                        jq('script[id="' + data.key + '"').attr('router', data.attr.routingURL._value);
                    }

                },

                changeBackgroundTextStyle: function(style) {
                    style = style == 'light' ? '200' : '800';
                    jq('body').css('font-weight', style);
                },

                changeBackgroundColor: function(color) {
                    var self = this;
                    var inter = setInterval(function() {

                        if (self.app.key == 'page-app') {
                            clearInterval(inter);
                            for (var i = 0; i < jq('script[id]').length; i++) {
                                var page = jq(jq('script[id]')[i]),
                                    pageId = page.attr('id');
                                jq('.' + pageId).css('background-color', '');
                            };
                            jq('body').css('background-color', color);
                        } else {
                            if (jq('.' + self.app.key).length > 0) {
                                clearInterval(inter);
                                jq('.' + self.app.key).css('background-color', color);
                            }
                        }

                    });

                },

                tabBar: {

                    refreshTabBarStyle: function(data) {

                        if (data.attr) {
                            if (!data.attr.tabBar) {
                                return false;
                            }
                        }

                        var tabBar = data.attr ? data.attr.tabBar._value : data;

                        var borderStyle = tabBar.borderStyle._value == 'black' ? '1px solid #000000' : '1px solid #FFFFFF';

                        jq('.page-app .weui-tabbar, .page-home .weui-tabbar').css('background-color', tabBar.backgroundColor._value)
                            .css('border-top', borderStyle);
                        jq('.page-app .weui-tabbar__label, .page-home .weui-tabbar__label').css('color', tabBar.color._value);
                    },

                    refreshTabBar: function(checked, tabBar) {

                        var tpl = jq('script[id="page-app"]');

                        if (checked) {
                            var tabList = tabBar.list.value,
                                tabs = this.generateTab(tabList);

                            tpl.html('<div class="page">' + tabs + '</div>');
                            jq('.page-app').html(tabs);

                            this.refreshTabBarStyle(tabBar);
                            this.addTabBarToMainPage(tabList, tabBar);
                        } else {
                            tpl.html('');
                            jq('.page-app').find('.weui-tab').remove();
                            this.cancelTabBarInMainPage();
                        }

                    },

                    generateTab: function(tabList) {
                        var tabBarTpl = this.generateTabBarLoop(tabList),
                            tabWrapper;
                        tabWrapper = this.generateTabWrapper(tabBarTpl);
                        return tabWrapper;
                    },

                    generateTabBarLoop: function(tabList) {
                        var tabBarTpl = '';
                        for (var i = 0; i < tabList.length; i++) {
                            var tab = tabList[i];
                            tabBarTpl = tabBarTpl + this.generateTabBar(tab.iconPath._value, tab.text._value, tab.pagePath._value, tab.selectedIconPath._value);
                        };
                        return tabBarTpl;
                    },

                    generateTabBar: function(iconPath, text, pagePath, selectedIconPath) {
                        return '<a tabbar="true" router="' + pagePath + '" href="#' + pagePath + '" class="weui-tabbar__item"> \
                             <img tabbar="true" router="' + pagePath + '" src="' + iconPath + '" alt="" class="weui-tabbar__icon"> \
                             <p class="weui-tabbar__label">' + text + '</p> \
                        </a>';
                    },

                    generateTabWrapper: function(tabs) {
                        return '<div class="weui-tab"> \
                                    <div class="weui-tab__panel"></div> \
                                    <div class="weui-tabbar">' + tabs + '</div> \
                                </div>';
                    },

                    addTabBarToMainPage: function(tabList, tabBar) {
                        var tabs = this.generateTabBarLoop(tabList);
                        jq('.page-home .weui-tabbar').html(tabs);
                        jq('script[id="page-home"]').find('.page .weui-tab .weui-tabbar').html(tabs);
                        setTimeout(function() {
                            if (jq('.page-home .weui-tabbar').html() == '') {
                                jq('.page-home .weui-tabbar').html(tabs);
                            }
                        }, 100);
                    },

                    cancelTabBarInMainPage: function() {
                        jq('.page-home .weui-tabbar').html('');
                    }
                },

                css: {
                    refresh: function(data) {
                        var page = data.page,
                            CSSG = new cssGenerator(page);
                    }
                }
            }

        function dndInitialization(options) {
            var self = this;

            this.rowSelector = options.rowSelector;
            this.comSelector = options.comSelector;
            this.containerSelector = options.containerSelector;
            this.inter = 0;

            this.makeComponentsDraggable();

            this.initEvents({
                onSourceController: function() {
                    // self.makeComponentsDraggable();
                }
            });

        }

        dndInitialization.prototype = {

            initEvents: function(cbs) {

                var self = this;

                window.addEventListener('message', function(evt) {

                    var data = evt.data,
                        evtAction = {
                            componentsDraggable: function() {
                                cbs.onSourceController();
                            }
                        },
                        eventName = '';

                    for (var key in data) {
                        eventName = key;
                    }

                    if (evtAction[eventName]) {
                        data = data[key];
                        evtAction[eventName]();
                    }

                });

            },

            makeComponentsDraggable: function(cb) {
                var self = this;

                var sourceController = jq(self.rowSelector, window.parent.parent.document).find('.ant-col-12'),
                    inter = 0;

                var initDnd = function() {
                    sourceController.each(function(n) {
                        jq(this).find(".app-components").attr("draggable", true);
                        jq(this).find(".app-components").attr("id", "source" + n);
                        //开始拖拽
                        jq(this).find(".app-components").on("dragstart", function(ev) {
                            data = jq(ev.target).clone();

                            var controller = parent.parent.dndData;

                            //传回父页面的数据
                            var ctrlAndParent = {
                                controller: controller
                            }

                            //若拖进来的元素必须有特定的父元素则判断是否需要添加其特定父元素
                            // var appendParent = jq('#' + dndData.dragAddCtrlTargetId)[0];
                            if (controller.attr.theParent && controller.attr.theParent._value) {

                                ctrlAndParent.theParent = controller.attr.theParent._value;

                            }

                            //生成dom数据结构
                            postMessageToFather.generateCtrl(ctrlAndParent);

                            //初始化一些拖拽过程中的数据
                            dndData.dragAddCtrlTargetId = '';
                            dndData.haveAppened = false;

                            //初始化会改变的属性数据
                            dndData.attrChangeData.haveAttrChange = false;
                            dndData.attrChangeData.changeId = [];
                            dndData.attrChangeData.changeAttr = [];
                            dndData.attrChangeData.changeValue = [];

                            //初始化会改变的左边结构树的数据
                            dndData.constructTreeData.haveChange = false;
                            dndData.constructTreeData.changeType = [];
                            dndData.constructTreeData.dragElementId = [];
                            dndData.constructTreeData.exchElementId = [];

                            // 结构树特殊变化置false
                            dndData.addCtrlbyAfter.isAfter = false;

                            ev.stopPropagation();

                        })

                        // jq("#page__bd").on('dragleave', function (e) {
                        //     console.log(3333)
                        //     e.stopPropagation();
                        //     console.log(jq(this).find('#' + dndData.dragAddCtrl.eq(0).attr('id')))
                        //     jq(this).find('#' + dndData.dragAddCtrl.eq(0).attr('id')).remove();
                        // })
                    }).on('drag', function(e) {

                        if (!dndData.haveAppened) {
                            return false;
                        }

                        dndProcessHandlder(e);

                    }).on('dragend', function(e) {

                        dndEndHandler(e);

                    });

                    self.onDrop();
                    self.onDragover();

                }

                if (sourceController.length === 0) {
                    inter = setInterval(function() {
                        sourceController = jq(self.rowSelector, window.parent.parent.document).find('.ant-col-12')
                        if (sourceController.length > 0) {
                            clearInterval(inter);
                            initDnd();
                        }
                    }, 1);
                } else {
                    initDnd();
                }

            },

            onDrop: function() {
                var self = this;
                jq(this.containerSelector).on("drop", function(e) {
                    if (e.originalEvent.dataTransfer.getData("Text") == 'fromSelf') {
                        return false;
                    }

                    var dropTarget = jq('#' + dndData.dragAddCtrlTargetId),
                        dragElement = dndData.dragAddCtrl;

                    dragElement.css('opacity', '1');

                    e.preventDefault();

                    //获取父元素的window对象上的数据
                    var controller = parent.parent.dndData;

                    //传回父页面的数据
                    var ctrlAndTarget = {
                        ctrl: dndData.dragAddCtrlData,
                        target: dndData.dragAddCtrlTargetId,
                        isAddByAfter: dndData.addCtrlbyAfter.isAfter,
                        prevElementId: dndData.addCtrlbyAfter.prevElementId
                    }

                    // //若拖进来的元素必须有特定的父元素则判断是否需要添加其特定父元素
                    // var appendParent = jq('#' + dndData.dragAddCtrlTargetId)[0];
                    // if (controller.attr.theParent && controller.attr.theParent._value) {

                    //     ctrlAndTarget.theParent = controller.attr.theParent._value;
                    //     ctrlAndTarget.theParent.indexOfDragElement = dropTarget.children().index(dragElement);

                    // }

                    parent.parent.currentTarget = e.target;

                    //设置自动高度
                    if (!dropTarget.hasClass('page__bd')) {
                        dropTarget.css({
                            height: 'auto'
                        })

                        postMessageToFather.attrChangeFromDrag({
                            changeId: [dropTarget.eq(0).attr('id')],
                            changeAttr: ['height'],
                            changeValue: ['atuo']
                        });
                    }
                    postMessageToFather.ctrlToBeAdded(ctrlAndTarget);
                    // hideDesignerDraggerBorder(dropTarget);
                });
            },

            onDragover: function() {
                //拖拽过程中
                if (dndData.haveAppened || !dndData.dragAddCtrl) {
                    return false;
                }
                jq("body").on("dragover", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var target = jq(e.target),
                        targetId = e.target.id;
                    jq('.container-box').removeClass('container-box');
                    if (target.height() <= 10) {

                    }
                    target.addClass('container-box');
                    if (target.hasClass('page__bd') || target.hasClass('page__hd') || target.hasClass('page__ft')) {
                        //over页面头部或中部或底部就append

                        dndData.dragElement = dndData.dragAddCtrl;

                        //自己over自己或者父元素over子元素或者已经append了返回false
                        if (targetId == dndData.dragAddCtrl.eq(0).attr('id') ||
                            dndData.dragAddCtrl.find('#' + targetId).length ||
                            dndData.haveAppened) {
                            return false;
                        }

                        target.append(dndData.dragAddCtrl);
                        dndData.haveAppened = true;
                        dndData.dragAddCtrl.css('opacity', '.3');

                        controllerOperations.showDesignerDraggerBorder(dndData.dragAddCtrl)

                        //append到的父元素
                        dndData.dragAddCtrlTargetId = targetId;

                        //初始化拖拽元素
                        dndData.dragElement = dndData.dragAddCtrl;
                        dndData.orginY = e.pageY;
                        dndData.dragElementParent = dndData.dragElement.parent();

                    } else {
                        //over的元素是容器且不是自己就append进去
                        if (target.data('is-container') &&
                            !dndData.dragAddCtrl.find('#' + targetId).length &&
                            !dndData.haveAppened) {
                            //appen进去
                            target.append(dndData.dragAddCtrl);
                            dndData.haveAppened = true;
                            dndData.dragAddCtrl.css('opacity', '.3');

                            controllerOperations.showDesignerDraggerBorder(dndData.dragAddCtrl)

                            //append到的父元素
                            dndData.dragAddCtrlTargetId = targetId;

                            //初始化拖拽元素
                            dndData.dragElement = dndData.dragAddCtrl;
                            dndData.orginY = e.pageY;
                            dndData.dragElementParent = dndData.dragElement.parent();

                        } else if (!dndData.haveAppened) {
                            //after到其后面去
                            target.after(dndData.dragAddCtrl);
                            dndData.haveAppened = true;
                            dndData.dragAddCtrl.css('opacity', '.3');

                            controllerOperations.showDesignerDraggerBorder(dndData.dragAddCtrl)

                            //append到的父元素
                            dndData.dragAddCtrlTargetId = target.parent().eq(0).attr('id');

                            //初始化拖拽元素
                            dndData.dragElement = dndData.dragAddCtrl;
                            dndData.orginY = e.pageY;
                            dndData.dragElementParent = dndData.dragElement.parent();

                            //此时不是简单的append,所以左边结构树要做特殊变化
                            dndData.addCtrlbyAfter.isAfter = true;
                            dndData.addCtrlbyAfter.prevElementId = targetId;
                        }
                    }

                });
            }

        };

        function appRender(app) {
            parent.postMessage({
                appConfigRender: app
            }, '*');
            pageOperations.refreshApp(app);
        }

        function layoutGenerator(data) {
            this.layout = data.layout;
            this.layoutState = data.layoutState;

            this.app = this.layout[0];
            this.pages = this.app.children;

            window.wholeAppConfig = this.app.attr;
            window.layoutState = this.layoutState;

            if (window.layoutState.activeKey == 'page-app') {
                var PR = new appRender(this.app);
            }

            var RG = new routerGenerator(this.pages),
                CSS = new cssGenerator(this.app);

            setPageManager();

            window.pageManager = pageManager;
            window.home = function() {
                location.hash = '';
            };

            if (this.app.attr.tabBar._value.useTabBar._value) {
                pageOperations.tabBar.refreshTabBar(true, this.app.attr.tabBar._value);
            }

        }

        var cssGenerator = function(app) {
            this.app = app;
            this.init();
        };

        cssGenerator.prototype = {

            init: function() {

                //加载应用CSS

                if (this.isStyleExist(this.app.key)) {
                    var style = this.getStyle(this.app.key);

                    if (this.app.key == 'page-app') {
                        style.html(this.app.attr.css._value);
                    } else {
                        style.html(this.compileCSS(this.app.attr.css._value, this.app.key));
                    }
                } else {
                    this.createStyleElement(this.app.attr.css._value);
                }

                //加载页面CSS
                var appPages = this.app.children;

                for (var i = 0; i < appPages.length; i++) {
                    var currentPage = appPages[i];
                    if (currentPage.type == 'page') {
                        var CG = new cssGenerator(currentPage);
                    }
                };

            },

            createStyleElement: function(styles) {
                var id = this.app.key,
                    css = '';

                if (id == 'page-app') {
                    css = jq('<style sid="' + id + '">' + styles + '</style>');
                } else {
                    css = jq('<style sid="' + id + '">' + this.compileCSS(styles, location.hash.split('#')[1] || 'page-home') + '</style>');
                }

                jq('head').append(css);
            },

            isStyleExist: function(id) {
                return jq('style[sid="' + id + '"]').length !== 0;
            },

            getStyle: function(id) {
                return jq('style[sid="' + id + '"]');
            },

            compileCSS: function(CSS, page) {

                var jsonCSS = CSSJSON.toJSON(CSS);

                for (var key in jsonCSS.children) {
                    jsonCSS.children[key + '[' + page + '="true"]'] = jsonCSS.children[key];
                    delete jsonCSS.children[key];
                }

                var CSSCompiled = CSSJSON.toCSS(jsonCSS);

                return CSSCompiled;
            }

        };

        function pageGenerator() {

        }

        function routerGenerator(pages) {
            this.pages = pages;
            this.init();
        }

        routerGenerator.prototype = {
            init: function() {
                if (this.pages.length) {
                    for (var i = 0; i < this.pages.length; i++) {
                        var currentPage = this.pages[i];
                        this.appendPageToHTML(currentPage);
                    };
                } else {
                    this.appendPageToHTML(this.pages);
                }

            },

            appendPageToHTML: function(page) {
                var wrapper = jq(this.generateTplScript(page.key, page.attr.routingURL._value)),
                    target;

                jq('#container').after(wrapper);

                if (page.key == 'page-home') {
                    wrapper.append('<div class="page">' + pageOperations.tabBar.generateTabWrapper('') + '</div>')
                    target = jq('.weui-tab__panel');
                } else {
                    wrapper.append('<div class="page"></div>');
                    target = wrapper.find('.page');
                }

                this.generateTpl(page, target);
            },

            generateTpl: function(page, target) {
                var controllers = page.children;

                for (var i = 0; i < controllers.length; i++) {
                    var ctrl = controllers[i],
                        CG = new ComponentsGenerator({
                            controller: ctrl,
                            page: page
                        });

                    var currentElem = CG.createElement(),
                        elemID = currentElem.attr('id');

                    target.append(currentElem);

                    var type = elemID.split('-')[0];

                    if (type == 'bd') {
                        //某些无高度的div容器，要加上类container-box显示给用户看
                        currentElem.addClass('container-box-a bd');
                    }

                    if (ctrl.children) {
                        this.generateTpl(ctrl, jq(currentElem));
                    }

                };
            },

            generateTplScript: function(id, router) {
                var wrapper = '<script type="text/html" id="' + id + '" router="' + router + '"></script>';
                return wrapper;
            }
        };

        //存储拖拽时的各种数据
        var dndData = {
            constructTreeData: {

            },
            attrChangeData: {

            },

            //左边组件开始拖拽时生成的数据结构转换为 dom 后的数据存在这里
            dragAddCtrl: {

            },

            //左边组件开始拖拽生成的数据结构
            dragAddCtrlData: {

            },

            //当从左边拖进来的组件是以after方式加入到页面的时候左边结构树要做特殊变化
            addCtrlbyAfter: {

            },

            //constructTreeData的 push 方法
            pushConstrData: function (action, dragElementId, exchElementId) {
                this.constructTreeData.haveChange = true;
                this.constructTreeData.changeType.push(action);
                this.constructTreeData.dragElementId.push(dragElementId);
                this.constructTreeData.exchElementId.push(exchElementId);
            },

            //attrChangeData的push方法
            pushAttrChangeData: function (attr, changeId, changeValue) {
                dndData.attrChangeData.haveAttrChange = true;
                dndData.attrChangeData.changeAttr.push(attr);
                dndData.attrChangeData.changeId.push(changeId);
                dndData.attrChangeData.changeValue.push(changeValue);
            }
        };

        //拖拽过程处理函数(ondrag)
        var dndProcessHandlder = function(e) {
            e.stopPropagation();
            
            var $this = dndData.dragElement,
                thisId = $this.eq(0).attr('id'),

                moveY = e.pageY - dndData.orginY,

                dragElementParent = dndData.dragElementParent,

                prevElement = $this.prev(),
                nextElement = $this.next(),

                parentIsPage = dragElementParent.hasClass('page__hd') 
                                || dragElementParent.hasClass('page__bd') 
                                || dragElementParent.hasClass('page__ft'),

                referHeight = 30; //位置变换的参考高度

            //小于参考高度的 -2/3 使用before()
            if (moveY <= -referHeight / 3 * 2) {

                if (prevElement.length) {

                    //被拖拽的元素前还有前兄弟元素，就before()到其前面去
                    dndData.pushConstrData('before', thisId, prevElement.eq(0).attr('id'));

                    prevElement.before($this);

                    dndData.orginY = e.pageY;


                } else if (dragElementParent.data('is-container')) {

                    //被拖拽的元素前没有前兄弟元素，但父元素是容器，就将其before到其父元素前面去
                    dndData.pushConstrData('outPrev', thisId, dragElementParent.eq(0).attr('id'));

                    dragElementParent.before($this);

                    if (!parentIsPage) {

                        if (dragElementParent.height() < 20) {
                            dragElementParent.css({
                                height: '20px'
                            });

                            dndData.pushAttrChangeData('height', dragElementParent.eq(0).attr('id'), '20px');
                        }
                    }

                    dndData.orginY = e.pageY;
                    dndData.dragElementParent = $this.parent();
                }else if(dragElementParent.hasClass('page__ft') || dragElementParent.hasClass('page__bd')) {

                    //被拖拽的元素没有前兄弟元素且其父元素是 page__bd 或 page__ft 就append到其父元素的前兄弟元素里面去
                    dndData.pushConstrData('outPrev', thisId, dragElementParent.eq(0).attr('id'));
                    dndData.pushConstrData('appendPrev', thisId, dragElementParent.prev().eq(0).attr('id'));

                    dragElementParent.prev().append($this);

                    if (!parentIsPage) {

                        if (dragElementParent.height() < 20) {
                            dragElementParent.css({
                                height: '20px'
                            });
                            
                            dndData.pushAttrChangeData('height', dragElementParent.eq(0).attr('id'), '20px');
                        }
                    }
                }

                dndData.orginY = e.pageY;
                dndData.dragElementParent = $this.parent();

                //小于参考高度的 -2/3 使用after()
            } else if (moveY >= referHeight / 3 * 2) {

                if (nextElement.length) {

                    //被拖拽的元素前还有后兄弟元素，就after()到其后面去
                    dndData.pushConstrData('next', thisId, nextElement.eq(0).attr('id'));

                    nextElement.after($this);

                    dndData.orginY = e.pageY;

                } else if (dragElementParent.data('is-container')) {

                    //被拖拽的元素前没有后兄弟元素，但父元素是容器，就将其after到其父元素后面去
                    dndData.pushConstrData('outNext', thisId, dragElementParent.eq(0).attr('id'));

                    dragElementParent.after($this);
                    if (!parentIsPage) {
                        if (dragElementParent.height() < 20) {
                            dragElementParent.css({
                                height: '20px'
                            });
                            
                            dndData.pushAttrChangeData('height', dragElementParent.eq(0).attr('id'), '20px');
                        }
                    }

                    dndData.orginY = e.pageY;
                    dndData.dragElementParent = $this.parent();

                }else if (dragElementParent.hasClass('page__bd') || dragElementParent.hasClass('page__hd')) {

                    //被拖拽的元素没有后兄弟元素且其父元素是 page__bd 或 page__ft 就append到其父元素的后兄弟元素里面去
                    dndData.pushConstrData('outPrev', thisId, dragElementParent.eq(0).attr('id'));
                    dndData.pushConstrData('appendPrev', thisId, dragElementParent.next().eq(0).attr('id'));

                    dragElementParent.next().append($this);

                    if (!parentIsPage) {

                        if (dragElementParent.height() < 20) {
                            dragElementParent.css({
                                height: '20px'
                            });
                            
                            dndData.pushAttrChangeData('height', dragElementParent.eq(0).attr('id'), '20px');
                        }
                    }
                }

                dndData.orginY = e.pageY;
                dndData.dragElementParent = $this.parent();


                //小于参考高度的 -1/3 且大于参考高度的 -2/3 使用 append()
            } else if (moveY < -referHeight / 3 && moveY > -referHeight / 3 * 2 &&
                prevElement.length && prevElement.data('is-container')) {

                //从下往上拖，用 append()
                dndData.pushConstrData('appendPrev', thisId, prevElement.eq(0).attr('id'));

                prevElement.append($this);

                //容器高度
                if (!parentIsPage) {

                    prevElement.css({
                        height: 'auto'
                    })

                    dndData.pushAttrChangeData('height', prevElement.eq(0).attr('id'), 'auto');

                }

                dndData.orginY = e.pageY;
                dndData.dragElementParent = $this.parent();

            } else if (moveY > referHeight / 3 && moveY < referHeight / 3 * 2 &&
                nextElement.length && nextElement.data('is-container')) {

                //从上往下拖，用 prepend()
                dndData.pushConstrData('prependNext', thisId, nextElement.eq(0).attr('id'));

                nextElement.prepend($this);

                //容器高度
                if (!parentIsPage) {

                    nextElement.css({
                        height: 'auto'
                    })

                    dndData.pushAttrChangeData('height', nextElement.eq(0).attr('id'), 'auto');

                }

                dndData.orginY = e.pageY;
                dndData.dragElementParent = $this.parent();
            }
        }

        //拖拽结束处理函数
        var dndEndHandler = function(e) {
            e.stopPropagation();

            jq(e.currentTarget).css('opacity', '1');

            //空容器直接remove掉
            // jq('body').find('*').each(function() {
            //     if (jq(this).data('is-container') && jq(this).children().length == 0 && jq(this).height() == 0) {
            //         jq(this).remove();
            //         postMessageToFather.ctrlRemoved(jq(this).data('controller'));
            //     }
            // })

            //属性比如容器高度改变
            if (dndData.attrChangeData.haveAttrChange) {
                postMessageToFather.attrChangeFromDrag(dndData.attrChangeData);
            }

            //组件树结构改变
            if (dndData.constructTreeData.haveChange) {
                postMessageToFather.ctrlExchanged(dndData.constructTreeData);
            }

            postMessageToFather.ctrlUpdated({
                params: {
                    key: ''
                }
            });
        }

        function ComponentsGenerator(params) {

            console.log(params);

            params.initElem = params.initElem || false;

            this.controller = params.controller;

            this.page = params.page;

            this.tag = typeof this.controller.tag == 'object' ? this.controller.tag[0] : this.controller.tag;

            this.elemLoaded = false;
            this.refresh = false;

            if (!this.tag) {
                alert('组件数据结构出错');
                return false;
            }

            if (params.initElem) {
                this.initElem();
            }

            return this;
        }

        ComponentsGenerator.prototype = {

            initElem: function() {

                if (!this.elemLoaded) {
                    var docCtrl = jq('#' + this.controller.key);

                    this.elem = docCtrl.length > 0 ? docCtrl : jq(document.createElement(this.tag));
                    this.elemLoaded = true;
                    this.refresh = docCtrl.length > 0;
                }

                return this.elem;
            },

            bindData: function() {

                this.initElem();

                this.elem.data('controller', this.controller);
                this.elem.data('is-controller', true);

                //局部CSS实现方案
                this.elem.attr(this.page.key, 'true');

            },

            handleWeuiTag: function(weuiType) {

                var self = this;

                var weuiTypeAction = {

                    button: function() {

                        for (var att in this.controller.attr) {
                            var currentAttr = this.controller.attr[att];


                        }

                    }

                };

                if (weuiTypeAction[weuiType]) {
                    weuiTypeAction[weuiType]();
                }

            },

            attrIsUseless: function(att) {
                this.uselessAttr = [
                    'addGrid', 'addPreviewerItem', 'addPreviewerFooterBtn'
                ];
                return this.uselessAttr.indexOf(att) > -1;
            },

            setAttribute: function() {

                this.initElem();

                // this.handleWeuiTag(this.controller.weui);

                for (var att in this.controller.attr) {
                    var currentAttr = this.controller.attr[att];

                    if (this.attrIsUseless(att)) {
                        continue;
                    }

                    if (currentAttr.isClassName) {
                        //更改的属性有css，则需要进行css操作

                        if (this.refresh && currentAttr.value) {
                            var isClsInVal = false;

                            for (var i = 0; i < currentAttr.value.length; i++) {
                                var currentAttrVal = currentAttr.value[i];

                                if (currentAttrVal == currentAttr._value) {
                                    isClsInVal = true;
                                    break;
                                }
                            };

                            if (isClsInVal && currentAttr.isNoConflict) {
                                // 不是添加控件而是刷新控件, 先重置为基本class再加新class
                                this.elem.attr('class', this.controller.baseClassName);
                            }
                        }

                        if (currentAttr.isSetAttribute) {
                            //对于某些控件既需要css，也需要attribute属性，比如禁止状态的按钮，需要disabled属性和css类
                            this.elem.attr(att, currentAttr._value);

                            //禁止按钮特殊处理
                            if (currentAttr._value && currentAttr.value) {
                                for (var j = 0; j < currentAttr.value.length; j++) {
                                    var currentDisabledCSS = currentAttr.value[j];
                                    this.elem.addClass(currentDisabledCSS);
                                };
                            }

                            if (!currentAttr._value && currentAttr.value) {
                                for (var j = 0; j < currentAttr.value.length; j++) {
                                    var currentDisabledCSS = currentAttr.value[j];
                                    this.elem.removeClass(currentDisabledCSS);
                                };
                            }

                        }

                        if (currentAttr.isSingleToggleClass) {
                            //针对某些对一个类进行开关的属性
                            if (currentAttr._value && currentAttr.value) {
                                for (var j = 0; j < currentAttr.value.length; j++) {
                                    var currentDisabledCSS = currentAttr.value[j];
                                    this.elem.addClass(currentDisabledCSS);
                                };
                            } else {
                                for (var j = 0; j < currentAttr.value.length; j++) {
                                    var currentDisabledCSS = currentAttr.value[j];
                                    this.elem.removeClass(currentDisabledCSS);
                                };
                            }
                        }

                        if (currentAttr.isNeedPrefixClass) {
                            if (currentAttr.isToggleButtonSize) {
                                currentAttr._value = currentAttr._value == 'default' ? '' : currentAttr._value;
                            }
                            if (typeof currentAttr._value == 'boolean') {
                                //开关操作

                                if (currentAttr._value && currentAttr.value) {
                                    for (var i = 0; i < currentAttr.value.length; i++) {
                                        var val = currentAttr.value[i];
                                        if (this.elem.attr('class').indexOf(val) != -1) {
                                            this.elem.addClass(currentAttr.prefixClassValue + val);
                                            break;
                                        }
                                    };
                                } else {
                                    for (var i = 0; i < currentAttr.value.length; i++) {
                                        var val = currentAttr.value[i];
                                        if (this.elem.attr('class').indexOf(val) != -1) {
                                            this.elem.removeClass(currentAttr.prefixClassValue + val);
                                            break;
                                        }
                                    };
                                }

                            } else {
                                this.elem.addClass(currentAttr.prefixClassValue + currentAttr._value);
                            }
                        } else {
                            this.elem.addClass(currentAttr._value);
                        }
                    }

                    if (currentAttr.isSetAttribute) {
                        if (currentAttr.isContrary) {
                            this.elem.attr(att, !currentAttr._value);
                        } else {

                            if (currentAttr.isFormType) {
                                this.elem.attr('type', currentAttr._value);
                            } else {
                                this.elem.attr(att, currentAttr._value);
                            }
                        }
                    }

                    if (currentAttr.isHTML) {
                        if (currentAttr.isNeedAppend) {

                            if (currentAttr.appendBefore) {
                                this.elem.html(currentAttr.value + this.controller.attr.value._value);
                            }

                        } else {
                            this.elem.html(currentAttr._value);
                        }
                    }

                    //设置默认样式，如容器的默认高度
                    if (currentAttr.isStyle) {
                        if (currentAttr.isMultiplyStyle) {
                            var styles = currentAttr._value.split(';');
                            for (var i = 0, len = styles.length - 1; i < len; i++) {
                                var styleNameAndVal = styles[i].split(':');
                                this.elem.css(styleNameAndVal[0].trim(), styleNameAndVal[1].trim());
                            }
                        } else {
                            if (currentAttr.isToggleStyle) {
                                this.elem.css(att, currentAttr._value ? currentAttr.value[1] : currentAttr.value[0]);
                            } else if (currentAttr.isPercent) {
                                this.elem.css(att, currentAttr._value + '%');
                            } else if (currentAttr.unitName) {
                                this.elem.css(att, currentAttr._value + currentAttr.unitName);
                            } else {
                                this.elem.css(att, currentAttr._value);
                            }
                        }
                    }

                    if (currentAttr.isBoundToId) {
                        //一些label获取id
                        var id = '';
                        var getRadioInputId = function(controller) {
                            for (var i = 0; i < controller.children.length; i++) {
                                if (controller.children[i].type == currentAttr.bindType) {
                                    id = controller.children[i].key;
                                    break;
                                }
                                if (typeof controller.children[i].children != 'undefined') {
                                    getRadioInputId(controller.children[i]);
                                }
                            }
                            return id;
                        }
                        this.elem.attr(att, getRadioInputId(this.controller));
                    }

                    if (currentAttr.isCreateAttr) {
                        //一些在创建元素时需设置的属性，比如是否需要可拖拽
                        this.att = currentAttr._value;
                    }

                    if (currentAttr.isRander == true) {
                        //针对某些子组件要不要渲染的情况，如页脚文字或链接
                        var getRanderObj = function(controller) {
                            for (var i = 0; i < controller.children.length; i++) {
                                if (controller.children[i].isRander == att) {
                                    return {
                                        parent: controller,
                                        child: controller.children[i]
                                    };
                                }
                            }
                            if (typeof controller.children[i].children !== 'undefined') {
                                getRanderObj(controller.children[i])
                            }
                        }

                        var obj = getRanderObj(this.controller);
                        if (!currentAttr._value) {
                            obj.parent.children.splice(obj.child, 1);
                        }
                    }

                    //设置容器属性
                    if (currentAttr.isContainer) {
                        this.elem.data('is-container', true);
                    }

                    //阻止用户在设计器中改变表单的值
                    if (att == 'value' || att == 'checked') {
                        this.elem.attr('readonly', true);
                    }

                }

                this.elem.attr('id', this.controller.key);

                return this.elem;
            },

            createElement: function() {
                var self = this;

                this.initElem();

                if (this.controller.baseClassName) {
                    this.elem.addClass(this.controller.baseClassName);
                }

                this.setAttribute();
                this.bindData();

                var component = this.elem;

                if (this.controller.children && this.controller.children.length > 0) {

                    for (var i = 0; i < this.controller.children.length; i++) {
                        var currentCtrl = this.controller.children[i],

                            reComGenerator = new ComponentsGenerator({
                                controller: currentCtrl,
                                page: self.page
                            }),

                            loopComponent = reComGenerator.createElement(),

                            jqComponent = jq(component);

                        jqComponent.append(jq(loopComponent));

                    };

                }
                if (!this.controller.attr.isComponent) {
                    this.makeElemAddedDraggable();
                }
                return component;
            },

            makeElemAddedDraggable: function() {
                var elem = this.elem;

                // elem.attr('draggable', true);

                elem.on('dragstart', function(e) {

                    // e.originalEvent.dataTransfer.effectAllowed = "move";

                    //初始化会改变的属性数据
                    dndData.attrChangeData.haveAttrChange = false;
                    dndData.attrChangeData.changeId = [];
                    dndData.attrChangeData.changeAttr = [];
                    dndData.attrChangeData.changeValue = [];

                    //初始化会改变的左边结构树的数据
                    dndData.constructTreeData.haveChange = false;
                    dndData.constructTreeData.changeType = [];
                    dndData.constructTreeData.dragElementId = [];
                    dndData.constructTreeData.exchElementId = [];

                    e.stopPropagation();

                    //初始化拖拽过程中的数据
                    dndData.dragElement = jq(e.currentTarget);
                    dndData.orginY = e.pageY;
                    dndData.dragElementParent = dndData.dragElement.parent();

                    if (dndData.dragElement.hasClass('hight-light')) {
                        e.originalEvent.dataTransfer.setData('Text', 'fromSelf');
                        jq(e.currentTarget).css('opacity', '.3');
                    } else {
                        return false;
                    }

                    //无关属性置false
                    dndData.addCtrlbyAfter.isAfter = false;

                });
                elem.on('drag', function(e) {

                    dndProcessHandlder(e);

                });

                elem.on('dragenter', function(e) {
                    e.stopPropagation();
                })

                elem.on('dragleave', function(e) {
                    console.log('离开')
                        // if (elem.hasClass('page__bd')) {
                        //     dndData.dragAddCtrl.remove();
                        // }
                })

                elem.on('dragend', function(e) {

                    dndEndHandler(e);

                });
            }

        }

        var evtHandler = function() {

            window.addEventListener("message", function(evt) {

                var data = evt.data,
                    eventName = '',

                    evtAction = {

                        previewerLayoutLoaded: function() {
                            var LG = new layoutGenerator(data);

                            var dnd = new dndInitialization({
                                rowSelector: '#dnd-row',
                                comSelector: '.app-components',
                                containerSelector: '#container'
                            });
                        },

                        pageAdded: function() {
                            var RG = new routerGenerator(data);
                            pageManager
                                .push(getPageConfig(data.key, data.key, data.key))
                                .go(data.key);

                            pageOperations.refreshApp(data);
                            controllerOperations.hideDesignerDraggerBorder();
                        },

                        attrRefreshed: function() {
                            pageOperations.refreshApp(data);
                        },

                        pageRemoved: function() {
                            pageManager.remove(data);
                        },

                        pageSelected: function() {
                            pageManager.go(data.key);
                            controllerOperations.hideDesignerDraggerBorder();
                            setTimeout(function() {
                                pageOperations.refreshApp(data);
                                postMessageToFather.stopRouting();
                            }, 100);
                        },

                        ctrlGenerated: function() {

                            console.log('ctrlGenerated');

                            var controller = data.controller;

                            comGen = new ComponentsGenerator({
                                    controller: controller,
                                    initElem: true,
                                    page: data.page
                                }),

                                elem = jq(comGen.createElement());

                            dndData.dragAddCtrl = elem;
                            dndData.dragAddCtrlData = controller;

                            if(data.isManaully) {
                                jq(parent.parent.currentTarget).append(elem.clone(true));
                                var pageId = location.hash.split('#')[1] || 'page-home';
                                jq('script[id="' + pageId + '"]').html(jq('.' + pageId).clone(true));
                                controllerOperations.select(data.controller);
                            }

                        },

                        controllerAdded: function () {
                            console.log(data);
                            var pageId = location.hash.split('#')[1] || 'page-home';
                            jq('script[id="' + pageId + '"]').html(jq('.' + pageId).clone(true));
                            controllerOperations.select(data.controller);
                        },

                        ctrlRemoved: function() {
                            var self = controllerState.currentActiveCtrlDOM;
                            if (self) {
                                self.remove();
                            }
                        },

                        ctrlUpdated: function() {

                        },

                        ctrlAttrRefreshed: function() {
                            controllerOperations.refresh(data.controller, data.page);
                        },

                        ctrlSelected: function() {
                            controllerOperations.select(data, true);
                        },

                        toggleTabBar: function() {
                            pageOperations.tabBar.refreshTabBar(data.checked, data.tabBar);
                        },

                        tabBarAdded: function() {
                            pageOperations.tabBar.refreshTabBar(true, data);
                        },

                        tabBarRemoved: function() {
                            pageOperations.tabBar.refreshTabBar(true, data);
                        },

                        tabBarUpdated: function() {
                            pageOperations.tabBar.refreshTabBar(true, data);
                        },

                        CSSUpdated: function() {
                            pageOperations.css.refresh(data);
                        }
                    };

                for (var key in data) {
                    eventName = key
                }

                if (evtAction[eventName]) {
                    data = data[key];
                    evtAction[eventName]();
                }
            });

        }();

    }();
});
