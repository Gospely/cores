$(function() {
	if (document.domain != 'localhost') {
		document.domain = 'gospely.com';
	}

	var jq = jQuery.noConflict();

	var dndHandlder = function () {

		var parentWindow = parent;

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

            this.containerSelector = jq('#VDDesignerContainer');
            this.inter = 0;

            this.makeComponentsDraggable();

        }

        DndInitialization.prototype = {
        	makeComponentsDraggable: function(cb) {

        		var deepCopyObj = function(obj, result) {
        			result = result || {};
        			for(let key in obj) {

        				if (typeof obj[key] === 'object') {
        					result[key] = (obj[key].constructor === Array)? []: {};
        					deepCopyObj(obj[key], result[key]);
        				}else {
        					result[key] = obj[key];
        				}
        			}
        			return result;
        		}
        		
        		var self = this;
        		
        		var components = jq(parent.document).find('.anticons-list-item');
        		
        		components.each(function(n) {
        			jq(this).attr("draggable", true);
        			jq(this).on("dragstart", function (e) {

        				var ctrl = parentWindow.VDDnddata
        				var ctrlData = {
        					ctrl: ctrl
        				}
		        		console.log(ctrlData)
		        		postMessageToFather.generateCtrlTree(ctrlData);

		        	});
        		})
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