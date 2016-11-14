// import React from 'react';

import dva from 'dva';

export default {
	namespace: 'devpanel',
	state: {

		panes: [
			{ title: '欢迎页面 - Gospel', content: '欢迎使用 Gospel在线集成开发环境', key: '1', type: 'welcome' },
	    ],

	    activeKey: '1'
	},

	reducers: {

		tabChanged(state, {payload: key}) {
			return {...state, activeKey: key};
		},

		'remove'(state, {payload: targetKey}) {
			let target = targetKey.targetKey;
			let activeKey = state.activeKey;
			let lastIndex;

			let type = targetKey.type;

			console.log(targetKey, targetKey.type);

			state.panes.forEach((pane, i) => {
				if(pane.key === target) {
					lastIndex = i - 1;
					if(lastIndex < 0) {
						lastIndex = 0;
					}
				}
			});

			const panes = state.panes.filter(pane => pane.key !== target);
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

			return {...state, panes, activeKey};
		},

		add(state, {payload: target}) {

		    const panes = state.panes;
		    const activeKey = (state.panes.length + 1).toString();

			target.title = target.title || '新标签页 ';
			target.type = target.type || 'editor';
			target.content = target.content || '';

		    panes.push({ title: target.title + activeKey, content: target.content, key: activeKey, type: target.type });

		    return {...state, panes, activeKey};
		}
	}

}