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