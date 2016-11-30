const keyConfig = {
	bindKey: [
		{
			mainKey: 'Ctrl',
			key: 'S',
			hander: function(props){
				const editorId = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].activeEditor.id;
				var content = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId].value;
				props.dispatch({
					type: 'file/writeFile',
					payload: {content}
				});
			}
		}
	],
	escape:[

	]
}
export default keyConfig;
