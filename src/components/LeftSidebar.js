import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover } from 'antd';

import ConstructionTree from './RightSidebar/ConstructionTree';
import FileTree from './RightSidebar/FileTree';
import Controllers from './RightSidebar/Controllers';
import CloumnLayout from './RightSidebar/CloumnLayout';
import Attr from './RightSidebar/Attr';
import SettingPanel from './RightSidebar/SettingPanel';

const TabPane = Tabs.TabPane;

const RightSidebar = () => {

	var callback = function(key) {
		console.log(key);
	}

	var styles = {
		tab: {
			minHeight: '100vh'
		},

		icon: {
			marginRight: '0px',
			marginBottom: '8px'
		},

		span: {
		 	writingMode: 'tb-rl'
		}
	}

	return (
	  	<Tabs tabPosition="left" defaultActiveKey="controllers" onChange={callback}>
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="bars" />控件</span>} key="controllers">
	    		<Controllers></Controllers>
	    	</TabPane>
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="file-text" />结构</span>} key="Construction">
	    		<ConstructionTree></ConstructionTree>
	    	</TabPane>
	  	</Tabs>
	)

}

export default RightSidebar;