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
				//

				ctrlSelected() {
					props.dispatch({
						type: "vdCtrlTree/ctrlSelected",
						payload: data
					});
				},

				showErrorMessage() {
					message.error(data.errorMessage);
				},

				ctrlMovedAndDroped() {
					props.dispatch({
						type: "vdCtrlTree/ctrlMovedAndDroped",
						payload: data
					})

					$("#closeVDLeftPanel").css({zIndex: '-1'})

				},

				copyCtrl() {
					props.dispatch({
						type: "vdCtrlTree/copyCtrl",
						payload: data
					})
				},

				pastCtrl() {
					props.dispatch({
						type: "vdCtrlTree/pastCtrl",
						payload: data
					})
				},

				cutCtrl() {
					props.dispatch({
						type: "vdCtrlTree/cutCtrl"
					})
				},

				deleteCtrl() {
					props.dispatch({
						type: "vdCtrlTree/deleteCtrl",
						payload: {
							isFromFrames: true
						}
					})
				},

				keyDown() {
					let e = jQuery.Event("keydown");
				    e.keyCode = data; //enter key
				    jQuery(document).trigger(e);
				},

				ctrlDomPasted() {
					props.dispatch({
						type: 'vdanimations/handlePastCtrl',
						payload: data
					})
				}
			}

			for(var key in data) {
				eventName = key
			}

			if(evtAction[eventName]) {
				
				$("#closeVDLeftPanel").css({zIndex: '-1'})
				
				if(typeof data[eventName] != 'object') {
					data = JSON.parse(data[eventName]);
				}else {
					data = data[eventName];
				}
				evtAction[eventName]();
			}
		})

		window.addEventListener('message',function(e) {

			if(!e.data.fetchImgFromSrc) {
				return false;
			}

			window.handleStylesChange('background-image', {
				parent: 'background'
			}, {
				target: {
					value: e.data.fetchImgFromSrc.url
				}
			});

		});


	}

}
