import dva from 'dva';
import request from '../utils/request.js';
import fetch from 'dva/fetch';
import baseUrl from '../configs.js';

import { message, notification } from 'antd';

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
				var splits = pathname.split("/");
				if(splits[1] == 'project' && splits[2] != null && splits[2] != undefined){

					var id = splits[2];
		      		dispatch({
		      			type: 'readConfig',
						payload:{id}
		      		});
				}
				return true;
	      	});
		}
	},

	effects: {

		*readConfig({ payload: params }, { call, put, select }) {
  			var configs = yield request('uistates?application=' + params.id, {
      			method: 'get'
      		});
  			if(!configs) {
  				message.error('读取配置失败');
  				return false;
  			}
			var config = configs.data.fields[0];
			localStorage.uistateId = config.id;
			if(!config) {
				config = {};
			}

			config.dySave = config.dySave || true;
			config.gap = config.gap || 500000;

      		yield put({
    			type: 'setDySave',
					payload: {
	    			dySave: config.dySave,
	    			gap: config.gap
	    		}
    		});
			var state = yield select(state => state.devpanel);

  			function cb() {
  				var configTobeSaved = {
  					id: config.id,
  					configs: localStorage.UIState
  				}
  				if(config.dySave) {
						var url = baseUrl.baseURL + "uistates";
						fetch(url, {
							method: 'PUT',
							headers: {
      							"Content-Type": "application/json;charset=UTF-8",
							},
							body: JSON.stringify(configTobeSaved)
						})
  				}else {
  					clearInterval(state.saveInterval);
  				}
  			}
  			setInterval(cb, config.gap);
				//yield put({ type: 'setSaveInterval', payload: saveInterval });
		},

		*writeConfig({ payload: params }, { call, put, select }) {

			var configTobeSaved = {
				id: localStorage.uistateId,
				configs: localStorage.UIState
			}
			var url = baseUrl.baseURL + "uistates";

			var result = yield fetch(url, {
				method: 'PUT',
				headers: {
					"Content-Type": "application/json;charset=UTF-8",
				},
				body: JSON.stringify(configTobeSaved)
			}).then(function() {
				notification.open({
					message: '保存成功'
				});
			}).catch(function() {
				notification.open({
					message: '保存失败'
				});				
			});
		},

		*setDySaveEffects({ payload: params }, { call, put, select }) {

			params.gap = params.gap || 500000;

			var result = yield request('uitates', {
      			method: 'PUT',
      			body: {
      				id: params.id,
      				application: params.application,
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
    	},

		setSaveInterval(state, { payload: params }) {
			state.saveInterval = params.saveInterval;
			return {...state};
		}

	}

}
