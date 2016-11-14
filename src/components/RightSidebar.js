import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover } from 'antd';

import ConstructionTree from './RightSidebar/ConstructionTree';
import FileTree from './RightSidebar/FileTree';
import Controllers from './RightSidebar/Controllers';
import CloumnLayout from './RightSidebar/CloumnLayout';

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
	  	<Tabs tabPosition="right" defaultActiveKey="1" onChange={callback}>
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="bars" />控件</span>} key="1">
	    		<Controllers></Controllers>
	    	</TabPane>
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="file-text" />结构</span>} key="2">
	    		<ConstructionTree></ConstructionTree>
	    	</TabPane>
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="file-text" />文件</span>} key="3">
	    		<FileTree></FileTree>
	    	</TabPane>
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="eye-o" />布局</span>} key="4">
	    		<CloumnLayout></CloumnLayout>
	    	</TabPane>	    	
	  	</Tabs>
	)

}

export default RightSidebar;