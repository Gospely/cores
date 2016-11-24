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

		syntaxList: [{
			language: 'HTML',
			key: '1',
			alias: 'html'
		}, {
			language: 'JavaScript',
			key: '2',
			alias: 'javascript'
		}, {
			language: 'CSS',
			key: '3',
			alias: 'css'
		}, {
			language: 'PHP',
			key: '4',
			alias: 'php'
		}],

		isSaving: false,
		currentLanguage: 'HTML',

		isSlideUp: false
	},

	reducers: {

		showSearchBar(state) {
				return {...state, searchVisible: true
				};
			},

			hideSearchBar(state) {
				return {...state, searchVisible: false
				};
			},

			toggleSearchBar(state) {
				return {...state, searchVisible: !state.searchVisible, jumpLineVisible:
						false
				};
			},

			search(state) {

			},

			searchPrev(state) {
				console.log('searchPrev');
				return {...state
				};
			},

			searchNext(state) {
				console.log('searchNext');
				return {...state
				};
			},

			replace(state) {
				console.log('replace');
				console.log("state", state);
				return {...state
				};
			},

			selectSyntax() {

			},

			showJumpLine(state) {
				return {...state, jumpLineVisible: true
				};
			},

			hideJumpLine(state) {
				return {...state, jumpLineVisible: false
				};
			},

			toggleJumpLine(state) {
				return {...state, jumpLineVisible: !state.jumpLineVisible, searchVisible:
						false
				};
			},

			jumpLine(state) {

			},

			toggleSlide(state, {
				payload: proxy
			}) {

				var target = proxy.target;
				var aceEditor = target.parentNode.parentNode.parentNode.parentNode.parentNode;
				var tabHeader = aceEditor.parentNode.parentNode.parentNode.firstChild;
				console.log(aceEditor, tabHeader, tabHeader.className); //ant-tabs-bar
				if (tabHeader.className != 'ant-tabs-bar') {
					tabHeader = tabHeader.firstChild;
				}
				if (aceEditor.className.substr(0, 9) != 'aceEditor') {
					aceEditor = aceEditor.firstChild;
				}

				if (!state.isSlideUp) {
					tabHeader.style.display = 'none';
				} else {
					tabHeader.style.display = 'block';
				}

				return {...state, isSlideUp: !state.isSlideUp
				};
			},

			save(state) {
				return {...state, isSaving: true
				};
			},

			handleReplaceInputChange(state, {
				payload: proxy
			}) {
				return {...state, replaceContent: proxy.target.value
				};
			},

			handleSearchInputChange(state, {
				payload: proxy
			}) {
				return {...state, searchContent: proxy.target.value
				};
			},

			handleSearchAllSwitchChange(state, {
				payload: proxy
			}) {
				return {...state, isReplaceAll: proxy
				};
			},

			handleJumpLineChange(state, {
				payload: proxy
			}) {
				return {...state, jumpLine: proxy.target.value
				};
			},

			onSelectSyntax(state, {
				payload: e
			}) {
				var key = e.key;
				var language = state.syntaxList[parseInt(key) - 1].language;
				return {...state, currentLanguage: language
				};
			}

	}

}
