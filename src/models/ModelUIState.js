import dva from 'dva';
import request from '../utils/request.js';
import fetch from 'dva/fetch';
import baseUrl from '../configs.js';
import initState from '../utils/initUIState'

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
				return true;
	      	});
		}
	},

	effects: {

		*readConfig({ payload: params }, { call, put, select }) {

			window.canSave = false;
			console.log(params);
  			var configs = yield request('uistates?application=' + params.id, {
      			method: 'get'
      		});
  			if(!configs) {
  				message.error('读取配置失败');
  				return false;
  			}
			var config = configs.data.fields[0];
			localStorage.uistateId = config.id;
			localStorage.UIState = config.configs;

			if(params.ctx !=null && params.ctx != undefined){
				initState(params.ctx, params.id);
				window.canSave = true;
			}
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
		},

		*writeConfig({ payload: params }, { call, put, select }) {

			var configTobeSaved = {
				id: localStorage.uistateId,
				configs: localStorage.UIState
			}
			var url = baseUrl.baseURL + "uistates";

			if(window.canSave){
				var result = yield fetch(url, {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json;charset=UTF-8",
						'Authorization': localStorage.token
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
			}

		},
		*initConfig({payload: params}, { call, put, select}){

			var configs = yield request('uistates?application=' + params.id, {
				method: 'get'
			});
			if(!configs) {
				message.error('读取配置失败');
				return false;
			}
			var config = configs.data.fields[0];
			localStorage.uistateId = configs.data.fields[0].id;
			var configTobeSaved = {
				id: configs.data.fields[0].id,
				configs: localStorage.UIState
			}
			var url = baseUrl.baseURL + "uistates";

			var result = yield fetch(url, {
				method: 'PUT',
				headers: {
					"Content-Type": "application/json;charset=UTF-8",
					'Authorization': localStorage.token
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

			var dySave = yield select(state=> state.UIState.dySave),
				gap = yield select(state => state.UIState.gap);
			function cb() {
				var configTobeSaved = {
					id: localStorage.uistateId,
					configs: localStorage.UIState
				}
				if(window.canSave && localStorage.flashState == 'true') {
						var url = baseUrl.baseURL + "uistates";
						fetch(url, {
							method: 'PUT',
							headers: {
								"Content-Type": "application/json;charset=UTF-8",
								'Authorization': localStorage.token
							},
							body: JSON.stringify(configTobeSaved)
						})
				}else {
					window.clearInterval(window.uistateSave)
				}
			}
			window.uistateSave = window.setInterval(cb, gap);
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
