import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import VDCtrl from './VDCtrl.js';
import VDSymbol from './VDSymbol.js';

const TabPane = Tabs.TabPane;

const Component = (props) => {

  return (
  	<Tabs defaultActiveKey="ctrl">
    	<TabPane tab="控件" key="ctrl">
    		<VDCtrl></VDCtrl>
    	</TabPane>
    	<TabPane tab="自定义组件" key="symbol">
    		<VDSymbol></VDSymbol>
    	</TabPane>
  	</Tabs>
  );

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(Component);
