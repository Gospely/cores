import React , { PropTypes } from 'react';
import dva from 'dva';
import request from '../utils/request.js';
import weappCompiler from '../utils/weappCompiler.js';
import initApplication from '../utils/initApplication';

import { Modal, Button, message } from 'antd';
import { notification, Form, Input, Radio, Switch } from 'antd';
import { Row, Col } from 'antd';

import config from '../configs.js';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

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
        gitTabKey: '1',
        isHttp: true,
        sshKey: '',
        domains: [],
        wechatSaveShow: false, //小程序设计保存modal

		modifyGitOriginInput: {
			value: '',
			isGit: false,
			pushValue: '',
            loading: false
		},
        modifyGitConfigInput: {
			userName: '',
			email: '',
            password: ''
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
			status: 'success',
			filePath: ''
		},

		debugConfig: {
			showConfigModal: false,
			runCommand: 'npm run dev',
			startPort: '',
            loading: false
		},

		currentAppCreatingStep: 0,

		appCreatingForm: {
			appName: '',
			fromGit: false,
			git: '',
			image: '',
			imageVersion: '',
			useFramework: true,
			framework: '',
			createLocalServer: false,
			databaseType: '',
			databasePassword: '',
			databaseAccount: '',
            databaseShow: '创建本地数据库',
            isFront: false,
            mongodb: false,
            isProjectNameAvailabel: true,
            useGit: true,
		},

        images: [],
        versions: [],
        frameworks: [],
		appCreator: {
			loading: false,
            available: true
		},

		sshKey: '',

		modalCommitInfo: {
			visible: false,
			title: '',
			message: '',
            changes: []
		},

		modalFeedback: {
			visible: false,
			message: ''
		},

        saveBtn:{
            key: 'saveBtn',
            title: '保存',
            iconType: 'check',
        },

        saveAsMouldModal: {
            visible: false,
            confirmLoading: false
        },

        modalPreview: {
            visible: false
        }
	},

    subscriptions: {

        setup({ dispatch, history }) {
            history.listen(({ pathname }) => {
                if(localStorage.image == 'vd:site') {
                    dispatch({
                        type: 'setActiveMenu',
                        payload: 'vdsite-controllers'
                    });
                }else {
                    dispatch({
                        type: 'setActiveMenu',
                        payload: 'file'
                    });
                }
            });
        }

    },


	effects: {

        *packVDSite({ payload: params }, { call, put, select }) {

            yield put({
                type: 'vdcore/packAndDownloadVDSiteProject'
            });
        },

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

				if(cloudPackResult.data.code == 200) {
		      		yield put({ type: 'updateWeappCompilerStep' });
		      		openNotificationWithIcon('success', '云打包成功');

		      		var filePath = cloudPackResult.data.fields;

		      		filePath = filePath.split('/');
		      		filePath = filePath.pop();

					weappCompiler.download(filePath);
					yield put({
						type: 'showDownLoadLink',
						payload: {
							filePath
						}
					})
				}else {
					message.error('打包失败，请重试');
		      		yield put({ type: 'setWeappCompilerStatusExpection' });
				}

			}else {
				message.error('编译失败，请重试');
	      		yield put({ type: 'setWeappCompilerStatusExpection' });
			}
		},
		*modifyGitOrigin({payload: params}, {call, put, select}) {
      		var git = yield select(state => state.sidebar.modifyGitOriginInput.value),
                config =  yield select(state => state.sidebar.modifyGitConfigInput);

			var modifyResult = yield request('git/origin', {
      			method: 'POST',
      			body: JSON.stringify({
      				id: localStorage.applicationId,
      				git: git,
                    user: config.userName,
                    email: config.email,
                    password: config.password
      			})
      		});

      		if(modifyResult.data.code == 1) {

	      		yield put({ type: 'hideModalModifyGitOrigin' });
                yield put({ type: 'setModifyGitOriginCompleted'});

      		}else{
                yield put({ type: 'setModifyGitOriginCompleted'});
                message.error('修改源失败,请重试');
            }
		},

		*pushGit({payload: params}, {call, put}) {

  			openNotificationWithIcon('success', '正在push...', '请稍候...');

      		var pushResult = yield request('git/push/' + localStorage.applicationId, {
      			method: 'get',
      		});

      		if(pushResult.data.code == 1) {
      			openNotificationWithIcon('success', pushResult.data.message, pushResult.data.fields);
      		}else {
      			openNotificationWithIcon('error', pushResult.data.message, '请检查是否已配置Git信息（user.email, user.name）');
      		}
		},

		*pullGit({payload: params}, {call, put}) {

  			openNotificationWithIcon('success', '正在pull...', '请稍候...');

      		var pullResult = yield request('git/pull/' + localStorage.applicationId, {
      			method: 'get',
      		});

      		if(pullResult.data.code == 1) {
      			openNotificationWithIcon('success', pullResult.data.message, pullResult.data.fields);
      		}else {
      			openNotificationWithIcon('error', pullResult.data.message, '请检查是否已配置Git信息（user.email, user.name）');
      		}

		},

		*pushCommit({payload: params}, {call, put, select}) {

  			openNotificationWithIcon('success', '正在commit...', '请稍候...');
            var message = yield select(state => state.sidebar.modalCommitInfo.title);
            console.log(message);
      		var commitResult = yield request('git/commit/' + localStorage.applicationId +'?message=' + message, {
      			method: 'get',
      		});

      		if(commitResult.data.code == 1) {
      			openNotificationWithIcon('success', commitResult.data.message, commitResult.data.fields);
      		}else {
      			openNotificationWithIcon('error', commitResult.data.message, '请检查当前版本未超过版本库版本（commit之后请先push再执行下一次commit）或已添加Git源');
      		}
            yield put({
                type: 'handChanges',
                payload: {
                    changes: []
                }
            })
		},
        *gitChange({payload: params}, {call, put}) {


      		var gitChange = yield request('git/change/' + localStorage.applicationId, {
      			method: 'get',
      		});
            yield put({
                type: 'handChanges',
                payload: {
                    changes: gitChange.data.fields
                }
            })
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
        *checkAvailable({payload: params}, {call, put}){

            var url = 'applications?creator=' + localStorage.user + '&host=120.76.235.234'
            var result = yield request(url, {
				method: 'GET'
			});
            if(result.data.code == 1){

                if(result.data.fields.length >= 10){
                    notification.open({
                        message: '创建的应用数已超出，请选择创建小程序应用'
                    });
                    yield put({
                        type: 'handleAvailable',
                        payload: {
                            available: false,
                        }
                    });
                }else{
                    yield put({
						type: 'initVersions',
						payload: {
							input: params.input,
							value: params.value
						}
					});
					yield put({
						type: 'initFrameWork',
						payload: {
                            input: params.input,
							value: params.value
						}
					});
                    yield put({
                        type: 'handleAvailable',
                        payload: {
                            available: true,
                        }
                    });
                }
            }else{
                notification.open({
                    message: '无法创建'
                });
            }
        },
		*deleteApp({payload: params}, {call, put}) {

			yield put({
				type: 'setAppCreatorStart'
			});

			var url = 'applications/'+ params.application;
			var result = yield request(url, {
				method: 'DELETE'
			});
			yield put({
				type: 'getApplications'
			});

			yield put({
				type: 'setAppCreatorCompleted'
			});
		},

		*handleCreateApp({payload: params}, {call, put, select}) {

            var app = yield select(state => state.sidebar.appCreatingForm);
            if(!app.fromGit){
                app.git = '';
            }else {

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

        	const showConfirm = (data) => {
			  	Modal.error({
			    	title: '服务器提了一个问题',
			    	content: '创建失败，请重试,' + data.message
			  	});
        	}

			const errorHandler = (response) => {
				if (response.status >= 200 && response.status < 300) {
					return response;
				}
				return {
					data: {
						message: '服务器提了一个问题',
						code: 500
					}
				};
			}

			const parseJSON = (response) => {
			  	return response.json();
			}

			const taskHandler = (data) => {

			  	if(data.code == 200 || data.code == 1) {
			    	if(data.message != null) {
			      		message.success(data.message);
			    	}
			  	}else {
			    	if(typeof data.length == 'number') {
			      		return {
			      			data: data
			      		};
			    	}
					return {
						data: {
							message: '服务器提了一个问题' + data.message,
							code: 500
						}
					};
			  	}

			  	return {
			  		data: data
			  	};
			}

            var url = 'applications';
            var result = yield fetch(config.baseURL + url, {
           	   'headers': { 'Authorization': localStorage.token },
                method:'POST',
                body: JSON.stringify(form),
           	})
           	.then(errorHandler)
           	.then(parseJSON)
           	.then(taskHandler)
           	.catch(errorHandler);

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
                //window.location.reload();
                initApplication(result.data.fields,params.ctx,true);

            }else {

            	showConfirm(result.data);

                yield put({
                    type: 'hideModalNewApp',
                });
            }

		},

        *initImages({payload: params}, {call, put}) {

			yield put({
				type: 'setAppCreatorStart'
			});

            var url = 'images?parent=0';
			var result = yield request(url, {
				method: 'GET'
			});
            var images = result.data.fields;
			yield put({
				type: 'handleImages',
                payload: { images }
			});

            yield put({
				type: 'setAppCreatorCompleted'
			});

        },

        *initFrameWork({payload: params}, {call, put}){

			yield put({
				type: 'setAppCreatorStart'
			});

            var url = 'images?parent='+params.value + "&type=framework";
            var result = yield request(url, {
                method: 'GET'
            });
            var images = result.data.fields;
            yield put({
                type: 'handleFramework',
                payload: { images }
            });

            yield put({
				type: 'setAppCreatorCompleted'
			});

        },

        *initVersions({payload: params}, {call, put}) {

			yield put({
				type: 'setAppCreatorStart'
			});

            var url = 'images?parent='+params.value + "&type=lang";
            var result = yield request(url, {
                method: 'GET'
            });
            var images = result.data.fields;
            yield put({
                type: 'handleVersion',
                payload: { images }
            });

            yield put({
				type: 'setAppCreatorCompleted'
			});

        },
        *updateCmds({payload: params}, {call, put, select}){

            yield put({
                type: 'setDebugConfigStart'
            });
            var cmd = yield select(state => state.sidebar.debugConfig.runCommand);
            var port = yield select(state => state.sidebar.debugConfig.startPort);
            var cmd = JSON.stringify( {
                default: cmd,
            });

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
            yield put({
                type: 'setDebugConfigCompleted'
            });
            if(result.data.code == 1){
                notification.open({
    	            message: '修改成功，即将重新加载配置'
    	        });
                setTimeout(function(){
                    window.location.reload();
                }, 1000)
                yield put({
                    type: 'sidebar/hideCmdsConfigModal',
                });
            }
        },

        *checkProjectAvailable( { payload: params }, { call, put, select }) {

        	var available = true;
        	var url = 'applications/validator?name=' + params.name + '&userName=' + localStorage.userName + '&creator=' + localStorage.user;

            var result = yield request(url, {
                method: 'get',
            });
            if(result.data.code == 1){
                available = true;
            }else{
                available = false;
            }
			yield put({
				type: 'setProjectNameAvailabel',
				payload: available
			});

        	if(!available) {
				notification.open({
					message: params.name + '与已有项目重复，请重新填写'
				});
        	}

        },

        *submitFeedback( { payload: params }, { call, put, select }) {

            var feedback = yield select(state => state.sidebar.modalFeedback.message);

            if(feedback == '') {
	        	notification.open({
	        		message: '请填写意见建议'
	        	});

	        }else {

                var result = yield request('feedbacks',{
                    method: 'POST',
                    body: JSON.stringify({
                        creator: localStorage.user,
                        message: feedback
                    })
                })
                if(result.data.code == 1){
                    notification.open({
                        message: '提交成功，谢谢参与'
                    });

					yield put({
						type: 'hideFeedback'
					});

					yield put({
						type: 'setFeedbackMessageBlank'
					});

                }else {
                    notification.open({
                        message: '提交失败，请重试'
                    });

                }
	        }
        },

        *packApp({ payload: params}, {call, put}) {
            notification.open({
                message: '正在打包，请稍等...',
            });

            var url = 'http://api.gospely.com/fs/packsrc?token=' + localStorage.token + '&user=' + localStorage.user + '&application=' + localStorage.applicationId;

            window.open(url);
        },

        *getKey({ payload: params }, {call, put, select}){

            notification.open({
                message: '获取sshKey ...'
            });
            yield put({
                type: 'setModifyGitOriginStart'
            });
            var res = yield request("users/" + localStorage.user, {
                method: 'GET',
            });
            if(res.data.code == 1){
                yield put({
                    type: "initKey",
                    payload :{ sshKey: res.data.fields.sshKey}
                });

            }else{
                notification.open({
                    message: '获取sshKey 失败...' + res.data.message
                });
            }
            yield put({
                type: 'setModifyGitOriginCompleted'
            });
        },
        *getDomains({ payload: params }, {call, put, select}){
            var domains = yield request("domains/?application=" + localStorage.applicationId, {
                method: 'GET',
            });
            console.log(domains);
            localStorage.domain = domains.data.fields[0].subDomain + '.' + domains.data.fields[0].domain;
            yield put({
                type: 'initDomains',
                payload: {
                    domains: domains.data.fields
                }
            })
        }
	},

	reducers: {
        initKey(state,  { payload: params}) {
            state.sshKey = params.sshKey;
            return {...state};
        },
        initDomains(state, { payload: params}){
            state.domains = params.domains
            return {...state};
        },
        changeSaveBtnState(state, { payload: params }) {
            state.saveBtn.key = params.key;
            state.saveBtn.title = params.title;
            state.saveBtn.iconType = params.iconType;
            return {...state};
        },
        changeSaveAsMouldeVisible(state, { payload: params}) {
            state.saveAsMouldModal.visible = params.visible
            state.saveAsMouldModal.confirmLoading = params.confirmLoading
            return {...state}
        },

        changesaveAsMouldState(state, { payload: params }) {
            state.saveAsMould.key = params.key;
            state.saveAsMould.title = params.title;
            state.saveAsMould.iconType = params.iconType;
            return {...state};
        },

		setProjectNameAvailabel(state, { payload: available }) {
			state.appCreatingForm.isProjectNameAvailabel = available;
			return {...state};
		},

		setFeedbackMessageBlank(state) {
			state.modalFeedback.message = '';
			return {...state};
		},

        hideCmdsConfigModal(state){
            state.debugConfig.showConfigModal = false;
            return {...state};
        },
        setActiveMenu (state, {payload: name}) {
            state.activeMenu = name;
            return {...state};
        },
        handleWechatSave(state){
            state.wechatSaveShow = !state.wechatSaveShow;
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
        setModifyGitOriginStart(state) {
			state.modifyGitOriginInput.loading = true;
			return {...state};
		},
        setModifyGitOriginCompleted(state) {
			state.modifyGitOriginInput.loading = false;
			return {...state};
		},
        setDebugConfigStart(state) {
			state.debugConfig.loading = true;
			return {...state};
		},
		setDebugConfigCompleted(state) {
			state.debugConfig.loading = false;
			return {...state};
		},
		showModalNewApp(state) {
			state.appCreator.available = true;
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
				loading: false,
                available: false,
			};

			if (state.createFromModal) {
				return {...state, modalNewAppVisible: false, modalSwitchAppVisible: false, createFromModal: false};
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
        changeGitTabKey(state, { payload: params}){

            state.gitTabKey = params.key;
            return {...state};
        },
        setGitOrigin(state, {  payload: params }){

            if(/https:\/\/github.com\/?/.test(params.gitOrigin)){
                state.isHttp = true;
            }
            if(/git@github.com:?/.test(params.gitOrigin)){
                state.isHttp = false;
            }
            state.modifyGitOriginInput.value = params.gitOrigin;
            state.modifyGitOriginInput.pushValue = params.gitOrigin;
            console.log(params);
            state.modifyGitOriginInput.isGit = params.isGit;
            state.modifyGitConfigInput.userName = params.userName,
            state.modifyGitConfigInput.email = params.email;
            state.modifyGitConfigInput.password = params.password;
            return {...state};
        },
		showModalModifyGitOrgin(state) {
			return {...state, modalModifyGitOriginVisible: true};
		},

		hideModalModifyGitOrigin(state) {
            state.modifyGitOriginInput.loading = false;
			return {...state, modalModifyGitOriginVisible: false};
		},

		handleModifyGitOriginInputChange(state, {payload: val}) {

            if(/https:\/\/github.com\/?/.test(val)){
                state.isHttp = true;
            }
            if(/git@github.com:?/.test(val)){
                state.isHttp = false;
            }
			return {...state, modifyGitOriginInput: {
				value: val,
                loading: false,
				isGit: state.modifyGitOriginInput.isGit,
				pushValue: state.modifyGitOriginInput.pushValue
			}}
		},

		handleModifyGitPushOriginInputChange(state, {payload: val}) {

            if(/https:\/\/github.com\/?/.test(val)){
                state.isHttp = true;
            }
            if(/git@github.com:?/.test(val)){
                state.isHttp = false;
            }
			return {...state, modifyGitOriginInput: {
				pushValue: val,
                loading: false,
				isGit: state.modifyGitOriginInput.isGit,
				value: state.modifyGitOriginInput.value
			}}
		},
        handleModifyGitConfigInputChange(state, {payload: val}) {

			return {...state, modifyGitConfigInput: {
				userName: val,
                email: state.modifyGitConfigInput.email,
                password: state.modifyGitConfigInput.password,
			}}
		},
        handleModifyGitConfigEmailInputChange(state, {payload: val}) {
            return {...state, modifyGitConfigInput: {
				email: val,
                userName: state.modifyGitConfigInput.userName,
                password: state.modifyGitConfigInput.password,
			}}
		},
        handleModifyGitConfigPasswordInputChange(state, {payload: val}) {
            return {...state, modifyGitConfigInput: {
				password: val,
                email: state.modifyGitConfigInput.email,
                userName: state.modifyGitConfigInput.userName
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
        handleAvailable(state, { payload: params}){
            state.appCreator.available = params.available;
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

		showDownLoadLink(state, {payload}) {
			state.weappCompiler.filePath = 'http://api.gospely.com/weapp/download/' + payload.filePath;
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

            console.log(params);
			state.appCreatingForm[params['input']] = params.value;

			if(params['input'] == 'image') {
				state.appCreatingForm.imageVersion = '';
				state.appCreatingForm.framework = '';


                if(params.value == 'html:latest' || params.value == 'wechat:latest' || params.value == 'vd:latest' || params.value == 'hybridapp:latest'){
                    state.appCreatingForm.isFront = true;
                    if(params.value == 'wechat:latest'){
                        state.appCreatingForm.useFramework = false;
                    }else {
                        state.appCreatingForm.useFramework = true;
                    }
                    if(params.value == 'vd:latest'){
                        console.log('git disabled');
                        state.appCreatingForm.useGit = false;
                    }else {
                        state.appCreatingForm.useGit = true;
                    }
                    state.appCreatingForm.databaseShow = '该类型项目暂时不支持创建本地数据库';
                }else{
                    state.appCreatingForm.isFront = false;
                    state.appCreatingForm.useFramework = true;
                    state.appCreatingForm.databaseShow = '创建本地数据库';
                }
                if(params.value == 'php:latest'){
                    state.appCreatingForm.mongodb = true;
                }else{
                    state.appCreatingForm.mongodb = false;
                }

                if(!window.debug) {

                    if(params.value == 'vd:latest'){
                        message.error('此功能未开放,正在开发');
                        state.appCreatingForm.image = '';
                        state.appCreatingForm.useFramework = false;
                    }else{
                        if(params.value != 'wechat:latest')
                        state.appCreatingForm.useFramework = true;
                    }

                }

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
		},
        handChanges(state, { payload: params }){
            state.modalCommitInfo.changes = params.changes;
			return {...state};
        },
		showFeedback(state, { payload: params }) {
			state.modalFeedback.visible = true;
			return {...state};
		},

		hideFeedback(state, { payload: params }) {
			state.modalFeedback.visible = false;
			return {...state};
		},

		handleFeedbackMsgChange(state, { payload: value }) {
			state.modalFeedback.message = value;
			return {...state};
		},

        showVDSiteDownloader(state) {
            state.vdSiteDownloader.visible = true;
            return {...state};
        },

        hideVDSiteDownloader(state) {
            state.vdSiteDownloader.visible = false;
            return {...state};
        }

	}

}
