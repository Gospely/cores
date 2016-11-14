import React , {PropTypes} from 'react';
import { Menu, Icon } from 'antd';

const ColumnLayout = React.createClass({
  getInitialState() {
    return {
      current: '1',
    };
  },

  handleClick(e) {
    console.log('click ', e, this.props.dispatch);
    this.setState({
      current: e.key,
    });
  },
  
  render() {
    return (
      <div className="rightColumn">

        <Menu onClick={this.handleClick}
          style={{ width: '100%' }}
          selectedKeys={[this.state.current]}
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
  },
});

export default ColumnLayout;
