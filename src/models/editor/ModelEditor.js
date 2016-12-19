import dva from 'dva';

export default {
	namespace: 'editor',
	state: {
		showArrow: true,

		editors: [],
		options: {
	      	selectOnLineNumbers: true,
	      	roundedSelection: true,
	      	readOnly: false,
	      	theme: 'vs',
	      	cursorStyle: 'line',
	      	automaticLayout: true,
			fontSize: 14,
			cursorBlinking: true
    	}
	},

	reducers: {

		pushEditor(state, { payload: editorId }) {
			var editorObj = {
					value: ''
				},
				tmp = {};
				tmp[editorId] = editorObj;
				state.editors.push(tmp);
			return {...state};
		},

		showArrow(state) {
			return {...state, showArrow: true};
		},

		hideArrow(state) {
			return {...state, showArrow: false};
		}
	}

}
