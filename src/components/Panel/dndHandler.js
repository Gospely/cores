
export default {
	init(props) {
		this.props = props;

		window.addEventListener("message", (event) =>  {
			console.log('previewPage receives message', event);

			const evtAction = {

				ctrlClicked () {


				},

				ctrlDragging () {

				},

				ctrlDragover () {

				},

				ctrlRefreshed () {

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

			evtAction[event]();
		});
	}

}