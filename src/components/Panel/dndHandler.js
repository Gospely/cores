import fetch from 'dva/fetch';
import configs from '../../configs.js';
import initApplication from '../../utils/initApplication';
import { message, notification } from 'antd';

export default {
	init(props) {

		if(window.dndHandlerLoadedOnce) {
			return false;
		}

		window.dndHandlerLoadedOnce = true;

		//监听页面刷新，保存最新的UI状态
		window.addEventListener("beforeunload", (evt) => {


		});
		//监听关闭页面，保存ui状态
		window.addEventListener("unload", (evt) => {

			//todo

		});

		//监听页面加载，获取刷新前的页面状态
		window.addEventListener("load", (evt) => {

			var applicationId = window.applicationId;
			if(localStorage.applicationId != null && localStorage.applicationId != '' && applicationId == null){
				window.location.hash = 'project/' + localStorage.applicationId;
				applicationId = localStorage.applicationId;
			}
			if(applicationId != null && applicationId != undefined) {
				var url = configs.baseURL + "applications/" + applicationId;
				fetch(url).then(function(response){
					if (response.status >= 200 && response.status < 300) {
				    return response;
				  }
				  const error = new Error(response.statusText);
				  error.response = response;
				  openNotificationWithIcon('error', '出错了: ' + response.status, response.statusText);
				  throw error;
				})
		    	.then(function(response){
					return response.json();
				})
		    	.then(function(data){
					if(data.code == 200 || data.code == 1) {
				    	if(data.message != null) {
				      		message.success(data.message);
				    	}
				  	}else {
				    	if(typeof data.length == 'number') {
				      		return data;
				    	}
				    	openNotificationWithIcon('error', data.message, data.fields);
				  	}
					var application = data.fields;
					if(data.fields != null){
						initApplication(application,props);
					}else{
						localStorage.clear();
						window.location.href = window.location.origin;
					}

				});
			}

		});

		window.addEventListener("message", (evt) =>  {

			var data = evt.data,
				eventName = '';
			const evtAction = {

				pageSelected () {

				    props.dispatch({
				        type: 'rightbar/setActiveMenu',
				        payload: 'attr'
				    });

				    props.dispatch({
				        type: 'attr/setFormItemsByType',
				        payload: {
				          key: data.key,
				          type: 'page'
				        }
			      	});

				    props.dispatch({
				        type: 'designer/handleTreeChanged',
				        payload: {
				          key: data.key,
				          type: 'page'
				        }
				    });

				    props.dispatch({
				    	type: 'designer/handleCtrlSelected'
				    });
				},

				ctrlClicked () {

				    props.dispatch({
				        type: 'rightbar/setActiveMenu',
				        payload: 'attr'
				    });

				    props.dispatch({
				        type: 'attr/setFormItemsByType',
				        payload: {
				          key: data.key,
				          type: 'controller'
				        }
			      	});

				    props.dispatch({
				        type: 'designer/handleTreeChanged',
				        payload: {
				          key: data.key,
				          type: 'controller'
				        }
				    });

				    props.dispatch({
				    	type: 'designer/handleCtrlSelected'
				    });
				},

				ctrlUpdated () {

				},

				ctrlToBeAdded () {

					props.dispatch({
						type: 'rightbar/setActiveMenu',
						payload: 'attr'
					});

					props.dispatch({
						type: 'designer/addController',
						payload: data
					});

				    props.dispatch({
				        type: 'attr/setFormItemsByDefault'
				    });

				},

				ctrlRemoved () {
					props.dispatch({
						type: 'designer/removeController',
						payload: data
					});
				},

				attrChangeFromDrag () {
					props.dispatch({
						type: 'designer/attrChangeFromDrag',
						payload: data
					});
				},

				invalidDropArea () {
					message.error('非法的拖拽区域');
				},

				finishAppCreate () {
					//创建完应用，开始退出模态框
					props.dispatch({
        				type: 'sidebar/hideModalNewApp'
					})
					//修改url
					window.location.hash = 'project/' + data.application;
				},

				previewerLoaded () {
					props.dispatch({
						type: 'designer/handlePreviewerLayoutLoaded'
					});
				},

				tabBarAdded () {
					props.dispatch({
						type: 'designer/fakePageSelected'
					});
				},

				ctrlExchanged () {
					props.dispatch({
						type: 'designer/ctrlExchanged',
						payload: data
					})
				},
				deleteError () {
					message.error('该项不能删除');
				}


			}

			for(var key in data) {
				eventName = key
			}

			if(evtAction[eventName]) {

				if(typeof data[eventName] != 'object') {
					data = JSON.parse(data[eventName]);
				}else {
					data = data[eventName];
				}
				evtAction[eventName]();
			}

		});
	}

}
