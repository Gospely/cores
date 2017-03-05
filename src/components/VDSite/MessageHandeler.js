import { message } from 'antd';
export default {
	init(props) {
		window.addEventListener("message", (evt) => {
			let data = evt.data,
				eventName = '';
			const evtAction = {

				generateCtrlTree() {
					props.dispatch({
						type: "vdCtrlTree/generateCtrlTree",
						payload: data
					})
					$(".LeftSidebar.vdsite>.ant-tabs>.ant-tabs-content").css({
	        			width: '0px'
	        		})
				},

				// elemAdded() {
				// 	props.dispatch({
				// 		type: "vdpm/elemAdded",
				// 		payload: data
				// 	})
				// },

				ctrlSelected() {
					props.dispatch({
						type: "vdCtrlTree/ctrlSelected",
						payload: data
					});
				},

				ctrlMovedAndDroped() {
					props.dispatch({
						type: "vdCtrlTree/ctrlMovedAndDroped",
						payload: data
					})
				},

				showErrorMessage() {
					message.error(data.errorMessage, 2.5)
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
		})
	}
}
