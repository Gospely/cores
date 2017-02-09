import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import VDAllPages from './VDAllPages.js';
import VDAddPages from './VDAddPages.js';

const TabPane = Tabs.TabPane;

const Component = (props) => {

  return (
  	<Tabs defaultActiveKey="pages">
    	<TabPane tab="全部" key="pages">
    		<VDAllPages></VDAllPages>
    	</TabPane>
    	<TabPane tab="添加" key="addpage">
    		<VDAddPages></VDAddPages>
    	</TabPane>
  	</Tabs>
  );

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(Component);