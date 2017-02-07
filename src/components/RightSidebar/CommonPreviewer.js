import React , { PropTypes } from 'react';
import { Menu, Icon, Dropdown, Button, Switch } from 'antd';
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

      <div className="designer-header">
        <label className="bold">大小：</label>

        <Dropdown overlay={deviceSelectedMenu} trigger={['click']}>
          <Button
            className="deviceSelectorBtn">
            {props.designer.deviceList[props.designer.defaultDevice].name} <Icon type="down" />
          </Button>
        </Dropdown>

        <label className="bold">占满屏幕：</label>
        <Switch size="small" />

      </div>

      <iframe 
        name="gospel-common-previewer" 
        width={props.designer.deviceList[props.designer.defaultDevice].width} 
        height={props.designer.deviceList[props.designer.defaultDevice].height} 
        className="designer-previewer common-previewer" 
        frameBorder="0" 
        src={'http://' + localStorage.domain}
        >
      </iframe>

    </div>

  );
};

// 指定订阅数据，这里关联了 indexPage
function mapStateToProps({ devpanel, designer }) {
  return { devpanel, designer };
}

export default connect(mapStateToProps)(CommonPreviewer);
