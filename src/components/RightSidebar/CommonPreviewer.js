import React , { PropTypes } from 'react';
import { Menu, Icon, Dropdown, Button, Switch, Spin } from 'antd';
import { connect } from 'dva';

const CommonPreviewer = (props) => {

  const previewerProps = {

    handleInputChange(e) {
      props.dispatch({
        type: 'previewer/handleInputChange',
        payload: e.target.value
      })
    },

    handleBGClicked() {
      props.dispatch({
          type: 'devpanel/loadPreviewer',
          payload: false
      });
    },

    onFullscreenSwitchChange(checked) {
      props.dispatch({
          type: 'cpre/handleFullscreenSwitchChange',
          payload: checked
      });
    },

    reloadPreviewer () {
      props.dispatch({
          type: 'cpre/setLoading'
      });
      var gospelCommonPreviewer = window.frames['gospel-common-previewer'];
      gospelCommonPreviewer.location.reload();
    }

  };

  const designerProps = {

    onSelectDevice(val) {
      props.dispatch({
        type: 'designer/handleDeviceSelected',
        payload: val.key
      })
    }
  };

  const deviceMenuItem = props.designer.deviceList.map((device, index) => (
    <Menu.Item key={index}>{device.name}</Menu.Item>
  ));

  const deviceSelectedMenu = (
      <Menu onSelect={designerProps.onSelectDevice}>
        {deviceMenuItem}
      </Menu>
  );

  return (

    <div className="common-previewer-wrapper">

      <div className="designer-header" style={{height: '36px'}}>
        <Button style={{marginRight: '10px'}} onClick={previewerProps.reloadPreviewer} size="small" shape="circle" icon="reload" />

        <label className="bold" style={{lineHeight: '2.2'}}>占满屏幕：</label>
        <Switch onChange={previewerProps.onFullscreenSwitchChange} size="small" checked={props.cpre.fullscreen} />

        <span hidden={props.cpre.fullscreen} style={{marginLeft: '20px'}}>

          <label className="bold">大小：</label>

          <Dropdown overlay={deviceSelectedMenu} trigger={['click']}>
            <Button
              className="deviceSelectorBtn">
              {props.designer.deviceList[props.designer.defaultDevice].name} <Icon type="down" />
            </Button>
          </Dropdown>

        </span>

      </div>

      <div className="common-frame-wrapper">
        <Spin style={{position: 'absolute'}} spinning={!props.cpre.loaded}></Spin>
        <iframe 
          name="gospel-common-previewer" 
          width={props.cpre.fullscreen ? '100%' : props.designer.deviceList[props.designer.defaultDevice].width} 
          height={props.cpre.fullscreen ? '100%' : props.designer.deviceList[props.designer.defaultDevice].height} 
          className="designer-previewer common-previewer" 
          frameBorder="0" 
          src='static/commonPreviewer/previewer.html'
          >
        </iframe>

      </div>

    </div>

  );
};

// 指定订阅数据，这里关联了 indexPage
function mapStateToProps({ devpanel, designer, cpre }) {
  return { devpanel, designer, cpre };
}

export default connect(mapStateToProps)(CommonPreviewer);
