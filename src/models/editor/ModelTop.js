import dva from 'dva';

export default {
	namespace: 'editorTop',
	state: {
		searchVisible: false,
		jumpLineVisible: false,

		isReplaceAll: true,
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
			console.log('searchPrev');
			return {...state};
		},

		searchNext(state) {
			console.log('searchNext');
			return {...state};
		},

		replace(state) {
			console.log('replace');
			return {...state};
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
		},

		handleReplaceInputChange(state, {payload: proxy}) {
			return {...state, replaceContent: proxy.target.value};
		},

		handleSearchInputChange(state, {payload: proxy}) {
			return {...state, searchContent: proxy.target.value};
		},

		handleSearchAllSwitchChange(state, {payload: proxy}) {
			return {...state, isReplaceAll: proxy};			
		},

		handleJumpLineChange(state, {payload: proxy}) {
			return {...state, jumpLine: proxy.target.value};
		}

	}

}