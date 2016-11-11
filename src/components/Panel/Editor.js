import React , {PropTypes} from 'react';
import AceEditor from 'react-ace';
import EditorStyle from './Editor.css';
import { connect } from 'dva';

import { Button } from 'antd';

import 'brace/mode/java';
import 'brace/theme/github';
import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';

import EditorTop from './EditorTop';

console.log(React);

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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

		isSlideUp: props$editorTop.isSlideUp,

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
		},

		onSlideUp(proxy) {
			dispatch({
				type: 'editorTop/toggleSlide',
				payload: proxy
			})
		}
	}


  	const editorProps = {
    	showArrow: props.editor.showArrow,

	    handleMouseEnter() {
	    	props.dispatch({
	    		type: 'editor/showArrow'
	    	})
    	},

    	handleMouseLeave() {
	    	props.dispatch({
	    		type: 'editor/hideArrow'
	    	})
    	}
  	}

  	return (
		<div onMouseEnter={editorProps.handleMouseEnter} onMouseLeave={editorProps.handleMouseLeave} className={EditorStyle.aceEditor}>
			<EditorTop {...EditorTopProps}></EditorTop>
			<AceEditor
	        	mode="javascript"
	        	theme="github"
	        	width="100%"
	        	height="92vh"
	        	name="UNIQUE_ID_OF_DIV"
	        	editorProps={{$blockScrolling: true}} />

			<ReactCSSTransitionGroup
			  transitionName="fullscreen"
			  transitionEnterTimeout={500}
			  transitionLeaveTimeout={300}
			>
				{
					editorProps.showArrow &&
			        <div className={EditorStyle.fullscreenBtn}>
					    <Button type="ghost" shape="circle-outline" icon="arrows-alt"></Button>
			        </div>				
				}
			</ReactCSSTransitionGroup>
  		</div>
  );

};

function mapSateToProps({ editorTop, editor}) {
	return {editorTop, editor};
}

export default connect(mapSateToProps)(Editor);
