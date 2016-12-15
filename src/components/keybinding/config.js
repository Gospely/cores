const keyConfig = {
	bindKey: [
		{
			mainKey: ['ctrl+s','command+s'],
			handler: function(props){
				console.log(props);
				var activePane = props.devpanel.panels.panes[props.devpanel.panels.activePane.key],
				tabKey = activePane.activeTab.key,
				editorId = activePane.tabs[tabKey-1].editorId,
				paneKey = props.devpanel.panels.activePane.key,
				isSave = activePane.tabs[tabKey-1].isSave;
				console.log(isSave);
				console.log(tabKey);
				console.log(activePane.tabs[tabKey-1]);
				if(isSave == false) {
					console.log('command');
					var content = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId].value;

					var fileName = activePane.tabs[tabKey-1].title.replace(localStorage.currentProject,localStorage.dir)
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
							payload: {content,tabKey: tabKey,paneKey:paneKey,fileName: fileName}
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
		},
		{
			mainKey: ['ctrl+p','command+p'],
			handler: function(props){

				var name = 'file';
				props.dispatch({
					type: 'rightbar/handleTabChanged',
					payload: name
				});
				props.dispatch({
					type: 'file/handleSearch',
					payload:{ value: '' }
				});
			}
		},
		{
			mainKey: ['esc'],
			handler: function(props){

				props.dispatch({
		      type: 'file/hideSearchPane'
		    })
			}
		},
	],
	escape:[

	]
}
export default keyConfig;
