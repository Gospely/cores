// import React from 'react';

import dva from 'dva';

// import AceEditor from 'react-ace';

// import PanelStyle from '../components/Panels.css';

// import 'brace/mode/java';
// import 'brace/theme/github';
// import 'brace/mode/javascript';
// import 'brace/mode/html';
// import 'brace/mode/css';


export default {
	namespace: 'devpanel',
	state: {

		panes: [
			{ title: 'Tab 1', content: 'content of tab 2', key: '1' },
	      	{ title: 'Tab 2', content: 'Content of Tab 2', key: '2' }
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
				}
			}

			return {...state, panes, activeKey};
		},

		add(state, {payload: targetKey}) {
		}
	}

}