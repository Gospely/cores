import { connect } from 'dva';
import React , { PropTypes } from 'react';
import { Menu, Input } from 'antd';
import TreeStyle from './styles.css';

const CommandPanel = (props) => {

	const commandProps = {
		onClick() {
			dispatch({
				type: 'CommandPanel/showCommandPanel'
			})
		},

		useThisCommand(key) {
			console.log(key);
		}
	}

	return null
}

function mapStateToProps({ CommandPanel }) {
  return { CommandPanel };
}

export default connect(mapStateToProps)(CommandPanel);

// <div>
// 				<Menu onClick={commandProps.onClick}
// 	        		style={{ width: '100%' }}
// 		        	defaultOpenKeys={['command']}
// 		        	mode="inline"
// 		      	>
// 			        <Menu.Item key="command">
// 						<span>查看快捷键</span>
// 			        </Menu.Item>
// 		      	</Menu>
// 		      	{props.commandPanel.visible && (
// 		      		<div className={TreeStyle.fileSearchPane}
// 	      	             onClick={() => {props.dispatch({type: 'commandPanel/hidePane'})}}
// 	      	             onKeyUp={handleKeyUp}
// 	      	        >
// 	      	          	<div onClick={(e) => e.stopPropagation()} style={{maxWidth: 400, margin: '0 auto'}}>
// 		      	            <Input autoFocus="autofocus" size="large" placeholder="command" onChange={commandPaneInputChange} value={props.commandPanel.inputValue}/>
// 		      	            <div style={{overflow: 'auto', maxHeight: 500}} id="toSetScrol">
// 		      	                {props.commandPanel.shortcuts.map((shortcut, i)=> {
// 		      	                  return  (
// 		      	                    <div onClick={useThisCommand.bind(this,shortcut.key)}
// 		      	                      key={shortcuts.key}
// 		      	                      id={props.file.searchFilePane.currentIndex == i && 'activeFileOptio'}
// 		      	                      className={TreeStyle.fileSearchPaneOption +  ' ' +
// 		      	                      (props.commandPanel.currentIndex == i && TreeStyle.fileSearchPaneOptionActive)}
// 		      	                      >
// 		      	                          {shortcut.desc}
// 		      	                    </div>)
// 		      	                	})
// 		      	            	}
// 		      	            </div>
// 	      	          	</div>
// 	      	        </div>)
// 		      	}