import './index.html';
import './index.css';
import dva from 'dva';

import createLoading from 'dva-loading';

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
	}
});

// 2. Plugins
//app.use({});
app.use(createLoading());

// 3. Model
app.model(require('./models/products'));
app.model(require('./models/ModelLeftSidebar'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
