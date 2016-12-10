
import { message, notification } from 'antd';

export default {
	init(props) {

		if(window.loadedOnce) {
			return false;
		}

		console.log('======================window.loadedOnce======================', window.loadedOnce);

		window.loadedOnce = true;

		//监听页面刷新，保存最新的UI状态
		window.addEventListener("beforeunload",(evt) =>{

			var state = {
				applicationId: localStorage.applicationId,
				UIState: props.devpanel,
			};
			localStorage.UIState = JSON.stringify(state,function(key,value){
				if(key == 'content' || key == 'value'){
					return undefined
				}else{
					return value;
				}
			});
		});
		//监听关闭页面，保存ui状态
		window.addEventListener("unload",(evt) =>{

			//todo
		});

		//监听页面加载，获取刷新前的页面状态
		window.addEventListener("load",(evt) =>{

			console.log("=========================onLoad=================");
			props.dispatch({
				type: 'file/fetchFileList'
			});
			props.dispatch({
				type: 'file/initFiles',
			});
			props.dispatch({
				type: 'UIState/readConfig',
				payload: {
					id: localStorage.applicationId
				}
			});
			props.dispatch({
				type: 'devpanel/getConfig',
				payload: { id : localStorage.applicationId}
			});
			props.dispatch({
				type: 'devpanel/handleImages',
				payload: { id : localStorage.image}
			});
			props.dispatch({
          type: 'sidebar/hideModalSwitchApp'
      });
			props.dispatch({
       type: 'devpanel/startDocker',
       payload: { id: localStorage.applicationId}
     	});
     	props.dispatch({
       type: 'devpanel/openTerminal',
       payload: { id:  localStorage.terminal}
     	});
		});
		window.addEventListener("message", (evt) =>  {
			var data = evt.data,
				eventName = '';
			const evtAction = {

				ctrlClicked () {
					console.log(eventName, data);

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
				    })

				    props.dispatch({
				    	type: 'designer/handleCtrlSelected'
				    });

				},

				ctrlEdited () {
					console.log(eventName,data);
				},

				ctrlToBeAdded () {

					console.log('ctrlToBeAdded', data);

					props.dispatch({
						type: 'rightbar/setActiveMenu',
						payload: 'attr'
					});

					props.dispatch({
						type: 'designer/addController',
						payload: dndData
					});

				    props.dispatch({
				        type: 'attr/setFormItemsByDefault'
				    });

				},

				ctrlRemoved () {
					console.log(eventName, data);
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
					window.location.href = 'http://localhost:8989/#/project/' + data.application;
					console.log("===================finishAppCreate===============");
					console.log(data);
				}

			}

			for(var key in data) {
				eventName = key
			}

			if(evtAction[eventName]) {

				console.log('typeof', typeof data[eventName]);

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
