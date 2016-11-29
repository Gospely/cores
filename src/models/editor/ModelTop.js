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
		currentMode: 'javascript',

		syntaxList: [{
			language: 'HTML',
			key: '1',
			alias: 'html',
			suffix: 'html'
		}, {
			language: 'JavaScript',
			key: '2',
			alias: 'javascript',
			suffix:'js'
		}, {
			language: 'CSS',
			key: '3',
			alias: 'css',
			suffix: 'css'
		}, {
			language: 'PHP',
			key: '4',
			alias: 'php',
			suffix: 'php'
		},{
			language: 'JAVA',
			key: '5',
			alias: 'java',
			suffix: 'java'
		}],

		isSaving: false,
		currentLanguage: 'HTML',

		isSlideUp: false,
	},


	reducers: {

		showSearchBar(state) {
			return {...state, searchVisible: true};
		},

		hideSearchBar(state) {
			return {...state, searchVisible: false};
		},

		toggleSearchBar(state,{payload: params}) {

			state.searchContent = params.searchContent;
			currentEditor.find(state.searchContent,{
				backwards: true,
				wrap: true,
				caseSensitive: true,
				wholeWord: true,
				regExp: false
			});
			return {...state, searchVisible: !state.searchVisible, jumpLineVisible: false};
		},

		search(state,{payload: params}) {

			console.log(params);
			state.searchContent = params.searchContent;
			return {...state};
		},
		searchPrev(state) {
			currentEditor.find(state.searchContent,{
				backwards: true,
				wrap: true,
				caseSensitive: true,
				wholeWord: true,
				regExp: false
			});

			currentEditor.findPrevious();
			console.log('searchPrev');
			return {...state};
		},

		searchNext(state) {
			currentEditor.find(state.searchContent,{
				backwards: true,
				wrap: true,
				caseSensitive: true,
				wholeWord: true,
				regExp: false
			});

			currentEditor.findNext();
			console.log('searchNext');
			return {...state};
		},
		replace(state) {

			console.log(state);
			console.log(state.replaceContent);
			if(!state.isReplaceAll) {
				console.log('all');
				currentEditor.replaceAll(state.replaceContent,{
						needle:state.searchContent,
						backwards: true,
						wrap: true,
						caseSensitive: true,
						wholeWord: true,
						regExp: false
				});
				console.log(currentEditor.getValue());
			}else{
				console.log('single');
				currentEditor.replace(state.replaceContent,{
						needle:state.searchContent,
						backwards: true,
						wrap: true,
						caseSensitive: true,
						wholeWord: true,
						regExp: false
				});
			}
			currentEditor.findNext();
			console.log("state", state);

			return {...state};
		},

		selectSyntax() {

		},
		dynamicChangeSyntax(state,{payload: params}) {

			var setMode = {
				js: function(){
						console.log('javascript');
						return 'javascript';
				},
				css: function(){
						console.log('css');
						return 'css';
				},
				html: function(){
						console.log('html');
						return 'html';
				},
				php: function(){
						console.log('php');
						return 'php';
				},
				java: function() {
						console.log('java');
						return 'java';
				},
				txt: function() {
					console.log('txt');
					return 'plain_text';
				},
				md: function() {
					console.log('markdown');
					return 'markdown';
				}
			}
			console.log("denamicChange");
			console.log(params.suffix);

			if(setMode[params.suffix] == undefined) {
				params.suffix = 'txt';
			}
			state.currentMode = setMode[params.suffix]();

			return {...state};
		},
		showJumpLine(state) {
			return {...state, jumpLineVisible: true
			};
		},

		hideJumpLine(state) {
			return {...state, jumpLineVisible: false};
		},

		toggleJumpLine(state) {
			return {...state, jumpLineVisible: !state.jumpLineVisible, searchVisible:false};
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

			return {...state, isSlideUp: !state.isSlideUp};
		},

		save(state) {
			return {...state, isSaving: true};
		},

		handleReplaceInputChange(state, {
			payload: proxy
		}) {
			return {...state, replaceContent: proxy.target.value};
		},

		handleSearchInputChange(state, {
			payload: proxy
		}) {
			return {...state, searchContent: proxy.target.value};
		},

		handleSearchAllSwitchChange(state, {
			payload: proxy
		}) {
			return {...state, isReplaceAll: !state.isReplaceAll};
		},

		handleJumpLineChange(state, {
			payload: proxy
		}) {
			currentEditor.gotoLine(proxy.target.value);
			console.log(state.jumpLine);
			return {...state, jumpLine: proxy.target.value};
		},

		onSelectSyntax(state, {
			payload: e
		}) {
			var key = e.key;
			var language = state.syntaxList[parseInt(key) - 1].language;
			return {...state, currentLanguage: language};
		}

	},
}
