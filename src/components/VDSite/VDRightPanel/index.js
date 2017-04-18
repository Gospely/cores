
import React, {PropTypes} from 'react';
import {connect} from 'dva';

import {Button,Modal,Spin} from 'antd';
import {Tabs,Icon} from 'antd';
import {Tooltip} from 'antd';

import VDAssets from './VDAssets.js';
import VDControllerList from './VDControllerList.js';
import VDInteractions from './VDInteractions.js';
import VDSettingPanel from './VDSettingPanel.js';
import VDStyleManager from './VDStyleManager.js';
import VDStylePanel from './VDStylePanel.js';
import MessageHandeler from '../MessageHandeler.js';

const TabPane = Tabs.TabPane;

let flag = false;

const VDRightPanel = (props) => {

  if (!flag) {
    MessageHandeler.init(props);
  }

  flag = true;

  const onTabClick = () => {

    // spinning = false;

  }

  const onChange = (key) => {

    props.dispatch({
      type: 'vdstyles/changeVDStylePaneSpinActive',
      payload: true
    })
    if((key == 'assets' && props.vdassets.fileList.length ==0) || (key == 'settings' && props.vdassets.fileList.length ==0)){
        props.dispatch({
            type: 'vdassets/fetchFileList'
        })
    }
    // setTimeout(function () {
      props.dispatch({
        type: 'vdcore/changeTabsPane',
        payload: {
          activeTabsPane: key,
          linkTo: false,
        }
      });

      if (key == 'controllers') {
        props.dispatch({
          type: 'vdCtrlTree/changeVDControllerListScroll',
          payload: 'hidden'
        })

        setTimeout(function() {
          props.dispatch({
            type: 'vdCtrlTree/changeVDControllerListScroll',
            payload: 'auto'
          })
        }, 1000)

      } else {
        props.dispatch({
          type: 'vdCtrlTree/changeVDControllerListScroll',
          payload: 'hidden'
        })
      }
    // }, 1)


    // setTimeout(function () {
      props.dispatch({
        type: 'vdstyles/changeVDStylePaneSpinActive',
        payload: false
      })
    // }, 1)
  }

  return (
    <Spin spinning={props.vdstyles.VDStylePaneSpinActive}>
      <div id="VDRightPanel" className="vd-right-panel">

        <Tabs onTabClick={onTabClick} onChange={onChange} activeKey={props.vdcore.rightTabsPane.activeTabsPane}>

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

          <TabPane style={{overflow: props.vdCtrlTree.VDControllerListScroll}} tab={
            <Tooltip placement="bottom" title="组件树">
              <Icon type="bars" />
            </Tooltip>} key='controllers'>
            <VDControllerList></VDControllerList>
          </TabPane>

          <TabPane tab={
            <Tooltip placement="bottom" title="样式管理">
              <Icon type="exception" />
            </Tooltip>} key="styles-manager">
            <VDStyleManager></VDStyleManager>
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
    </Spin>
  );

};

function mapSateToProps({vdCtrlTree, elemAdded, vdcore, vdstyles, vdassets}) {
  return { vdCtrlTree,elemAdded, vdcore, vdstyles, vdassets };
}

export default connect(mapSateToProps)(VDRightPanel);
