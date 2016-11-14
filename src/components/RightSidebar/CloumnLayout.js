import React , { PropTypes } from 'react';
import { Menu, Icon } from 'antd';
import { connect } from 'dva';

const ColumnLayout = (props) => {

  console.log(props);

  const rightColumnProps = {
    current: props.layout.current,

    handleClick: function(e) {
      props.dispatch({
        type: 'layout/handleClick',
        payload: e.key
      });

      props.dispatch({
        type: 'devpanel/changeColumn',
        payload: e.key
      })
    }
  }

  console.log(rightColumnProps);

  return (
    <div className="rightColumn">

      <Menu onClick={rightColumnProps.handleClick}
        style={{ width: '100%' }}
        selectedKeys={[rightColumnProps.current]}
        mode="inline"
      >
        <Menu.Item key="single">
          <span>单栏布局</span>
        </Menu.Item>
        <Menu.Item key="vertical-dbl">
          <span>垂直双栏布局</span>
        </Menu.Item>
        <Menu.Item key="horizontal-dbl">
          <span>水平双栏布局</span>
        </Menu.Item>
        <Menu.Item key="grid">
          <span>网格布局</span>
        </Menu.Item>
        
      </Menu>

    </div>
  );
};

// 指定订阅数据，这里关联了 indexPage
function mapStateToProps({ layout }) {
  return {layout};
}

export default connect(mapStateToProps)(ColumnLayout);
