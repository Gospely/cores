import React , {PropTypes} from 'react';
import { Tree, Tooltip, Popover, Icon, Row, Col, Button, Card, Menu, message } from 'antd';
import { connect } from 'dva';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import TreeStyle from './styles.css';
import EditorStyle from '../Panel/Editor.css';

const TreeNode = Tree.TreeNode;

const ConstructionTree = (props) => {

    if (!window.flag) {

        window.addEventListener('click', function (data) {
            props.dispatch({
                type: 'designer/hideConstructionMenu'
            });
        }, false)

    }

    window.flag = true;

    let findCtrl = function(data, level) {

        let lastIndex = -1,
            deleteIndex,
            key,
            activePage = props.designer.layoutState.activePage.key,
            activeController = props.designer.layoutState.activeController.key;

         for(let i = 0; i < data.length; i ++){

            if (data[i].key == sessionStorage.currentSelectedConstructionKey) {
                lastIndex = i - 1;
                deleteIndex = i;
                if (lastIndex < 0) {
                    lastIndex = 0;
                }
                if (lastIndex == data.length - 2) {
                    if (data.length == 2) {
                        if (i == 0) {
                            key = data[1].key;
                        }else {
                            key = data[0].key
                        }
                    }else {
                        key = data[lastIndex].key;
                    }
                }else {
                    key = data[lastIndex + 1] && data[lastIndex + 1].key;
                }
                return {
                    level: level - i,
                    deleteIndex,
                    lastIndex,
                    key
                };
            }else {
                level ++ ;
            }

            if (data[i].children) {
                let ctrl = findCtrl(data[i].children, level);
                if (ctrl) {
                    ctrl.level = ctrl.level - i;
                return ctrl;
                }
            }
            
        }
    }

    const deleteThisConstruction = function() {

        let parentCtrl, 
            activeKey, 
            activeType, 
            activeIndex, 
            activeLevel,
            ctrl = findCtrl(props.designer.layout, 1),
            deleteType = sessionStorage.currentSelectedConstructionType,
            deleteKey = sessionStorage.currentSelectedConstructionKey,
            layout = props.designer.layout[0];
            
        if (deleteKey == props.designer.layout.key) {
            message.error('不能删除应用');
            return false;
        }

        if (deleteType == 'page') {
            parentCtrl = layout;
            activeType = 'page';

            if(layout.children.length == 1) {
                activeKey = layout.key;
                activeLevel = 1;
                activeIndex = 0;
            }else {
                for(let i = 0; i < layout.children.length; i ++) {

                    if(layout.children[i].key == deleteKey) {
                        activeIndex = i - 1;
                    }
                }
                activeLevel = 2;
            }
        }else {
            let findParentCtrl = function(data, deleteKey) {

                for(let i = 0; i < data.children.length; i ++) {

                    if (data.children[i].key == deleteKey) {
                        return data;
                    }

                    if (data.children[i].children) {
                        console.log(data)
                        let parentCtrl = findParentCtrl(data.children[i], deleteKey);
                        if(parentCtrl) {
                            return parentCtrl;
                        }
                    }

                }
            }
            parentCtrl = findParentCtrl(layout, deleteKey);

            if (parentCtrl.children.length == 1) {

                if (parentCtrl.type == 'page') {
                    for(let i = 0; i < layout.children.length; i ++) {
                        if(layout.children[i].key == parentCtrl.key) {
                            activeIndex = i;
                        }
                    }
                    activeKey = parentCtrl.key;
                    activeType = 'page';
                    activeLevel = 2;
                }else {
                    let parparentCtrl = findParentCtrl(layout, parentCtrl.key);

                    for(let i = 0; i < parparentCtrl.children.length; i ++) {
                        if (parparentCtrl.children[i].key == parentCtrl.key) {
                            activeIndex = i;
                        }
                    }
                    activeKey = parentCtrl.key;
                    activeType = 'controller';
                    activeLevel = ctrl.level - 1;
                }

            }else {
                if (deleteType.type == 'page') {
                    activeType = 'page';
                }else {
                    activeType = 'controller';
                }
                activeIndex = ctrl.lastIndex;
                activeKey = ctrl.key;
                activeLevel = ctrl.level;
            }
        }

        props.dispatch({
            type: 'designer/deleteConstruction',
            payload: {
                activeKey,
                activeType,
                activeIndex,
                activeLevel,
                parentCtrl,
                deleteIndex: ctrl.deleteIndex
            }
        });
        props.dispatch({
            type: 'attr/setFormItemsByType',
            payload: {
                type: activeType,
                key: activeKey
            }
        })

    };

    const layoutTreeProps = {

        onRightClick(proxy, node) {

            var selectedKey = proxy.node.props.eventKey,
                type = selectedKey.split('-')[0];

            sessionStorage.currentSelectedConstructionKey = selectedKey;
            sessionStorage.currentSelectedConstructionType = type == 'page' ? 'page' : 'controller';

            layoutTreeProps.onSelect([selectedKey]);

            props.dispatch({
                type: 'designer/showConstructionMenu', 
                payload: proxy
            });
        },

    onSelect: function(e) {

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
                    <Menu.Item key="remove">删除</Menu.Item>
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
