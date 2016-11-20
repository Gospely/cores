// import React from 'react';
import React , { PropTypes } from 'react';
import dva from 'dva';

import CodingEditor from '../components/Panel/Editor.js';
import Terminal from '../components/Panel/Terminal.js';

import { message } from 'antd';

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
		    		}
	    		}
	    	],

	    	splitType: 'single',

	    	activePane: {
	    		key: 0
	    	},
	    	activeTab: {
	    		key: '1',
	    		index: 0
	    	},
	    	activeEditor: {
	    		id: ''
	    	}
	    },

	},

	effects: {



	},

	reducers: {

		tabChanged(state, {payload: params}) {
			state.panels.activeTab.key = params.active;
			state.panels.activeTab.index = ( parseInt(params.active) - 1 ).toString();
			console.log(state);
			const activeTab = state.panels.panes[state.panels.activePane.key].tabs[state.panels.activeTab.index];
			if(activeTab.type == 'editor') {
				state.panels.activeEditor.id = activeTab.content.props.editorId;
			}
			return {...state};
		},

		changeColumn(state, {payload: type}) {
			state.panels.splitType = type;
			return {...state};
		},

		'remove'(state, {payload: targetKey}) {
			let target = targetKey.targetKey;
			let activeKey = state.panels.activeTab.key;
			let lastIndex;

			let type = targetKey.type;

			state.panels.panes.forEach((pane, i) => {
				if(pane.tabs.key === target) {
					lastIndex = i - 1;
					if(lastIndex < 0) {
						lastIndex = 0;
					}
				}
			});

			const panes = state.panels.panes.filter(pane => pane.tabs[state.panels.activeTab.index].key !== target);
			if(lastIndex >= 0 && activeKey === target) {
				if(panes.length != 0) {
					activeKey = panes[lastIndex].key;
				}else {
					if(type != 'welcome') {
						panes.push({
							title: '欢迎页面 - Gospel',
							content: 'content',
							key: '1',
							type: 'welcome'
						});
						activeKey = '1';
					}
				}
			}

			state.panels.panes = panes;
			state.panels.activeTab.key = activeKey;
			state.panels.activeTab.index = ( parseInt(activeKey) - 1 ).toString();

			return {...state};
		},

		handleEditorChanged(state, { payload: params }) {
			state.panels.panes[state.panels.activePane.key].editors[params.editorId].value = params.value;
			return {...state};
		},

		add(state, {payload: target}) {

		    const panes = state.panels.panes;
		    state.panels.activeTab.key = (state.panels.panes[state.panels.activePane.key].tabs.length + 1).toString();

			target.title = target.title || '新标签页';
			target.type = target.type || 'editor';
			target.content = target.content || '';

			const devTypes = {
				editor: function(params) {

					var editorObj = {
						value: '// TO DO \r\n',
						id: params.editorId
					};

					state.panels.panes[state.panels.activePane.key].editors[params.editorId] = editorObj;
					state.panels.panes[state.panels.activePane.key].activeEditor.id = params.editorId;
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
		    state.panels.panes[state.panels.activePane.key].tabs.push({ title: target.title, content: currentDevType, key: state.panels.activeTab.key, type: target.type });

		    return {...state};
		}
	}

}