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
import MessageHandeler from '../MessageHandeler.js';

const TabPane = Tabs.TabPane;

let flag = false;
        // <TabPane tab={
        //   <Tooltip placement="bottom" title="样式管理">
        //     <Icon type="exception" />
        //   </Tooltip>} key="styles-manager">
        //   <VDStyleManager></VDStyleManager>
        // </TabPane>

const VDRightPanel = (props) => {

    if (!flag) {
      MessageHandeler.init(props);
    }

    flag = true;

  return (
    <div className="vd-right-panel">

      <Tabs activeKey={props.vdcore.rightTabsPane.activeTabsPane}>

        <TabPane tab={
          <Tooltip placement="bottom" title="样式">
            <Icon type="edit" />
          </Tooltip>} key='style'>
          <VDStylePanel></VDStylePanel>
        </TabPane>

        <TabPane tab={
          <Tooltip placement="bottom" title="组件设置">
            <Icon type="setting" />
          </Tooltip>} key='settings'>
          <VDSettingPanel></VDSettingPanel>
        </TabPane>

        <TabPane tab={
          <Tooltip placement="bottom" title="组件树">
            <Icon type="bars" />
          </Tooltip>} key='controllers'>
          <VDControllerList></VDControllerList>
        </TabPane>

        <TabPane tab={
          <Tooltip placement="bottom" title="交互动画">
            <Icon type="inbox" />
          </Tooltip>} key='interactions'>
          <VDInteractions></VDInteractions>
        </TabPane>

        <TabPane tab={
          <Tooltip placement="bottom" title="资源文件">
            <Icon type="picture" />
          </Tooltip>} key='assets'>
          <VDAssets></VDAssets>
        </TabPane>
      </Tabs>
    </div>
  );

};

function mapSateToProps({ vdCtrlTree, elemAdded, vdcore}) {
  return { vdCtrlTree, elemAdded, vdcore};
}

export default connect(mapSateToProps)(VDRightPanel);