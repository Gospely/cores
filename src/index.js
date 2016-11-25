import './index.html';
import './index.less';
import dva from 'dva';
import { message } from 'antd';

import createLoading from 'dva-loading';

localStorage.itemToCut = localStorage.itemToCut || undefined;
localStorage.itemToCopy = localStorage.itemToCopy || undefined;

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

// 2. Plugins
//app.use({});
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
app.model(require('./models/ModelDesigner'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
