import React , { PropTypes } from 'react';
import { Menu, Icon, Modal, Input, Button, message, Tabs, Card, Popconfirm, Row, Col } from 'antd';

const TabPane = Tabs.TabPane;

import { connect } from 'dva';

import CodingEditor from './Panel/Editor.js';
import Terminal from './Panel/Terminal.js';

import randomWord from '../utils/randomString';

import dndHandler from './Panel/dndHandler';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const InputGroup = Input.Group;

const LeftSidebar = (props) => {

	dndHandler.init(props);

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
	};
	const initApplications = () => {

		return props.sidebar.applications.map(application => {
			return   <Col className="gutter-row" span={6} key={application.id}>
			 <div className="gutter-box">
					<Card onClick={leftSidebarProps.openApp} extra={
						<Popconfirm onClick={(e) => e.stopPropagation()} title="确认删除此项目?"
						onConfirm={leftSidebarProps.confirmDeleteApp.bind(this,application.id)}
						onCancel={leftSidebarProps.cancelDeleteApp} okText="Yes" cancelText="No">
								<a className="delete-app">
								<Icon type="close" />
							</a>
						</Popconfirm>
					} style={{ width: 110, height: 110 }}
					bodyStyle={{height: '100%', background: 'whitesmoke', color: '#555', cursor: 'pointer'}}>
							<div style={{ height: 50,lineHeight: '50px',textAlign: 'center'}}>
								<p className="app-name-hover">{application.name}</p>
							</div>
					</Card>
			 </div>
				</Col>;
		});
	};

	const leftSidebarProps = {

	    handleClick(activeMenu) {
	      var handleActiveMenuEvent = {

	        create() {

						console.log("create app");
	          props.dispatch({
	            type: 'sidebar/showModalNewApp'
	          });
	        },

	        'switch'() {
						console.log('switch');
	          props.dispatch({
	            type: 'sidebar/showModalSwitchApp'
	          });
						props.dispatch({
	            type: 'sidebar/getApplications'
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
	              	type = 'terminal';

	          	props.dispatch({
	            	type: 'devpanel/add',
	            	payload: {title, type}
	          	})

	        },

	        file() {

	          	var title = '新文件',
	              	content = '// TO DO',
	              	type = 'editor',
	              	editorId = randomWord(8, 10);

	            props.dispatch({
	            	type: 'rightbar/setActiveMenu',
	            	payload: 'file'
	            });

	          	props.dispatch({
	            	type: 'devpanel/add',
	            	payload: {title, content, type, editorId}
	          	});

	          	localStorage.isSave = true;

	        },

	        designer() {

	          	var title = 'Gospel UI 设计器',
	              	type = 'designer';

	          	var editor = props.dispatch({
	            	type: 'devpanel/add',
	            	payload: {title, type}
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


	    confirmDeleteApp(application) {

				console.log('confirm delete app')
				props.dispatch({
					type: 'sidebar/deleteApp',
					payload: {application}
				})
	    },

	    cancelDeleteApp() {
	    	console.log('cacle delete app')
	    },

	    openApp() {
	    	console.log('TopBar中dispatch')
	    	// alert(1)
	    },

	    switchApp() {

				console.log('switch app');
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
				if(props.sidebar.modifyGitOriginInput.value == '' || props.sidebar.modifyGitOriginInput.pushValue == '') {
					message.error('git源不能为空');
					return false;
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
				})
			}
		},

		onGitOperationTabChanged: function() {

		},

		createAppFromModal() {
			console.log("create app");
			props.dispatch({
				type: 'sidebar/showNewAppAndHideSwitch',
			})
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
	      		mode="horizontal">

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
		        <Menu.Item key="designer">
		        	<Icon type="windows-o" />
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

	    	<Modal style={{maxWidth: '545px'}}  title="切换应用" visible={props.sidebar.modalSwitchAppVisible}
	          	onOk={leftSidebarProps.switchApp} onCancel={leftSidebarProps.cancelSwitchApp}
	        >
        	    <Row gutter={16}>
								{initApplications()}
        	    </Row>
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
		    					<li>6、开源中国（gitosc）官方说明：<a href="http://git.oschina.net/oschina/git-osc/wikis/%E5%B8%AE%E5%8A%A9" target="_blank">GitOSC ssh操作说明</a></li>
		    					<li>7、Github 官方说明：<a href="https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/" target="_blank">Github ssh操作说明</a></li>
		    				</ol>
	    				</div>
    				</div>
    			</TabPane>
  			</Tabs>

	        </Modal>

        </div>

	);

}

function mapStateToProps({ sidebar, editor, rightbar, designer, attr }) {
  return { sidebar, editor, rightbar, designer, attr };
}

export default connect(mapStateToProps)(LeftSidebar);
