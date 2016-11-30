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
      theme: 'vs-dark',
      cursorStyle: 'line',
      automaticLayout: true,
			fontSize: 12,
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
			console.log(state.editors);
			return {...state};
		},

		showArrow(state) {
			return {...state, showArrow: true};
		},

		hideArrow(state) {
			return {...state, showArrow: false};
		},

		handleEditorChanged(state, { payload: params }) {
			console.log(params);
			state.editor.value = state.editors[params.editorId].value + params.value;
			return {...state};
		}

	}

}
