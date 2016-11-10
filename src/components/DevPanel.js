import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover } from 'antd';

// import CodingPanel from './Panel/CodingPanel';
// import TerminalPanel from './Panel/TerminalPanel';

const TabPane = Tabs.TabPane;

const DevPanel = ({ 
	panes, activeKey, onChange, onEdit 
}) => {

	// var onChange = function(key) {
	// 	console.log(key);
	// 	activeKey = key;
	// }

	// const panes = [

	// 	{ title: 'Tab 1', content:   
	// 						<AceEditor
	// 						    mode="javascript"
	// 						    theme="github"
	// 						    width="100%"
	// 						    height="96vh"
	// 						    onChange={onChange}
	// 						    className={PanelStyle.aceEditor}
	// 						    name="UNIQUE_ID_OF_DIV"
	// 						    editorProps={{$blockScrolling: true}} />, 
  	
 //  		key: '1' },

 //      	{ title: 'Tab 2', content: 'Content of Tab 2', key: '2' }
 //    ];

 //    var activeKey = panes[0].key,
 //    	styles = {

 //    	};

	// var onEdit = function(key) {

	// }

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
