import dva from 'dva';

export default {
	namespace: 'editor',
	state: {
		showArrow: true,

		editors: []
	},

	reducers: {

		pushEditor(state, { payload: editorId }) {
			var editorObj = {
				value: '// TO DO \r\n'
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
			state.editor.value = state.editors[params.editorId].value + params.value;
			return {...state};
		}

	}

}
