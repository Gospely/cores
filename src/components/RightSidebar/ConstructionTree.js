import React , {PropTypes} from 'react';
import { Tree, Tooltip, Popover, Icon, Row, Col, Button, Card, Menu } from 'antd';
import { connect } from 'dva';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import TreeStyle from './styles.css';
import EditorStyle from '../Panel/Editor.css';

const TreeNode = Tree.TreeNode;

const ConstructionTree = (props) => {

  if (!window.flag) {

    window.addEventListener('click', function (data) {
      props.dispatch({type: 'designer/hideConstructionMenu'});
    }, false)

  }

  window.flag = true;

  const deleteThisConstruction = function() {

      let type,
          lastIndex = -1,
          deleteIndex,
          key,
          level = 1,
          isDeleteAll = false,
          activePage = props.designer.layoutState.activePage.key,
          activeController = props.designer.layoutState.activeController.key;

      let loopData = function (data) {

          for(let i = 0; i < data.length; i ++){
              if (data[i].children) {
                 loopData(data[i].children);
                 level ++;
              }
              // alert(data[i].key)
              if (data[i].key == localStorage.currentSelectedConstruction) {
                  type = data[i].type;
                  if(activePage == localStorage.currentSelectedConstruction ||
                      activeController == localStorage.currentSelectedConstruction) {
                      lastIndex = i - 1;
                      deleteIndex = i;
                      if (lastIndex < 0) {
                          isDeleteAll = true;
                          lastIndex = 0;
                      }
                      key = data[lastIndex].key;
                  }
                  break;
              }
          }
      }

      console.log(props.designer.layout)

      loopData(props.designer.layout);

      if(isDeleteAll) {
        if (type == 'Controller') {

        }else {

        }
      }

      props.dispatch({
        type: 'designer/deleteConstruction',
        payload: {
          type,
          deleteIndex,
          key,
          lastIndex,
          level
        }
      });

      props.dispatch({
        type: 'attr/setFormItemsByType',
        payload: {
          type,
          key
        }
      })

  };

  const layoutTreeProps = {

    onRightClick(proxy) {
      localStorage.currentSelectedConstruction = proxy.node.props.eventKey;
      props.dispatch({type: 'designer/showConstructionMenu', payload: proxy});
    },

    onSelect: function(e, node) {

      if(e.length === 0) {
        return false;
      }

      var elemSelected = e[0];
      var elemType = elemSelected.split('-')[0];

      props.dispatch({
        type: 'rightbar/setActiveMenu',
        payload: 'attr'
      });

      props.dispatch({
        type: 'attr/setFormItemsByType',
        payload: {
          key: elemSelected,
          type: elemType
        }
      });

      props.dispatch({
        type: 'designer/handleTreeChanged',
        payload: {
          key: e[0],
          type: elemType
        }
      });

      props.dispatch({
        type: 'designer/handleCtrlSelected'
      });

    }

  }

  const addPageProps = {

    addThisPage () {

      props.dispatch({
        type: 'designer/addPage'
      });

      props.dispatch({
        type: 'rightbar/setActiveMenu',
        payload: 'attr'
      });

      props.dispatch({
        type: 'attr/setFormItemsByDefault'
      });

      props.dispatch({
        type: 'designer/handlePageAdded'
      });

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

  if(props.designer.loaded) {

    return (
      
        <div style={{marginTop: -20}}>
          <div className={TreeStyle.headerCons}>
            <Row>
              <Col span={24}>
                <Button onClick={addPageProps.addThisPage} className={TreeStyle.topbarBtnCons}><Icon type="plus" />添加页面</Button>
              </Col>
            </Row>
          </div>

          <Tree className="layoutTree"
            showLine
            defaultExpandAll
            onRightClick={layoutTreeProps.onRightClick}
            onSelect={layoutTreeProps.onSelect}
            selectedKeys={[props.designer.layoutState.activeKey]}
            expandedKeys={props.designer.layoutState.expandedKeys}
          >
            {treeNodes}
          </Tree>

          <Menu style={props.designer.constructionMenuStyle} onClick={deleteThisConstruction} className="context-menu">
            <Menu.Item key="read">删除</Menu.Item>
          </Menu>
        </div>

    );

  }else {

    return (
      <p>无处理对象</p>
    );

  }

};

function mapStateToProps({ designer, attr, construction }) {
  return { designer, attr, construction };
}

export default connect(mapStateToProps)(ConstructionTree);
