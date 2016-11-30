const keyConfig = {
	bindKey: [
		{
			mainKey: 'Ctrl',
			key: 'S',
			hander: function(props){
				console.log(props);
				var activePane = props.devpanel.panels.panes[props.devpanel.panels.activePane.key],
				editorId = activePane.activeEditor.id,
				tabKey = activePane.activeTab.key,
				paneKey = props.devpanel.panels.activePane.key,
				isSave = activePane.tabs[tabKey-1].isSave;
				console.log(isSave);
				console.log(tabKey);
				if(isSave == false) {
					console.log('command');
					var content = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId].value;
					var fileName =  localStorage.currentSelectedFile;
					console.log(fileName);
					if(fileName == '新标签页' || fileName == '新文件' || fileName == undefined) {

						var type = 'editor';
						props.dispatch({
							type: 'file/showNewFileNameModal',
							payload: {type}
						});
					}else{
						props.dispatch({
							type: 'file/writeFile',
							payload: {content,tabKey: tabKey,paneKey:paneKey}
						});
						props.dispatch({
							type: 'devpanel/handleFileSave',
							payload: {
								tabKey: tabKey, pane: paneKey
							}
						});
					}
				}
			}
		}
	],
	escape:[

	]
}
export default keyConfig;
