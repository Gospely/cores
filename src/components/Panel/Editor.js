import React , {PropTypes} from 'react';
import EditorStyle from './Editor.css';
import { connect } from 'dva';

import MonacoEditor from 'react-monaco-editor';

import { Button, message } from 'antd';

import EditorTop from './EditorTop';
import EditorBottom from './EditorBottom';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import randomWord from '../../utils/randomString';

const Editor = (props) => {
	let props$editorTop = props.editorTop,
		dispatch = props.dispatch,
		belongTo = props.devpanel.panels.panes[props.belongTo],
		editorId = props.editorId,
		isSave = props.isSave,
		tabKey = props.tabKey;

	const EditorTopProps = {
		searchVisible: props.searchVisible,
		jumpLineVisible: props$editorTop.jumpLineVisible,

		isSearchAll: props$editorTop.isSearchAll,
		searchContent: props$editorTop.searchContent,
		replaceContent: props$editorTop.replaceContent,

		jumpLine: props$editorTop.jumpLine,

		syntaxList: props$editorTop.syntaxList,

		themeList: props$editorTop.themeList,

		isSaving: props$editorTop.isSaving,

		currentLanguage: props.devpanel.currentLanguage,

		currentTheme: props.editor.options.theme,

		isSlideUp: props$editorTop.isSlideUp,

		onOpenSearch() {
			var searchContent = props.editorTop.searchContent;
			dispatch({
				type: 'editorTop/toggleSearchBar',
				payload:{searchContent}
			});
			dispatch({
				type: 'devpanel/toggleSearchBar',
				payload: {belongTo: props.belongTo}
			});
		},

		onOpenJumpLine() {
			dispatch({
				type: 'editorTop/toggleJumpLine'
			})
		},

		onSave() {

			if(isSave == false) {
				const editorId = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].activeEditor.id;
				var content = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId].value;
				var fileName = localStorage.currentSelectedFile;

				if(fileName == localStorage.currentFoler) {
					message.error('请输入文件名');
					return false;
				}

				if(fileName == '新标签页' || fileName == '新文件' || fileName == undefined || fileName == 'undefined') {
					var type = 'editor';
					dispatch({
						type: 'file/showNewFileNameModal',
						payload: {type}
					});
				}else{
					dispatch({
						type: 'file/writeFile',
						payload: {content, tabKey: tabKey}
					});
					dispatch({
						type: 'devpanel/handleFileSave',
						payload: {
							tabKey: tabKey, pane: paneKey
						}
					})
				}
			}
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

		onReplace(value) {
			var replaceContent = props.editorTop.replaceContent;
			var searchContent = props.editorTop.searchContent;
			var isReplaceAll = props.editorTop.isReplaceAll;
			dispatch({
				type: 'devpanel/replace',
				payload:{replaceContent,searchContent,isReplaceAll}
			})
			// dispatch({
			// 	type: 'editorProps/replace'
			// })
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
			// console.log(e);
			// var suffix = e.key;
			// console.log("===============change==========");
			// dispatch({
			// 	type: 'editorTop/dynamicChangeSyntax',
			// 	payload: {suffix}
			// });
		},

		onSelectTheme(e) {
			props.dispatch({
				type: 'editor/changeTheme',
				payload: e.key
			})
		},

		onSlideUp(proxy) {
			dispatch({
				type: 'editorTop/toggleSlide',
				payload: proxy
			})
		},
	}

  	const editorProps = {
    	showArrow: props.editor.showArrow,

	    handleMouseEnter() {
	    	props.dispatch({
	    		type: 'editor/showArrow'
	    	})
    	},

		onLoad(e,editor) {
			window.currentEditor = editor;
		},

    	handleMouseLeave() {
	    	props.dispatch({
	    		type: 'editor/hideArrow'
	    	})
    	},

    	handleEditorChanged(value) {
			var activePane = props.devpanel.panels.panes[props.devpanel.panels.activePane.key],
				tabKey = activePane.activeTab.key,
				activeTab = activePane.tabs[tabKey-1],
				editorId = activeTab.editorId;
			props.dispatch({
    			type: 'devpanel/handleEditorChanged',
    			payload: {value, editorId}
    		})
    	}
  	}

  	const editorBottomProps = {
  		panes: props.devpanel.panes,
  		activeKey: props.devpanel.activeKey
  	}

  	let splitType = props.devpanel.panels.splitType;
  	let aceHeight;

  	if (splitType == 'single' || splitType == 'vertical-dbl') {
  		aceHeight = ( parseInt(document.body.clientHeight) - 62 );
  	}else {
  		aceHeight = ( parseInt(document.body.clientHeight) - 160 ) * (parseInt(props.devpanel.horizontalColumnHeight) / 100);
  	}

  	//

  	// if (editorId && thisPane && thisPane.editors && thisPane.editors[editorId]) {
  		return (
		<div className={EditorStyle.aceEditor}>
			<EditorTop {...EditorTopProps}></EditorTop>
				<MonacoEditor
					width="100%"
					height={aceHeight}
					language={props.devpanel.currentMode}
					options={props.editor.options}
					defaultValue={props.content}
					onChange={editorProps.handleEditorChanged}
					editorDidMount={editorProps.onLoad}
				/>
	        <EditorBottom></EditorBottom>
  		</div>
 		);
  			//全屏按钮
 		// <ReactCSSTransitionGroup
			//   transitionName="fullscreen"
			//   transitionEnterTimeout={500}
			//   transitionLeaveTimeout={300}
			// >
			// 	{
			// 		editorProps.showArrow &&
			//         <div className={EditorStyle.fullscreenBtn}>
			// 		    <Button type="ghost" shape="circle-outline" icon="arrows-alt"></Button>
			//         </div>
			// 	}
			// </ReactCSSTransitionGroup>

};

function mapSateToProps({ editorTop, editor, devpanel}) {
	return {editorTop, editor, devpanel};
}

export default connect(mapSateToProps)(Editor);
