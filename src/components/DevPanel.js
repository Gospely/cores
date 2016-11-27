import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover } from 'antd';

import SplitPane from 'react-split-pane';

import CodingEditor from './Panel/Editor.js';
import Terminal from './Panel/Terminal.js';
import Designer from './Panel/Designer.js';

const TabPane = Tabs.TabPane;

const DevPanel = ({
	splitType, onChange, onEdit, panes, panels, onChangePane
}) => {

	let genterTypeOfTabPane = {
		editor: function(params) {
			return (
				<CodingEditor editorId={params.editorId}>></CodingEditor>
			);
		},
		terminal: function() {
			return (
				<Terminal></Terminal>
			);
		},
		designer: function() {
			return (
				<Designer></Designer>
			);
		},
		welcome: function (params) {
			return params.content;
		}
	}

	const generatorTabPanes = (panes) => {

		return panes.map(pane => {

			let params = {
				content: pane.content || '',
				editorId: pane.editorId || ''
			}
			return <TabPane tab={pane.title} key={pane.key}>{genterTypeOfTabPane[pane.type](params)}</TabPane>;
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
			pane.push(<div onClick={onChangePane.bind(this,panes.key)} key={panes.key}>{generatorTabs(onChange, activeKey, onEdit, animated, tabPanes)}</div>);
		});

		console.log('pane', pane);
		return pane;
	};

	const animated = false,
		  defaultSize = '50%',

		  tabs = <Tabs
		        	onChange={onChange}
		        	// activeKey={activeKey}
		        	type="editable-card"
		        	onEdit={onEdit}
		        	animated={animated}>
		        	{panels.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
		      	</Tabs>,

		  columnList = {
		  	'single': generatorPanes(panels.panes),

		  	'vertical-dbl': <SplitPane split="vertical" defaultSize={defaultSize}>
  								{generatorPanes(panels.panes)}
		  					</SplitPane>,

		  	"horizontal-dbl": <SplitPane split="horizontal" defaultSize={defaultSize}>
  								{generatorPanes(panels.panes)}
		  					</SplitPane>,

		  	'grid': <SplitPane split="vertical" defaultSize={defaultSize}>
		  				<SplitPane split="horizontal" defaultSize={defaultSize}>
							{tabs}
							{tabs}
	  					</SplitPane>
	  					<SplitPane split="horizontal" defaultSize={defaultSize}>
							{tabs}
							{tabs}
	  					</SplitPane>
  					</SplitPane>
		  };

	return (
		<div>
			{columnList[splitType]}
		</div>
	)

}

export default DevPanel;
