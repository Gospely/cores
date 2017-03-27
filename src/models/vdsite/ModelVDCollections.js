import React , {PropTypes} from 'react';
import dva from 'dva';
import { message, Modal } from 'antd';
import request from '../../utils/request';
import fetch from 'dva/fetch';

export default {
	namespace: 'vdCollections',
	state: {

	},
	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(({ pathname }) => {

			});
		}
	},
	reducers: {


	},
	effects: {
	}

}
