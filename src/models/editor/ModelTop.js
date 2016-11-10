import dva from 'dva';

export default {
	namespace: 'editorTop',
	state: {
		searchVisible: false,
		jumpLineVisible: false,

		isSearchAll: false,
		searchContent: '',
		replaceContent: '',

		jumpLine: '0:0',
		
		syntaxList: [],

		isSaving: false
	},

	reducers: {

		showSearchBar(state) {
			return {...state, searchVisible: true};
		},

		hideSearchBar(state) {
			return {...state, searchVisible: false};
		},

		toggleSearchBar(state) {
			return {...state, searchVisible: !state.searchVisible, jumpLineVisible: false};
		},

		search(state) {

		},

		searchPrev(state) {

		},

		searchNext(state) {

		},

		replace(state) {

		},

		selectSyntax() {

		},

		showJumpLine(state) {
			return {...state, jumpLineVisible: true};
		},

		hideJumpLine(state) {
			return {...state, jumpLineVisible: false};
		},

		toggleJumpLine(state) {
			return {...state, jumpLineVisible: !state.jumpLineVisible, searchVisible: false};
		},

		jumpLine(state) {

		},

		slideUp(state) {

		},

		save(state) {
			return {...state, isSaving: true};
		}

	}

}