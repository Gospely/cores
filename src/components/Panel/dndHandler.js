
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

				ctrlAdded () {

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
				data = JSON.parse(data[key]);
				evtAction[eventName]();
			}

		});
	}

}