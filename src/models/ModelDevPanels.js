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

export default {
	namespace: 'devpanel',
	state: {

			devType: {
				visual: localStorage.visual || true,
				defaultActiveKey: localStorage.defaultActiveKey || 'controllers',
			},
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
			    			isSave: false
			    		},

			    		{
			    			title: 'Gospel 小程序 UI 设计器',
			    			content: '',
			    			key: '2',
			    			type: 'designer',
			    			editorId: '',
			    			searchVisible: false,
			    			isSave: false
			    		}
		    		],

		    		editors: {},

		    		activeEditor: {
		    			id: ''
		    		},

		    		key: 0,

		    		activeTab: {
		    			key: '2',
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
	    }

	},

	effects: {

		//根据项目的类型渲染ide面板
		*handleImages({ payload: params}, {call, put, select}) {

			console.log("handleImages");
			console.log(params);
			const devType = {

				common(){
					console.log("common");

				},

				visual(){

				}
			};

			const debugType = {

				common() {

				},

				shell() {

				}
			};

			var url = "images/" + params.id;
			console.log(url);
			var res = yield request(url, {
						method: 'GET',
						});
			console.log(res);
			if(res.data.fields.devType == 'common'){
					yield put({ type: "handleCommon" });
			}else{
				yield put({ type: "handleVisual" });
			}
		}
	},

	reducers: {

		handleDebugger(state, { payload: params}){

				state.debug = params.debug;
				console.log('handleDebugger');
				return {...state};
		},
		handleTabChanged(state, {payload: name}) {
			state.activeMenu = name;
			return {...state};
		},
		handleCommon(state) {
			console.log("handleCommon");
			state.panels.panes[0].tabs =  [
				{
					title: '欢迎页面 - Gospel',
					content: '',
					key: '1',
					type: 'welcome',
					editorId: '',
					searchVisible: false,
					isSave: false
				}
			];
			state.panels.panes[0].activeTab.key = "1";
			state.devType.visual = false;
			localStorage.visual = false;
			state.devType.defaultActiveKey = 'setting';
			localStorage.defaultActiveKey = 'setting';
			localStorage.activeMenu = "file";
			window.location.href = 'http://localhost:8989/#/project/' + localStorage.currentProject;
			return {...state};

		},
		handleVisual(state){

			console.log("handleVisual");
			state.panels.panes[0].tabs =  [
				{
					title: '欢迎页面 - Gospel',
					content: '',
					key: '1',
					type: 'welcome',
					editorId: '',
					searchVisible: false,
					isSave: false
				},
				{
					title: 'Gospel 小程序 UI 设计器',
					content: '',
					key: '2',
					type: 'designer',
					editorId: '',
					searchVisible: false,
					isSave: false
				}
			];
			state.panels.panes[0].activeTab.key = "2";
			state.devType.visual = true;
			localStorage.visual = true;
			state.devType.defaultActiveKey = 'controllers';
			localStorage.defaultActiveKey = 'controllers';
			localStorage.activeMenu = "attr";
			window.location.href = 'http://localhost:8989/#/project/' + localStorage.currentProject;
			return {...state};
		},
		toggleSearchBar(state,{payload:params}) {
			console.log(params.belongTo)
			let tab = methods.getActiveTab(state, state.panels.panes[params.belongTo]);
			tab.searchVisible = !tab.searchVisible;
			return {...state};
		},

		changePane(state,{payload: key}){
			console.log(key);
			state.panels.activePane.key = key;
			return {...state};
		},

		tabChanged(state, {payload: params}) {

			console.log('tab change');
			// localStorage.isSave = false;
			console.log(params);
			// console.log(params.paneKey)
			state.panels.activePane.key = params.paneKey;
			const activePane = methods.getActivePane(state);
			console.log(state);
			methods.getActivePane(state).activeTab.key = params.active;
			const activeTab = activePane.tabs[params.active - 1]
			console.log(activeTab);
			// console.log(activeTab)

			methods.getActivePane(state).activeTab.index = ( parseInt(params.active) - 1 ).toString();


			// console.log('activePane',methods.getActivePane(state))
			// console.log('activeTab',activeTab);


			if(activeTab.type == 'editor') {
				// state.panels.activeEditor.id = activeTab.content.props.editorId;
				console.log(activeTab)

				activePane.activeEditor.id = activeTab.editorId;
			}
			console.log(activePane.activeEditor.id);
			return {...state};
		},
		changeTabTitle(state,{payload:params}){
			console.log(params);
			const activePane = methods.getActivePane(state);
			const activeTab = activePane.tabs[activePane.activeTab.index];
			const activeEditor = activePane.editors[activePane.activeEditor.id];
			activeEditor.fileName = params.value;
			console.log(activeTab);
			console.log(params.value);
			activeTab.title = params.value;
			return {...state};
		},
		changeColumn(state, {payload: type}) {
			const panes = state.panels.panes;
			const pushPane = function(key) {
				panes.push({
					  tabs: [{
						title: '欢迎页面 - Gospel',
						content: '欢迎使用 Gospel在线集成开发环境',
						key: '1',
						type: 'welcome',
						editorId: ''
					}],
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

			console.log(state.panels.panes)
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
			console.log('lastIndex',lastIndex)

			const tabs = activePane.tabs.filter(tab => tab.key !== targetKey);
			// console.log('activePane',methods.getActivePane(state).key)
			if(lastIndex >= 0 && activeKey === targetKey) {
				if(tabs.length != 0) {
					activeKey = tabs[lastIndex].key;
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
			// localStorage.isSave = true;
			console.log(params)
			let activePane = methods.getActivePane(state);
			let editorObj = {
				id: params.editorId,
				value: params.value
			}
			console.log(editorObj)
			activePane.editors[params.editorId] = editorObj;
			// methods.getActivePane(state).editors[params.editorId].value = params.value;
			activePane.activeEditor.id = params.editorId;
			methods.getActiveTab(state,activePane).isSave = false;

			return {...state};
		},

		handleFileSave(state,{payload: params}) {

			console.log("handleFileSave");
			console.log(params);
			console.log(state.panels.panes[params.paneKey].tabs)
			state.panels.panes[params.paneKey].tabs[params.tabKey - 1].isSave = true;
			return {...state};
		},

		replace(state,{payload: params}) {

			console.log('devpanel replace');
			// methods.getActivePane(state).editors[state.panels.activeEditor.id].value = currentEditor.getValue();
			// console.log(currentEditor.getValue());

			console.log(state);
			console.log(params.replaceContent);
			console.log(params.searchContent);
			console.log(params.isReplaceAll);
			var content = currentEditor.getValue();
			console.log(content);
			currentEditor.find(state.searchContent,{
				backwards: true,
				wrap: true,
				caseSensitive: true,
				wholeWord: true,
				regExp: false
			});
			currentEditor.findAll();


			// if(!params.isReplaceAll) {
			// 	content = content.replace(params.searchContent,params.replaceContent);
			// 	console.log(content);
			// }else{
			// 	content = content.replace(new RegExp(params.searchContent, 'gm'), params.replaceContent);
			// }

			if(!params.isReplaceAll) {
				console.log('all');
				currentEditor.replaceAll(params.replaceContent,{
						needle:params.searchContent,
						backwards: false,
						wrap: true,
						caseSensitive: true,
						wholeWord: true,
						regExp: false
				});
			}else{
				console.log('single');
				currentEditor.replace(params.replaceContent,{
						needle:params.searchContent,
						backwards: false,
						wrap: true,
						caseSensitive: true,
						wholeWord: true,
						regExp: false
				});

				currentEditor.find(params.replaceContent,{
					backwards: true,
					wrap: true,
					caseSensitive: true,
					wholeWord: true,
					regExp: false
				});
				currentEditor.findAll();
			}
			console.log("state", state);
			var editorId = state.panels.panes[state.panels.activePane.key].activeEditor.id
			state.panels.panes[state.panels.activePane.key].editors[editorId].value = currentEditor.getValue();
			methods.getActiveTab(state,methods.getActivePane(state)).isSave = false;
			return {...state};
		},
		add(state, {payload: target}) {

			// localStorage.isSave = false;
			console.log("paneKey",target.paneKey)
			if (typeof target.paneKey !== 'undefined') {
				state.panels.activePane.key = target.paneKey;
			}
			// console.log(target.paneKey)

		    let panes = state.panels.panes;
		    let activePane = methods.getActivePane(state);


			target.title = target.title || '新标签页';
			target.type = target.type || 'editor';
			target.content = target.content || '';

			for(let i = 0; i < panes.length; i ++) {
				for(let j = 0; j < panes[i].tabs.length; j ++) {
					if (target.title !== '新文件' && target.title !== '新标签页' &&
						target.type === 'editor' && panes[i].tabs[j].title === target.title) {
						message.error('您已打开此文件!')
						state.panels.activePane.key = i + '';
						state.panels.panes[i].activeTab.key = j + 1 + '';
						state.panels.panes[i].activeTab.index = j;
						return {...state};
					}
				}
			}

			activePane.activeTab.key = (activePane.tabs.length + 1).toString();

			console.log(target.content)
			let isSave = true;
			if (target.type === 'editor') {
				var editorObj = {
					value: target.content,
					id: target.editorId,
					fileName: target.title
				};
				activePane.editors[target.editorId] = editorObj;
				activePane.activeEditor.id = target.editorId;
				if(target.title == '新文件' || target.title == '新标签页'){
					isSave = false;
				}
			}
			let editorId = target.editorId || '';
			activePane.activeEditor.id = target.editorId;
			console.log("key",state.panels.activePane.key)
		    activePane.tabs.push({ title: target.title, content: target.content,
		    					type: target.type, key: activePane.activeTab.key,
		    					editorId: editorId,isSave: isSave});
		    // console.log('editorTab:',currentDevType)
			activePane.activeTab = {key: activePane.activeTab.key, index: activePane.tabs.length - 1};
			console.log({ title: target.title, content: target.content,
		    					type: target.type, key: activePane.activeTab.key,
		    					editorId: editorId,isSave: isSave})
		    return {...state};
		}
	}

}
