import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover } from 'antd';

import SplitPane from 'react-split-pane';

const TabPane = Tabs.TabPane;

const DevPanel = ({ 
	panes, activeKey, onChange, onEdit 
}) => {

	const animated = false;

	var defaultSize = '50%';

	return (
		<div>
			<SplitPane split="horizontal" defaultSize={defaultSize}>
		      	<Tabs
		        	onChange={onChange}
		        	activeKey={activeKey}
		        	type="editable-card"
		        	onEdit={onEdit}
		        	animated={animated}>
		        	{panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
		      	</Tabs>

		      	<SplitPane split="vertical" defaultSize={defaultSize}>

			      	<Tabs
			        	onChange={onChange}
			        	activeKey={activeKey}
			        	type="editable-card"
			        	onEdit={onEdit}
			        	animated={animated}>
			        	{panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
			      	</Tabs>

			      	<Tabs
			        	onChange={onChange}
			        	activeKey={activeKey}
			        	type="editable-card"
			        	onEdit={onEdit}
			        	animated={animated}>
			        	{panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
			      	</Tabs>

		      	</SplitPane>
			</SplitPane>
		</div>
	)

}

export default DevPanel;
