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

      		// var currentController = 

      		for (var i = 0; i < controllersList.length; i++) {
      			var controller = controllersList[i];
      			if(controller.type == params.type) {
		      		yield put({
		      			type: 'setFormItems',
		      			payload: controller.attr
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

			for(var att in attr) {
				attr[att]['attrName'] = att;
				tmpAttr.push(attr[att]);
			}

			state.formItems = tmpAttr;
			return {...state};
		}
	}

}