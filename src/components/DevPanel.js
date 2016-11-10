import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover } from 'antd';

// import CodingPanel from './Panel/CodingPanel';
// import TerminalPanel from './Panel/TerminalPanel';

const TabPane = Tabs.TabPane;

const DevPanel = ({ 
	panes, activeKey, onChange, onEdit 
}) => {

	const animated = false;

	return (
      	<Tabs
        	onChange={onChange}
        	activeKey={activeKey}
        	type="editable-card"
        	onEdit={onEdit}
        	animated={animated}>

        	{panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}

      	</Tabs>
	)

}

export default DevPanel;
