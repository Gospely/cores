var init = function() {

	document.domain = location.hostname;

	var jq = jQuery.noConflict(),
		pageAction = {

			changeNavigationBarTitleText: function(title) {
				jq('#gospel-app-title').html(title);
			},

			changeNavigationBarBackgroundColor: function(color) {
				jq('#navigation-bar').css('background-color', color);
			},

			changeNavigationBarTextStyle: function(style) {
				var color = style == 'white' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';

				jq('#gospel-app-title').css('color', color);

				if(style == 'white') {
					jq('.head-option .head-option-icon').addClass('white');
					jq('.head-home .head-home-icon').addClass('white');
				}else {
					jq('.head-option .head-option-icon').removeClass('white');
					jq('.head-home .head-home-icon').removeClass('white');					
				}
			},

			changeBackgroundTextStyle: function(style) {
				style = style == 'light' ? '200' : '800';
				jq('#gospel-app-title').css('font-weight', style);
			},

			changeBackgroundColor: function(color) {
				$('body').css('background-color', color);
			}

		},

		initApp = function(designer) {
			var layout = designer.layout,
				layoutState = designer.layoutState,
				app = layout[0],
				pages = app.children;

			window.wholeAppConfig = app.attr;
			window.layoutState = layoutState;

			pageAction.changeNavigationBarTitleText(app.attr.window._value.navigationBarTitleText._value);
			pageAction.changeNavigationBarBackgroundColor(app.attr.window._value.navigationBarBackgroundColor._value);
			pageAction.changeNavigationBarTextStyle(app.attr.window._value.navigationBarTextStyle._value);
			pageAction.changeBackgroundTextStyle(app.attr.window._value.backgroundTextStyle._value);
			pageAction.changeBackgroundColor(app.attr.window._value.backgroundColor._value);

		},

		refreshApp = function(data) {

			var attr = {};

			if(data.attr.window) {
				attr = data.attr.window._value;
			}else {
				attr = data.attr;
			}

			pageAction.changeNavigationBarTitleText(attr.navigationBarTitleText._value);
			pageAction.changeNavigationBarBackgroundColor(attr.navigationBarBackgroundColor._value);
			pageAction.changeNavigationBarTextStyle(attr.navigationBarTextStyle._value);
			pageAction.changeBackgroundTextStyle(attr.backgroundTextStyle._value);
			pageAction.changeBackgroundColor(attr.backgroundColor._value);

		},

        initPreviewer = function(src) {

        	var previewFrame = document.createElement('iframe');
        	previewFrame.setAttribute('src', src);
        	previewFrame.setAttribute('name', 'gospel-previewer');
        	previewFrame.setAttribute('id', 'preview-frame');

        	var designerOnload = function() {

        		parent.gospelDesignerPreviewer = window.frames['gospel-previewer'];
        		window.gospelDesignerPreviewer = parent.gospelDesignerPreviewer;

				parent.postMessage({
					previewerLoaded: {
						loaded: true
					}
				}, '*');
        	}

		    if (previewFrame.attachEvent){
		        previewFrame.attachEvent("onload", function(){
		          	designerOnload();
		        });
		    } else {
		        previewFrame.onload = function(){
		          	designerOnload();
		        };
		    }

		    $('body .head').after(previewFrame);
        }(location.origin + '/static/designer/vui/app/index.html');

	window.addEventListener("message", function (evt) {

		var data = evt.data;

		var evtAction = {

			attrRefreshed: function() {
				refreshApp(data);
			},

			layoutLoaded: function() {
				initApp(data);
			},

			appConfigRender: function() {
				refreshApp(data);
			}

		}

		var eventName = '';

		for(var key in data) {
			eventName = key
		}

		if(evtAction[eventName]) {
			data = data[key];
			evtAction[eventName]();
		}

	});

	//发送信息给父级页面
	var postMessageToFather = {

		pageSelected: function(c) {
			parent.postMessage({ 'pageSelected': c }, "*");
		}

	}
}();
