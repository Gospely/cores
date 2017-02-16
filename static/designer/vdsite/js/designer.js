$(function() {
	if (document.domain != 'localhost') {
		document.domain = 'gospely.com';
	}

	var jq = jQuery.noConflict();

	//拖拽过程中的一些数据
	var dndData = {
		//开始拖拽时生成的dom
		elemToAdd: '',

		//拖拽增加控件时生成的控件的数据
		ctrlToAddData: ''

	};

	var dndHandlder = function () {

		var parentWindow = window.parent;

		//点击组件
		jq(document).on("click", function (e) {
			e.stopPropagation();
			var targetData = jq(e.target).data('controller');
            if(!targetData) {
                controllerOperations.desSelect(targetData);                
            }
		})

		//给父级发送消息
		var postMessageToFather = {
			ctrlClicked: function (c) {
				parentWindow.postMessage({ 'ctrlClicked': c }, "*");
			},

			pageSelected: function (c) {
				parentWindow.postMessage({ 'pageSelected': c }, "*");
			},

			generateCtrlTree: function(c) {
				parentWindow.postMessage({ 'generateCtrlTree': c }, "*");
			},

			elemAdded: function (c) {
				parentWindow.postMessage({ 'elemAdded': c }, "*");
			},

			ctrlSelected: function (c) {
				parentWindow.postMessage({ 'ctrlSelected': c }, "*");
			}
		};

		//监听父级消息
		var listenParentMessage = function() {

            var self = this;

            window.addEventListener('message', function(evt) {

                var data = evt.data;
                var eventName = '';

                var evtAction = {
                    ctrlTreeGenerated: function() {
                        var elem = new ElemGenerator(data.controller);
                        var elemToAdd = jq(elem.createElement());
                        dndData.elemToAdd = elemToAdd;
                        dndData.ctrlToAddData = data.controller;
                    },

                    VDAttrRefreshed: function() {
                        controllerOperations.refreshCtrl(data.activeCtrl, data.attr, data.attrType);
                        controllerOperations.select(data.activeCtrl, true);
                    }
                };

                for (var key in data) {
                    eventName = key;
                }

                if (evtAction[eventName]) {
                    data = data[key];
                    evtAction[eventName]();
                }

            });

        }();

		//对控件的一些操作
		var controllerOperations = {
			hideDesignerDraggerBorder: function () {
                jq('#vd-OutlineSelectedActiveNode').hide();
			},

			showDesignerDraggerBorder: function (target) {
                jq('#vd-OutlineSelectedActiveNode').css({
                    top: target.offset().top,
                    left: target.offset().left,
                    width: target.outerWidth(),
                    height: target.outerHeight(),
                    display: 'block'
                });
			},

			desSelect: function (data) {
			},

            select: function(data, notPostMessage) {
                notPostMessage = notPostMessage || false;
                controllerOperations.showDesignerDraggerBorder(jq('[vdid=' + data.vdid + ']'))
                if(!notPostMessage) {
                    postMessageToFather.ctrlSelected(data);                    
                }
            },

            refreshCtrl: function(activeCtrl, attr, attrType) {
                new ElemGenerator(activeCtrl).setAttributeByAttr(attr, attrType);
            }
		};

		//点击其他区域隐藏border和i
        jq("body").on("click", function(e) {
            // controllerOperations.hideDesignerDraggerBorder();
            // postMessageToFather.pageSelected({
            //     key: ''
            // });
            
        });

        //拖拽初始化类
        function DndInitialization(options) {

            var self = this;

            this.containerSelector = '#VDDesignerContainer';
            this.inter = 0;

            this.makeComponentsDraggable();

        	jq(self.containerSelector).on("drop", function (e) {
        		e.preventDefault();
        		e.stopPropagation();
        		var elemAdded = jq(self.containerSelector).append(dndData.elemToAdd);
        		postMessageToFather.elemAdded(dndData.ctrlToAddData);
        		controllerOperations.showDesignerDraggerBorder(dndData.elemToAdd);
        	})

        	jq(self.containerSelector).on("dragover", function (e) {
        		e.preventDefault();
        	})

        }

        DndInitialization.prototype = {
        	makeComponentsDraggable: function(cb) {
        		var self = this;
        		var components = jq(parentWindow.document, parentWindow.document).find('.anticons-list-item');
        		
        		components.each(function(n) {
        			jq(this).attr("draggable", true);
        			jq(this).on("dragstart", function (e) {
		        		postMessageToFather.generateCtrlTree(parentWindow.VDDnddata);
		        		e.stopPropagation();
		        	});

		        	jq(this).on("dragend", function (e) {
		        		e.preventDefault();
		        	});
        		})
        	}
        }

        //生成dom类
        function ElemGenerator(params) {
        	this.controller = params;
        	this.tag = typeof this.controller.tag == 'object' ? this.controller.tag[0] : this.controller.tag;
        	this.elemLoaded = false;
        	return this;
        }

        ElemGenerator.prototype = {

        	initElem: function () {
        		if (!this.elemLoaded) {
                    var docCtrl = jq('[vdid='+ this.controller.vdid + ']');
                    this.elem = docCtrl.length > 0 ? docCtrl : jq(document.createElement(this.tag));
                    this.elemLoaded = true;
                    // this.refresh = docCtrl.length > 0;
                }
        	},

        	bindData: function () {
        		this.initElem();
        		this.elem.data('controller', this.controller);
        	},

            setCustomAttr: function(attr) {
                var self = this;
                var attrAction = {
                    add: function() {
                        self.elem.attr(attr.value.key, attr.value.value);
                    },

                    modify: function() {
                        self.elem.attr(attr.attrName, attr.value);
                    },

                    remove: function() {
                        self.elem.attr(attr.attrName, '');
                    }
                }

                if(attrAction[attr.action]) {
                    attrAction[attr.action]();
                }
            },

            setBasic: function(attr) {

                if(attr.isAttr) {
                    if(attr.value) {
                        this.elem.attr(attr.attrName, attr.value);
                    }
                }

                if(attr.isScreenSetting) {
                    var className = attr.value,
                        currentCtrlClass = this.elem.attr('class');

                    if(currentCtrlClass) {
                        var currentCtrlClassList = currentCtrlClass.split(' ');
                        for (var i = 0; i < currentCtrlClassList.length; i++) {
                            var cls = currentCtrlClassList[i];
                            for (var j = 0; j < attr.valueList.length; j++) {
                                var val = attr.valueList[j];
                                if(val.value == cls) {
                                    this.elem.removeClass(cls);
                                }
                            };
                        };
                    }

                    for (var i = 0; i < className.length; i++) {
                        var cls = className[i];
                        this.elem.addClass(cls);
                    };
                }

            },

            setAttr: function(attr) {
                if(attr.isHTML) {
                    this.elem.html(attr.value);
                }

                if(attr.isTag) {
                    // this.elem.
                }
            },

            setLinkSetting: function(attr) {
                console.log('attr');

                if(attr.isHTML) {
                    this.elem.attr(attr.attrName, attr.value);
                }
            },

            setImageSetting: function(attr) {
                if(attr.attrName == 'src') {
                    if(attr.value != '') {
                        this.withImage = true;
                    }
                }

                if(attr.isAttr) {
                    this.elem.attr(attr.attrName, attr.value);
                }

                if(attr.isImagePlaceholder) {
                    if(!this.withImage) {
                        this.elem.attr('src', 'https://d3e54v103j8qbb.cloudfront.net/img/image-placeholder.svg');
                    }
                }
            },

            transformTypeToUpper: function(type) {
                var settingTypeSplit = type.split('-'),
                    upperTypeName = '';
                for (var j = 0; j < settingTypeSplit.length; j++) {
                    var type = settingTypeSplit[j];
                    type = type.replace(/^\S/,function(s){return s.toUpperCase();});
                    upperTypeName += type;
                };

                return upperTypeName;
            },

        	setAttribute: function () {
        		this.initElem();
        		for(var i = 0, len = this.controller.attrs.length; i < len; i ++) {
        			var attr = this.controller.attrs[i];

                    if(attr.isAttrSetting) {
                        //基础属性设置（无复杂交互）统一处理
                        for (var j = 0; j < attr.children.length; j++) {
                            var att = attr.children[j];
                            this.setAttr(att);
                        };
                    }else {

                        //调用所需要的属性设置类型
                        var upperTypeName = this.transformTypeToUpper(attr.key);

                        if(this['set' + upperTypeName]) {
                            for (var j = 0; j < attr.children.length; j++) {
                                var att = attr.children[j];
                                this['set' + upperTypeName](att);
                            };
                        }

                    }
        		}

        		this.elem.attr('vdid', this.controller.vdid);
        	},

            setAttributeByAttr: function(attr, attrType) {
                this.initElem();
                this.bindData();
                var upperTypeName = this.transformTypeToUpper(attrType.key);
                if(attrType.isAttrSetting) {
                    this.setAttr(attr);
                }else {
                    if(this['set' + upperTypeName]) {
                        this['set' + upperTypeName](attr);
                    }                    
                }
            },

        	createElement: function () {
        		var self = this;

        		this.initElem();
        		this.bindData();
        		this.setAttribute();

        		var className = this.controller.className;
        		if (className) {
        			for(var i = 0, len = className.length; i < len; i ++) {
        				this.elem.addClass(className[i]);
        			}
        		}

        		var component = this.elem;

        		if (this.controller.children && this.controller.children.length > 0) {

                    for (var i = 0; i < this.controller.children.length; i++) {
                        var currentCtrl = this.controller.children[i],

                            reComGenerator = new ElemGenerator(currentCtrl),

                            loopComponent = reComGenerator.createElement(),

                            jqComponent = jq(component);

                        jqComponent.append(jq(loopComponent));

                    };

                }

                this.listenHover();
                this.listenClick();

                this.makeElemAddedDraggable();

                return component;
        	},

            listenHover: function() {
                var self = this;
                this.elem.hover(function(e) {
                    var target = jq(e.target);
                    var targetHeight = 0;

                    targetHeight = target.height();

                    jq('#vd-OutlineSelectedHoverNode').css({
                        top: target.offset().top,
                        left: target.offset().left,
                        width: target.outerWidth(),
                        height: target.outerHeight(),
                        display: 'block'
                    });
                }, function(e) {
                    jq('#vd-OutlineSelectedHoverNode').hide();
                });
            },

            listenClick: function() {
                var self = this;
                this.elem.click(function(e) {
                    e.stopPropagation();
                    var target = jq(e.target);
                    controllerOperations.select(target.data('controller'));
                    return false;
                });
            },

        	makeElemAddedDraggable: function () {
        		console.log('要拖了吗？')
        	}
        }

        new DndInitialization();
	};

	//iframe加载完再执行
	window.addEventListener('message', function (evt) {
		var eventName = '',
			data = evt.data;

		for(var key in data) {
			eventName = key
		}

		if(eventName == 'VDDesignerLoaded') {
			dndHandlder();
		}
		
	})

})