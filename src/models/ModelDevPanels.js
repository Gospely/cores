// import React from 'react';
import React , { PropTypes } from 'react';
import dva from 'dva';
import { message } from 'antd';
import request from '../utils/request.js';

const methods = {
	getActivePane(state) {
		return state.panels.panes[state.panels.activePane.key];
	},
	getActiveTab(state,pane) {
		return pane.tabs[pane.activeTab.index];
	},
	getEditors(state,index){
		return state.panels.panes[index].editors;
	}
}

const setMode = {
		js: function() {
			console.log('javascript');
			return 'javascript';
		},
		css: function() {
			console.log('css');
			return 'css';
		},
		html: function() {
			console.log('html');
			return 'html';
		},
		php: function() {
			console.log('php');
			return 'php';
		},
		java: function() {
			console.log('java');
			return 'java';
		},
		txt: function() {
			console.log('txt');
			return 'plain_text';
		},
		md: function() {
			console.log('markdown');
			return 'markdown';
		},
		json: function() {
			console.log('json');
			return 'json';
		},
		xml: function() {
			console.log("xml");
			return "xml"
		},
		vue: function() {
			return "javascript";
		},
		sh: function() {
			return "bat";
		}
	}

export default {
	namespace: 'devpanel',
	state: {
		devType: {
			visual: localStorage.visual || true,
			defaultActiveKey: localStorage.defaultActiveKey || 'controllers',
			type: "common"
		},
		currentMode: 'javascript',
		currentLanguage: 'HTML',
		cmd: 'cd /root/workspace && clear\n',
		debug: '',


	    panels: {

	    	panes: [
	    		{
	    			tabs: [
			    		{
			    			title: '欢迎页面 - Gospel',
			    			content: '',
			    			key: '1',
			    			type: 'welcome',
			    			editorId: '',
			    			searchVisible: false,
			    			isSave: false,
			    			loading: false
			    		}
		    		],

		    		editors: {},

		    		activeEditor: {
		    			id: ''
		    		},

		    		key: 0,

		    		activeTab: {
		    			key: '1',
		    			index: 0
		    		}
	    		}
	    	],

	    	splitType: 'single',

	    	activePane: {
	    		key: 0
	    	},
	    	activeEditor: {
	    		id: ''
	    	}
	    },

	    loading: {
	    	isLoading: false,
	    	tips: '请稍后...'
	    }

	},

	subscriptions: {

		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
	      	});
		}

	},


	effects: {

		*startDocker({ payload: params }, {call, put, select}){
			var res = yield request("container/start/" + params.id, {
				method: 'GET',
			});
		},
		*loadPanels({ payload: params }, {call, put, select}) {

    		var devpanel = yield select(state => state.devpanel);

    		var tmpTabs = {
				title: 'Gospel 小程序 UI 设计器',
				content: '',
				key: '2',
				type: 'designer',
				editorId: '',
				searchVisible: false,
				isSave: false
			}
      		devpanel.panels.panes[devpanel.panels.activePane.key].tabs.push(tmpTabs);
		},

		//根据项目的类型渲染ide面板
		*handleImages({ payload: params}, {call, put, select}) {

			var url = "images/" + params.id;

			var res = yield request(url, {
				method: 'GET',
			});

			if(res.data.fields.devType == 'common'){
				yield put({ type: "handleCommon" });
			}else{
				yield put({ type: "handleVisual" });
			}
		},
		//获取界面初始化配置
		*getConfig({ payload: params}, {call, put, select}){

			var configs = '',
				config = '',
				UIState = '';
			localStorage.flashState = 'true';
			if(window.reload || params.UIState == null || params.UIState == undefined){

				window.reload = false;
				configs = yield request('uistates?application=' + params.id, {
 					method: 'get'
 				});
				config = configs.data.fields[0];
				UIState = JSON.parse(config.configs);
			}else{
				UIState = params.UIState;
			}

			for(var i = 0; i < UIState.panels.panes.length; i++) {
				var pane =  UIState.panels.panes[i];
				for(var j= 0; j< pane.tabs.length; j++){
					var activeTab = pane.tabs[j];
					if(activeTab.type == 'editor') {

						var fileName = activeTab.file;

						if(fileName != null && fileName != undefined && fileName != '新文件'　&& fileName != '新标签页') {
							var fileName = activeTab.file;

							var file = fileName.split('.');
							var suffix = file[file.length-1];
							if(suffix != undefined){
								localStorage.suffix = suffix;
							}
							yield put({
								type: 'dynamicChangeSyntax',
								payload:{suffix}
							});
							var readResult = yield request('fs/read', {
								method: 'POST',
								body: JSON.stringify({
									fileName: localStorage.dir + fileName.replace(localStorage.currentProject,""),
								})
							});
							var content = readResult.data
							content = content.fields;
							activeTab.content = content.content;
							UIState.panels.panes[i].tabs[j].content = content.content;
						}
					}
				}
			}
			yield put({
				type: 'initState',
				payload: {UIState}
			});

		},
		*loadContent({ payload: params}, {call, put, select}){
			var fileName = params.tab.title;
			var readResult = yield request('fs/read', {
				method: 'POST',
				body: JSON.stringify({
					fileName: localStorage.dir + fileName.replace(localStorage.currentProject + "/",""),
				})
			});

			var content = readResult.data.fields;

			yield put({
				type: "initTab",
				payload: {
					content: content.content,
					editorId: params.editorId,
					paneKey: params.paneKey
				}
			});
		},

		*killPID({ payload: params}, {call, put, select}){

			yield request('applications/killpid?pid=' + params.pid + "&&docker=" + localStorage.docker + "&&host=" + localStorage.host, {
				method: 'GET',
			});
		}
	},

	reducers: {
		initState(state, { payload: params}){
			state.panels = params.UIState.panels;
			state.devType = params.UIState.devType;
			return {...state};
		},
		initDebugPanel(state, { payload: params}){
			state.panels.activePane.key = 1;
			state.cmd = params.cmd;
			return {...state}
		},
		initCmd(state){
			state.cmd = 'cd /root/workspace && clear\n';
			return {...state};
		},
		initTab(state, { payload: params}){
			var pane = state.panels.panes[params.paneKey.paneKey],
				activeTab = pane.tabs[pane.activeTab.index];
			activeTab = params.content;
			pane.editors[params.editorId].value = params.content;
			return {...state};
		},
		handleDebugger(state, { payload: params}){
			state.debug = params.debug;
			return {...state};
		},

		handleTabChanged(state, {payload: name}) {
			state.activeMenu = name;
			return {...state};
		},

		hideLoading(state, {payload: params}) {
			return {...state, loading: {
					isLoading: false,
					tips: '请稍后...'
				}
			};
		},

		showLoading(state, {payload: params}) {
			return {...state,loading: {
					isLoading: true,
					tips: params.tips
				}
			};
		},

		handleCommon(state) {
			state.panels.panes[0].activeTab.key = "1";
			state.devType.defaultActiveKey = 'setting';
			localStorage.defaultActiveKey = 'setting';
			localStorage.activeMenu = "file";

			state.panels.panes[0].tabs = [{
				"title":"欢迎页面 - Gospel",
				"key":"1","type":"welcome",
				"editorId":"",
				"searchVisible":false,
				"isSave":false
			}];
			state.devType.type = 'common';
			return {...state};
		},

		handleVisual(state){

			console.log("visual");
			state.panels.panes[0].activeTab.key = "2";
			state.devType.defaultActiveKey = 'controllers';
			localStorage.defaultActiveKey = 'controllers';
			localStorage.activeMenu = "attr";
			// appRouter.go('/project/' + localStorage.currentProject);
			state.panels.panes[0].tabs = [{
				"title":"欢迎页面 - Gospel",
				"key":"1","type":"welcome",
				"editorId":"",
				"searchVisible":false,
				"isSave":false
				},{
					"title":"Gospel 微信小程序 设计器",
					"type":"designer","key":"2",
					"editorId":"","isSave":true
				}];
			state.devType.type = 'visual';
			//window.location.href = 'http://localhost:8989/#/project/' + localStorage.applicationId;
			return {...state};
		},
		toggleSearchBar(state,{payload:params}) {
			let tab = methods.getActiveTab(state, state.panels.panes[params.belongTo]);
			tab.searchVisible = !tab.searchVisible;
			return {...state};
		},

		changePane(state,{payload: key}){
			state.panels.activePane.key = key;
			return {...state};
		},

		tabChanged(state, {payload: params}) {
			state.panels.activePane.key = params.paneKey;
			const activePane = methods.getActivePane(state);
			methods.getActivePane(state).activeTab.key = params.active;
			const activeTab = activePane.tabs[params.active - 1]

			methods.getActivePane(state).activeTab.index = ( parseInt(params.active) - 1 ).toString();

			if(activeTab.type == 'editor') {
				activePane.activeEditor.id = activeTab.editorId;
			}
			return {...state};
		},
		changeTabTitle(state,{payload:params}){
			const activePane = methods.getActivePane(state);
			const activeTab = activePane.tabs[activePane.activeTab.index];
			const activeEditor = activePane.editors[activePane.activeEditor.id];
			activeEditor.fileName = params.value;
			activeTab.title = params.value;
			return {...state};
		},
		changeColumn(state, {payload: type}) {
			const panes = state.panels.panes;
			const pushPane = function(key) {
				panes.push({
					  tabs: [],
				  	editors: {},
					activeEditor: {
						id: ''
			    	},
			    	key: key,
			    	activeTab: {
		    			key: '1',
		    			index: key - 1
		    		}
				})
			}
			let reTabKey = function (index) {
				panes[index].tabs.forEach((tab,i) => {
					let isKey = false;
					if (tab.key == panes[index].activeTab.key) {
						isKey = true;
					}
					tab.key = i + 1 + "";
					if (isKey) {
						panes[index].activeTab.key = tab.key;
						panes[index].activeTab.index = i;

					}
				})
			}
			switch(state.panels.splitType) {
				case 'single':
					switch(type) {
						case 'grid':
							for(let i = 1; i < 4; i ++){
								pushPane(i);
							}
							state.panels.activePane.key = 3;
							break;
						case 'single':
							state.panels.activePane.key = 0;
					    	break;
						default:
							pushPane(1);
							state.panels.activePane.key = 1;
					}
					break;
				case 'grid':
					switch(type){
						case 'single':
							for(let i = 1; i < 4; i ++){
								for(let j = 0; j < panes[i].tabs.length; j ++){
									panes[0].tabs.push(panes[i].tabs[j]);
								}
								panes[0].editors = {...panes[0].editors, ...panes[i].editors}
							}
							state.panels.activePane.key = 0;
							reTabKey(0);
							panes.pop();
							panes.pop();
							panes.pop();
							break;
						case 'grid':
							break;
						default:
							for(let i = 2; i < 4; i ++){
								panes[1].editors = {...panes[1].editors, ...panes[i].editors}
							}
							state.panels.activePane.key = 1;
							reTabKey(1);
							panes.pop();
							panes.pop();
					}
					break;
				default:
					switch(type) {
						case 'single':
							for(let i = 0; i < panes[1].tabs.length; i ++){
								panes[0].tabs.push(panes[1].tabs[i]);
							}
							panes[0].editors = {...panes[0].editors, ...panes[1].editors}
							state.panels.activePane.key = 0;
							reTabKey(0);
							panes.pop();
							break;
						case 'grid':
							pushPane(2);
							pushPane(3);
							state.panels.activePane.key = 3;
							break;
					}
			}

			// console.log(state.panels.panes)
			state.panels.splitType = type;
			return {...state};
		},

		removeFile(state,{payload: fileName}) {
			for(let i = 0; i < state.panels.panes.length; i ++){
				for(let j = 0; j < state.panels.panes[i].tabs.length; j ++){
					console.log(state.panels.panes[i].tabs[j].title.split('/').pop(),fileName)
					if (state.panels.panes[i].tabs[j].title.split('/').pop() == fileName) {
						state.panels.panes[i].tabs.splice(j,1);
					}
				}
			}
			return {...state};
		},

		remove(state, {payload: target}) {
			if (typeof target.paneKey != 'undefined') {
				state.panels.activePane.key = target.paneKey;
			}
			let targetKey = target.targetKey;
			let activeKey = methods.getActivePane(state).activeTab.key;
			let activePane = methods.getActivePane(state);
			let lastIndex;
			let type = target.type;

			const reTabKey = function () {
				activePane.tabs.forEach((tab,i) => {
					let isKey = false;
					if (tab.key == activePane.activeTab.key) {
						isKey = true;
					}
					tab.key = i + 1 + "";
					if (isKey) {
						activePane.activeTab.key = tab.key;
						activePane.activeTab.index = i;
						activePane.activeEditor.id = tab.editorId;
					}
				})
			}

			// console.log('tabs',state.panels.panes.tabs)
			activePane.tabs.forEach((tab, i) => {
				if(tab.key === targetKey) {
					lastIndex = i - 1;
					if(lastIndex < 0) {
						lastIndex = 0;
					}
				}
			});
			const tabs = activePane.tabs.filter(tab => tab.key !== targetKey);
			if(lastIndex >= 0 && activeKey === targetKey) {
				if(tabs.length != 0) {
					activeKey = tabs[lastIndex].key;
					//切换语法
					if (tabs[lastIndex].type == 'editor') {
						let fileName = tabs[lastIndex].title.split('.');
						let suffix = fileName[fileName.length - 1];
						if(setMode[suffix] == undefined) {
							suffix = 'txt';
						}
						localStorage.suffix = suffix;
						state.currentMode = setMode[suffix]();
						state.currentLanguage = state.currentMode.toUpperCase();
					}

				}else {
					if(type != 'welcome') {
						// tabs.push({
						// 	title: '',
						// 	content: '',
						// 	key: '1',
						// 	type: 'NoTabs'
						// });
						// activeKey = '1';
					}
				}
			}

			activePane.tabs = tabs;
			activePane.activeTab.key = activeKey;
			// console.log('activeTab',activeKey)
			activePane.activeTab.index = ( parseInt(activeKey) - 1 ).toString();

			reTabKey();

			return {...state};
		},

		handleEditorChanged(state, { payload: params }) {
			let activePane = methods.getActivePane(state);
			let editorObj = {
				id: params.editorId,
				value: params.value
			}
			activePane.editors[params.editorId] = editorObj;
			activePane.activeEditor.id = params.editorId;
			methods.getActiveTab(state,activePane).isSave = false;

			return {...state};
		},

		handleFileSave(state,{payload: params}) {
			state.panels.panes[params.pane].tabs[params.tabKey - 1].isSave = true;
			return {...state};
		},
		add(state, {payload: target}) {

			if (typeof target.paneKey !== 'undefined') {
				state.panels.activePane.key = target.paneKey;
			}

		    let panes = state.panels.panes;
		    let activePane = methods.getActivePane(state);
			target.title = target.title || '新标签页';
			target.file = target.file || '';
			target.type = target.type || 'editor';
			target.content = target.content || '';
			target.loading = target.loading || false;

			activePane.activeTab.key = (activePane.tabs.length + 1).toString();
			let isSave = true;

			if (target.type === 'editor') {
				var editorObj = {
					value: target.content,
					id: target.editorId,
					fileName: target.file
				};
				activePane.editors[target.editorId] = editorObj;
				activePane.activeEditor.id = target.editorId;
				if(target.title == '新文件' || target.title == '新标签页'){
					isSave = false;
				}
			}
			let editorId = target.editorId || '';
			activePane.activeEditor.id = target.editorId;
		    activePane.tabs.push({ title: target.title, content: target.content,
		    					type: target.type, key: activePane.activeTab.key, file: target.file,
		    					editorId: editorId,isSave: isSave,loading: target.loading});
			activePane.activeTab = {key: activePane.activeTab.key, index: activePane.tabs.length - 1};

		    return {...state};
		},

		//打开文件时，先打开编辑器，加载动画，再在此把内容放进去
		pushContentToEditors(state, {payload: params}) {

			let panes = state.panels.panes;
			for(let i = 0; i < panes.length; i ++) {
				for(let j = 0; j < panes[i].tabs.length; j ++) {
					if (panes[i].tabs[j].editorId == params.editorId) {

						panes[i].tabs[j].type = 'editor';
						panes[i].tabs[j].content = params.content;
						panes[i].tabs[j].loading = params.loading;

						panes[i].editors[params.editorId] = {
							content: params.content,
							editorId: params.editorId,
							fileName: params.file
						};

					}
				}
			}

			return { ...state };
		},

		setActivePaneAndTab(state, { payload: params }) {
			state.panels.activePane.key = params.paneKey;
			state.panels.panes[params.paneIndex].activeTab.key = params.tabKey;
			state.panels.panes[params.paneIndex].activeTab.index = params.tabIndex;
			return { ...state };
		},


		//UI状态初始化
		initState(state, { payload: params }){
			state.panels = params.UIState.panels;
			return {...state};
		},
		setPID(state, { payload: params }){
			var activePane = state.panels.panes[state.panels.activePane.key],
			tabKey = activePane.activeTab.key,
			activeTab = activePane.tabs[tabKey-1];
			activeTab.editorId = params.pid;
			return {...state};
		},
		dynamicChangeSyntax(state,{payload: params}) {
			if(setMode[params.suffix] == undefined) {
				params.suffix = 'txt';
			}
			state.currentMode = setMode[params.suffix]();
			state.currentLanguage = state.currentMode.toUpperCase();
			return {...state};
		},
	}

}
