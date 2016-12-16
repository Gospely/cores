import dva from 'dva';
import request from '../utils/request.js';

import { notification } from 'antd';

const openNotificationWithIcon = (type, title, description) => (
  notification[type]({
    message: title,
    description: description,
  })
);

export default {
	namespace: 'sidebar',
	state: {

		modalNewAppVisible: false,
		modalSwitchAppVisible: false,
		modalModifyGitOriginVisible: false,
		createFromModal: false,
		applications: [],

		modifyGitOriginInput: {
			value: '',
			isGit: false,
			pushValue: ''
		},

		activeMenu: localStorage.defaultActiveKey || 'attr',

		isAutoSave: false,
		autoSaveInterval: ''
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
          		dispatch({
            		type: 'isGitProject'
          		});
	      	});
		}
	},

	effects: {

		*isGitProject({payload: params}, {call, put, select}) {
      		var isGit = yield request('fs/git/', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: localStorage.dir
      			})
      		});

      		if(isGit.data.fields) {
      			//获取origin源
      			var origin = yield request('fs/origin/git', {
	      			method: 'POST',
	      			body: JSON.stringify({
	      				dir: localStorage.dir
	      			})
	      		});

	      		yield put({ type: 'setOriginValue', payload: {
	      			origin,
	      			isGit
	      		} })
      		}else {
	      		yield put({ type: 'setIsGit', payload: isGit });
      		}

		},

		*modifyGitOrigin({payload: params}, {call, put, select}) {
      		var val = yield select(state => state.sidebar.modifyGitOriginInput.value);
			var modifyResult = yield request('fs/origin/modify', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: localStorage.dir,
      				origin: val
      			})
      		});

      		if(modifyResult.data.code == 200) {
	      		yield put({ type: 'hideModalModifyGitOrigin' });
      		}
		},

		*pushGit({payload: params}, {call, put}) {

  			openNotificationWithIcon('success', '正在push...', '请稍候...');

      		var pushResult = yield request('fs/push', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: localStorage.dir
      			})
      		});

      		if(pushResult.data.code == 200) {
      			openNotificationWithIcon('success', pushResult.data.message, pushResult.data.fields);
      		}else {
      			openNotificationWithIcon('error', pushResult.data.message, '请检查是否已配置Git信息（user.email, user.name）');      			
      		}
		},

		*pullGit({payload: params}, {call, put}) {

  			openNotificationWithIcon('success', '正在pull...', '请稍候...');

      		var pullResult = yield request('fs/pull', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: localStorage.dir
      			})
      		});

      		console.log(pullResult);

      		if(pullResult.data.code == 200) {
      			openNotificationWithIcon('success', pullResult.data.message, pullResult.data.fields);
      		}else {
      			openNotificationWithIcon('error', pullResult.data.message, '请检查是否已配置Git信息（user.email, user.name）');      			
      		}

		},

		*pushCommit({payload: params}, {call, put}) {

  			openNotificationWithIcon('success', '正在commit...', '请稍候...');

      		var commitResult = yield request('fs/commit', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: localStorage.dir
      			})
      		});

      		if(commitResult.data.code == 200) {
      			openNotificationWithIcon('success', commitResult.data.message, commitResult.data.fields);
      		}else {
      			openNotificationWithIcon('error', commitResult.data.message, '请检查当前版本未超过版本库版本（commit之后请先push再执行下一次commit）或已添加Git源');      			
      		}
		},
		*getApplications({payload: params}, {call, put}){

			var url = 'applications?creator=' + localStorage.user;
			var result = yield request(url, {
				method: 'GET'
			});
			var applications =  result.data.fields;
			yield put({
				type: 'initApplications',
				payload: {applications}
			});
		},
		*deleteApp({payload: params}, {call, put}) {

			console.log('delete');
			var url = 'applications/'+ params.application;
			var result = yield request(url, {
				method: 'DELETE'
			});
			yield put({
				type: 'getApplications'
			});
			}
	},

	reducers: {

		showModalNewApp(state) {
			return {...state, modalNewAppVisible: true};
		},

		hideModalNewApp(state) {
			if (state.createFromModal) {
				return {...state, modalNewAppVisible: false, modalSwitchAppVisible: true, createFromModal: false};
			}else{
				return {...state, modalNewAppVisible: false};
			}
		},

		createApp(state) {
			return {...state}
		},

		showModalSwitchApp(state) {
			return {...state, modalSwitchAppVisible: true};
		},

		hideModalSwitchApp(state) {
			return {...state, modalSwitchAppVisible: false};
		},

		switchApp(state) {

		},

		selectApp(state) {

		},

		showModalModifyGitOrgin(state) {
			return {...state, modalModifyGitOriginVisible: true};
		},

		hideModalModifyGitOrigin(state) {
			return {...state, modalModifyGitOriginVisible: false};
		},

		handleModifyGitOriginInputChange(state, {payload: val}) {
			return {...state, modifyGitOriginInput: {
				value: val,
				isGit: state.modifyGitOriginInput.isGit,
				pushValue: state.modifyGitOriginInput.pushValue
			}}
		},

		handleModifyGitPushOriginInputChange(state, {payload: val}) {
			return {...state, modifyGitOriginInput: {
				pushValue: val,
				isGit: state.modifyGitOriginInput.isGit,
				value: state.modifyGitOriginInput.value
			}}
		},

		showNewAppAndHideSwitch(state, {payload: val}) {
			return {...state, modalNewAppVisible: true, modalSwitchAppVisible: false, createFromModal: true};
		},

		setIsGit(state, {payload: flag}) {
			return {...state, modifyGitOriginInput: {
				isGit: flag.data.fields,
				value: state.modifyGitOriginInput.value,
				pushValue: state.modifyGitOriginInput.pushValue
			}}
		},

		setOriginValue(state, {payload: params}) {

			var split = params.origin.data.fields.split('	');

			var fetch = split[1],
				push = split[2];

			if(!fetch) {
				return {...state};
			}

			fetch = fetch.split(' (fetch)')[0];
			push = push.split(' (push)')[0];

			return {...state, modifyGitOriginInput: {
				value: fetch,
				isGit: params.isGit.data.fields,
				pushValue: push
			}}
		},

		initApplications(state, {payload: params}) {

			console.log("initApplications");
			console.log(params);
			state.applications = params.applications;
			return {...state};
		},

		handleTabChanged(state, {payload: name}) {

			state.activeMenu = name;
			return {...state};
		},
		initState(state, { payload: params }) {

			console.log("sidebar initState");
			console.log(params.UIState.activeMenu);
			state.activeMenu = params.UIState.activeMenu;
			return {...state};
		}

	}

}
