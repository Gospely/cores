import React , {PropTypes} from 'react';
import { Tree, Tooltip, Popover, Icon, Row, Col, Button, Card, Menu } from 'antd';

import { connect } from 'dva';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import TreeStyle from './styles.css';
import EditorStyle from '../Panel/Editor.css';

const TreeNode = Tree.TreeNode;

const ConstructionTree = (props) => {

  const layoutTreeProps = {

    onSelect: function(e, node) {

      if(e.length === 0) {
        return false;
      }

      var elemSelected = e[0];
      var elemType = elemSelected.split('-')[0];

      console.log(elemSelected);

      props.dispatch({
        type: 'rightbar/setActiveMenu',
        payload: 'attr'
      });

      props.dispatch({
        type: 'attr/setFormItemsByType',
        payload: elemType
      });

      props.dispatch({
        type: 'designer/handleTreeChanged',
        payload: {
          key: e[0],
          type: elemType
        }
      })

    }

  }

  const addPageProps = {
    addThisPage () {
      props.dispatch({
        type: 'designer/addPage'
      })
    }
  }

  const addPagePop = {
    title: '添加页面',
    content: (
      <div>
        <Row gutter={16} type="flex" justify="space-around" align="middle">
          <Col span={12}>
            <Card onClick={addPageProps.addThisPage} loading title="空白页面">
              空白页面
            </Card>
          </Col>
          <Col span={12}>
            <Card onClick={addPageProps.addThisPage}  loading title="登录页面">
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

  const loopData = data => data.map((item) => {
    if (item.children) {
      return <TreeNode title={item.attr.title._value} key={item.key}>{loopData(item.children)}</TreeNode>;
    }
    return (
        <TreeNode title={item.attr.title._value} key={item.key} isLeaf={item.isLeaf} />
    );
  });

  const treeNodes = loopData(props.designer.layout);

	return (

    <div>

      <div className={TreeStyle.header}>

        <Row>
          <Col span={24}>
            <Button onClick={addPageProps.addThisPage} className={TreeStyle.topbarBtnCons}><Icon type="plus" />添加页面</Button>
          </Col>
        </Row>
      </div>

      <Tree className="layoutTree" 
        showLine 
        defaultExpandAll
        onSelect={layoutTreeProps.onSelect}
        selectedKeys={[props.designer.layoutState.activeKey]}
        expandedKeys={props.designer.layoutState.expandedKeys}
      >
        {treeNodes}
      </Tree>


    </div>

	);

};

function mapStateToProps({ designer, attr, construction }) {
  return { designer, attr, construction };
}

export default connect(mapStateToProps)(ConstructionTree);
