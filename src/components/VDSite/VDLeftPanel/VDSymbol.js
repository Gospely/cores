import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal, message, notification } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';
import { Row, Col } from 'antd';
import { Popover, Form, Input, Menu, Popconfirm } from 'antd';

const FormItem = Form.Item;
const SubMenu = Menu.SubMenu;

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const openNotificationWithIcon = (type, title, description) => (
  notification[type]({
    message: title,
    description: description,
  })
);
const Component = (props) => {

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  };
  const formItemProps = {

      chooseSymbol(e){

         props.dispatch({
             type: 'vdCtrlTree/handleSymbolNameChange',
             payload: e.name
         });
         props.dispatch({
             type: 'vdCtrlTree/handleEditPopoverVisbile',
             payload: !props.vdCtrlTree.editPopoverVisible
         });
         props.dispatch({
             type: 'vdCtrlTree/handleCurrentSymbolKey',
             payload: e.key
         });
     },
     addSymbol(){
         console.log('add');
         if(props.vdCtrlTree.symbolName == '' || props.vdCtrlTree.symbolName == null ){
             openNotificationWithIcon('info', '控件名为空');
             return;
         }
         props.dispatch({
             type: 'vdCtrlTree/handleAddSymbol',
         });
     },
     editSymbol(){

         props.dispatch({
             type: 'vdCtrlTree/editSymbol',
         });
     },
     deleteSymbol(e){
       props.dispatch({
           type: 'vdCtrlTree/deleteSymbol',
           payload: e.key
       });
     },
     showPopover(){
        //  if(props.vdctrl.currentSymbolKey == '' || props.vdctrl.currentSymbolKey == null ){
        //      openNotificationWithIcon('info', '请选择要填加到的部分');
        //      return;
        //  }
         props.dispatch({
             type: 'vdCtrlTree/handlePopoverVisbile',
             payload: !props.vdCtrlTree.popoverVisible
         });
     },
     onChange(e){

         localStorage.symbolName = e.target.value;
         props.dispatch({
             type: 'vdCtrlTree/handleSymbolNameChange',
             payload: e.target.value
         });
     },
     visibleChange(value){
         props.dispatch({
             type: 'vdCtrlTree/handlePopoverVisbile',
             payload: value
         });
     },
     editPopoverVisibleChange(value) {

         props.dispatch({
             type: 'vdCtrlTree/handleEditPopoverVisbile',
             payload: value
         });
     }
  }
  const newSymbolsPopover = {
    content: (
      <Row>
        <Col span={14}>
          <Input size="small" placeholder="请输入名称" value={props.vdCtrlTree.symbolName} onChange={formItemProps.onChange}/>
        </Col>
        <Col span={10} style={{textAlign: 'right'}}>
          <Button size="small" onClick={formItemProps.addSymbol} >添加</Button>
        </Col>
      </Row>
    )
  };

  const editSymbolsPopover = {
    content: (
      <Row>
        <Col span={14}>
          <Input size="small"  value={props.vdCtrlTree.symbolName} onChange={formItemProps.onChange}/>
        </Col>
        <Col span={10} style={{textAlign: 'right'}}>
          <Button size="small" onClick={formItemProps.editSymbol} >确定</Button>
        </Col>
      </Row>
    )
  };

  const symbols = () => {

    var sys = props.vdCtrlTree.symbols.map((item, index) => {
        console.log(props.vdCtrlTree.symbols);
      return (
        <Menu.Item key={index}>
          <Row>
            <Col span={4}>
              <svg width="26" height="26" viewBox="0 0 26 26" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)', color: 'rgba(0, 0, 0, 0.521569)', flexShrink: '0'}}><path fill="currentColor" d="M13-.08l-.37.14L0,5V20.66l13,5.47,13-5.47V5ZM24,6.46l0-.06h0ZM13,10.29,2.64,6.15,13,2.07,23.32,6.15ZM2,6.4l0,.06V6.41ZM2,8.05l10,4v11.5L2,19.34ZM14,23.54V12l10-4V19.34Z"></path><polygon fill="currentColor" opacity=".3" points="1.71 19.59 12.8 24.16 12.98 11.34 1.62 6.76 1.71 19.59"></polygon></svg>
            </Col>
            <Col span={16} style={{paddingLeft: '10px'}} >
              <p>{item.name} - {item.controllers.length} 个控件</p>
            </Col>
            <Col span={2}>
              <Popconfirm title="确定要删除这个Symbol吗？" onConfirm={formItemProps.deleteSymbol.bind(this, item)} okText="是" cancelText="否">
                <a href="#">
                  <Icon type="delete" />
                </a>
              </Popconfirm>
            </Col>
            <Col span={2}>
              <Icon type="edit" onClick={formItemProps.chooseSymbol.bind(this, item)} />
            </Col>
          </Row>
        </Menu.Item>
      );
    });

    return(
    <Popover placement="right" content={editSymbolsPopover.content} visible={props.vdCtrlTree.editPopoverVisible} onVisibleChange={formItemProps.editPopoverVisibleChange}>
        <Menu>
            {sys}
        </Menu>
    </Popover>

    )

  }

  return (
    <div>

      <Row>
        <Col span={4} offset={20}>
          <Popover placement="right" trigger={['click']} content={newSymbolsPopover.content} visible={props.vdCtrlTree.popoverVisible} onVisibleChange={formItemProps.visibleChange}>
              <Tooltip placement="bottom" title="选择一个块然后点击此按钮添加一个Symbol">
                <Button style={{marginTop: '10px'}} shape="circle"><Icon type="plus"/></Button>
              </Tooltip>
          </Popover>
        </Col>
      </Row>

      <li style={{marginTop: '10px'}} className="ant-dropdown-menu-item-divider"></li>

      {symbols()}

    </div>
  );

};

function mapSateToProps({ vdctrl,vdCtrlTree }) {
  return { vdctrl, vdCtrlTree };
}

export default connect(mapSateToProps)(Component);
