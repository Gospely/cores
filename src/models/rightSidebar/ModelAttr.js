import React , {PropTypes} from 'react';
import dva from 'dva';
import { Form } from 'antd';
const FormItem = Form.Item;

export default {
	namespace: 'attr',
	state: {
		form: {
			keys: [0]
		},

		formItems: []
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
          		dispatch({
            		type: 'setFormItemsByDefault'
          		});
	      	});
		}		
	},

	effects: {

      	*setFormItemsByType({payload: params}, {call, put, select}) {
      		var controllersList = yield select(state => state.designer.controllersList);
      		var currentControllerKey = params.key;

      		var layouts = yield select(state => state.designer.layout);

      		var activePage = yield select(state => state.designer.layoutState.activePage);

      		var activeCtrl;

      		if(params.type == 'page') {

      			for (var i = 0; i < layouts.length; i++) {
      				var page = layouts[i];
      				if(page.key == params.key) {
      					activeCtrl = page;
      					break;
      				}
      			};

      		}else {
      			
      		}

      		// activePage = layouts[activePage.index];

      		console.log('currentControllerKey', activeCtrl, controllersList);

      		for (var i = 0; i < controllersList.length; i++) {
      			var controller = controllersList[i];
      			if(controller.type == params.type) {
		      		yield put({
		      			type: 'setFormItems',
		      			payload: activeCtrl.attr
		      		});
      				break;
      			}
      		};
      	},

      	*setFormItemsByDefault({payload: key}, {call, put, select}) {
      		var activeKey = yield select(state => state.designer.layoutState.activeKey);
      		var activePage = yield select(state => state.designer.layoutState.activePage);
      		var activeController = yield select(state => state.designer.layoutState.activeController);

      		var elemType = 'page';

      		if(activeKey == activePage.key) {
      			elemType = 'page';
      		}else {
      			elemType = 'controller';
      		}

      		yield put({
      			type: 'setFormItemsByType',
      			payload: {
      				key: activeKey,
      				type: elemType
      			}
      		})
      	}

	},

	reducers: {
		handleClick (state, {payload: key}) {
			return {...state, current: key};
		},

		setFormItems (state, {payload: attr}) {

			var tmpAttr = [];

			console.log('setFormItems', attr);

			for(var att in attr) {
				attr[att]['attrName'] = att;
				tmpAttr.push(attr[att]);
			}

			state.formItems = tmpAttr;
			return {...state};
		}
	}

}