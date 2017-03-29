import React , { PropTypes } from 'react';
import { Menu, Spin, Icon, Modal, Input, Button, message, notification, Tabs, Card, Popconfirm, Row, Col, Dropdown, Form, Radio, Switch } from 'antd';

import { Tooltip } from 'antd';

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
import fileListen from '../utils/fileListen';

import { Cascader } from 'antd';

import Preview from './TopBar/Preview.js';

import SaveAsTemplate from './TopBar/SaveAsTemplate.js';

import TemplateStore from './TopBar/TemplateStore.js';

import { Steps } from 'antd';
import { Progress, Popover } from 'antd';

import Dashboard from './TopBar/Dashboard.js';

import { Badge } from 'antd';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const ButtonGroup = Button.Group;
const Step = Steps.Step;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const InputGroup = Input.Group;
const confirm = Modal.confirm;

const LeftSidebar = (props) => {

	dndHandler.init(props);
	keyRegister.init(props);
	if(!window.socket && window.applicationId){
		gitTerminal(props);
	}

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
								bodyStyle={{height: '100%', background: 'whitesmoke', display:'flex',
											color: '#555', cursor: 'pointer', wordWrap: 'break-word',
											overflow: 'auto'}}>
										<div style={{margin: 'auto', width: '100%', display: 'flex',
													wordBreak: 'break-all', justifyContent: 'center'}}
											className="app-name-hover"
										>
											{application.name}
										</div>
								</Card>
						 </div>
					</Col>
			);
		});
	};

	const initPreviewer = () => {
		if(props.devpanel.loadPreviewer) {
			// return <Previewer></Previewer>;
		}
	}
	const genChanges = () => {

		if(props.sidebar.modalCommitInfo.changes.length < 1 || props.sidebar.modalCommitInfo.changes.length == undefined) {
			return;
		}
		return props.sidebar.modalCommitInfo.changes.map((item, index) => (
			<div key={item.file}>
				{item.type == 'M' && <Icon type="edit"/>}
				{item.type == 'A' && <Icon type="plus"/>}
				{item.type == 'D' && <Icon type="minus"/>}
				<span> {item.file}</span>
			</div>
		));
	}

	const leftSidebarProps = {

	    handleClick(activeMenu) {

	      var handleActiveMenuEvent = {

	        create() {
				props.dispatch({
					type: 'sidebar/initImages'
				});
	        	if(location.hash.indexOf('project') != -1) {
					props.dispatch({
						type: 'sidebar/handleAvailable',
                        payload: {
                            available: true,
                        }
					});
					confirm({
					    title: '即将新建应用',
					    content: '您要保存工作状态后再进行新建操作吗? ',
					    onOk() {
							wechatSave.save();

	    	          		props.dispatch({
				        		type: 'sidebar/showModalNewApp'
				          	});
					    },
					});
	        	}else {
	          		props.dispatch({
		        		type: 'sidebar/showModalNewApp'
		          	});
	        	}
	        },

	        'switch'() {

	        	// if(location.hash.indexOf('project') != -1) {

				props.dispatch({
	            	type: 'sidebar/showModalSwitchApp'
	          	});

				props.dispatch({
	            	type: 'sidebar/getApplications'
	          	});

				// 	confirm({
				// 	    title: '即将切换应用',
				// 	    content: '您确定要切换吗（点击确定将保存您的工作内容并进行切换）',
				// 	    onOk() {

				// 			wechatSave.save();



				// 	    },
				// 	    onCancel() {
				// 	    },
				// 	});

				// }else {
				// 	props.dispatch({
		  //           	type: 'sidebar/showModalSwitchApp'
		  //         	});

				// 	props.dispatch({
		  //           	type: 'sidebar/getApplications'
		  //         	});
				// }
		    },

	        commit() {

				console.log(props.sidebar.modifyGitConfigInput.password);
	        	if(!props.sidebar.modifyGitConfigInput.password) {
					message.error('您尚未添加git源，请先添加');

		        	props.dispatch({
		        		type: 'sidebar/showModalModifyGitOrgin'
		        	});
				}else {
					//获取文件修改详细
					props.dispatch({
		        		type: 'sidebar/gitChange'
		        	});
					modalCommitInfoProps.showModal();
				}
	        },

	        'push'() {

	        	if(!props.sidebar.modifyGitConfigInput.password) {
					message.error('您尚未添加git源，请先添加');
					props.dispatch({
						type: 'sidebar/showModalModifyGitOrgin'
					})
				}else {
					props.dispatch({
						type: 'sidebar/pushGit',
					});
				}
	        },

	        pull() {
	        	if(!props.sidebar.modifyGitOriginInput.isGit) {
					message.error('您尚未添加git源，请先添加');
					props.dispatch({
						type: 'sidebar/showModalModifyGitOrgin'
					});
				}else {

					props.dispatch({
						type: 'sidebar/pullGit',
					});
				}
	        },

	        terminal() {
	          	var title = '终端',
	              	type = 'terminal';

				props.dispatch({
					type: 'devpanel/initDebugPanel',
					payload: { cmd: 'cd /root/workspace && clear\n' }
				});

	          	props.dispatch({
	            	type: 'devpanel/add',
	            	payload: {title, type}
	          	});
	        },

	        file() {

	          	var title = '新文件',
	              	content = '',
	              	type = 'editor',
	              	editorId = randomWord(8, 10);

				localStorage.currentSelectedFile = '新文件';

	            props.dispatch({
	            	type: 'sidebar/setActiveMenu',
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

	          	var title = (
						<span>
							<i className="fa fa-weixin"></i> Gospel 小程序 UI 设计器
						</span>
					),

	              	type = 'designer';

	          	var editor = props.dispatch({
	            	type: 'devpanel/add',
	            	payload: {title, type}
	          	});

	        },

	        showStartMenu() {

				if(localStorage.debugType == 'common'){
					// sessionStorage.currentDebugResource = 'http://'+ localStorage.host +':' + localStorage.port;
					// var debug = window.open(location.origin + '/static/debugger/wordpress.html','_blank')
					var debug = window.open('http://'+ localStorage.domain);
					// props.dispatch({
					// 	type: 'devpanel/handleDebugger',
					// 	payload: {debug}
					// });
				}else{
					return false;
				}

	        },

	        'version-control' () {
	        	return false;
	        },

	        pause() {

				notification.open({
		            message: '正在停止...'
		        });
				if(localStorage.debugType == 'shell') {
					var kill = "kill -9 $(netstat -tlnp | grep "+ localStorage.exposePort +" |awk '{print $7}' | awk -F '/' '{print $1}')\n"
					window.socket.send(kill);
				}
				setTimeout(function(){
					notification.open({
			            message: '停止成功'
			        });
				}, 500)

	        },


	        'common-preview'() {

	        	props.dispatch({
	        		type: 'index/toggleCommonPreviewer'
	        	});

				props.dispatch({
					type: 'rightbar/setActiveMenu',
					payload: 'common-previewer'
				});

				props.dispatch({
					type: 'cpre/setLoading'
				});

	        },

	        'download-weapp'() {
	        	props.dispatch({
	        		type: 'sidebar/showWeappCompilerModal'
	        	});
	        },

	        dashboard () {
	        	props.dispatch({
	        		type: 'dashboard/showDash'
	        	})
	        },

	        packApp() {
	        	props.dispatch({
	        		type: 'sidebar/packApp',
	        	});
	        },

	        templateStore(){
				props.dispatch({
					type: 'templateStore/changeTemplateStoreVisible',
					payload: true
				})
	        },

	        feedback () {
	        	props.dispatch({
	        		type: 'sidebar/showFeedback'
	        	});
	        },

	        delete() {
	        	confirm({
	        	    title: '确定要删除此应用吗',
	        	    content: '您确定要删除此应用吗?删除后数据将不可恢复',
	        	    onOk() {
	        			leftSidebarProps.confirmDeleteApp(localStorage.applicationId);
	        	    },
	        	    onCancel() {
	        	    },
	        	});
	        },

	        preview() {
	        	props.dispatch({
	        		type: 'preview/showSpin',
	        		payload: true
	        	})
				//vdsite 预览
				if(localStorage.image == 'vd:site'){

					props.dispatch({
						type: 'preview/setSrc',
						payload: 'http://' + localStorage.domain + '/pages/' + props.vdpm.currentActivePageListItem
					});
					props.dispatch({
						type: 'preview/initPreviewer'
					});
					props.dispatch({
						type: 'preview/showPreview'
					})
				}else {
					props.dispatch({
						type: 'preview/showPreview'
					})
				}
	        },

	        saveBtn() {

				props.dispatch({
					type: 'UIState/writeConfig'
				});
	        	props.dispatch({
	        		type: 'sidebar/changeSaveBtnState',
	        		payload: {
	        			key: '',
				        title: '正在保存...',
				        iconType: 'loading',
	        		}
	        	})

	        	setTimeout(function recovery() {

	        		props.dispatch({
		        		type: 'sidebar/changeSaveBtnState',
		        		payload: {
		        			key: 'saveBtn',
				            title: '保存',
				            iconType: 'check',
		        		}
		        	})

	        	},"2000");
	        },

	        saveAsTemplate() {
	        	html2canvas($("#VDDesignerContainer",window.VDDesignerFrame.document),{
	        		onrendered: function(canvas) {
	        			var templatePreviewUrl = canvas.toDataURL();

	        			props.dispatch({
				          type: 'vdcore/changeSaveAsTemplateVisible',
				          payload: {
				              visible: true,
				              confirmLoading: false
				          }
				        });
						props.dispatch({
				          type: 'vdcore/getTemplate',
				        });
				        props.dispatch({
				        	type: 'vdcore/saveAsTemplatePreviewUrl',
				        	payload: templatePreviewUrl
				        })
	        		}

	        	});

	        },

			release() {

			},
	        configGit () {
	        	props.dispatch({
	        		type: 'sidebar/showModalModifyGitOrgin'
	        	});
	        },

	        'vdsite-downloader' () {
	        	props.dispatch({
	        		type: 'sidebar/packVDSite'
	        	});
	        },

	        PC() {
	        	props.dispatch({
	        		type: 'vdcore/changeVDSize',
	        		payload: {
	        			VDSize: 'pc'
	        		}
	        	});
	        },

	        verticalTablet() {
	        	props.dispatch({
	        		type: 'vdcore/changeVDSize',
	        		payload: {
	        			VDSize: 'verticalTablet'
	        		}
	        	});
	        },

	        alignTablet() {
	        	props.dispatch({
	        		type: 'vdcore/changeVDSize',
	        		payload: {
	        			VDSize: 'alignTablet'
	        		}
	        	});
	        },

	        verticalPhone() {
	        	props.dispatch({
	        		type: 'vdcore/changeVDSize',
	        		payload: {
	        			VDSize: 'verticalPhone'
	        		}
	        	});
	        },

	        alignPhone() {
	        	props.dispatch({
	        		type: 'vdcore/changeVDSize',
	        		payload: {
	        			VDSize: 'alignPhone'
	        		}
	        	});
	        }


	      }

	      if(handleActiveMenuEvent[activeMenu.key]) {
		      handleActiveMenuEvent[activeMenu.key]();
	      }
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
				    	message: '应用创建过程中不允许取消喔',
				    	key,
				    	duration: 0
				  	});
				};openNotification();
	    	}
	    },

		//btn,
		//onClose: close

	    createApp() {

			props.dispatch({
				type: 'sidebar/handleBtnCtrl',
				payload: { value: true}
			});
			props.dispatch({
				type: 'sidebar/createApp'
			});

			notification.open({
				message: '正在创建应用，请稍等……',
				title: '创建应用'
			});
	    },

	    cancelSwitchApp() {
	      props.dispatch({
	        type: 'sidebar/hideModalSwitchApp'
	      });
	    },

	    confirmDeleteApp(application) {
			window.disabled = true;
			localStorage.image = '';
			notification.open({
				message: '正在删除应用，请稍等……',
				title: '删除应用'
			});
			if(localStorage.applicationId == application){
				localStorage.clear;
				window.location.hash = '#/'
				props.dispatch({
					type: 'devpanel/initPanel',
				})
			}
			props.dispatch({
				type: 'sidebar/deleteApp',
				payload: {application}
			});
	    },

	    cancelDeleteApp() {

	    },

	    openApp(application) {
	    	const swApp = (application) => {
	    		window.location.hash = 'project/' + application.id;
    			// props.dispatch({
    			// 	type: 'devpanel/stopDocker',
    			// 	payload: { id: localStorage.applicationId, image: localStorage.image }
    			// });
				if(application.image == "vd:site" && localStorage.image == "vd:site") {

					if(window.frames["vdsite-designer"]){
						window.frames["vdsite-designer"].location.reload();
					}
				}
    			window.reload = true
    			window.applicationId = application.id;
    			initApplication(application, props);
	    	}

        	if(location.hash.indexOf('project') != -1) {
	    		if(application.id != localStorage.applicationId) {

	    			confirm({
	    			    title: '即将切换应用',
	    			    content: '您确定要切换吗（点击确定将保存您的工作内容并进行切换）',
	    			    onOk() {
	    					wechatSave.save();
	    					swApp(application);
	    			    },
	    			    onCancel() {
	    			    },
	    			});
	    		}else {
    				props.dispatch({
    			      	type: 'sidebar/hideModalSwitchApp'
    			  	});
	    		}

			}else {
				swApp(application);
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

				if(props.sidebar.gitTabKey == '1'){
					if(props.sidebar.modifyGitOriginInput.value == '' || props.sidebar.modifyGitOriginInput.pushValue == '') {
						message.error('git源不能为空');
						return false;
					}
					var isHttp = /https:\/\/github.com\/?/.test(props.sidebar.modifyGitOriginInput.pushValue) && /https:\/\/github.com\/?/.test(props.sidebar.modifyGitOriginInput.value);
					var isSSH = /git@github.com:?/.test(props.sidebar.modifyGitOriginInput.value) && /git@github.com:?/.test(props.sidebar.modifyGitOriginInput.pushValue);
					if(isHttp){
						if(props.sidebar.modifyGitConfigInput.userName == '' || props.sidebar.modifyGitConfigInput.email == '') {
							message.error('git 配置不能为空');
							return false;
						}
						if(!/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(props.sidebar.modifyGitConfigInput.email)){
							message.error('邮箱格式错误');
							return false;
						}
					}
					props.dispatch({
						type: 'sidebar/setModifyGitOriginStart'
					});
					props.dispatch({
						type: 'sidebar/modifyGitOrigin'
					})
					if(isSSH){
						notification.open({
							message: '请在Github或git@oschina配置你的sshKey'
						});
					}
				}else {
					props.dispatch({
						type: 'sidebar/setModifyGitOriginCompleted'
					});
					props.dispatch({
						type: 'sidebar/hideModalModifyGitOrigin'
					})
				}

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
		modifyGitConfigInput: {
			onPressEnter: function() {
				if(props.sidebar.modifyGitConfigInput.userName == '' || props.sidebar.modifyGitConfigInput.email == '') {
					message.error('git 配置不能为空');
					return false;
				}

				props.dispatch({
					type: 'sidebar/modifyGitOrigin'
				})
			},

			onChange: function(e) {
				props.dispatch({
					type: 'sidebar/handleModifyGitConfigInputChange',
					payload: e.target.value
				})
			},

			onEmailChange: function(e) {
				props.dispatch({
					type: 'sidebar/handleModifyGitConfigEmailInputChange',
					payload: e.target.value
				})
			},
			onPasswordChange: function(e) {
				props.dispatch({
					type: 'sidebar/handleModifyGitConfigPasswordInputChange',
					payload: e.target.value
				})
			}
		},

		onGitOperationTabChanged: function(key) {

			props.dispatch({
				type: 'sidebar/changeGitTabKey',
				payload: { key: key }
			});
			if(key == '3'){
				props.dispatch({
					type: 'sidebar/getKey'
				});
			}
			if(key == ''){

			}
			if(key == '1'){

			}
		},

		createAppFromModal() {
			props.dispatch({
				type: 'sidebar/initImages'
			});
			props.dispatch({
				type: 'sidebar/handleAvailable',
				payload: {
					available: true,
				}
			});
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

				//分栏
				var kill = "mv /root/temp/.* /root/workspace || kill -9 $(netstat -tlnp | grep "+ localStorage.exposePort +" |awk '{print $7}' | awk -F '/' '{print $1}')\n"
				var cmd = 'cd /root/workspace\n ' + kill  + 'clear\n' + props.sidebar.debugConfig.runCommand + '\n';
				var key = "horizontal-dbl";
				props.dispatch({
					type: 'devpanel/changeColumnWithHeight',
					payload: {
						key: key,
						height: '70%'
					}
				});
				props.dispatch({
					type: 'devpanel/initDebugPanel',
					payload: { cmd: cmd}
				});
				var title = '调试终端 - ' + props.sidebar.debugConfig.runCommand,
					type = 'terminal';
				props.dispatch({
					type: 'devpanel/add',
					payload: {title, type}
				})
				// if(window.debugTerminal){
				// 	fireKeyEvent(window.debug_el,'keydown',17)
				// 	fireKeyEvent(window.debug_el,'keydown',67)
				// 	window.debugTerminal.send(cmd);
				// }else{
				//
				// }
			},
			visit(){
				//分栏
				var url = 'http://' + localStorage.domain;
				window.open(url);
			},
			'run&visit&noleave'(){
				var key = "vertical-dbl";
				props.dispatch({
					type: 'devpanel/changeColumn',
					payload: key
				});
				props.dispatch({
					type: 'devpanel/initDebugPanel',
					payload: {cmd: 'cd /root/workspace && clear\n'}
				});

				var title = '预览',
	        		type = 'previewer',
					url = 'http://' + localStorage.domain;
        		props.dispatch({type: 'devpanel/add',payload: {title,type,url}});
			},
			run() {
				const debugType = {
					common(){
						// sessionStorage.currentDebugResource = 'http://' + localStorage.domain;
						window.open('http://' + localStorage.domain);
						// props.dispatch({
						// 	type: 'devpanel/handleDebugger',
						// 	payload: {debug}
						// });
					},
					shell(){
						//分栏
						var key = "vertical-dbl";
						props.dispatch({
							type: 'devpanel/changeColumn',
							payload: key
						});
						props.dispatch({
							type: 'devpanel/initDebugPanel',
						});

						var title = '启动命令终端',
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

	//<Menu.Item key='run&visit&noleave' disabled={window.disabled}>在IDE访问</Menu.Item>

	const startMenu = (
		localStorage.debugType == 'shell' &&
		<Menu onClick={onSelectStartMenu}>
			<Menu.Item key='runCommand' disabled={window.disabled}>运行：{props.sidebar.debugConfig.runCommand}</Menu.Item>
			<Menu.Item key='visit' disabled={window.disabled}>访问：http://{localStorage.domain}</Menu.Item>
			<Menu.Divider/>
			<Menu.Item key='config' disabled={window.disabled}>配置...</Menu.Item>
		</Menu>
	);

	const versionControlMenu = (
		<Menu onClick={leftSidebarProps.handleClick}>
			<Menu.Item key='commit' disabled={window.disabled}>commit...</Menu.Item>
			<Menu.Item key='push' disabled={window.disabled}>push</Menu.Item>
			<Menu.Item key='pull' disabled={window.disabled}>pull</Menu.Item>
			<Menu.Divider/>
			<Menu.Item key='configGit' disabled={window.disabled}>配置...</Menu.Item>
		</Menu>
	);

	const wechatSave = {
		hideModal() {
			props.dispatch({
				type: 'sidebar/handleWechatSave'
			})
			props.dispatch({
				type: 'sidebar/showModalSwitchApp'
			});
			props.dispatch({
				type: 'sidebar/getApplications'
			});
		},
		save(){
			notification.open({
				message: '正在保存工作状态...'
			});
			props.dispatch({
				type: 'UIState/writeConfig'
			});
		}
	}
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

			if(props.sidebar.debugConfig.startPort < 0){
				message.error('请填写正确的端口');
				return false;
			}
			props.dispatch({
				type: 'sidebar/updateCmds',
			})
			notification.open({
	            message: '正在修改端口配置....'
	        });
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
			if(s == 'git') {

				if(dom.target.value.indexOf('git@') != -1) {
					notification['warning']({
						message: '暂时不支持通过SSH创建',
						description: '请先使用HTTP然后在程序创建完毕后在[设置]菜单中更改Git源',
						duration: 6000
					});

					props.dispatch({
						type: 'sidebar/handleInputChanged',
						payload: {
							input: s,
							value: ''
						}
					});

					return false;
				}

			}
			console.log(s);
			if(s == 'databaseAccount'){

				if(!/^[a-z]*$/.test(dom.target.value)){
					notification['warning']({
						message: '数据库用户名只支持小写英文名',
						description: '请重新输入'
					});
					props.dispatch({
						type: 'sidebar/checkProjectAvailable',
						payload: {
							name:  ''
						}
					});
					return;
				}
			}
			if(s == 'appName') {

				for(var i = 0; i < 10; i++) {
					if(dom.target.value.indexOf(i.toString()) === 0) {

						notification['warning']({
							message: '首字符不能为数字',
							description: '请重新输入'
						});

						props.dispatch({
							type: 'sidebar/handleInputChanged',
							payload: {
								input: s,
								value: ''
							}
						});
						return false;
					}
				}
				const illegalLetter = ['!',' ', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '[', ']',
									'{', '}', '\\', '|', ':', ';', '\'', '"', '<', '>', ',', '.', '/', '?'];
				let theCurrentLetter = dom.target.value.replace(props.sidebar.appCreatingForm.appName, '');
				if(illegalLetter.indexOf(theCurrentLetter) !== -1) {
					notification['warning']({
						message: '请勿输入非法字符: \' ' + theCurrentLetter + ' \'',
						description: '请重新输入'
					});
					return false;
				}

				props.dispatch({
					type: 'sidebar/checkProjectAvailable',
					payload: {
						name:  dom.target.value
					}
				});
			}

			props.dispatch({
				type: 'sidebar/handleInputChanged',
				payload: {
					input: s,
					value: dom.target.value
				}
			});

			if(s == 'image') {
				if(dom.target.value != 'wechat:latest'){
					props.dispatch({
						type: 'sidebar/checkAvailable',
						payload: {
							input: s,
							value: dom.target.value
						}
					});
				}else{
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
					props.dispatch({
						type: 'sidebar/handleAvailable',
                        payload: {
                            available: true,
                        }
					});

				}
			}
		}
	}


	const generateDatabaseSelector = () => {
		if(!props.sidebar.appCreatingForm.isFront) {
			return (
				<div>
			      	<Col span={4} style={{textAlign: 'right'}}>
			      		<span>{props.sidebar.appCreatingForm.databaseShow}：</span>
			      	</Col>
			      	<Col span={8} style={{textAlign: 'left'}}>
			      		<Switch onChange={modalAppCreatorFromHandler.onFromGitSwitchChange.bind(this, 'createLocalServer')} disabled={props.sidebar.appCreatingForm.isFront} checked={props.sidebar.appCreatingForm.createLocalServer} />
			      	</Col>
				</div>
			);
		}else {
			return (
				<span>{props.sidebar.appCreatingForm.databaseShow}</span>
			);
		}
	}

	const modalAppCreatorProps = {

		appCreatingSteps: [{
			title: '选择项目类型',
			content: (

				<div>
		  			<div style={{ marginTop: 32 }}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>请选择项目类型：</span>
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

			  		<div style={{ marginTop: 32 }} >
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
		  	title: '基本信息',
		  	content: (
		  		<div>
			  		<div style={{ marginTop: 32 }}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>您的项目名称：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
				              	<Input onPressEnter={() => modalAppCreatorProps.next()} onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'appName')} value={props.sidebar.appCreatingForm.appName} />
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.useGit}>
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
				              	<Input placeholder="暂不支持SSH创建，请使用HTTP" onPressEnter={() => modalAppCreatorProps.next()} onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'git')} value={props.sidebar.appCreatingForm.git} />
					      	</Col>
					    </Row>
					</div>
		  		</div>
		    ),
		}, {
			title: '数据库配置',
			content: (
				<div>
			  		<div style={{ marginTop: 32 }}>
			  		    <Row>
			  		    	{generateDatabaseSelector()}
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
							      	<RadioButton value="mongodb" disabled={props.sidebar.appCreatingForm.mongodb}>MongoDB</RadioButton>
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
					      		<Input onPressEnter={() => modalAppCreatorProps.next()} onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'databaseAccount')} value={props.sidebar.appCreatingForm.databaseAccount} type="text" />
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.createLocalServer}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>数据库密码：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
					      		<Input onPressEnter={() => modalAppCreatorProps.next()} onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'databasePassword')} value={props.sidebar.appCreatingForm.databasePassword} type="password" />
					      	</Col>
					    </Row>
					</div>
				</div>
			)
		}],

		next () {

			if(props.sidebar.currentAppCreatingStep === 1) {

				const illegalLetter = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '[', ']',
									'{', '}', '\\', '|', ':', ';', '\'', '"', '<', '>', ',', '.', '/', '?'];

				for(let i = 0; i < illegalLetter.length; i ++) {
					if (props.sidebar.appCreatingForm.appName.indexOf(illegalLetter[i]) !== -1) {
						message.error('项目名中不能含有特殊字符');
						return false;
					}
				}

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

				if(!props.sidebar.appCreatingForm.isProjectNameAvailabel) {
					message.error('您的项目名与已有项目重复，请重新填写');
					return false;
				}


			}

			if(props.sidebar.currentAppCreatingStep === 0) {

				if(props.sidebar.appCreatingForm.image == '') {
					message.error('请选择项目类型');
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

			if(props.sidebar.currentAppCreatingStep === 2) {
				modalAppCreatorProps.createApp();
			}else {
				props.dispatch({
					type: 'sidebar/handleNextAppCreatingStep'
				});
			}

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
			if (props.sidebar.appCreatingForm.fromGit) {
				props.dispatch({
					type: 'file/setTreeLoadingStatus',
					payload: 'cloning'
				});
				//fileListen(props, localStorage.user);
			}
			props.dispatch({
				type: 'sidebar/handleCreateApp',
				payload: {ctx: props}
			});
			notification.open({
				message: '正在创建应用',
				description: '请稍等……'
			});

		},

		deployFast() {

			let src;

			if(document.domain == 'localhost') {
	        	src = 'http://localhost:8088/#!/apps/new';
	      	}else {
	        	src = 'http://dash.gospely.com/#!/apps/new';
	      	}

			props.dispatch({
				type: 'dashboard/setSrc',
				payload: src
			})

			props.dispatch({
				type: 'sidebar/hideModalNewApp',
			})

			props.dispatch({
				type: 'dashboard/showDash'
			})
		}
	}

	var topbarMenu = '';

	let generateTopBarMenu = () => {

		var topbarMenu = '',
			debugMenu = '';

		if(window.disabled) {

			topbarMenu = (

		      	<Menu
		      		style={styles.sidebar}
		      		onClick={leftSidebarProps.handleClick}
		      		mode="horizontal">
					<Menu.Item key="create">
				      	<Tooltip title="新建项目">
			          		<Icon type="plus" />
			          	</Tooltip>
			        </Menu.Item>
			        <Menu.Item key="switch">
				      	<Tooltip title="切换项目">
			          		<Icon type="appstore-o" />
			          	</Tooltip>
			        </Menu.Item>
			        <Menu.Item key="dashboard">
						<Icon type="laptop" />
		        		控制台
			        </Menu.Item>
					<Menu.Item key="feedback">
						<Icon type="smile-o" />
						反馈建议
				    </Menu.Item>
		      	</Menu>

			);

			return topbarMenu;
		}

		if(window.isWeapp) {

			topbarMenu = (
		      	<Menu
		      		style={styles.sidebar}
		      		onClick={leftSidebarProps.handleClick}
		      		mode="horizontal">
					<Menu.Item key="create">
				      	<Tooltip title="新建项目">
			          		<Icon type="plus" />
			          	</Tooltip>
			        </Menu.Item>
			        <Menu.Item key="switch">
				      	<Tooltip title="切换项目">
			          		<Icon type="appstore-o" />
			          	</Tooltip>
			        </Menu.Item>
				    <Menu.Item key="preview">
				      	<Tooltip title="预览">
				    		<Icon type="eye-o" />
				      	</Tooltip>
				    </Menu.Item>
				    <Menu.Item key="download-weapp">
				    	<Icon type="cloud-o" />
				    	打包小程序
				    </Menu.Item>
    		        <Menu.Item key="dashboard">
						<Icon type="laptop" />
		        		控制台
			        </Menu.Item>
    		        <Menu.Item key="feedback">
						<Icon type="smile-o" />
						反馈建议
			        </Menu.Item>
			        <Menu.Item key="delete" className='delete-app-btn'>
				      	<Tooltip placement="leftBottom" title="删除此应用">
			          		<Icon type="delete" />
			          	</Tooltip>
			        </Menu.Item>
			    </Menu>
			);

			return topbarMenu;
		}

		const debugMenuGenerator = () => {

			var debugMenu = '';

			if(localStorage.debugType == 'common') {
				debugMenu = (
				    <Menu.Item key="showStartMenu">
			      		<Tooltip title="调试运行">
							<Icon type="play-circle-o" />
						</Tooltip>
				    </Menu.Item>
				);
			}else {
				debugMenu = (
				    <Menu.Item key="showStartMenu">
				    	<Dropdown overlay={startMenu}  trigger={['click']}>
				      		<Tooltip title="调试运行">
				    			<div style={{width: 30}}>
									<Icon type="play-circle-o" />
								</div>
							</Tooltip>
						</Dropdown>
				    </Menu.Item>
				);
			}
			return debugMenu;
		}
		if(localStorage.image == 'vd:site') {
			const vdMenuProps = {

				selectMenu(item){

					const eventHandle ={
						deploy() {
							props.dispatch({
								type: 'vdcore/deploy'
							});
						},
						visit(){
							window.open("http://" + localStorage.domain + '/index.html?r=' + randomWord(8, 10));
						}
					}
					eventHandle[item.key]();
				}

			}
			const deployMenu = (
				<Menu onClick = {vdMenuProps.selectMenu}>
					<Menu.Item key='deploy' onClick={vdMenuProps.release}>发布</Menu.Item>
					<Menu.Item key='visit' disabled={window.disabled}>访问：http://{localStorage.domain}</Menu.Item>
				</Menu>
			);

			const options = [{
			  value: 'zhejiang',
			  label: 'Zhejiang',
			  children: [{
			    value: 'hangzhou',
			    label: 'Hangzhou',
			  }],
			}, {
			  value: 'jiangsu',
			  label: 'Jiangsu',
			  children: [{
			    value: 'nanjing',
			    label: 'Nanjing',
			  }],
			}];

			topbarMenu = (
		      	<Menu
		      		style={styles.sidebar}
		      		onClick={leftSidebarProps.handleClick}
		      		mode="horizontal">
					<Menu.Item key="create">
				      	<Tooltip title="新建项目">
			          		<Icon type="plus" />
			          	</Tooltip>
			        </Menu.Item>
			        <Menu.Item key="switch">
				      	<Tooltip title="切换项目">
			          		<Icon type="appstore-o" />
			          	</Tooltip>
			        </Menu.Item>
			        <Menu.Item key="vdsite-downloader">
						<Icon type="cloud-download-o" />
		        		打包下载
			        </Menu.Item>
			        <Menu.Item key="dashboard">
						<Icon type="laptop" />
		        		控制台
			        </Menu.Item>
			        <Menu.Item key="templateStore">
			        	<Icon type="shopping-cart" />
						VD商城
			        </Menu.Item>
					<Menu.Item key="feedback">
						<Icon type="smile-o" />
						反馈建议
			        </Menu.Item>
			        <Menu.Item key="PC" className='change-icon' style={{position: 'fixed', left: '35%'}}>
			        	<i className='change-vd-icon icon-bg-0'></i>
			        </Menu.Item>
			        <Menu.Item key="verticalTablet" className='change-icon' style={{position: 'fixed', left: '37.5%'}}>
			        	<i className='change-vd-icon icon-bg-36'></i>
			        </Menu.Item>
			        <Menu.Item key="alignTablet" className='change-icon' style={{position: 'fixed', left: '40%'}}>
			        	<i className='change-vd-icon icon-bg-75'></i>
			        </Menu.Item>
			        <Menu.Item key="verticalPhone" className='change-icon' style={{position: 'fixed', left: '42.5%'}}>
			        	<i className='change-vd-icon icon-bg-113'></i>
			        </Menu.Item>
			        <Menu.Item key="alignPhone" className='change-icon' style={{position: 'fixed', left: '45%'}}>
			        	<i className='change-vd-icon icon-bg-150'></i>
			        </Menu.Item>
			        <Menu.Item key={props.sidebar.saveBtn.key} placement="left" className='save-app-btn'>
						<Tooltip placement="leftBottom" title={props.sidebar.saveBtn.title}>
			          		<span>
			          			<Icon type={props.sidebar.saveBtn.iconType} />
			          			{props.sidebar.saveBtn.title}
			          		</span>
			          	</Tooltip>
					</Menu.Item>
			        <Menu.Item key='saveAsTemplate' placement="left" className='save-as-template-app-btn'>
			        	<Tooltip placement="leftBottom" title='保存为模板'>
			          		<span>
			          			<Icon type='check-square-o' />
			          			存至VD商城
			          		</span>
		          		</Tooltip>
					</Menu.Item>
					<Menu.Item key="preview" placement="left" className='preview-app-btn'>
						<Tooltip placement="leftBottom" title="预览">
			          		<Icon type="eye-o" />
			          	</Tooltip>
					</Menu.Item>
			        <Menu.Item key="delete" placement="left" className='delete-app-btn'>
				      	<Tooltip placement="leftBottom" title="删除此应用">
			          		<Icon type="delete" />
			          	</Tooltip>
			        </Menu.Item>

			        <Menu.Item key="release" className="releaseItem">
						<Dropdown overlay={deployMenu}  trigger={['click']}>
				    			<div style={{width: 60}}>
									<Icon type="export" />
									发布
								</div>
						</Dropdown>
			        </Menu.Item>

			    </Menu>
			);

		}else {

			debugMenu = debugMenuGenerator();

			topbarMenu = (
		      	<Menu
		      		style={styles.sidebar}
		      		onClick={leftSidebarProps.handleClick}
		      		mode="horizontal">
					<Menu.Item key="create">
				      	<Tooltip title="新建项目">
			          		<Icon type="plus" />
			          	</Tooltip>
			        </Menu.Item>
			        <Menu.Item key="switch">
				      	<Tooltip title="切换项目">
			          		<Icon type="appstore-o" />
			          	</Tooltip>
			        </Menu.Item>
				    <Menu.Item key="file">
				      	<Tooltip title="新建文件">
							<Icon type="file-text" />
						</Tooltip>
				    </Menu.Item>
				    <Menu.Item key="packApp">
				      	<Tooltip title="源码下载">
				      		<Badge dot>
								<Icon type="cloud-download-o" />
				      		</Badge>
						</Tooltip>
				    </Menu.Item>
				    <Menu.Item key="terminal">
				      	<Tooltip title="打开终端">
							<Icon type="code-o" />
						</Tooltip>
				    </Menu.Item>
				    {debugMenu}
				    <Menu.Item key="pause">
				      	<Tooltip title="停止运行">
							<Icon type="pause-circle-o" />
						</Tooltip>
				    </Menu.Item>
				    <Menu.Item key="version-control">
						<Badge dot>
				    		<Dropdown overlay={versionControlMenu}  trigger={['click']}>
				      			<Tooltip title="版本控制(BETA)">
				    				<div style={{width: 30}}>
										<Icon type="github" />
									</div>
								</Tooltip>
							</Dropdown>
				   		</Badge>
				    </Menu.Item>
				    <Menu.Item key="common-preview">
						<Icon type="eye-o" />
						预览
				    </Menu.Item>
			        <Menu.Item key="dashboard">
						<Icon type="laptop" />
		        		控制台
			        </Menu.Item>
					<Menu.Item key="feedback">
						<Icon type="smile-o" />
						反馈建议
			        </Menu.Item>
			        <Menu.Item key="delete" placement="left" className='delete-app-btn'>
				      	<Tooltip placement="leftBottom" title="删除此应用">
			          		<Icon type="delete" />
			          	</Tooltip>
			        </Menu.Item>
			    </Menu>
			);

		}

		return topbarMenu;
	}

	const modalCommitInfoProps = {
		showModal () {
			props.dispatch({
				type: 'sidebar/showModalCommitInfo'
			});
		},

		hideModal () {
			props.dispatch({
				type: 'sidebar/hideModalCommitInfo'
			});
		},

		commit () {

			modalCommitInfoProps.hideModal();

			props.dispatch({
				type: 'sidebar/pushCommit',
			});
		},

		onInputChange (input, e) {
			sessionStorage.commitInfo = e.target.value;
			props.dispatch({
				type: 'sidebar/handleCommitInfoInputChange',
				payload: {
					value: e.target.value,
					input: input
				}
			});
		}
	}

	const feedbackProps = {
		'submit' () {
			props.dispatch({
				type: 'sidebar/submitFeedback'
			});
		},

		hideModal () {
			props.dispatch({
				type: 'sidebar/hideFeedback'
			});
		},

		onMsgChange (e) {
			props.dispatch({
				type: 'sidebar/handleFeedbackMsgChange',
				payload: e.target.value
			});
		}
	}

	const vdSiteProps = {
		handleOk () {
			props.dispatch({
				type: 'sidebar/hideVDSiteDownloader'
			});
		},

		handleCancel () {
			props.dispatch({
				type: 'sidebar/hideVDSiteDownloader'
			});
		},

		aceHeight: (parseInt(document.body.clientHeight) - 300),

		handleCodePreviewerChanged (value) {
		}
	}

	return (
		<div style={styles.wrapper}>
			{generateTopBarMenu()}

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
				            <Button hidden={!props.sidebar.appCreator.loading} type="primary" disabled={!props.sidebar.appCreator.available} onClick={() => modalAppCreatorProps.next()}>下一步</Button>
				          }
				          {
				          	props.sidebar.currentAppCreatingStep == 0
				          	&&
				          	<Button hidden={!props.sidebar.appCreator.loading} style={{ marginLeft: 8 }} type="ghost" onClick={modalAppCreatorProps.deployFast}>快速部署应用</Button>
				          }
				          {
				            props.sidebar.currentAppCreatingStep === modalAppCreatorProps.appCreatingSteps.length - 1
				            &&
				            <Button hidden={!props.sidebar.appCreator.loading} disabled={props.sidebar.appCreator.btnCtrl} type="primary" onClick={modalAppCreatorProps.createApp}>立即创建</Button>
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

	    	<Modal title="切换应用" visible={props.sidebar.modalSwitchAppVisible}
	          	onOk={leftSidebarProps.switchApp} onCancel={leftSidebarProps.cancelSwitchApp}
	          	footer={[(<Button key='cancel' onClick={leftSidebarProps.cancelSwitchApp}>取消</Button>)]}
	        >
	            <Spin spinning={props.sidebar.showAppsLoading || props.sidebar.appCreator.loading}>
	        	    <Row gutter={16}>
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
        	    	</Row>
        	    </Spin>
	        </Modal>

	        <Modal
	          	title="请输入commit信息"
	          	style={{ top: 20 }}
	          	visible={props.sidebar.modalCommitInfo.visible}
	          	onOk={modalCommitInfoProps.commit}
	          	onCancel={modalCommitInfoProps.hideModal}
	        >

	        	<Input type="text" placeholder="请输入commit信息" onChange={modalCommitInfoProps.onInputChange.bind(this, 'title')} value={props.sidebar.modalCommitInfo.title} onPressEnter={modalCommitInfoProps.commit}></Input>
				{genChanges()}
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
			  	<Spin spinning={props.sidebar.weappCompiler.percent >= 60 && props.sidebar.weappCompiler.percent !== 100}>
			        <div className="steps-content">
	        	        {
	        	        	props.sidebar.weappCompiler.status !== 'exception' &&
	        	        	(props.sidebar.weappCompiler.percent == 100 ?
	        	        	<a href={props.sidebar.weappCompiler.filePath} target='blank'>若浏览器没有开始下载，请点击这里</a> :
	        	        	<Progress type="circle" percent={props.sidebar.weappCompiler.percent} />)
	        	        }
	        	        {
	        	        	props.sidebar.weappCompiler.status === 'exception' &&
	        	        	<Progress type="circle" status='exception' percent={props.sidebar.weappCompiler.percent} />
	        	        }
			        </div>
			    </Spin>
	        </Modal>

	    	<Modal width="60%"  title="添加/更改 Git 源" visible={props.sidebar.modalModifyGitOriginVisible}
	          	onOk={leftSidebarProps.modifyGitOriginInput.onPressEnter} onCancel={leftSidebarProps.cancelModifyGitOrigin}
	        >
				<Spin spinning={props.sidebar.modifyGitOriginInput.loading}>
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

							<div style={{ marginBottom: 16, marginTop: 16 }}>

						      	<InputGroup style={searchCls}>
						        	<Input
							        	addonBefore="user.name"
						        		value={props.sidebar.modifyGitConfigInput.userName}
						        		onPressEnter={leftSidebarProps.modifyGitOriginInput.onPressEnter}
						        		onChange={leftSidebarProps.modifyGitConfigInput.onChange}
						        	/>
						     	</InputGroup>

				        	</div>

				        	<div style={{ marginBottom: 16 }} >

						      	<InputGroup style={searchCls}>
						        	<Input
							        	addonBefore="user.email"
						        		value={props.sidebar.modifyGitConfigInput.email}
						        		onPressEnter={leftSidebarProps.modifyGitOriginInput.onPressEnter}
						        		onChange={leftSidebarProps.modifyGitConfigInput.onEmailChange}
						        	/>
						     	</InputGroup>

				        	</div>
				        	<div style={{ marginBottom: 16 }}   hidden={!props.sidebar.isHttp}>

						      	<InputGroup style={searchCls}>
						        	<Input
							        	addonBefore="user.password"
										type="password"
						        		value={props.sidebar.modifyGitConfigInput.password}
						        		onPressEnter={leftSidebarProps.modifyGitOriginInput.onPressEnter}
						        		onChange={leftSidebarProps.modifyGitConfigInput.onPasswordChange}
						        	/>
						     	</InputGroup>

				        	</div>
		    			</TabPane>
		    			<TabPane tab="SSH" key="2">
		    				<div style={{marginTop: 16}}>
			    				<h4>ssh可以让您免密码使用push操作，请按照以下方法配置SSH：</h4>
			    				<div style={{margin: 10}}>
				    				<ol>
				    					<li>1、点击查看公钥并将其配置到您的Git平台中即可</li>
				    					<li>2、开源中国（gitosc）官方说明：<a href="http://git.oschina.net/oschina/git-osc/wikis/%E5%B8%AE%E5%8A%A9" target="_blank">GitOSC ssh操作说明</a></li>
				    					<li>3、Github 官方说明：<a href="https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/" target="_blank">Github ssh操作说明</a></li>
				    				</ol>
			    				</div>
		    				</div>
		    			</TabPane>
						<TabPane tab="查看公钥" key="3">
		    				<div style={{marginTop: 16}}>
			    				<div style={{margin: 10}}>
									<Input type="textarea" readOnly rows={4} value={props.sidebar.sshKey}/>
			    				</div>
		    				</div>
		    			</TabPane>

		  			</Tabs>
				</Spin>
	        </Modal>

	        <Modal width="30%"  title="配置调试参数" visible={props.sidebar.debugConfig.showConfigModal}
	          	onOk={debugConfigModal.commitDebugConfigChange} onCancel={debugConfigModal.hideModal}
		    >
				<Spin spinning={props.sidebar.debugConfig.loading}>
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
				</Spin>
		    </Modal>

			<Modal width="30%"  title="您正在切换应用" visible={props.sidebar.wechatSaveShow}
	          	onOk={wechatSave.save} onCancel={wechatSave.hideModal}
		    >
				要保存您的设计吗？
		    </Modal>

		    <Dashboard></Dashboard>

	    	<Preview></Preview>

	    	<SaveAsTemplate></SaveAsTemplate>

	    	<TemplateStore></TemplateStore>

			<Modal width="30%"  title="意见建议" visible={props.sidebar.modalFeedback.visible}
	          	onOk={feedbackProps.submit} onCancel={feedbackProps.hideModal}
		    >
		    	<Input type="textarea" placeholder="请留下您的想法:)" value={props.sidebar.modalFeedback.message} rows={4} onChange={feedbackProps.onMsgChange} />
		    </Modal>

        </div>

	);

}

function mapStateToProps({ sidebar, editor, editorTop, rightbar, designer, attr ,devpanel, layout, cpre, vdpm, vdcore, vdCtrlTree}) {
  return { sidebar, editor, editorTop, rightbar, designer, attr ,devpanel, layout, cpre, vdpm, vdcore, vdCtrlTree};
}

export default connect(mapStateToProps)(LeftSidebar);
