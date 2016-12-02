import './index.html';
import './index.less';
import dva from 'dva';
import { message } from 'antd';

import createLoading from 'dva-loading';

import packUIStage from './utils/packUIState.js';

localStorage.itemToCut = localStorage.itemToCut || undefined;
localStorage.itemToCopy = localStorage.itemToCopy || undefined;
window.flag = false;

// 1. Initialize
const app = dva({
	initialState: {
		products: [{
			name: 'dva',
			id: 1
		}, {
			name: 'antd',
			id: 2
		}]
	},

	onError(e) {
	  	message.error(e.message);
	}
});

// 登录状态同步
function getCookie(c_name) {
	if (document.cookie.length > 0) {
	  	var c_start = document.cookie.indexOf(c_name + "=");
	  if (c_start != -1) {
	    c_start = c_start + c_name.length + 1;
	    var c_end = document.cookie.indexOf(";",c_start);
	    if (c_end == -1) c_end=document.cookie.length;
	    return unescape(document.cookie.substring(c_start,c_end));
	  }
	}
	return "";
}

var user = getCookie('user'), 
	token =  getCookie('token'), 
	userName =  getCookie('userName');

localStorage.user = user;
localStorage.token = token;
localStorage.userName = userName;

// 2. Plugins
//app.use({});
app.use({
	onStateChange: () => {
		var state = app._store.getState();
		var UIState = packUIStage(state);
		console.log('onStateChange', UIState);
	}
});

app.use(createLoading());

// 3. Model
app.model(require('./models/products'));
app.model(require('./models/ModelLeftSidebar'));
app.model(require('./models/ModelRightSidebar'));
app.model(require('./models/ModelDevPanels'));
app.model(require('./models/editor/ModelTop'));
app.model(require('./models/editor/ModelEditor'));
app.model(require('./models/rightSidebar/ModelLayout'));
app.model(require('./models/rightSidebar/ModelFileTree'));
app.model(require('./models/rightSidebar/ModelAttr'));
app.model(require('./models/ModelDesigner'));
app.model(require('./models/Modelpreviewer'));
app.model(require('./models/ModelConstruction'));
app.model(require('./models/ModelUIState'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
