import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip, Collapse } from 'antd';

import VDAllPages from './VDAllPages.js';
import VDPageManager from './VDPageManager.js';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

const Component = (props) => {

  return (
	<div className="vdctrl-pane-wrapper vdpage-pane-wrapper">
		<Collapse bordered={false} defaultActiveKey={['page-manager', 'page-list']}>
		    <Panel header="页面管理" key="page-manager">
		      	<VDPageManager></VDPageManager>
		    </Panel>
		    <Panel header="页面列表" key="page-list">
				<VDAllPages></VDAllPages>
		    </Panel>
		</Collapse>
	</div>
  );

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(Component);