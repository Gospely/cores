import React , { PropTypes } from 'react';
import { Menu, Icon, Modal, Input, Button, message, Tabs} from 'antd';

const TabPane = Tabs.TabPane;

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
		},

		onGitOperationTabChanged: function() {

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

  			<Tabs className="modalTab" defaultActiveKey="1" onChange={leftSidebarProps.onGitOperationTabChanged}>
    			<TabPane tab="HTTPS" key="1">

		        	<div style={{ marginBottom: 16, marginTop: 16 }}>

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

    			</TabPane>
    			<TabPane tab="SSH" key="2">
    				<div style={{marginTop: 16}}>
	    				<h4>ssh可以让您免密码使用push操作，请按照以下方法配置SSH：</h4>
	    				<div style={{margin: 10}}>
		    				<ol>
		    					<li>1、打开终端</li>
		    					<li>2、输入 ssh-keygen，一路回车</li>
		    					<li>3、输入 vim /root/.ssh/id_rsa.pub</li>
		    					<li>4、复制你所看到的内容</li>				
		    					<li>5、将其配置到您的Git平台中即可</li>				
		    					<li>6、开源中国（gitosc）官方说明：<a href="http://git.oschina.net/oschina/git-osc/wikis/%E5%B8%AE%E5%8A%A9" targer="_blank">GitOSC ssh操作说明</a></li>				
		    					<li>7、Github 官方说明：<a href="https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/" targer="_blank">Github ssh操作说明</a></li>				
		    				</ol>
	    				</div>
    				</div>
    			</TabPane>
  			</Tabs>

	        </Modal>

        </div>

	);

}

function mapStateToProps({ sidebar }) {
  return { sidebar };
}

export default connect(mapStateToProps)(LeftSidebar);
