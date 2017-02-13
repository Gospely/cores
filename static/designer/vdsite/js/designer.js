$(function() {
	if (document.domain != 'localhost') {
		document.domain = 'gospely.com';
	}

	var jq = jQuery.noConflict();

	//拖拽过程中的一些数据
	var dndData = {
		//开始拖拽时生成的dom
		elemToAdd: ''
	};

	var dndHandlder = function () {

		var parentWindow = window.parent;

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
				console.log(4)
			}
		};

		//点击其他区域隐藏border和i
        jq("body").on("click", function(e) {
            controllerOperations.hideDesignerDraggerBorder();
            postMessageToFather.pageSelected({
                key: ''
            });
            
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

        		jq(self.containerSelector).append(dndData.elemToAdd)
        		
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

        		})
        	}
        }

        //生成dom类
        function ElemGenerator(params) {
        	
        	this.controller = params;

        	this.tag = typeof this.controller.tag == 'object' ? this.controller.tag[0] : this.controller.tag;

        	this.elemLoaded = false;

        }

        ElemGenerator.prototype = {

        	initElem: function () {
        		if (!this.elemLoaded) {
                    var docCtrl = jq('#' + this.controller.key);

                    this.elem = docCtrl.length > 0 ? docCtrl : jq(document.createElement(this.tag));
                    this.elemLoaded = true;
                    // this.refresh = docCtrl.length > 0;
                }
                console.log(this.controller)
        	},

        	bindData: function () {
        		this.elem.data('controller', this.controller);
        	},

        	createElement: function () {
        		var self = this;

        		this.initElem();
        		this.bindData();

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
        	},

        	makeElemAddedDraggable: function () {
        		console.log('要拖了吗？')
        	}
        }

        var test = new DndInitialization();

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