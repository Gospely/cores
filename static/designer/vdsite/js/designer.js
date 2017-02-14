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
            if(targetData) {
                controllerOperations.selected(targetData);                
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
                            console.log(elemToAdd)
                            dndData.elemToAdd = elemToAdd;
                            dndData.ctrlToAddData = data.controller;
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
				
			},

			showDesignerDraggerBorder: function (elem) {
				jq(".designerBorder").removeClass('designerBorder');
				elem.addClass('designerBorder')
			},

			selected: function (data) {
				controllerOperations.showDesignerDraggerBorder(jq('[vdid=' + data.vdid + ']'))
				postMessageToFather.ctrlSelected(data);
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

        		jq(self.containerSelector).append(dndData.elemToAdd);

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
		        	})

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
                    var docCtrl = jq('#' + this.controller.key);

                    this.elem = docCtrl.length > 0 ? docCtrl : jq(document.createElement(this.tag));
                    this.elemLoaded = true;
                    // this.refresh = docCtrl.length > 0;
                }
        	},

        	bindData: function () {

        		this.initElem();
        		this.elem.data('controller', this.controller);

        	},

        	setAttribute: function () {

        		this.initElem();

        		for(var i = 0, len = this.controller.attrs.length; i < len; i ++) {
        			var attr = this.controller.attrs[i];

        			//更换标签
        			if (attr.isTag) {
        				console.log('换标签啦');
        			}
        		}

        		this.elem.attr('VDId', this.controller.vdid);

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

                            reComGenerator = new ComponentsGenerator({
                                controller: currentCtrl
                            }),

                            loopComponent = reComGenerator.createElement(),

                            jqComponent = jq(component);

                        jqComponent.append(jq(loopComponent));

                    };

                }

                this.makeElemAddedDraggable();

                return component;
        	},

        	makeElemAddedDraggable: function () {
        		console.log('要拖了吗？')
        	}
        }

        setTimeout(function() {
            var test = new DndInitialization();
        }, 1000);

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