import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import VDAssets from './VDAssets.js';
import VDControllerList from './VDControllerList.js';
import VDInteractions from './VDInteractions.js';
import VDSettingPanel from './VDSettingPanel.js';
import VDStyleManager from './VDStyleManager.js';
import VDStylePanel from './VDStylePanel.js';

const TabPane = Tabs.TabPane;

        // <TabPane tab={
        //   <Tooltip placement="bottom" title="样式管理">
        //     <Icon type="exception" />
        //   </Tooltip>} key="styles-manager">
        //   <VDStyleManager></VDStyleManager>
        // </TabPane>

const VDRightPanel = (props) => {

  return (
    <div className="vd-right-panel">
      <Tabs defaultActiveKey="styles">

        <TabPane tab={
          <Tooltip placement="bottom" title="样式">
            <Icon type="edit" />
          </Tooltip>} key="styles">
          <VDStylePanel></VDStylePanel>
        </TabPane>

        <TabPane tab={
          <Tooltip placement="bottom" title="组件设置">
            <Icon type="setting" />
          </Tooltip>} key="settings">
          <VDSettingPanel></VDSettingPanel>
        </TabPane>

        <TabPane tab={
          <Tooltip placement="bottom" title="组件树">
            <Icon type="bars" />
          </Tooltip>} key="controllers">
          <VDControllerList></VDControllerList>
        </TabPane>

        <TabPane tab={
          <Tooltip placement="bottom" title="交互动画">
            <Icon type="inbox" />
          </Tooltip>} key="interactions">
          <VDInteractions></VDInteractions>
        </TabPane>

        <TabPane tab={
          <Tooltip placement="bottom" title="资源文件">
            <Icon type="picture" />
          </Tooltip>} key="assets">
          <VDAssets></VDAssets>
        </TabPane>
      </Tabs>
    </div>
  );

};

function mapSateToProps({ vdCtrlTree }) {
  return { vdCtrlTree };
}

export default connect(mapSateToProps)(VDRightPanel);