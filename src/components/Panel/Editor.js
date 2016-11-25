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
import EditorBottom from './EditorBottom';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import randomWord from '../../utils/randomString';


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

		onReplace(value) {

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
		},
		command(proxy){
			console.log(proxy);
		}
	}

	const commandsArray = [{
						name: "help",
						bindKey: {win: "Ctrl-Alt-h", mac: "Command-Alt-h"},
						exec: function(editor) {

								console.log('command');
								ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
										module.init(editor);
										editor.showKeyboardShortcuts()
								})
						}
				},{
						name: "search",
						bindKey: {win: "Ctrl-r", mac: "Command-r"},
						exec: function(editor) {

							dispatch({
								type: 'editorTop/toggleSearchBar'
							});

							console.log('command');
							ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
									module.init(editor);
									editor.showKeyboardShortcuts()
							})
						}
				},{
						name: "replace",
						bindKey: {win: "Ctrl-f", mac: "Command-f"},
						exec: function(editor) {

							var searchContent = editor.getSelection().doc.getTextRange(editor.getSelection().getRange());
							props.editorTop.searchContent = searchContent;
							editor.findNext();
							console.log();
							console.log('command');
							ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
									module.init(editor);
									editor.showKeyboardShortcuts()
							})
						}
				},{
						name: "save",
						bindKey: {win: "Ctrl-s", mac: "Command-r"},
						exec: function(editor) {

							console.log('command');
							ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
									module.init(editor);
									editor.showKeyboardShortcuts()
							})
						}
				}
		];
  	const editorProps = {
    	showArrow: props.editor.showArrow,

	    handleMouseEnter() {
	    	props.dispatch({
	    		type: 'editor/showArrow'
	    	})
    	},
			onLoad(value) {

				console.log('editor onLoad');
				window.currentEditor = value;
			},
    	handleMouseLeave() {
	    	props.dispatch({
	    		type: 'editor/hideArrow'
	    	})
    	},

    	handleEditorChanged(value) {

				console.log('change');
				console.log(this);
				console.log(value);
    		var editorId = props.devpanel.panels.activeEditor.id;
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

  	var aceHeight = ( parseInt(document.body.clientHeight) - 62 ) + 'px',
  		editorId = props.devpanel.panels.activeEditor.id;
  		console.log(editorId, props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId].value);


  	if (editorId && props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId] && props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId].value) {
  		return (
		<div className={EditorStyle.aceEditor}>
			<EditorTop {...EditorTopProps}></EditorTop>

			<AceEditor
	        	mode="javascript"
	        	theme="github"
	        	width="100%"
	        	height={aceHeight}
						fontSize='18px'
	        	name={editorId}
						onLoad={editorProps.onLoad}
	        	editorProps={{$blockScrolling: true}}
	        	value={props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId].value}
	        	enableBasicAutocompletion={true}
						commands={commandsArray}
	        	onChange={editorProps.handleEditorChanged}
	        	enableBasicAutocompletion={true}/>

	        <EditorBottom></EditorBottom>

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
 	}else {
 		return (<div></div>);
 	}


};

function mapSateToProps({ editorTop, editor, devpanel}) {
	return {editorTop, editor, devpanel};
}

export default connect(mapSateToProps)(Editor);
