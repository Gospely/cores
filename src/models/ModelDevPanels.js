// import React from 'react';
import React , { PropTypes } from 'react';
import dva from 'dva';

import CodingEditor from '../components/Panel/Editor.js';
import Terminal from '../components/Panel/Terminal.js';
import Designer from '../components/Panel/Designer.js';

import { message } from 'antd';

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

	    panels: {

	    	panes: [
	    		{
	    			tabs: [
			    		{
			    			title: '欢迎页面 - Gospel',
			    			content: '欢迎使用 Gospel在线集成开发环境',
			    			key: '1',
			    			type: 'welcome'
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
	    }

	},

	effects: {



	},

	reducers: {

		changePane(state,{payload: key}){
			// methods.getActivePane.activeEditor.id = state.panels.activeEditor.id;
			state.panels.activePane.key = key;
			return {...state};
		},

		tabChanged(state, {payload: params}) {
			// console.log('ifFalse',state.panels.activePane.key !== state.panels.prevPane.key)
			// if (state.panels.activePane.key !== state.panels.prevPane.key) {
			// 	return{...state};
			// }
			const activePane = methods.getActivePane(state);
			const activeTab = methods.getActiveTab(state,activePane);
			// console.log(activeTab)
			methods.getActivePane(state).activeTab.key = params.active;
			methods.getActivePane(state).activeTab.index = ( parseInt(params.active) - 1 ).toString();

			
			// console.log('activePane',methods.getActivePane(state))
			// console.log('activeTab',activeTab);


			if(activeTab.type == 'editor') {
				// state.panels.activeEditor.id = activeTab.content.props.editorId;
				activePane.activeEditor.id = activeTab.content.props.editorId;
			}
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
						type: 'welcome'
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
						case 'grid': for(let i = 1; i < 4; i ++){
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
								for(let j = 0; j < state.panels.penes[i].tabs.length; j ++){
									panes[0].tabs.push(state.panels.penes[i].tabs[j]);
								}
								panes[0].editors = {...panes[0].editors, ...panes[i].editors}
							}
							state.panels.activePane.key = 0;
							panes.forEach((pane,j) => {
								while(j > 0){
									reTabKey(j);
								}
							})
							panes.pop();
							panes.pop();
							panes.pop();
							break;
						case 'grid': 
							break;
						default: 
							panes.pop();
							for(let i = 2; i < 4; i ++){
								panes[0].tabs.push(state.panels.penes[i].tabs[j]);
								panes[0].editors = {...panes[0].editors, ...panes[i].editors}
							}
							state.panels.activePane.key = 1;
							reTabKey(1);
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

		'remove'(state, {payload: targetKey}) {
			let target = targetKey.targetKey;
			let activeKey = methods.getActivePane(state).activeTab.key;
			let activePane = methods.getActivePane(state);
			let lastIndex;
			let type = targetKey.type;

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
				if(tab.key === target) {
					lastIndex = i - 1;
					if(lastIndex < 0) {
						lastIndex = 0;
					}
				}
			});
			console.log('lastIndex',lastIndex)



			const tabs = activePane.tabs.filter(tab => tab.key !== target);
			// console.log('activePane',methods.getActivePane(state).key)
			if(lastIndex >= 0 && activeKey === target) {
				if(tabs.length != 0) {
					activeKey = tabs[lastIndex].key;
				}else {
					if(type != 'welcome') {
						tabs.push({
							title: '欢迎页面 - Gospel',
							content: 'content',
							key: '1',
							type: 'welcome'
						});
						activeKey = '1';
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
			console.log(currentEditor.getValue());
			console.log(params)
			let activePane = methods.getActivePane(state);
			let editorObj = {
				id: params.editorId,
				value: params.value
			}
			console.log(editorObj)
			activePane.editors[params.editorId] = editorObj;
			// methods.getActivePane(state).editors[params.editorId].value = params.value;
			methods.getActivePane(state).activeEditor.id = params.editorId;
			return {...state};
		},
		replaceSync(state) {

			console.log('devpanel replace');
			methods.getActivePane(state).editors[state.panels.activeEditor.id].value = currentEditor.getValue();
			console.log(currentEditor.getValue());
			return {...state};
		},
		add(state, {payload: target}) {

		    let panes = state.panels.panes;
		    let activePane = methods.getActivePane(state);
		    // console.log(activePane.tabs.length + 1)
		    activePane.activeTab.key = (activePane.tabs.length + 1).toString();
		    // console.log(target); 

			target.title = target.title || '新标签页';
			target.type = target.type || 'editor';
			target.content = target.content || '// TO DO \r\n';
			console.log(target.content)

			const devTypes = {
				editor: function(params) {
					console.log(params);
					var editorObj = {
						value: params.content,
						id: params.editorId
					};

					activePane.editors[params.editorId] = editorObj;
					activePane.activeEditor.id = params.editorId;
					return (
						<CodingEditor inThisPane={state.panels.activePane.key} editorId={params.editorId} test="dsfdsfd"></CodingEditor>
					);
				},

				terminal: function() {
					return (
						<Terminal></Terminal>
					);
				},

				designer: function() {
					return (
						<Designer></Designer>
					);
				}
			}

			var params = {
				editorId: target.editorId,
				content: target.content
			};

			var currentDevType = devTypes[target.type](params);

			if(currentDevType == undefined) {
				message.error('您使用了不存在的开发面板类型!');
				return {...state};
			}

			activePane.activeEditor.id = target.editorId;
			console.log("key",state.panels.activePane.key)
		    activePane.tabs.push({ title: target.title, content: currentDevType, type: target.type, key: activePane.activeTab.key});
		    console.log('editorTab:',currentDevType)
			activePane.activeTab = {key: activePane.activeTab.key, index: activePane.tabs.length - 1};
		    return {...state};
		}
	}

}
