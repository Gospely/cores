import dva from 'dva';
import request from '../utils/request.js';

import { message } from 'antd';

export default {
	namespace: 'UIState',
	state: {

		dySave: true,
		gap: 50000,

		saveInterval: 0
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
	      		dispatch({
	      			type: 'readConfig'
	      		})
	      	});
		}
	},

	effects: {

		*readConfig({ payload: params }, { call, put, select }) {
  			var configs = yield request('UIStates/' + params.id, {
      			method: 'get'
      		});

  			if(!configs) {
  				message.error('读取配置失败');
  				return false;
  			}

      		console.log(configs);

      		yield put({
      			tupe: 'setDySave'
      		}, payload: {
      			dySave: configs.dySave,
      			gap: configs.gap
      		});

      		var state = yield select(state => state.UIState);

      		if(state.dySave) {
      			state.saveInterval = setInterval(() => {

      				var configTobeSaved = {
      					id: '',
      					application: '',
      					creator: '',
      					configs: {}
      				}

      				if(state.dySave) {
      					yield put({ type: 'writeConfig' }, configTobeSaved);
      				}else {
      					clearInterval(state.saveInterval);
      				}

      			}, state.gap);
      		}


      		yield put({ type: 'setSaveInterval', payload: configs });
		},

		*writeConfig({ payload: params }, { call, put, select }) {
			var result = yield request('UIStates', {
      			method: 'POST',
      			body: {
      				id: params.id,
      				application: params.application,
      				creator: '',
      				configs: params.configs
      			}
      		});
		},

		*setDySaveEffects({ payload: params }, { call, put, select }) {

			params.gap = params.gap || 50000;

			var result = yield request('UIStates', {
      			method: 'POST',
      			body: {
      				id: params.id,
      				application: params.application,
      				creator: '',
      				dySave: params.dySave,
      				gap: params.gap
      			}
      		});

      		if(result) {
      			yield put({
      				type: 'setDySave'
      			}, payload: {
      				dySave: params.dySave,
      				gap: params.gap
      			});
      		}
		}

	},

	reducers: {

		setDySave(state, { payload: params }) {
			state.dySave = params.dySave;
			state.gap = params.gap;
			return {...state};
		}

	}

}
