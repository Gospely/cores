import React , { PropTypes } from 'react';
import dva from 'dva';
import request from '../utils/request.js';
import weappCompiler from '../utils/weappCompiler.js';
import initApplication from '../utils/initApplication';


import { notification, Form, Input, Radio, Switch } from 'antd';
import { Row, Col } from 'antd';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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
		showAppsLoading: false,

		modifyGitOriginInput: {
			value: '',
			isGit: false,
			pushValue: ''
		},

		activeMenu: localStorage.defaultActiveKey || 'file',

		isAutoSave: false,
		autoSaveInterval: '',

		weappCompilerModalVisible: false,

		weappCompiler: {
			current: 0,
			start: false,
			steps: [{
				title: '云编译',
				description: '编译成符合小程序的结构化数据'
			}, {
				title: '云打包',
				description: '打包成小程序的目录结构'
			}, {
				title: '下载',
				description: '下载压缩包:)'
			}],
			percent: 0,
			status: 'success'
		},

		debugConfig: {
			showConfigModal: false,
			runCommand: 'npm run dev',
			startPort: ''
		},

		currentAppCreatingStep: 0,

		appCreatingForm: {
			appName: '',
			fromGit: false,
			git: '',
			image: '',
			imageVersion: '',
			useFramework: false,
			framework: '',
			createLocalServer: false,
			databaseType: '',
			databasePassword: '',
			databaseAccount: ''
		},

        images: [],
        versions: [],
        frameworks: [],
		appCreator: {
			loading: false
		},

		sshKey: '',

		modalCommitInfo: {
			visible: false,
			title: '',
			message: ''
		}
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {

	      		if(location.hash.indexOf('project') != -1) {
	          		dispatch({
	            		type: 'isGitProject'
	          		});
	      		}

	      	});
		}
	},

	effects: {

		*startCompileWeapp({ payload: params }, {call, put, select}) {
			var modelDesigner = yield select(state => state.designer),
				topbar = yield select(state => state.sidebar),
				compileResult,
				cloudPackResult;

      		yield put({ type: 'setWeappCompilerStartTrue' });

			topbar.weappCompiler.percent = 30;

			weappCompiler.init(modelDesigner.layout);
			compileResult = weappCompiler.compile();

			if(compileResult) {
	      		yield put({ type: 'updateWeappCompilerStep' });

				cloudPackResult = yield weappCompiler.cloudPack();

				console.log('-----------------------cloudPackResult===========================', cloudPackResult);

				if(cloudPackResult.data.code == 200) {
		      		yield put({ type: 'updateWeappCompilerStep' });
		      		openNotificationWithIcon('success', '云打包成功');

		      		var filePath = cloudPackResult.data.fields;

		      		filePath = filePath.split('/');
		      		filePath = filePath.pop();

					weappCompiler.download(filePath);
				}else {
		      		yield put({ type: 'setWeappCompilerStatusExpection' });
				}

			}else {
	      		yield put({ type: 'setWeappCompilerStatusExpection' });
			}
		},

		*isGitProject({payload: params}, {call, put, select}) {
      		var isGit = yield request('fs/git/', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: localStorage.dir,
                    remoteIp: localStorage.host
      			})
      		});

      		if(isGit.data.fields) {
      			//获取origin源
      			var origin = yield request('fs/origin/git', {
	      			method: 'POST',
	      			body: JSON.stringify({
	      				dir: localStorage.dir,
                        remoteIp: localStorage.host
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
      				origin: val,
                    remoteIp: localStorage.host
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
      				dir: localStorage.dir,
                    remoteIp: localStorage.host
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
      				dir: localStorage.dir,
                    remoteIp: localStorage.host
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
      				dir: localStorage.dir,
                    remoteIp: localStorage.host
      			})
      		});

      		if(commitResult.data.code == 200) {
      			openNotificationWithIcon('success', commitResult.data.message, commitResult.data.fields);
      		}else {
      			openNotificationWithIcon('error', commitResult.data.message, '请检查当前版本未超过版本库版本（commit之后请先push再执行下一次commit）或已添加Git源');
      		}
		},
		*getApplications({payload: params}, {call, put}){

			yield put({
				type: 'showAppsLoading'
			})

			var url = 'applications?creator=' + localStorage.user;
			var result = yield request(url, {
				method: 'GET'
			});
			var applications =  result.data.fields;
			yield put({
				type: 'initApplications',
				payload: {applications}
			});
			yield put({
				type: 'hideAppsLoading'
			})
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
		},

		*handleCreateApp({payload: params}, {call, put, select}) {

            var app = yield select(state => state.sidebar.appCreatingForm);
            if(!app.fromGit){
                app.git = '';
            }

            if(!app.createLocalServer){
                app.databaseType = '';
                app.databasePassword = '';
                app.dbUser = '';
            }

            if(!app.useFramework){
                app.framework = '';
            }

            var form ={
                name: app.appName,
                git: app.git,
                fromGit: app.fromGit,
                languageType: app.image,
                languageVersion: app.imageVersion,
                databaseType: app.databaseType,
                password: app.databasePassword,
                dbUser: app.databaseAccount,
                framework: app.framework,
                creator: localStorage.user
            };

			yield put({
				type: 'setAppCreatorStart'
			});

            var url = 'applications';
            var result = yield request(url, {
                method:'POST',
                body: JSON.stringify(form),
			});

            if(result.data.code == 1){
                yield put({
    				type: 'setAppCreatorCompleted'
    			});
                yield put({
                    type: 'hideModalNewApp',
                });

				notification.open({
					message: '创建应用成功，即将跳转',
					title: '创建应用'
				});

                window.location.hash = 'project/' + result.data.fields.id;
                initApplication(result.data.fields,params.ctx);
            }else{
                yield put({
                    type: 'hideModalNewApp',
                });
            }

		},

        *initImages({payload: params}, {call, put}) {
            var url = 'images?parent=0';
			var result = yield request(url, {
				method: 'GET'
			});
            var images = result.data.fields;
			yield put({
				type: 'handleImages',
                payload: { images }
			});
        },

        *initFrameWork({payload: params}, {call, put}){
            var url = 'images?parent='+params.value + "&type=framework";
            var result = yield request(url, {
                method: 'GET'
            });
            var images = result.data.fields;
            yield put({
                type: 'handleFramework',
                payload: { images }
            });
        },

        *initVersions({payload: params}, {call, put}) {
            var url = 'images?parent='+params.value + "&type=lang";
            var result = yield request(url, {
                method: 'GET'
            });
            var images = result.data.fields;
            yield put({
                type: 'handleVersion',
                payload: { images }
            });
        },
        *updateCmds({payload: params}, {call, put, select}){

            var cmd = yield select(state => state.sidebar.debugConfig.runCommand);
            var port = yield select(state => state.sidebar.debugConfig.startPort);
            var cmd = JSON.stringify( {
                default: cmd,
            });
            console.log(cmd);
            var result = yield request("applications", {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({
                    cmds: cmd,
                    id: localStorage.applicationId,
                    exposePort: port
                })
            });
        }

	},

	reducers: {
        hideCmdsConfigModal(state){
            state.debugConfig.showConfigModal = false;
            return {...state};
        },
        setActiveMenu (state, {payload: name}) {
            state.activeMenu = name;
            return {...state};
        },
		handleSSHKeyInputChange(state, { payload: value }) {
			state.sshKey = value;
			return {...state};
		},

        initRunCommond(state, {payload: params}){
            state.debugConfig.runCommand = params.command;
            state.debugConfig.startPort =  params.port;
            return {...state};
        },

        handleImages(state, { payload: params }) {
            state.images = params.images;
            return {...state};
        },

        handleFramework(state, { payload: params }) {
            state.frameworks = params.images;
            return {...state};
        },

        handleVersion(state, { payload: params }) {
            state.versions = params.images;
            return {...state};
        },
		setAppCreatorStart(state) {
			state.appCreator.loading = true;
			return {...state};
		},
		setAppCreatorCompleted(state) {
			state.appCreator.loading = false;
			return {...state};
		},

		showModalNewApp(state) {
			return {...state, modalNewAppVisible: true};
		},

		hideModalNewApp(state) {

			state.currentAppCreatingStep = 0;

			state.appCreatingForm = {
				appName: '',
				fromGit: false,
				git: '',
				image: '',
				imageVersion: '',
				useFramework: true,
				createLocalServer: false,
				databaseType: '',
				databasePassword: ''
			};

			state.appCreator = {
				loading: false
			};

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

		showDebugConfigModal(state) {
			state.debugConfig.showConfigModal = true;
			return {...state};
		},

		hideDebugConfigModal(state) {
			state.debugConfig.showConfigModal = false;
			return {...state};
		},

		handleRunCommandChange(state, {payload: val}) {
			state.debugConfig.runCommand = val;
			return {...state};
		},

		handleStartPortChange(state, {payload: val}) {
			state.debugConfig.startPort = val;
			return {...state};
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

		showAppsLoading(state) {
			state.showAppsLoading = true;
			return {...state};
		},

		hideAppsLoading(state) {
			state.showAppsLoading = false;
			return {...state};
		},

		initApplications(state, {payload: params}) {
			state.applications = params.applications;
			return {...state};
		},

		handleTabChanged(state, {payload: name}) {
			state.activeMenu = name;
			return {...state};
		},

		initState(state, { payload: params }) {
			state.activeMenu = params.UIState.activeMenu;
			return {...state};
		},

		showWeappCompilerModal(state, { payload: params }) {
			state.weappCompilerModalVisible = true;
			return {...state};
		},

		hideWeappCompilerModal(state, { payload: params }) {
			state.weappCompilerModalVisible = false;
			state.weappCompiler = {
				current: 0,
				start: false,
				steps: [{
					title: '云编译',
					description: '编译成符合小程序的结构化数据'
				}, {
					title: '云打包',
					description: '打包成小程序的目录结构'
				}, {
					title: '下载',
					description: '下载压缩包:)'
				}],
				status: 'success',
				percent: 0
			};
			return {...state};
		},

		setWeappCompilerStartTrue(state) {
			state.weappCompiler.start = true;
			return {...state};
		},

		updateWeappCompilerStep(state) {
			state.weappCompiler.current++;
			state.weappCompiler.percent += 30;
			if(state.weappCompiler.percent == 90) {
				state.weappCompiler.percent = 100;
			}
			return {...state};
		},

		setWeappCompilerStatusExpection(state) {
			state.weappCompiler.status = 'exception';
			return {...state};
		},

		handleNextAppCreatingStep(state) {
			state.currentAppCreatingStep++;
			return {...state};
		},

		handlePrevAppCreatingStep(state) {
			state.currentAppCreatingStep--;
			return {...state};
		},

		handleSwitchChanged(state, { payload: params }) {
			state.appCreatingForm[params['switch']] = params.checked;
			return {...state};
		},

		handleInputChanged(state, { payload: params }) {
			state.appCreatingForm[params['input']] = params.value;

			if(params['input'] == 'image') {
				state.appCreatingForm.imageVersion = '';
				state.appCreatingForm.framework = '';
			}

			return {...state};
		},

		showModalCommitInfo(state) {
			state.modalCommitInfo.visible = true;
			return {...state};
		},

		hideModalCommitInfo(state) {
			state.modalCommitInfo.visible = false;
			return {...state};
		},

		handleCommitInfoInputChange(state, { payload: params }) {
			state.modalCommitInfo[params.input] = params.value;
			return {...state};
		}

	}

}
