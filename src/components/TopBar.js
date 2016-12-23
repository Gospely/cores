import React , { PropTypes } from 'react';
import { Menu, Spin, Icon, Modal, Input, Button, message, notification, Tabs, Card, Popconfirm, Row, Col, Dropdown, Form } from 'antd';

const TabPane = Tabs.TabPane;

import { connect } from 'dva';
import { Router, Route, IndexRoute, Link } from 'dva/router';

import CodingEditor from './Panel/Editor.js';
import Terminal from './Panel/Terminal.js';
import randomWord from '../utils/randomString';
import dndHandler from './Panel/dndHandler';
import keyRegister from './keybinding/register';
import initApplication from '../utils/initApplication';
import gitTerminal from '../utils/gitTerminal';

import { Steps } from 'antd';
import { Progress } from 'antd';

const ButtonGroup = Button.Group;
const Step = Steps.Step;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const InputGroup = Input.Group;



const LeftSidebar = (props) => {

	dndHandler.init(props);
	keyRegister.init(props);

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
		console.log('side');
		if(props.sidebar.applications.length < 1) {
			return;
		}
		console.log('side==================', props);
		return props.sidebar.applications.map(application => {
			return   <Col className="gutter-row" span={6} style={{marginTop: 20}} key={application.id}>
						 <div className="gutter-box">
								<Card onClick={leftSidebarProps.openApp.bind(this,application)} extra={
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
          		props.dispatch({
            		type: 'sidebar/showModalNewApp'
	          	});
	        },

	        'switch'() {
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
					// props.dispatch({
					// 	type: 'sidebar/pushCommit'
					// })
					window.socket.send("cd /root/workspace && git commit\n");
					localStorage.message = 'git commit ';
					localStorage.gitOperate = 'git commit';
					props.dispatch({
						type: 'editorTop/initGitOperate',
						payload: { operate: 'git comit'}
					});


				}
	        },

	        'push'() {
	        	if(!props.sidebar.modifyGitOriginInput.isGit) {
					message.error('您尚未添加git源，请先添加');
					props.dispatch({
						type: 'sidebar/showModalModifyGitOrgin'
					})
				}else {
					window.socket.send("cd /root/workspace && git push\n");
					localStorage.message = 'git push ';
					 localStorage.gitOperate = 'git push';
					props.dispatch({
						type: 'editorTop/initGitOperate',
						payload: { operate: 'git push'}
					});


					// props.dispatch({
					// 	type: 'sidebar/pushGit'
					// })
				}
	        },

	        pull() {
	        	if(!props.sidebar.modifyGitOriginInput.isGit) {
					message.error('您尚未添加git源，请先添加');
					props.dispatch({
						type: 'sidebar/showModalModifyGitOrgin'
					});
				}else {
					window.socket.send("cd /root/workspace && git pull\n");
					localStorage.message = 'git pull ';
					 localStorage.gitOperate = 'git pull';
					props.dispatch({
						type: 'editorTop/initGitOperate',
						payload: { operate: 'git pull'}
					});

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
	              	content = '',
	              	type = 'editor',
	              	editorId = randomWord(8, 10);

				localStorage.currentSelectedFile = '新文件';

	            props.dispatch({
	            	type: 'rightbar/setActiveMenu',
	            	payload: 'file'
	            });

				// 更换默认语法
				localStorage.suffix = "js";

	          	props.dispatch({
	            	type: 'devpanel/add',
	            	payload: {title, content, type, editorId}
	          	});

	          	// localStorage.isSave = true;

	        },

	        designer() {

	          	var title = 'Gospel 微信小程序 设计器',
	              	type = 'designer';

	          	var editor = props.dispatch({
	            	type: 'devpanel/add',
	            	payload: {title, type}
	          	});

	        },

	        showStartMenu() {
	        	return false;
	        },

	        pause() {

	        },

	        preview() {
	        	var title = '小程序预览',
	        		type = 'previewer';
        		props.dispatch({type: 'devpanel/add',payload: {title,type}});
	        },

	        'download-weapp'() {
	        	props.dispatch({
	        		type: 'sidebar/showWeappCompilerModal'
	        	});
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

	    openApp(application) {
			window.location.href = 'http://localhost:8989/#/project/' + application.id;
			if(application.id != localStorage.applicationId) {
				window.reload = true
				initApplication(application,props);
			}else{
				props.dispatch({
			      type: 'sidebar/hideModalSwitchApp'
			  });
			}
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
			props.dispatch({
				type: 'sidebar/showNewAppAndHideSwitch',
			})
		}
	};

	const compilerModalProps = {
		handleOk () {
        	props.dispatch({
        		type: 'sidebar/startCompileWeapp'
        	});
		},

		handleCancel () {
        	props.dispatch({
        		type: 'sidebar/hideWeappCompilerModal'
        	});
		},

		handleRestart () {
			compilerModalProps.handleCancel();
			setTimeout(function() {
	        	props.dispatch({
	        		type: 'sidebar/showWeappCompilerModal'
	        	});

	        	setTimeout(function() {
					compilerModalProps.handleOk();
	        	}, 200);
			}, 200);
		},

		stepTemplate () {
			return props.sidebar.weappCompiler.steps.map( (item, index) => {
    			return (
			    	<Step key={index} title={item.title} description={item.description} />
    			);
    		});

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

	const onSelectStartMenu = function (activeMenu) {
		let handleActiveMenuEvent = {
			runCommand() {
				
			},

			run() {
				console.log("debugger");
				const debugType = {
					common(){
						console.log('common');
						sessionStorage.currentDebugResource = 'http://gospely.com:' + localStorage.port;
						var debug = window.open('http://localhost:8989/static/debugger/wordpress.html','_blank')
						props.dispatch({
							type: 'devpanel/handleDebugger',
							payload: {debug}
						});
					},
					visual(){
						console.log('===================visual===================');

						//分栏
						var key = "vertical-dbl";
						props.dispatch({
							type: 'devpanel/changeColumn',
							payload: key
						});
						props.dispatch({
							type: 'devpanel/initDebugPanel',
						});

						var title = '终端',
								type = 'terminal';
						props.dispatch({
							type: 'devpanel/add',
							payload: {title, type}
						})
						//创建termin，执行启动的shell
					}
				}
				debugType["visual"]();
			},
			config() {
				props.dispatch({
					type: 'sidebar/showDebugConfigModal'
				})
			}
		}
		handleActiveMenuEvent[activeMenu.key]()
	}

	const startMenu = (
		<Menu onClick={onSelectStartMenu}>
			<Menu.Item key='runCommand' disabled={window.disabled}>运行命令:{props.sidebar.debugConfig.runCommand}</Menu.Item>
			<Menu.Item key='run' disabled={window.disabled}>直接运行</Menu.Item>
			<Menu.Divider/>
			<Menu.Item key='config' disabled={window.disabled}>配置...</Menu.Item>
		</Menu>
	);

	const debugConfigModal = {
		formItemLayout: {
			labelCol: { span: 4 },
      		wrapperCol: { span: 16 }
		},
		hideModal() {
			props.dispatch({
				type: 'sidebar/hideDebugConfigModal'
			})
		},
		runCommandChange(event) {
			props.dispatch({
				type: 'sidebar/handleRunCommandChange',
				payload: event.target.value
			})
		},
		startPortChange(event) {
			props.dispatch({
				type: 'sidebar/handleStartPortChange',
				payload: event.target.value
			})
		},
		commitDebugConfigChange() {
			
		}
	}

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
		        <Menu.Item key="commit" disabled={window.disabled}>
					<Icon type="check"/>
		        </Menu.Item>
		        <Menu.Item key="push" disabled={window.disabled}>
					<Icon type="upload" />
		        </Menu.Item>
		        <Menu.Item key="pull" disabled={window.disabled}>
					<Icon type="download" />
		        </Menu.Item>
		        <Menu.Item key="file" disabled={window.disabled}>
					<Icon type="file-text" />
		        </Menu.Item>
				<Menu.Item key="designer" disabled={window.disabled}>
					<Icon type="windows-o" />
				</Menu.Item>
		        <Menu.Item key="terminal" disabled={window.disabled}>
					<Icon type="code-o" />
		        </Menu.Item>
		        <Menu.Item key="showStartMenu" disabled={window.disabled}>
		        	<Dropdown overlay={startMenu} trigger={['click']}>
		        		<div style={{width: 30}}>
							<Icon type="play-circle-o" />
						</div>
					</Dropdown>
		        </Menu.Item>
		        <Menu.Item key="pause" disabled={window.disabled}>
					<Icon type="pause-circle-o" />
		        </Menu.Item>
		        <Menu.Item key="preview" disabled={window.disabled}>
		        	<Icon type="eye-o" />
		        </Menu.Item>
		        <Menu.Item key="download-weapp" disabled={window.disabled}>
		        	打包小程序
		        </Menu.Item>
	      	</Menu>

	    	<Modal width="80%"  title="新建应用" visible={props.sidebar.modalNewAppVisible}
	          	onOk={leftSidebarProps.createApp} onCancel={leftSidebarProps.cancelNewApp}
	        >
	        	<iframe style={styles.ifr} src="http://localhost:8088/#!/apps/new"></iframe>
	        </Modal>

	    	<Modal style={{maxWidth: 550}}  title="切换应用" visible={props.sidebar.modalSwitchAppVisible}
	          	onOk={leftSidebarProps.switchApp} onCancel={leftSidebarProps.cancelSwitchApp}
	        >
        	    {props.sidebar.showAppsLoading ? 
        	    	(<div style={{width: '100%', textAlign: 'center', padding: '100px 0'}}>
        	    		<Spin tip="应用加载中..." spinning={true}></Spin>
        	    	</div>)
                    :
        	    	(<Row gutter={16}>
		        	    <Col className="gutter-row" span={6} style={{marginTop: 20}} key='addApp'>
							 <div className="gutter-box">
									<Card onClick={console.log('')}
									style={{ width: 110, height: 110 }}
									bodyStyle={{height: '100%', background: 'whitesmoke', color: '#555', cursor: 'pointer'}}>
											<div style={{ height: 50,lineHeight: '50px',textAlign: 'center' }}>
												<a className="create-app-from-modal" onClick={leftSidebarProps.createAppFromModal}>
													<Icon type="plus" />
												</a>

											</div>
									</Card>
							 </div>
						</Col>
						{initApplications()}
        	    	</Row>)
        	    }
	        </Modal>

	        <Modal
	          	visible={props.sidebar.weappCompilerModalVisible}
	          	title="小程序打包器"
	          	onOk={compilerModalProps.handleOk}
	          	onCancel={compilerModalProps.handleCancel}
	          	width="60%"
      	        footer={[
		            <Button key="back" type="ghost" size="small" onClick={compilerModalProps.handleCancel}>返回</Button>,
		            <Button key="submit" disabled={props.sidebar.weappCompiler.start} type="primary" size="small" onClick={compilerModalProps.handleOk}>
		              开始
		            </Button>,
		            <Button disabled={props.sidebar.weappCompiler.status == 'success'} key="restart" type="primary" size="small" onClick={compilerModalProps.handleRestart}>
		              重新开始
		            </Button>
		        ]}
	        >
			  	<Steps current={props.sidebar.weappCompiler.current}>
		        	{compilerModalProps.stepTemplate()}
			  	</Steps>
		        <div className="steps-content">
        	        <Progress type="circle" status={props.sidebar.weappCompiler.status} percent={props.sidebar.weappCompiler.percent} />
		        </div>
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

	        <Modal width="30%"  title="配置调试参数" visible={props.sidebar.debugConfig.showConfigModal}
	          	onOk={debugConfigModal.commitDebugConfigChange} onCancel={debugConfigModal.hideModal}
		    >
		    	<Form.Item key="runCommand" label="启动命令" {...debugConfigModal.formItemLayout}>
		    		<Input value={props.sidebar.debugConfig.runCommand}
	         				type="text"
	         				onChange={debugConfigModal.runCommandChange}
	         				placeholder="npm run dev" />
		    	</Form.Item>

		    	<Form.Item key="startPort" label="启动端口" {...debugConfigModal.formItemLayout}>
		    		<Input value={props.sidebar.debugConfig.startPort}
	         				type="number"
	         				onChange={debugConfigModal.startPortChange}
	         				placeholder="8080" />
		    	</Form.Item>
		    </Modal>

        </div>

	);

}

function mapStateToProps({ sidebar, editor, editorTop, rightbar, designer, attr ,devpanel,layout}) {
  return { sidebar, editor, editorTop, rightbar, designer, attr ,devpanel,layout};
}

export default connect(mapStateToProps)(LeftSidebar);
