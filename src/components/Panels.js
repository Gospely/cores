import React , {PropTypes} from 'react';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

const tabs = () => {

	var callback = function(key) {
		console.log(key);
	}

	return (
	  	<Tabs  tabPosition="right" defaultActiveKey="1" onChange={callback}>
	    	<TabPane tab="控件" key="1">Content of Tab Pane 1</TabPane>
	    	<TabPane tab="控件树" key="2">Content of Tab Pane 2</TabPane>
	    	<TabPane tab="文件" key="3">Content of Tab Pane 3</TabPane>
	  	</Tabs>
	)

}

export default tabs;