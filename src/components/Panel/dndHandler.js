
export default {
	init(props) {
		this.props = props;

		window.addEventListener("message", (evt) =>  {

			var data = evt.data, 
				eventName = '';

			const evtAction = {

				ctrlClicked () {
					console.log(eventName, data);
				},

				ctrlEdited () {

				},

				ctrlAdded () {

					console.log('ctrlAdded', data);

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