import './index.html';
import './index.less';
import dva from 'dva';
import { message } from 'antd';
import createLoading from 'dva-loading';
import packUIStage from './utils/packUIState.js';
import auth from './utils/auth';

import dragging from './utils/dragging.js';

dragging();//

localStorage.itemToCut = localStorage.itemToCut || undefined;
localStorage.itemToCopy = localStorage.itemToCopy || undefined;

window.flag = false;
window.fileFlag = false;
window.isListenBGImageEvt = false;
window.placeholderImgBase64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTQwcHgiIGhlaWdodD0iMTQwcHgiIHZpZXdCb3g9IjAgMCAxNDAgMTQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxnPgogICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiBmaWxsPSIjRTBFMEUwIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCI+PC9yZWN0PgogICAgICA8cGF0aCBkPSJNOTIsODggTDQ4LDg4IEM0Ni45LDg4IDQ2LDg3LjEgNDYsODYgTDQ2LDU0IEM0Niw1Mi45IDQ2LjksNTIgNDgsNTIgTDkyLDUyIEM5My4xLDUyIDk0LDUyLjkgOTQsNTQgTDk0LDg2IEM5NCw4Ny4xIDkzLjEsODggOTIsODggWiBNNjguMjgwNSw3My41NzI1IEw2NC44NjU1LDcwLjA1MTUgTDU1LjIyOTUsODAuOTk5NSBMODUuMzQ5NSw4MC45OTk1IEw3NC41NjQ1LDY0LjY0NDUgTDY4LjI4MDUsNzMuNTcyNSBaIE02Mi45MTg1LDY0LjUyMzUgQzYyLjkxODUsNjIuNDI5NSA2MS4yMjA1LDYwLjczMjUgNTkuMTI2NSw2MC43MzI1IEM1Ny4wMzU1LDYwLjczMjUgNTUuMzM2NSw2Mi40Mjk1IDU1LjMzNjUsNjQuNTIzNSBDNTUuMzM2NSw2Ni42MTY1IDU3LjAzNTUsNjguMzEzNSA1OS4xMjY1LDY4LjMxMzUgQzYxLjIyMDUsNjguMzEzNSA2Mi45MTg1LDY2LjYxNjUgNjIuOTE4NSw2NC41MjM1IFoiIGlkPSJDb21iaW5lZC1TaGFwZSIgZmlsbD0iI0MyQzJDMiI+PC9wYXRoPgogIDwvZz4KPC9zdmc+";


if(document.domain != 'localhost') {
	window.debug = false;
	document.domain = 'gospely.com';
}else {
	window.debug = true;
}

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

// 1. 认证和状态同步
auth();
localStorage.flashState = 'false';

// 2. Initialize
const app = dva({
	initialState: {},

	onError(e) {
	  	message.error(e.message);
	}
});

// 3. Plugins
app.use({
	onStateChange: (data) => {

		if(!window.appRouter) {
			window.appRouter = app._history;
		}

		if(localStorage.flashState == 'true') {

			var state = app._store.getState();
			var UIState = packUIStage(state);
			var state = {
				applicationId: localStorage.applicationId,
				UIState: UIState,
			};
			var escape = false
			if(localStorage.image == 'wechat:latest' ||  localStorage.image == 'vd:site'){

				localStorage.UIState = JSON.stringify(state);
			}else{
				localStorage.UIState = JSON.stringify(state,function(key,value){

					if(key == 'content' || key == 'value'|| key == 'designer'){
						return undefined
					}else{
						return value;
					}
				});
			}
		}
	}
});

app.use(createLoading());

// 4. Model
app.model(require('./models/ModelIndexPage'));
app.model(require('./models/ModelLeftSidebar'));
app.model(require('./models/ModelRightSidebar'));
app.model(require('./models/ModelDevPanels'));
app.model(require('./models/editor/ModelTop'));
app.model(require('./models/editor/ModelEditor'));
app.model(require('./models/rightSidebar/ModelLayout'));
app.model(require('./models/rightSidebar/ModelFileTree'));
app.model(require('./models/rightSidebar/ModelAttr'));
app.model(require('./models/rightSidebar/ModelCommandPanel'));
app.model(require('./models/ModelDesigner'));
app.model(require('./models/ModelPreviewer'));
app.model(require('./models/ModelConstruction'));
app.model(require('./models/ModelUIState'));
app.model(require('./models/topbar/ModelDashboard'));
app.model(require('./models/rightSidebar/ModelCommonPreviewer'));
app.model(require('./models/vdsite/ModelVDPagesManager'));
app.model(require('./models/vdsite/ModelVDAsets'));
app.model(require('./models/vdsite/ModelVDCtrlTree'));
app.model(require('./models/vdsite/ModelVDCtrl'));
app.model(require('./models/vdsite/ModelVDStyle'));
app.model(require('./models/vdsite/ModelVDCore'));
app.model(require('./models/vdsite/ModelInteractions'));
app.model(require('./models/vdsite/ModelVDCollections'));
app.model(require('./models/topbar/ModelPreview'));
app.model(require('./models/topbar/ModelTemplateStore'));
// 5. Router
app.router(require('./router'));

// 6. Start
app.start('#root');
