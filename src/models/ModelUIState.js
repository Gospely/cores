import dva from 'dva';
import request from '../utils/request.js';

import { message } from 'antd';

export default {
	namespace: 'UIState',
	state: {

		dySave: true,
		gap: 500000,

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
  			var configs = yield request('uistates/' + params.id, {
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
      			function *cb() {

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
      			}

      			state.saveInterval = setInterval(cb, state.gap);
      		}


      		yield put({ type: 'setSaveInterval', payload: configs });
		},

		*writeConfig({ payload: params }, { call, put, select }) {
			var result = yield request('UIStates', {
      			method: 'UPDATE',
      			body: params
      		});
		},

		*setDySaveEffects({ payload: params }, { call, put, select }) {

			params.gap = params.gap || 500000;

			var result = yield request('uitates', {
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
			state.dySave = params.checked;
			return {...state};
		},

            setDySaveGap(state, { payload: params }) {
                  state.gap = params.val;
                  return {...state};
            }

	}

}
