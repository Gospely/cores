$(function() {
	if (document.domain != 'localhost') {
		document.domain = 'gospely.com';
	}

	var jq = jQuery.noConflict();

	var dndHandlder = function () {

		//给父级发送消息
		var postMessageToFather = {
			ctrlClicked: function (c) {
				parent.postMessage({ 'ctrlClicked': c }, "*");
			},

			pageSelected: function (c) {
				parent.postMessage({ 'pageSelected': c }, "*");
			},

			generateCtrlTree: function(c) {
				top.postMessage({ 'generateCtrlTree': c }, "*");
			}
		}

		//对控件的一些操作
		var controllerOperations = {
			hideDesignerDraggerBorder: function () {
				console.log(4)
			}
		}

		//点击其他区域隐藏border和i
        jq("body").on("click", function(e) {
            controllerOperations.hideDesignerDraggerBorder();
            postMessageToFather.pageSelected({
                key: ''
            });
            
        });

        //拖拽初始化
        function DndInitialization(options) {

            var self = this;

            // this.rowSelector = options.rowSelector;
            // this.comSelector = options.comSelector;
            // this.containerSelector = options.containerSelector;
            this.containerSelector = jq('#VDDesignerContainer');
            this.inter = 0;

            this.makeComponentsDraggable();

            // this.initEvents({
            //     onSourceController: function() {
            //         // self.makeComponentsDraggable();
            //     }
            // });

        }

        DndInitialization.prototype = {
        	makeComponentsDraggable: function(cb) {
        		
        		var self = this;
        		
        		var components = jq(parent.document).find('.anticons-list-item');

        		components.each(function(n) {
        			jq(this).attr("draggable", true)
        					.on("dragstart", function (e) {
        				var ctrlData = top.VDDnddata;
		        		console.log(ctrlData)
		        		postMessageToFather.generateCtrlTree(ctrlData);
		        	});
        		})
        	},

        	containerDragover: function() {
        		var self = this;
        		self.containerSelector.on("dragover", function (e) {
        			e.preventDefault();
        			console.log(1, window.parent.VDDnddata)
        		})
        	}
        }

        var test = new DndInitialization();
        // test.onDrop()

	};

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