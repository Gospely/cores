import React , { PropTypes } from 'react';
import { Menu, Spin, Icon, Modal, Input, Button, message, notification, Tabs, Card, Popconfirm, Row, Col, Dropdown, Form, Radio, Switch } from 'antd';

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

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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
		// console.log('side');
		if(props.sidebar.applications.length < 1) {
			return;
		}
		return props.sidebar.applications.map(application => {
			return  ( <Col className="gutter-row" span={6} style={{marginTop: 20}} key={application.id}>
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
					</Col>
			);
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

	        	if(window.gospelDesignerPreviewer) {
	        		message.warning('小程序设计器目前只能打开一个!');
	        		return false;
	        	}

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
	    	if(!props.sidebar.appCreator.loading) {
		      	props.dispatch({
		        	type: 'sidebar/hideModalNewApp'
		      	});
	    	}else {
				const openNotification = () => {
				  	const key = 'cancelNewApp';
				  	const btnClick = function () {
				    	notification.close(key);
    			      	props.dispatch({
		        			type: 'sidebar/hideModalNewApp'
				      	});
    		    		message.success('您已取消创建应用');
				  	};
				  	const cancelBtnClick = function () {
				    	notification.close(key);
				  	};
				  	const btn = [
				  		(<Button type="ghost" size="small" style={{ marginRight: 15 }} onClick={cancelBtnClick}>
				      		不取消
				    	</Button>),

				  		(<Button type="primary" size="small" onClick={btnClick}>
				      		取消
				    	</Button>)
				    ];
				  	notification.open({
				    	message: '您确定要取消创建应用吗？',
				    	btn,
				    	key,
				    	onClose: close,
				    	duration: 0
				  	});
				};openNotification();
	    	}
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
			props.dispatch({
				type: 'sidebar/deleteApp',
				payload: {application}
			})
	    },

	    cancelDeleteApp() {

	    },

	    openApp(application) {
			window.location.hash = 'project/' + application.id;
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
			},

			run() {
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

	const modalAppCreatorFromHandler = {
		onFromGitSwitchChange (s, checked) {
			props.dispatch({
				type: 'sidebar/handleSwitchChanged',
				payload: {
					'switch': s,
					checked: checked
				}
			});
		},

		onFormInputChange (s, dom) {
			console.log(s);
			console.log(dom.target.value);
			props.dispatch({
				type: 'sidebar/handleInputChanged',
				payload: {
					input: s,
					value: dom.target.value
				}
			});
			if(s == 'image') {
				props.dispatch({
					type: 'sidebar/initVersions',
					payload: {
						input: s,
						value: dom.target.value
					}
				});
				props.dispatch({
					type: 'sidebar/initFrameWork',
					payload: {
						input: s,
						value: dom.target.value
					}
				});
			}
		}
	}

	const modalAppCreatorProps = {

		appCreatingSteps: [{
		  	title: '基本信息',
		  	content: (
		  		<div>
			  		<div style={{ marginTop: 32 }}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>您的项目名称：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
				              	<Input onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'appName')} value={props.sidebar.appCreatingForm.appName} />
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>从Git创建：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
				              	<Switch onChange={modalAppCreatorFromHandler.onFromGitSwitchChange.bind(this, 'fromGit')} checked={props.sidebar.appCreatingForm.fromGit} />
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.fromGit}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>您的Git项目地址：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
				              	<Input onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'git')} value={props.sidebar.appCreatingForm.git} />
					      	</Col>
					    </Row>
					</div>
		  		</div>
		    ),
		}, {
			title: '选择语言',
			content: (

				<div>
		  			<div style={{ marginTop: 32 }}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>请选择语言：</span>
					      	</Col>
					      	<Col style={{textAlign: 'left'}}>
							    <RadioGroup
							    	value={props.sidebar.appCreatingForm.image}
							    	onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'image')}>
									{props.sidebar.images.map(image =><RadioButton value={image.id} key={image.id}>{image.name}</RadioButton>)}
							    </RadioGroup>
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={props.sidebar.versions.length === 0 }>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>请选择语言版本：</span>
					      	</Col>
					      	<Col style={{textAlign: 'left'}}>
							    <RadioGroup
							    	value={props.sidebar.appCreatingForm.imageVersion}
							    	onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'imageVersion')}>
							      	{props.sidebar.versions.map(image =><RadioButton value={image.label} key={image.id}>{image.label}</RadioButton>)}
							    </RadioGroup>
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={props.sidebar.appCreatingForm.fromGit}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>使用框架：</span>
					      	</Col>
					      	<Col style={{textAlign: 'left'}}>
					      		<Switch onChange={modalAppCreatorFromHandler.onFromGitSwitchChange.bind(this, 'useFramework')} checked={props.sidebar.appCreatingForm.useFramework}  />
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.useFramework || props.sidebar.frameworks.length === 0}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>请选择框架：</span>
					      	</Col>
					      	<Col style={{textAlign: 'left'}}>
							    <RadioGroup
							    	value={props.sidebar.appCreatingForm.framework}
							    	onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'framework')}>
							      	{props.sidebar.frameworks.map(image =><RadioButton value={image.id} key={image.id}>{image.name}</RadioButton>)}
							    </RadioGroup>
					      	</Col>
					    </Row>
					</div>

				</div>

			)
		}, {
			title: '数据库配置',
			content: (
				<div>
			  		<div style={{ marginTop: 32 }}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>创建本地数据库：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
					      		<Switch onChange={modalAppCreatorFromHandler.onFromGitSwitchChange.bind(this, 'createLocalServer')} checked={props.sidebar.appCreatingForm.createLocalServer} />
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.createLocalServer}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>请选择数据库类型：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
							    <RadioGroup
							    	value={props.sidebar.appCreatingForm.databaseType}
							    	onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'databaseType')}>
							      	<RadioButton value="mysql">MySQL</RadioButton>
							      	<RadioButton value="mongodb">MongoDB</RadioButton>
							    </RadioGroup>
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.createLocalServer}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>数据库用户：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
					      		<Input onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'databaseAccount')} value={props.sidebar.appCreatingForm.databaseAccount} type="text" />
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.createLocalServer}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>数据库密码：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
					      		<Input onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'databasePassword')} value={props.sidebar.appCreatingForm.databasePassword} type="password" />
					      	</Col>
					    </Row>
					</div>
				</div>
			)
		}],

		next () {

			if(props.sidebar.currentAppCreatingStep === 0) {

				if(props.sidebar.appCreatingForm.appName == '') {
					message.error('请填写应用名!');
					return false;
				}

				if(props.sidebar.appCreatingForm.fromGit) {
					if(props.sidebar.appCreatingForm.git == '') {
						message.error('请填写git地址');
						return false;
					}
				}
				//初始化语言镜像
				props.dispatch({
					type: 'sidebar/initImages'
				});
			}

			if(props.sidebar.currentAppCreatingStep === 1) {

				if(props.sidebar.appCreatingForm.image == '') {
					message.error('请选择语言');
					return false;
				}

				if(props.sidebar.versions.length > 0) {
					if(props.sidebar.appCreatingForm.imageVersion == '') {
						message.error('请选择语言版本');
						return false
					}
				}

				if(props.sidebar.appCreatingForm.useFramework && props.sidebar.frameworks.length > 0) {
					if(props.sidebar.appCreatingForm.framework == '') {
						message.error('请选择框架版本');
						return false;
					}
				}

			}

			props.dispatch({
				type: 'sidebar/handleNextAppCreatingStep'
			});
		},

		prev () {
			props.dispatch({
				type: 'sidebar/handlePrevAppCreatingStep'
			});
		},

		createApp () {

			if(props.sidebar.currentAppCreatingStep === 2) {
				if(props.sidebar.appCreatingForm.createLocalServer) {
					if(props.sidebar.appCreatingForm.databaseType == '' || props.sidebar.appCreatingForm.databaseAccount == '' || props.sidebar.appCreatingForm.databasePassword == '') {
						message.error('请完整填写数据库信息!');
						return false;
					}
				}
			}

			props.dispatch({
				type: 'sidebar/handleCreateApp'
			});
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
		        <Menu.Item key="preview" disabled={window.disabled}>
		        	<Icon type="eye-o" />
		        </Menu.Item>
		        <Menu.Item key="download-weapp" disabled={window.disabled}>
		        	打包小程序
		        </Menu.Item>
	      	</Menu>

	    	<Modal width="80%"  title="新建应用" visible={props.sidebar.modalNewAppVisible}
	          	onOk={leftSidebarProps.createApp} onCancel={leftSidebarProps.cancelNewApp}
	          	footer={[]}
	          	maskClosable={!props.sidebar.appCreator.loading}
	        >
	            <Spin spinning={props.sidebar.appCreator.loading}>
		        	<Steps current={props.sidebar.currentAppCreatingStep}>
				        {modalAppCreatorProps.appCreatingSteps.map(item => <Step key={item.title} title={item.title} />)}
				    </Steps>
					    <div className="steps-content">{modalAppCreatorProps.appCreatingSteps[props.sidebar.currentAppCreatingStep].content}</div>
			        <div className="steps-action">
				          {
				            props.sidebar.currentAppCreatingStep < modalAppCreatorProps.appCreatingSteps.length - 1
				            &&
				            <Button hidden={!props.sidebar.appCreator.loading} type="primary" onClick={() => modalAppCreatorProps.next()}>下一步</Button>
				          }
				          {
				            props.sidebar.currentAppCreatingStep === modalAppCreatorProps.appCreatingSteps.length - 1
				            &&
				            <Button hidden={!props.sidebar.appCreator.loading} type="primary" onClick={modalAppCreatorProps.createApp}>立即创建</Button>
				          }
				          {
				            props.sidebar.currentAppCreatingStep > 0
				            &&
				            <Button hidden={!props.sidebar.appCreator.loading} style={{ marginLeft: 8 }} type="ghost" onClick={() => modalAppCreatorProps.prev()}>
				              上一步
				            </Button>
				          }
				    </div>
	            </Spin>

	        </Modal>

	    	<Modal style={{maxWidth: 550}}  title="切换应用" visible={props.sidebar.modalSwitchAppVisible}
	          	onOk={leftSidebarProps.switchApp} onCancel={leftSidebarProps.cancelSwitchApp}
	        >
        	    {props.sidebar.showAppsLoading ?
        	    	(<div style={{width: '100%', textAlign: 'center', padding: '100px 0'}}>
        	    		<Spin spinning={true}></Spin>
        	    	</div>)
                    :
        	    	(<Row gutter={16}>
		        	    <Col className="gutter-row" span={6} style={{marginTop: 20}} key='addApp'>
							 <div className="gutter-box">
									<Card
									style={{ width: 110, height: 110 }}
									bodyStyle={{height: '100%', background: 'whitesmoke', color: '#555', cursor: 'pointer'}}
									>
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
