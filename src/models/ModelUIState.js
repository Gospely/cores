import dva from 'dva';
import request from '../utils/request.js';
import fetch from 'dva/fetch';
import baseUrl from '../configs.js';

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

						console.log(pathname);
						var splits = pathname.split("/");
						if(splits[1] == 'project' && splits[2] != null && splits[2] != undefined){

							var id = splits[2];
							console.log("===================setup===========");
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

				console.log("=======readConfig========");
  			var configs = yield request('uistates?application=' + params.id, {
      			method: 'get'
      		});

  			if(!configs) {
  				message.error('读取配置失败');
  				return false;
  			}

				var config = configs.data.fields[0];
				console.log(config);
      	yield put({
    			type: 'setDySave',
					payload: {
	    			dySave: config.dySave,
	    			gap: config.gap
	    		}
    		});
				var state = yield select(state => state.devpanel);

  			function cb() {

					console.log("setInterval");
					var configStr = JSON.stringify(state);
					console.log(configStr);
  				var configTobeSaved = {
  					id: config.id,
  					application: params.id,
  					configs: configStr
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

			console.log("=========writeConfig=======");
			var result = yield request('UIStates', {
      			method: 'PUT',
      			body: params
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

			console.log("========setDySave========");
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
