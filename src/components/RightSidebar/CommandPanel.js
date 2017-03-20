import { connect } from 'dva';
import React , { PropTypes } from 'react';
import { Menu, Input } from 'antd';
import TreeStyle from './styles.css';
import config from '../keybinding/config.js';

const CommandPanel = (props) => {

	const doThisCommand = () => {
	
	};

	const commandProps = {
		onClick() {
			props.dispatch({
				type: 'commandpanel/showCommandPanel'
			})
		},

		useThisCommand(key) {
			var split = key.split(' / '),
				command = split[1].replace(new RegExp('-', 'gm'), '+').toLowerCase();
			for(var i = 0; i< config.bindKey.length; i++){
				for (var j = 0; j < config.bindKey[i].mainKey.length; j++) {
					if(config.bindKey[i].mainKey[j] == command){
						config.bindKey[i].handler(props);
						props.dispatch({
							type: 'commandpanel/hideCommandPanel'
						})
						return false;
					}
				}
			}
		},
		loopData(pros,shortcuts) {
			return	shortcuts.map((shortcut, i)=> {
	          return  (
	            	<div onClick={commandProps.useThisCommand.bind(this,shortcut.key)}
	              		key={shortcut.key}
	              		id={pros.commandpanel.currentIndex == i && 'activeFileOptionTwo'}
	              		className={TreeStyle.fileSearchPaneOption + ' ' + TreeStyle.commandPanelOption + ' ' +
	              		(pros.commandpanel.currentIndex == i && TreeStyle.fileSearchPaneOptionActive)}
	              	>
	                  	<div>{shortcut.desc}</div>
	                  	<div>{shortcut.key}</div>
	            	</div>)
        	})
		},

		handleKeyUp(Proxy) {
			if(Proxy.keyCode == 27) {
			  props.dispatch({
			    type: 'commandpanel/hideCommandPanel'
			  })
			}

			if (Proxy.keyCode == 38) {
			  props.dispatch({
			      type: 'commandpanel/goPrevCommand'
			  })
			}

			if (Proxy.keyCode == 40) {
			  props.dispatch({
			      type: 'commandpanel/goNextCommand'
			  })
			}

			if (Proxy.keyCode == 13) {
			  doThisCommand();
			}
		},

		commandPaneInputChange(e) {
			props.dispatch({
				type: 'commandpanel/handleInputChange',
				payload: e.target.value
			})
		}

	}

	return (
		<div>
			<Menu onClick={commandProps.onClick}
	    		style={{ width: '100%' }}
	        	defaultOpenKeys={['command']}
	        	mode="inline"
	      	>
		        <Menu.Item key="command">
					<span>打开命令面板</span>
		        </Menu.Item>
	      	</Menu>
	      	{props.commandpanel.visible && (
	      		<div className={TreeStyle.fileSearchPane}
	  	             onClick={() => {props.dispatch({type: 'commandpanel/hideCommandPanel'})}}
	  	             onKeyUp={commandProps.handleKeyUp}
	  	        >
	  	          	<div onClick={(e) => e.stopPropagation()} style={{maxWidth: 400, margin: '0 auto'}}>
	      	            <Input autoFocus="autofocus" size="large" placeholder="command" onChange={commandProps.commandPaneInputChange}
	      	            	value={props.commandpanel.inputValue}/>
	      	            <div style={{overflow: 'auto', maxHeight: 500}} id="toSetScrollTwo">
	      	               {commandProps.loopData(props, props.commandpanel.shortcuts)}
	      	            </div>
	  	          	</div>
	  	        </div>)
	      	}
	    </div>
	)
}

function mapStateToProps({ commandpanel, devpanel, sidebar, file, rightbar }) {
  return { commandpanel, devpanel, sidebar, file, rightbar };
}

export default connect(mapStateToProps)(CommandPanel);
