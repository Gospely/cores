import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover } from 'antd';

import SplitPane from 'react-split-pane';

const TabPane = Tabs.TabPane;

const DevPanel = ({ 
	splitType, onChange, onEdit, activeKey, panes, panels
}) => {

	const animated = false, 
		  defaultSize = '50%',

		  tabs = <Tabs
		        	onChange={onChange}
		        	activeKey={activeKey}
		        	type="editable-card"
		        	onEdit={onEdit}
		        	animated={animated}>
		        	{panels.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
		      	</Tabs>,

		  columnList = {
		  	'single': tabs,

		  	'vertical-dbl': <SplitPane split="vertical" defaultSize={defaultSize}>
  								{tabs}
  								{tabs}
		  					</SplitPane>,

		  	"horizontal-dbl": <SplitPane split="horizontal" defaultSize={defaultSize}>
  								{tabs}
  								{tabs}
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
