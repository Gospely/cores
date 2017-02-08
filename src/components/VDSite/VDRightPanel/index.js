import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
const TabPane = Tabs.TabPane;

const VDRightPanel = (props) => {

  return (
    <div className="vd-right-panel">
      <Tabs defaultActiveKey="styles">
        <TabPane tab={<Icon type="edit" />} key="styles">Content of tab 1</TabPane>
        <TabPane tab={<Icon type="setting" />} key="settings">Content of tab 2</TabPane>
        <TabPane tab={<Icon type="bars" />} key="controllers">Content of tab 3</TabPane>
        <TabPane tab={<Icon type="exception" />} key="styles-manager">Content of tab 4</TabPane>
        <TabPane tab={<Icon type="switcher" />} key="interactions">Content of tab 5</TabPane>
        <TabPane tab={<Icon type="picture" />} key="assets">Content of tab 6</TabPane>
      </Tabs>
    </div>
  );

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(VDRightPanel);