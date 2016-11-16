import React , { PropTypes } from 'react';
import { Menu, Icon, Modal, Input, Button, message } from 'antd';

import { connect } from 'dva';

import CodingEditor from './Panel/Editor.js';
import Terminal from './Panel/Terminal.js';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const InputGroup = Input.Group;

const LeftSidebar = (props) => {

	var styles = {
		sidebar: {
			height: '100%'
		},

		ifr: {
			width: '100%',
			height: parseInt(document.body.clientHeight) - 300,
			border: 'none'
		},

		wrapper: {
			height: '100%'
		}
	}

	console.log(props);

	const leftSidebarProps = {

	    handleClick(activeMenu) {
	      console.log(activeMenu);

	      var handleActiveMenuEvent = {

	        create() {
	          props.dispatch({
	            type: 'sidebar/showModalNewApp'
	          });
	        },

	        'switch'() {
	          props.dispatch({
	            type: 'sidebar/showModalSwitchApp'
	          });
	        },

	        commit() {
	        	if(!props.sidebar.modifyGitOriginInput.isGit) {
					message.error('您尚未添加git源，请先添加');
		        	props.dispatch({
		        		type: 'sidebar/showModalModifyGitOrgin'
		        	});
				}else {
					props.dispatch({
						type: 'sidebar/pushCommit'
					})
				}
	        },

	        'push'() {
	        	if(!props.sidebar.modifyGitOriginInput.isGit) {
					message.error('您尚未添加git源，请先添加');
					props.dispatch({
						type: 'sidebar/showModalModifyGitOrgin'
					})
				}else {
					props.dispatch({
						type: 'sidebar/pushGit'
					})
				}
	        },

	        pull() {
	        	console.log(props.sidebar.modifyGitOriginInput.isGit);
	        	if(!props.sidebar.modifyGitOriginInput.isGit) {
					message.error('您尚未添加git源，请先添加');
					props.dispatch({
						type: 'sidebar/showModalModifyGitOrgin'
					})
				}else {
					props.dispatch({
						type: 'sidebar/pullGit'
					})
				}
	        },

	        terminal() {

	          var title = '终端',
	              content = <Terminal></Terminal>,
	              type = 'terminal';

	          props.dispatch({
	            type: 'devpanel/add',
	            payload: {title, content, type}
	          })

	        },

	        file() {

	          var title = '新文件',
	              content = <CodingEditor></CodingEditor>,
	              type = 'editor';

	          props.dispatch({
	            type: 'devpanel/add',
	            payload: {title, content, type}
	          });

	        },

	        start() {

	        },

	        pause() {

	        }

	      }

	      handleActiveMenuEvent[activeMenu.key]();
	    },

	    cancelNewApp() {
	      props.dispatch({
	        type: 'sidebar/hideModalNewApp'
	      })
	    },

	    createApp() {
	      props.dispatch({
	        type: 'sidebar/createApp'
	      })
	    },

	    cancelSwitchApp() {
	      props.dispatch({
	        type: 'sidebar/hideModalSwitchApp'
	      });
	    },

	    switchApp() {
	      props.dispatch({
	        type: 'sidebar/switchApp'
	      })
	    },

		cancelModifyGitOrigin: function() {
			props.dispatch({
				type: 'sidebar/hideModalModifyGitOrigin'
			})
		},

		modifyGitOriginInput: {
			onPressEnter: function() {
				console.log(props.sidebar.modifyGitOriginInput);
				if(props.sidebar.modifyGitOriginInput.value == '' || props.sidebar.modifyGitOriginInput.pushValue == '') {
					message.error('git源不能为空');
				}

				props.dispatch({
					type: 'sidebar/modifyGitOrigin'
				})
			},

			onChange: function(e) {
				props.dispatch({
					type: 'sidebar/handleModifyGitOriginInputChange',
					payload: e.target.value
				})
			},

			onPushValueChange: function(e) {
				props.dispatch({
					type: 'sidebar/handleModifyGitPushOriginInputChange',
					payload: e.target.value
				})
			}
		}
	};

	const searchCls = {
	    antSearchInput: true,
	    antSearchInputFocus: false,
	};

  	const btnCls = {
	    borderRadius: '0px',
	    marginLeft: '-1px'
	};

	return (
		<div style={styles.wrapper}>
	      	<Menu 
	      		style={styles.sidebar} 
	      		onClick={leftSidebarProps.handleClick} 
	      		mode="inline">

		        <Menu.Item key="create">
		          	<Icon type="plus" />
		        </Menu.Item>
		        <Menu.Item key="switch">
		          	<Icon type="appstore-o" />
		        </Menu.Item>
		        <Menu.Item key="commit">
					<Icon type="check"/>
		        </Menu.Item>
		        <Menu.Item key="push">
					<Icon type="upload" />
		        </Menu.Item>
		        <Menu.Item key="pull">
					<Icon type="download" />
		        </Menu.Item>
		        <Menu.Item key="file">
					<Icon type="file-text" />
		        </Menu.Item>        		        
		        <Menu.Item key="terminal">
					<Icon type="code-o" />
		        </Menu.Item>        
		        <Menu.Item key="start">
					<Icon type="play-circle-o" />
		        </Menu.Item>        
		        <Menu.Item key="pause">
					<Icon type="pause-circle-o" />
		        </Menu.Item>

	      	</Menu>

	    	<Modal width="80%"  title="新建应用" visible={props.sidebar.modalNewAppVisible}
	          	onOk={leftSidebarProps.createApp} onCancel={leftSidebarProps.cancelNewApp}
	        >
	        	<iframe style={styles.ifr} src="http://localhost:8088/#!/apps/new"></iframe>
	        </Modal>

	    	<Modal width="60%"  title="切换应用" visible={props.sidebar.modalSwitchAppVisible}
	          	onOk={leftSidebarProps.switchApp} onCancel={leftSidebarProps.cancelSwitchApp}
	        >
	        </Modal>

	    	<Modal width="60%"  title="添加/更改 Git 源" visible={props.sidebar.modalModifyGitOriginVisible}
	          	onOk={leftSidebarProps.modifyGitOriginInput.onPressEnter} onCancel={leftSidebarProps.cancelModifyGitOrigin}
	        >
	        	<div style={{ marginBottom: 16 }}>

			      	<InputGroup style={searchCls}>
			        	<Input
				        	addonBefore="fetch"
			        		value={props.sidebar.modifyGitOriginInput.value}
			        		onPressEnter={leftSidebarProps.modifyGitOriginInput.onPressEnter}
			        		onChange={leftSidebarProps.modifyGitOriginInput.onChange}
			        	/>
			     	</InputGroup>

	        	</div>

	        	<div style={{ marginBottom: 16 }}>

			      	<InputGroup style={searchCls}>
			        	<Input
				        	addonBefore="push"
			        		value={props.sidebar.modifyGitOriginInput.pushValue}
			        		onPressEnter={leftSidebarProps.modifyGitOriginInput.onPressEnter}
			        		onChange={leftSidebarProps.modifyGitOriginInput.onPushValueChange}
			        	/>
			     	</InputGroup>

	        	</div>

	        </Modal>

        </div>

	);

}

function mapStateToProps({ sidebar }) {
  return { sidebar };
}

export default connect(mapStateToProps)(LeftSidebar);
