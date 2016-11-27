import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover } from 'antd';

import SplitPane from 'react-split-pane';

const TabPane = Tabs.TabPane;

const styles = {
	paneWrapper: {
		width: '100%'
	}
}

const DevPanel = ({
	splitType, onChange, onEdit, panes, panels, onChangePane
}) => {

	const generatorTabPanes = (panes) => {

		return panes.map(pane => {

			let params = {
				content: pane.content || '',
				editorId: pane.editorId || ''
			}
			return <TabPane tab={pane.title} key={pane.key}>{genterTypeOfTabPane[pane.type](params)}</TabPane>;
			//return <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>;
		});
	};

	const generatorTabs = (onChange, activeKey, onEdit, animated, tabPane) => {
		return (
			<Tabs
	        	onChange={onChange}
	        	activeKey={activeKey}
	        	type="editable-card"
	        	onEdit={onEdit}
	        	animated={animated}>
	        	{tabPane}
	      	</Tabs>
		);
	};

	const generatorPanes = (panels) => {
		var pane = [];

		panels.map(panes => {
			var tabPanes = generatorTabPanes(panes.tabs);
			console.log(tabPanes);
			const activeKey = panes.activeTab.key;
			pane.push(<div style={styles.paneWrapper} onClick={onChangePane.bind(this,panes.key)} key={panes.key}>{generatorTabs(onChange, activeKey, onEdit, animated, tabPanes)}</div>);
		});

		console.log('pane', pane);
		return pane;
	};

	const animated = false,
		  defaultSize = '50%',

		  // tabs = <Tabs
		  //       	onChange={onChange}
		  //       	// activeKey={activeKey}
		  //       	type="editable-card"
		  //       	onEdit={onEdit}
		  //       	animated={animated}>
		  //       	{panels.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
		  //     	</Tabs>,

		  columnList = {
		  	'single': function() {
		  		return generatorPanes(panels.panes)
		  	},

		  	'vertical-dbl': function() {
		  		return 	(<SplitPane split="vertical" defaultSize={defaultSize}>
  							{generatorPanes(panels.panes)}
		  				</SplitPane>)
		  	},

		  	"horizontal-dbl": function() {
		  		return (<SplitPane split="horizontal" defaultSize={defaultSize}>
  							{generatorPanes(panels.panes)}
		  				</SplitPane>)
		  	},

		  	'grid': function () {
		  		let gridPanes = generatorPanes(panels.panes);
		  		console.log('grid:',gridPanes)
				return	(<SplitPane split="vertical" defaultSize={defaultSize}>
		  					<SplitPane split="horizontal" defaultSize={defaultSize}>
								{gridPanes[0]}
								{gridPanes[1]}
							</SplitPane>
							<SplitPane split="horizontal" defaultSize={defaultSize}>
								{gridPanes[2]}
								{gridPanes[3]}
							</SplitPane>
						</SplitPane>)
		  	}
		  };

	return (
		<div>
			{columnList[splitType]()}
		</div>
	)

}

export default DevPanel;
