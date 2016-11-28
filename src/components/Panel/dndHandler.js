
export default {
	init(props) {
		this.props = props;

		window.addEventListener("message", (event) =>  {
			console.log('previewPage receives message', event);

			const evtAction = {

				ctrlClicked () {

				},

				ctrlDragover () {

				},

				attrRefreshed () {

				},

				attrSelected () {

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

				},

				pageClicked () {

				},

				pageRemoved () {

				},

				pageAdded () {
					
				}

			}

			evtAction[event]();
		});
	}

}