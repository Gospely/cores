import React , {PropTypes} from 'react';
import AceEditor from 'react-ace';
import EditorStyle from './Editor.css';
import { connect } from 'dva';

import 'brace/mode/java';
import 'brace/theme/github';
import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';

import EditorTop from './EditorTop';

const Editor = (props) => {

	var props$editorTop = props.editorTop,
		dispatch = props.dispatch;

	const EditorTopProps = {
		searchVisible: props$editorTop.searchVisible,
		jumpLineVisible: props$editorTop.jumpLineVisible,

		isSearchAll: props$editorTop.isSearchAll,
		searchContent: props$editorTop.searchContent,
		replaceContent: props$editorTop.replaceContent,

		jumpLine: props$editorTop.jumpLine,
		
		syntaxList: props$editorTop.syntaxList,

		isSaving: props$editorTop.isSaving,

		currentLanguage: props$editorTop.currentLanguage,

		onOpenSearch() {
			dispatch({
				type: 'editorTop/toggleSearchBar'
			});
		},

		onOpenJumpLine() {
			dispatch({
				type: 'editorTop/toggleJumpLine'
			})
		},

		onSave() {
			dispatch({
				type: 'editorTop/save'
			})
		},

		onSearchPrev() {
			dispatch({
				type: 'editorTop/searchPrev'
			});
		},

		onSearchNext() {
			dispatch({
				type: 'editorTop/searchNext'
			});
		},

		onReplace() {
			dispatch({
				type: 'editorTop/replace'
			})
		},

		handleSearchAllSwitchChange(proxy) {
			dispatch({
				type: 'editorTop/handleSearchAllSwitchChange',
				payload: proxy
			});
		},

		handleReplaceInputChange(proxy) {
			dispatch({
				type: 'editorTop/handleReplaceInputChange',
				payload: proxy
			})
		},

		handleSearchInputChange(proxy) {
			dispatch({
				type: 'editorTop/handleSearchInputChange',
				payload: proxy
			})
		},

		handleJumpLineChange(proxy) {
			dispatch({
				type: 'editorTop/handleJumpLineChange',
				payload: proxy
			})
		},

		onSelectSyntax(e) {
			dispatch({
				type: 'editorTop/onSelectSyntax',
				payload: e
			})
		}
	}

  	return (
		<div className={EditorStyle.aceEditor}>
			<EditorTop {...EditorTopProps}></EditorTop>
			<AceEditor
	        	mode="javascript"
	        	theme="github"
	        	width="100%"
	        	height="92vh"
	        	name="UNIQUE_ID_OF_DIV"
	        	editorProps={{$blockScrolling: true}} />
  		</div>
  );

};

function mapSateToProps({ editorTop }) {
	return {editorTop};
}

export default connect(mapSateToProps)(Editor);
