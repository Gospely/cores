import React , { PropTypes } from 'react';
import { Menu, Icon } from 'antd';
import { connect } from 'dva';

const ColumnLayout = (props) => {

  const rightColumnProps = {
    current: props.layout.current,
    columnsType: props.layout.columnsType,

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

  return (
    <div className="rightColumn">

      <Menu onClick={rightColumnProps.handleClick}
        style={{ width: '100%' }}
        selectedKeys={[rightColumnProps.current]}
        mode="inline"
      >
        {rightColumnProps.columnsType.map(type => <Menu.Item key={type.name}><span>{type.alias}</span></Menu.Item>)}

      </Menu>

    </div>
  );
};

// 指定订阅数据，这里关联了 indexPage
function mapStateToProps({ layout }) {
  return {layout};
}

export default connect(mapStateToProps)(ColumnLayout);
