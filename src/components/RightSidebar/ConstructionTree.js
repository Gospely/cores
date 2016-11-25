import React , {PropTypes} from 'react';
import { Tree, Tooltip, Popover, Icon, Row, Col, Button, Card, Menu } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import TreeStyle from './styles.css';
import EditorStyle from '../Panel/Editor.css';

const TreeNode = Tree.TreeNode;

const ConstructionTree = () => {

	var onSelect = function () {

	}

	var onCheck = function() {

	}

  // const pageMenuProps = {
  //   onClick: function(item) {

  //     var action = {
  //       blank () {

  //       },

  //       'login-page' () {

  //       },

  //       'register-page' () {

  //       }
  //     }

  //     action[item.key]();

  //   }
  // }  

  // const pageMenu = (
  //   <Menu {...pageMenuProps} className="context-menu">
  //     <Menu.Item key="blank">空白页面</Menu.Item>
  //     <Menu.Item key="login-page">登录页面</Menu.Item>
  //     <Menu.Item key="register-page">注册页面</Menu.Item>
  //   </Menu>
  // );

  const addPagePop = {
    title: '添加页面',
    content: (
      <div>
        <Row gutter={16} type="flex" justify="space-around" align="middle">
          <Col span={12}>
            <Card loading title="空白页面">
              空白页面
            </Card>
          </Col>
          <Col span={12}>
            <Card loading title="登录页面">
              空白页面
            </Card>
          </Col>       
        </Row>     
      </div>
    ),

    overlayStyle: {
      width: '50%'
    }
  }

	return (

    <div>

      <div className={TreeStyle.header}>

        <Row>
          <Col span={24}>
              <Popover placement="bottom" {...addPagePop} trigger="click">
                <Button className={TreeStyle.topbarBtnCons}><Icon type="plus" />添加页面</Button>
              </Popover>
          </Col>
        </Row>
      </div>

      <Tree className="myCls" showLine defaultExpandAll
        onSelect={onSelect} onCheck={onCheck}
      >
      
        <TreeNode title="parent 1" key="0-0">
            <TreeNode title="parent 1-0" key="0-0-0">
        <TreeNode title="leaf" key="0-0-0-0" />
              <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title={<span style={{ color: '#08c' }}>sss</span>} key="0-0-1-0" />
            </TreeNode>
        </TreeNode>

      </Tree>


    </div>

	);

};

export default ConstructionTree;
