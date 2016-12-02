import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover } from 'antd';

import SplitPane from 'react-split-pane';

import CodingEditor from './Panel/Editor.js';
import Terminal from './Panel/Terminal.js';
import Designer from './Panel/Designer.js';
import Previewer from './Panel/Previewer.js';
import Welcome from '../components/Panel/Welcome.js';
import NoTabs from '../components/Panel/NoTabs.js';

const TabPane = Tabs.TabPane;

const styles = {
	paneWrapper: {
		width: '100%'
	}
}

const DevPanel = ({
	splitType, onChange, onEdit, panes, panels, onChangePane
}) => {

	const currentDevType = {
		editor: function(params) {
			console.log(params);
			return (
				<CodingEditor searchVisible={params.searchVisible}
				 editorId={params.editorId} belongTo={params.belongTo}
				 isSave={params.isSave} tabKey={params.tabKey}
				 >
				</CodingEditor>
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

		welcome: function() {
			return (
				<Welcome></Welcome>
			);
		},

		NoTabs: function() {
			return (
				<NoTabs></NoTabs>
			);
		},
		previewer: function () {
			return(
				<Previewer></Previewer>
			)
		}
	}

	const generatorTabPanes = (panes, belongTo) => {

		return panes.map(pane => {
			let params = {
				content: pane.content || '//To Do',
				editorId: pane.editorId,
				fileName: pane.title,
				belongTo: belongTo || 0,
				searchVisible: pane.searchVisible || false,
				isSave: pane.isSave || false,
				tabKey: pane.key
			}
			return <TabPane tab={pane.title} key={pane.key}>{currentDevType[pane.type](params)}</TabPane>;
		});
	};

	const generatorTabs = (onChange, activeKey, onEdit, animated, tabPane, paneKey) => {
		return (
			<Tabs
	        	onChange={onChange.bind(this,{paneKey})}
	        	activeKey={activeKey}
	        	type="editable-card"
	        	onEdit={onEdit.bind(this,{paneKey})}
	        	animated={animated}>
	        	{tabPane}
	      	</Tabs>
		);
	};

	const generatorPanes = (panels) => {
		var pane = [];

		panels.map(panes => {
			var tabPanes = generatorTabPanes(panes.tabs,panes.key);
			console.log(tabPanes);
			const activeKey = panes.activeTab.key;
			const paneKey = panes.key;
			pane.push(<div style={styles.paneWrapper} onClick={onChangePane.bind(this,panes.key)} key={paneKey}>
						{generatorTabs(onChange, activeKey, onEdit, animated, tabPanes, paneKey)}
					  </div>);
		});

		// console.log('pane', pane);
		return pane;
	};

	const animated = false,
		  defaultSize = '50%',
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
