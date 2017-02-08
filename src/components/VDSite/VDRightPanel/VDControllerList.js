import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

const TabPane = Tabs.TabPane;

const Component = (props) => {

  return (
  	<Tabs defaultActiveKey="1">
    	<TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
    	<TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
  	</Tabs>
  );

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(Component);