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
			    		},

						{
			    			title: '欢迎页面 - Gospel',
			    			key: '2',
			    			type: 'designer'
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

		tabChanged(state, {payload: params}) {
			methods.getActivePane(state).activeTab.key = params.active;
			methods.getActivePane(state).activeTab.index = ( parseInt(params.active) - 1 ).toString();

			const activeTab = methods.getActiveTab(state,methods.getActivePane(state));
			console.log('activeTab',activeTab);
			

			if(activeTab.type == 'editor') {
				state.panels.activeEditor.id = activeTab.content.props.editorId;
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
			switch(state.panels.splitType) {
				case 'single': switch(type) {
					case 'grid': for(let i = 1; i < 4; i ++){
						pushPane(i);
					}
					state.panels.activePane.key = 3;
					break;
					case 'single': state.panels.activePane.key = 0;
				    break;
					default: pushPane(1);
						state.panels.activePane.key = 1;
				}
				break;
				case 'grid': switch(type){
					case 'single': for(let i = 0; i < 3; i ++){
						panes.pop();
					}
					state.panels.activePane.key = 0;
					break;
					case 'grid': break;
					default: panes.pop();
						panes.pop();
						state.panels.activePane.key = 1;
				}
				break;
				default: switch(type) {
					case 'single': panes.pop();
						state.panels.activePane.key = 0;
						break;
					case 'grid': pushPane(2);
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
			let lastIndex;

			let type = targetKey.type;
			// console.log('tabs',state.panels.panes.tabs)
			methods.getActivePane(state).tabs.forEach((tab, i) => {
				if(tab.key === target) {
					lastIndex = i - 1;
					if(lastIndex < 0) {
						lastIndex = 0;
					}
				}
			});



			const tabs = methods.getActivePane(state).tabs.filter(tab => tab.key !== target);
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

			methods.getActivePane(state).tabs = tabs;
			methods.getActivePane(state).activeTab.key = activeKey;
			methods.getActivePane(state).activeTab.index = ( parseInt(activeKey) - 1 ).toString();

			return {...state};
		},

		handleEditorChanged(state, { payload: params }) {
			methods.getActivePane(state).editors[params.editorId].value = params.value;
			return {...state};
		},

		add(state, {payload: target}) {

		    const panes = state.panels.panes;
		    const activePane = methods.getActivePane(state);
		    activePane.activeTab.key = (activePane.tabs.length + 1).toString();
		    console.log(target);

			target.title = target.title || '新标签页';
			target.type = target.type || 'editor';
			target.content = target.content || '';

			const devTypes = {
				editor: function(params) {
					console.log(params);
					var editorObj = {
						value: '// TO DO \r\n',
						id: params.editorId
					};

					activePane.editors[params.editorId] = editorObj;
					activePane.activeEditor.id = params.editorId;
					return (
						<CodingEditor
							editorId={params.editorId}>
						</CodingEditor>
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
				editorId: target.editorId
			};

			var currentDevType = devTypes[target.type](params);

			if(currentDevType == undefined) {
				message.error('您使用了不存在的开发面板类型!');
				return {...state};
			}

			state.panels.activeEditor.id = target.editorId;
			console.log("key",state.panels.activePane.key)
		    activePane.tabs.push({ title: target.title, content: currentDevType, type: target.type, key: activePane.activeTab.key});
			activePane.activeTab = {key: activePane.activeTab.key, index: activePane.tabs.length - 1};
		    return {...state};
		}
	}

}
