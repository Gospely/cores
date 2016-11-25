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

	effects: {

      	*setFormItemsByType({payload: type}, {call, put, select}) {
      		var controllersList = yield select(state => state.designer.controllersList);
      		for (var i = 0; i < controllersList.length; i++) {
      			var controller = controllersList[i];
      			if(controller.type == type) {
		      		yield put({
		      			type: 'setFormItems',
		      			payload: controller.attr
		      		});
      				break;
      			}
      		};
      	},
	},

	reducers: {
		handleClick (state, {payload: key}) {
			return {...state, current: key};
		},

		setFormItems (state, {payload: attr}) {

			var tmpAttr = [];

			for(var att in attr) {
				console.log(att);
				attr[att]['attrName'] = att;
				tmpAttr.push(attr[att]);
			}

			console.log(tmpAttr);

			state.formItems = tmpAttr;
			return {...state};
		}
	}

}