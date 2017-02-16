import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal, message, notification } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';
import { Row, Col } from 'antd';
import { Popover, Form, Input, Menu } from 'antd';

const FormItem = Form.Item;
const SubMenu = Menu.SubMenu;

const TabPane = Tabs.TabPane;

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
             type: 'vdctrl/handleCurrentSymbolKey',
             payload: e.key
         });
     },
     checkSymbol(){
         if(props.vdctrl.currentSymbolKey == '' || props.vdctrl.currentSymbolKey == null ){
             openNotificationWithIcon('info', '请选择要填加到的部分');
             return;
         }
     },
     addSymbol(){
         if(props.vdctrl.symbolName == '' || props.vdctrl.symbolName == null ){
             openNotificationWithIcon('info', '控件名为空');
             return;
         }
         props.dispatch({
             type: 'vdctrl/addSymbol',
         });
     },
     onChange(e){
         props.dispatch({
             type: 'vdctrl/handleSymbolNameChange',
             payload: e.target.value
         });
     }
  }
  const newSymbolsPopover = {
    content: (
      <Form className="form-no-margin-bottom">
        <FormItem {...formItemLayout} label="名称">
          <Input size="small"  value={props.vdctrl.symbolName} onChange={formItemProps.onChange}/>
        </FormItem>
        <Button size="small" onClick={formItemProps.addSymbol} >添加</Button>
      </Form>
    )
  };

  const symbols = () => {

    var sys = props.vdctrl.symbols.map((item, index) => {
      return (
        <Menu.Item key={index}>
          <Row onClick={formItemProps.chooseSymbol.bind(this, item)} >
            <Col span={4}>
              <svg width="26" height="26" viewBox="0 0 26 26" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)', color: 'rgba(0, 0, 0, 0.521569)', flexShrink: '0'}}><path fill="currentColor" d="M13-.08l-.37.14L0,5V20.66l13,5.47,13-5.47V5ZM24,6.46l0-.06h0ZM13,10.29,2.64,6.15,13,2.07,23.32,6.15ZM2,6.4l0,.06V6.41ZM2,8.05l10,4v11.5L2,19.34ZM14,23.54V12l10-4V19.34Z"></path><polygon fill="currentColor" opacity=".3" points="1.71 19.59 12.8 24.16 12.98 11.34 1.62 6.76 1.71 19.59"></polygon></svg>
            </Col>
            <Col span={18} style={{paddingLeft: '10px'}} >
              <p>{item.name} - {item.controllers.length} 个控件</p>
            </Col>
            <Col span={2}>
              <Icon type="edit" />
            </Col>
          </Row>
        </Menu.Item>
      );
    });

    console.log(sys);

    return(
      <Menu>
        {sys}
      </Menu>
    )

  }

  return (
    <div>

      <Row>
        <Col span={4} offset={20}>
          <Popover placement="right" trigger={['click']} content={newSymbolsPopover.content}>
              <Tooltip placement="bottom" title="选择一个块然后点击此按钮添加一个Symbol">
                <Button style={{marginTop: '10px'}} shape="circle"><Icon type="plus" onClick={formItemProps.checkSymbol}/></Button>
              </Tooltip>
          </Popover>
        </Col>
      </Row>

      <li style={{marginTop: '10px'}} className="ant-dropdown-menu-item-divider"></li>

      {symbols()}

    </div>
  );

};

function mapSateToProps({ vdctrl }) {
  return { vdctrl };
}

export default connect(mapSateToProps)(Component);
