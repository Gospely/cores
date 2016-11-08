import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover } from 'antd';

// import CodingPanel from './Panel/CodingPanel';
// import TerminalPanel from './Panel/TerminalPanel';

const TabPane = Tabs.TabPane;

const DevPanel = () => {

	var onChange = function(key) {
		console.log(key);
	}

	var onEdit = function(key) {

	}

	const panes = [
		{ title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
      	{ title: 'Tab 2', content: 'Content of Tab 2', key: '2' }
    ];

    var activeKey = panes[0].key;

	return (
      	<Tabs
        	onChange={onChange}
        	activeKey={activeKey}
        	type="editable-card"
        	onEdit={onEdit}>

        	{panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}

      	</Tabs>
	)

}

export default DevPanel;