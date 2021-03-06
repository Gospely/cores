import React , { PropTypes } from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';
import { Collapse } from 'antd';
import { Radio, Popover, Upload, Slider } from 'antd';

import randomString from '../../../utils/randomString.js';

import { Tree, TreeSelect, Form, Switch, Input, Cascader, Select, Row, Col, Checkbox, Menu, Dropdown, message, Tag, Table, Popconfirm } from 'antd';

const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

const Option = Select.Option;
const confirm = Modal.confirm;
const children = [];

 var Regex = "^((https|http|ftp|rtsp|mms)?://)"
  + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
  + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
  + "|" // 允许IP和DOMAIN（域名）
  + "([0-9a-z_!~*'()-]+\.)*" // 域名- www. 
  + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名 
  + "[a-z]{2,6})" // first level domain- .com or .museum 
  + "(:[0-9]{1,4})?" // 端口- :80 
  + "((/?)|" // a slash isn't required if there is no file name 
  + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
var urlRegex = new RegExp(Regex);

for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const Component = (props) => {

	if (!props.vdCtrlTree.activeCtrl.tag) {
		return (
			<div className="none-operation-obj">暂无操作对象</div>
		)
	}

    const formItemLayout = {
      	labelCol: { span: 8 },
      	wrapperCol: { span: 16 }
    };

    let animationClassList = [{
        animate: '',
        name: 'None',
        duration: '',
        condition: 'none',
        vdid: [],
        key: 'none'
    }];

    const vdCtrlOperate = {
        /**
         * 查找当前活跃控件的配置数据
         */
        findCtrlOriginConfig(fatherKey, key){

            for (var i = 0; i < props.vdctrl.controllers.length; i++) {
                if(props.vdctrl.controllers[i].key = fatherKey){

                    for (var j = 0; j < props.vdctrl.controllers[i].content.length; j++) {
                        if(props.vdctrl.controllers[i].content[j].key == key){
                            return props.vdctrl.controllers[i].content[j];
                        }
                    }
                }
            }
            return null;
        },
        /**
         * 深度克隆对象
         */
        deepCopyObj(obj, result) {
            result = result || {};
            for(let key in obj) {
                if (typeof obj[key] === 'object') {
                    result[key] = (obj[key].constructor === Array)? []: {};
                    vdCtrlOperate.deepCopyObj(obj[key], result[key]);
                }else {
                    result[key] = obj[key];
                }
            }
            return result;
        },

        loopAttr(controller, root, parent) {

            let childCtrl = {},
                tmpAttr = {},
                ctrl = {};

            tmpAttr = controller.attrs;
            for(let i = 0, len = tmpAttr.length; i < len; i ++) {
                for (var j = 0; j < tmpAttr[i].children.length; j++) {
                    var attr = tmpAttr[i].children[j];
                    attr['id'] = randomString(8, 10);
                };
            }
            ctrl = {
                vdid: controller.key ? (controller.key + '-' + randomString(8, 10)) : randomString(8, 10),
                attrs: tmpAttr,
                tag: controller.tag,
                className: controller.className,
                customClassName: [],
                activeStyle: '',
                children: [],
                isRander: controller.isRander || '',
                ignore: controller.ignore || false,
                parent: parent.vdid || '',
                root: root || '',
                unCtrl: controller.unCtrl,
                animationClassList: controller.animationClassList || animationClassList
            };
            if(controller.children) {
                for (var i = 0; i < controller.children.length; i++) {
                    var currentCtrl = controller.children[i];

                    childCtrl = vdCtrlOperate.loopAttr(currentCtrl, root, ctrl);
                    ctrl.children.push(childCtrl);
                };
            }else {
                ctrl.children = undefined;
            }
            return ctrl;
        }
    }
    const copyOperate = {

        /**
         *从原始配置里面复制一个chidren, index 指定以第几个children 作为模板复制 level 要复制组件的深度, levelsInfo 在某个深度 取children的下标,默认0
         */
        copyChildren(index, fatherKey, key, level, levelsInfo){
            var result,
                ctrlConfig = vdCtrlOperate.findCtrlOriginConfig(fatherKey,key),
                i = 0,
                parent = ctrlConfig.details;


                function copyByLevel(parent) {
                    let comonIndex = 0;

                    if(levelsInfo) {
                        for (var j = 0; j < levelsInfo.length; j++) {
                            if(i == levelsInfo[j].level){
                                comonIndex = levelsInfo[j].index;
                            }
                        }
                    }
                    i++;
                    if(i < level){
                        copyByLevel(parent.children[comonIndex]);
                    }else{
                        result = vdCtrlOperate.deepCopyObj(parent.children[index], result)
                    }
                }
            copyByLevel(parent);
            result = vdCtrlOperate.loopAttr(result, props.vdCtrlTree.activeCtrl.root, { vdid: undefined});
            return result;
        }
    }
	const formProps = {
		handleAttrFormInputChange (item, attrType, dom) {
			let newVal = dom.target ? dom.target.value : dom;
			let attrId = item.id;
            let time = new Date().getTime();
            sessionStorage.newTime = time;

                if(sessionStorage.oldTime){
                    if(sessionStorage.newTime-sessionStorage.oldTime > 1500){
                        sessionStorage.oldTime = sessionStorage.newTime;
                        if(attrType.key == 'link-setting'){

                            if(attrType.activeLinkType == 'link'){
                                if(newVal != ""){

                                    if(newVal.substr(0,7)=="http://"){
                                        console.log(newVal);
                                        newVal = newVal;
                                        sessionStorage.clear();
                                    }else{
                                        console.log('error',newVal);
                                        message.error('请输入http://开头的链接地址');
                                        sessionStorage.clear();
                                        item.value = "";
                                        newVal = "";
                                    }

                                    if(urlRegex.test(newVal)){
                                        newVal = newVal;
                                        sessionStorage.clear();
                                    }else{
                                        message.error('请输入正确的链接地址');
                                        sessionStorage.clear();
                                        item.value = "";
                                        newVal = "";
                                    }
                                }
                            }

                            if(attrType.activeLinkType == 'mail'){
                                if(newVal != ""){
                                    if(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(newVal)){
                                        newVal = newVal;
                                        sessionStorage.clear();
                                    }else{
                                        message.error('请输入正确的邮箱地址');
                                        sessionStorage.clear();
                                        item.value = "";
                                        newVal = "";
                                    }
                                }
                            }

                            if(attrType.activeLinkType == 'phone'){
                                if(newVal != ""){
                                   if(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|177)\d{8}$/.test(newVal)){
                                        newVal = newVal;
                                        sessionStorage.clear();
                                    }else{
                                        message.error('请输入正确的电话号码');
                                        sessionStorage.clear();
                                        item.value = "";
                                        newVal = "";
                                    }
                                }
                            }
                        }

                            if(attrType.key == 'video-attr') {
                                if(newVal != ""){
                                    if(/\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(newVal)){
                                        newVal = newVal;
                                        sessionStorage.clear();
                                    }else{
                                        message.error('请输入正确的地址');
                                        sessionStorage.clear();
                                        item.value = "";
                                        newVal = "";
                                    }
                                }
                            }

                    }else{
                        sessionStorage.oldTime = sessionStorage.newTime;
                    }
                }else{
                    sessionStorage.oldTime = sessionStorage.newTime;
                }



            if(attrType.key == 'slider-setting'){

                if(newVal != ''){
                    if(item.name == 'height') {

                        if(props.vdCtrlTree.heightUnit == '%'){
                            if(!/^([1-9]\d?|100)$/.test(newVal)){
                                message.error("请输入 1～100 之间的数字 ");
                                return;
                            }
                        }else {
                            if(!/^([1-9][0-9]*)$/.test(newVal)){
                                message.error("请输入合理的数值");
                                return;
                            }
                        }
                    }
                    if(item.name == 'width'){
                        if(props.vdCtrlTree.widthUnit == '%'){
                            if(!/^([1-9]\d?|100)$/.test(newVal)){
                                message.error("请输入 1～100 之间的数字 ")
                                return;
                            }
                        }else {
                            if(!/^([1-9][0-9]*)$/.test(newVal)){
                                message.error("请输入合理的数值");
                                return;
                            }
                        }
                    }
                }
            }

            props.dispatch({
                type: 'vdCtrlTree/handleAttrFormChange',
                payload: {
                    newVal: newVal,
                    attrId: attrId,
                    attrType: attrType
                }
            });
            props.dispatch({
                type: 'vdCtrlTree/handleAttrRefreshed',
                payload: {
                    activeCtrl: props.vdCtrlTree.activeCtrl,
                    attr: item,
                    attrType: attrType
                }
            });
		},

		handleAttrFormSwitchChange (item, attType, checked) {
			let attrId = item.id;
			props.dispatch({
				type: 'vdCtrlTree/handleAttrFormChange',
				payload: {
					newVal: checked,
					attrId: attrId,
					attrType: attType
				}
			});

			props.dispatch({
				type: 'vdCtrlTree/handleAttrRefreshed',
				payload: {
					activeCtrl: props.vdCtrlTree.activeCtrl,
					attr: item,
					attrType: attType
				}
			});
		},

		handleAttrFormSelectChange (item, attType, selectedVal) {
			var attrId = item.id;
			props.dispatch({
				type: 'vdCtrlTree/handleAttrFormChange',
				payload: {
					newVal: selectedVal,
					attrId: attrId,
                    attrType: attType
				}
			});

			props.dispatch({
				type: 'vdCtrlTree/handleAttrRefreshed',
				payload: {
					activeCtrl: props.vdCtrlTree.activeCtrl,
					attr: item,
					attrType: attType
				}
			});
		},
        childrenDelete(message,item, index, level,attType){

            props.dispatch({
                type: 'vdCtrlTree/handleUpdateVisible',
                payload: false
            });
            props.dispatch({
                type: 'vdCtrlTree/handleChildrenDelete',
                payload: {
                    activeCtrl: props.vdCtrlTree.activeCtrl,
                    attrType: attType,
                    children: item,
                    index: index,
                    level: level
                }
            });

        },
        handleComplextChildrenDelete(message, type){
            props.dispatch({
                type: 'vdCtrlTree/handleComplextChildrenDelete',
                payload:{ type: type}
            });
        },
        childrenUpdate(attType){
            let activeCtrl = props.vdCtrlTree.activeCtrl.children[props.vdCtrlTree.selectIndex] || props.vdCtrlTree.activeCtrl.children[0];

            if(attType.key == 'tabs-setting') {
                activeCtrl = props.vdCtrlTree.activeCtrl.children[0].children[props.vdCtrlTree.selectIndex].children[0] || props.vdCtrlTree.activeCtrl.children[0];
            }
            props.dispatch({
                type: 'vdCtrlTree/handleChildrenUpdate',
                payload: {
                    activeCtrl: activeCtrl,
                    attrType: attType
                }
            });
        },
        childrenAdd(index, fatherKey, key, level, levelsInfo){
            var children = copyOperate.copyChildren(index, fatherKey, key, level, levelsInfo);
            props.dispatch({
                type: 'vdCtrlTree/handleChildrenAdd',
                payload: {
                    activeCtrl: props.vdCtrlTree.activeCtrl,
                    children: children,
                    levelsInfo: levelsInfo,
                    level: level
                }
            });
        },
        //普通children添加逻辑,当前activeCtrl 下添加Child
        handleComplexChildrenAdd(fatherKey, key, item, type){
            //从配置中clone child的数据结构
            let children = copyOperate.copyChildren(0, fatherKey, key, item.level, item.levelsInfo);
            props.dispatch({
                type: 'vdCtrlTree/handleComplexChildrenAdd',
                payload: {
                    activeCtrl: props.vdCtrlTree.activeCtrl,
                    children: children,
                    type: type
                }
            });
        },
	}

   	const specialAttrList = props.vdctrl.specialAttrList;

   	const loopPages = (pages) => {
          let tpl = [];
          for (let i = 0; i < pages.length; i++) {
            let item = pages[i];
            if(item != null && item.children && item.children != undefined) {
                  tpl.push(
                    <TreeNode value={item.key} key={item.key} title={item.name} isLeaf={false}>
                    	{loopPages(item.children)}
                    </TreeNode>
                  );
            }else {
    			if(item != null){
    				tpl.push((<TreeNode value={item.key} key={item.key} title={item.name} isLeaf={true} />));
    			}
            }

        }
        return tpl;

   	}

   	let pageTree = loopPages(props.vdpm.pageList);

   	let controllerTree = [];
   	const loopControllerTree = data => data.map((item) => {

   		if (item.children) {
			loopControllerTree(item.children);
   		}

   		if (item.id) {
   			controllerTree.push(
	            <Option title={'#' + item.id} value={item.id} key={item.vdid}>{'#' + item.id}</Option>
	        );
   		}

    })

    loopControllerTree(props.vdCtrlTree.layout[props.vdCtrlTree.activePage.key]);

    const attrsPanels = () => {

    	let attrs = props.vdCtrlTree.activeCtrl.attrs;

    	return attrs.map((item, index) => {

    		var attrType = item;

    		//针对比如自定义属性这种拥有复杂交互的表单，不适合在控件属性中写form结构
			if(specialAttrList.indexOf(item.key) != -1) {
	    		const specialAttrHandler = {
	    			'custom-attr' (item, attrTypeIndex) {

			    		const handleInputChange = (customAttrIndex, attrName, proxy) => {
			    			var valChanged = proxy.target.value,
			    				self = this;
		    				props.dispatch({
		    					type: 'vdCtrlTree/handleCustomAttrInputChange',
		    					payload: {
		    						attrName: attrName,
		    						value: valChanged,
		    						attrTypeIndex: attrTypeIndex,
		    						customAttrIndex: customAttrIndex,
		    						attrType: attrType
		    					}
		    				});

			    		}

			    		const customAttrCreator = {

			    			key: props.vdcore.customAttr.creator.key,

			    			value: props.vdcore.customAttr.creator.value,

			    			save () {
                                var self = this;

                                if(self.value == '' || self.key == '') {
                                    message.error('请完整填写键值对!');
                                    return false;
                                }

			    				props.dispatch({
			    					type: 'vdCtrlTree/saveCustomAttr',
			    					payload: {
			    						key: self.key,
			    						value: self.value,
			    						attrTypeIndex: attrTypeIndex,
			    						attrType: attrType
			    					}
			    				});
			    				props.dispatch({
			    					type: 'vdcore/handleCustomAttrCreatorInputChange',
			    					payload: {
			    						attrName: 'key',
			    						value: ''
			    					}
			    				});

			    				props.dispatch({
			    					type: 'vdcore/handleCustomAttrCreatorInputChange',
			    					payload: {
			    						attrName: 'value',
			    						value: ''
			    					}
			    				});
			    			},

			    			onChange (attr, proxy) {
			    				var valChanged = proxy.target.value;
			    				this[attr] = valChanged;
			    				props.dispatch({
			    					type: 'vdcore/handleCustomAttrCreatorInputChange',
			    					payload: {
			    						attrName: attr,
			    						value: valChanged
			    					}
			    				});
			    			},

			    			modify (index) {

			    			}
			    		}

					    const customAttrProps = {
					    	creatorContent: (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="key">
										<Input value={customAttrCreator.key} onChange={customAttrCreator.onChange.bind(customAttrCreator, 'key')} onPressEnter={customAttrCreator.save.bind(customAttrCreator)} size="small" />
									</FormItem>
									<FormItem {...formItemLayout} label="value">
										<Input value={customAttrCreator.value} onChange={customAttrCreator.onChange.bind(customAttrCreator, 'value')} onPressEnter={customAttrCreator.save.bind(customAttrCreator)} size="small" />
									</FormItem>
									<FormItem>
										<Button onClick={customAttrCreator.save.bind(customAttrCreator)} size="small">保存</Button>
									</FormItem>
								</Form>
					    	),

					    	modifyContent (val, index) {

					    		return (
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="key">
											<Input onChange={handleInputChange.bind(this, index, 'key')} onPressEnter={customAttrCreator.modify} value={val.key} size="small" />
										</FormItem>
										<FormItem {...formItemLayout} label="value">
											<Input onChange={handleInputChange.bind(this, index, 'value')} onPressEnter={customAttrCreator.modify} value={val.value} size="small" />
										</FormItem>
										<FormItem>
											<Button onClick={customAttrCreator.modify} size="small">保存</Button>
										</FormItem>
									</Form>
					    		);
					    	},

					    	onVisibleChange () {

					    	},

					    	onConfirmDelete (index) {
					    		props.dispatch({
					    			type: 'vdCtrlTree/handleCustomAttrRemoved',
					    			payload: {
					    				index,
					    				attrTypeIndex: attrTypeIndex,
					    				attrType: item
					    			}
					    		});
					    	}
					    }

	    				return (
						    <Panel header={item.title} key={item.key}>
						    	<Form>
									<FormItem {...formItemLayout} label="">
										<Popover
								        	content={customAttrProps.creatorContent}
								        	title="新建 自定义属性"
								        	trigger="click"
								      	>
											<Button type="circle" size="small"><Icon type="plus" style={{position: 'relative', top: '-2px'}} /></Button>
								      	</Popover>
									</FormItem>

								    <ul style={{marginTop: '-15px'}} className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
								    	{
								    		item.children.map((val, index) => {
								    			return (
									    			<li key={index}>
												      <li className="ant-dropdown-menu-item" role="menuitem">
												        <Row>
												          <Col span={18}>
												            <p>{val.key}={val.value}</p>
												          </Col>
												          <Col span={3}>

															<Popover
													        	content={customAttrProps.modifyContent(val, index)}
													        	title="修改 自定义属性"
													        	trigger="click"
													      	>
												            	<Icon type="edit" />
													      	</Popover>

												          </Col>
												          <Col span={3}>
												            <Popconfirm title="确认删除吗？" onConfirm={customAttrProps.onConfirmDelete.bind(this, index)} okText="确定" cancelText="取消">
																<Icon type="delete" />
							  								</Popconfirm>
												          </Col>
												        </Row>
												      </li>
												      <li className="ant-dropdown-menu-item-divider"></li>
												    </li>
								    			);
								    		})

								    	}

								    </ul>

								</Form>
						    </Panel>
	    				);
	    			},

	    			'link-setting' (item, attrTypeIndex) {

                        const dropdownProps = {

                            switchDropDown(item){
                                let replacement = copyOperate.copyChildren(2, 'components', 'navbar', 4, [{level: 1,index:1}]);

                                props.dispatch({
                                    type: 'vdCtrlTree/handleChangeCurrentCtrl',
                                    payload: {
                                        replacement: replacement,
                                        toDropDown: true,
                                    }
                                });
                            }
                        }

                        const validateFromData =() => {

                            let inputLinkValue = item.children[0].value;
                            let inputMailValue = item.children[1].value;
                            let inputPhoneValue = item.children[2].value;

                            if(item.activeLinkType == 'link' && inputLinkValue != ""){
                                if(inputLinkValue.substr(0,7) != "http://"){
                                    console.log(inputLinkValue);
                                    message.error('请输入http://开头的链接地址');
                                    inputLinkValue = '';
                                    return false;
                                }
                                if(!urlRegex.test(inputLinkValue)){
                                    message.error('请输入正确的链接地址');
                                    inputLinkValue = '';
                                    return false;
                                }

                            }
                            if(item.activeLinkType == 'mail' && inputMailValue != ""){
                                if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(inputMailValue)){
                                    message.error('请输入正确的邮箱地址');
                                    inputMailValue = '';
                                    return false;
                                }
                            }

                            if(item.activeLinkType == 'phone' && inputPhoneValue != ""){
                               if(!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|177)\d{8}$/.test(inputPhoneValue)){
                                    message.error('请输入正确的电话号码');
                                    inputPhoneValue = '';
                                    return false;
                                }
                            }
                        }

                        const linkRemind = (
                                    <span>
                                   <span>链接地址</span>
                                        <Tooltip placement="bottom" title='只能输入http://开头的链接地址'>
                                            <Icon type="question-circle-o" style={{position: 'absolute', left: '65px', top: '4px'}}/>
                                          </Tooltip>
                                   </span> 
                            )

					    const linkSettingProps = {

					    	linkSettingTemplate: props.vdcore.linkSetting.list.map( (item, index) => {
								return (
									<RadioButton key={index} value={item.value}>
						              	<Tooltip placement="top" title={item.tip}>
						      				<Icon type={item.icon} />
						      			</Tooltip>
							      	</RadioButton>
								);
							}),
					    	tpl: [(
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label={linkRemind}>
                                          
										<Input size="small" value={item.children[0].value} type="url" onChange={formProps.handleAttrFormInputChange.bind(this, item.children[0], attrType)} onBlur={validateFromData}/>
									</FormItem>

									<FormItem {...formItemLayout} label="新窗口">
										<Switch value={item.children[5].value} onChange={formProps.handleAttrFormSwitchChange.bind(this, item.children[5], attrType)} size="small" />
									</FormItem>
                                    {attrType.changeDropDown && <FormItem {...formItemLayout} label="下拉菜单">
                                        <Switch size="small"  onChange={dropdownProps.switchDropDown.bind(this, item)}/>
                                    </FormItem>}
                                    { attrType.deleteAble && <FormItem {...formItemLayout} label="">
                                        <Popconfirm title="确认删除？" onConfirm={formProps.handleComplextChildrenDelete.bind(this, item.children[6].value, 'navbar-drop-down')}>
                                            <Button  size="small" ><Icon type="delete" /> &nbsp;&nbsp;删除</Button>
                                        </Popconfirm>
                                    </FormItem>}
						      	</Form>
					    	), (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="邮箱地址">
										<Input value={item.children[1].value} type="email" size="small" onChange={formProps.handleAttrFormInputChange.bind(this, item.children[1], attrType)} onBlur={validateFromData}/>
									</FormItem>
						      	</Form>
					    	), (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="手机号码">
										<Input value={item.children[2].value} type="tel" size="small" onChange={formProps.handleAttrFormInputChange.bind(this, item.children[2], attrType)} onBlur={validateFromData}/>
									</FormItem>
						      	</Form>
					    	), (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="页面">
									    <TreeSelect
									        placeholder="请选择页面"
									        treeDefaultExpandAll
									        size="small"
									        value={item.children[3].value}
									        onChange={formProps.handleAttrFormSelectChange.bind(this, item.children[3], attrType)}
									    >
									      	{pageTree}
									    </TreeSelect>
									</FormItem>
									<FormItem {...formItemLayout} label="新窗口">
										<Switch size="small" />
									</FormItem>
						      	</Form>
					    	), (
								<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="元素">
									    <Select onChange={formProps.handleAttrFormSelectChange.bind(this, item.children[4], attrType)} size="small" value={item.children[4].value}>
									      	{controllerTree}
									    </Select>
									</FormItem>
						      	</Form>
					    	)],

					    	onChange (e) {
                                sessionStorage.clear();
					    		props.dispatch({
					    			type: 'vdcore/handleLinkSettingTypeChange',
					    			payload: e.target.value
					    		});

                                props.dispatch({
                                    type: 'vdCtrlTree/handleLinkSettingTypeChange',
                                    payload: {
                                        item,
                                        value: e.target.value
                                    }
                                });
					    	}

					    }

	    				return (
						    <Panel header={item.title} key={item.key}>
								<RadioGroup onChange={linkSettingProps.onChange} value={item.activeLinkType} size="small">
									{linkSettingProps.linkSettingTemplate}
							    </RadioGroup>
						    	{linkSettingProps.tpl[props.vdcore.linkSetting.activeLinkType]}
						    </Panel>
	    				);
	    			},

	    			'list-setting' (item, attrTypeIndex) {

                        const listSettingProps = {

                            listTypeChoose(e){
                                var attr = {
        							name: 'tag',
        							desc: '标签',
        							type: 'select',
        							value: e.target.value,
        							isTag: true,
        						}
                                props.dispatch({
                                    type: 'vdCtrlTree/handleAttrRefreshed',
                                    payload: {
                                        activeCtrl: props.vdCtrlTree.activeCtrl,
                                        attr: attr,
                                        attrType: attrType
                                    }
                                });
                            },
                            onChange(e){

                                var value = e? 'decimal inside': 'circle inside'
                                var attr = {
                                    name: 'list-style',
                                    desc: '有无序号',
                                    value: value,
                                    isStyle: true
                                };
                                props.dispatch({
                                    type: 'vdCtrlTree/handleAttrRefreshed',
                                    payload: {
                                        activeCtrl: props.vdCtrlTree.activeCtrl,
                                        attr: attr,
                                        attrType: attrType
                                    }
                                });
                            }
                        }
	    				return (
						    <Panel header={item.title} key={item.key}>
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="列表类型">
								        <RadioGroup defaultValue="ul" size="small" onChange={listSettingProps.listTypeChoose}>
									      	<RadioButton value="ul">
									      		无序列表
								      		</RadioButton>
									      	<RadioButton value="ol">
									      		有序列表
									      	</RadioButton>
									    </RadioGroup>
									</FormItem>
									<FormItem {...formItemLayout} label="无序号">
										<Switch size="small" onChange={listSettingProps.onChange}/>
									</FormItem>
						      	</Form>
						    </Panel>
	    				);
	    			},

	    			'image-setting' (item, attrTypeIndex) {

                        const skipToImggallery = {

                            handleClick() {
                                props.dispatch({
                                    type: 'vdcore/changeTabsPane',
                                    payload: {
                                    	activeTabsPane: 'assets',
                                    	linkTo: 'settings'
                                    }

                                });
                            }

                        }

					    const bgUploaderProps = {
					 		listType: 'picture',
						  	defaultFileList: item.children[0].fileInfo,

						  	beforeUpload () {
						  		props.dispatch({
						  			type: 'vdCtrlTree/handleImageSettingBeforeUpload',
						  			payload: item.children[0].fileInfo
						  		});
						  	},

						  	onChange (object) {
						  		formProps.handleAttrFormInputChange(item.children[0], attrType, {
						  			target: {
						  				value: object.file.thumbUrl
						  			}
						  		});
						  	}
					    }

                        const handleImgChange = () =>{

                            if(props.vdcore.ImgLink != "") {
                                formProps.handleAttrFormInputChange(item.children[0], attrType, {
                                        target: {
                                            value: props.vdcore.ImgLink
                                        }
                                    });
                                    
                                    const file = {
                                        url : props.vdcore.ImgLink
                                    }
                                    
                                    props.dispatch({
                                        type: 'vdCtrlTree/uploadPreviewImg',
                                        payload: file
                                    })
                            }                                                             
                        }

                        const saveImgLink = (e) =>{
                            props.dispatch({
                                type: 'vdcore/saveImgLink',
                                payload: e.target.value
                            })
                        }

	    				return (
						    <Panel header={item.title} key={item.key}>

								<div className="guidance-panel-wrapper">
									<div className="guidance-panel-child">
										<div className="bem-Frame">
											<div className="bem-Frame_Head">
												<div className="bem-Frame_Legend">
													<div className="bem-SpecificityLabel bem-SpecificityLabel-local bem-SpecificityLabel-text">
														图片资源
													</div>
												</div>
											</div>
											<div className="bem-Frame_Body">
												<Button onClick={skipToImggallery.handleClick} style={{ left: '0' ,top: '24px' ,bottom: '102px'}}><i className="fa fa-picture-o"></i>&nbsp;图片资源</Button>
										        <div className="background-setting-pane-img-preview">
                                                     <img id="imgPreview" style={{width: '80px', height: '65px'}} src={item.children[0].fileInfo[0].url}/>
                                                </div>
                                                <div>
                                                    <Form className="form-no-margin-bottom">
                                                        <Row>
                                                            <Col span={20}>
                                                                <FormItem {...formItemLayout} label="图片地址:">
                                                                    {props.vdcore.ImgLink == "" || props.vdcore.ImgLink == undefined? 
                                                                        <Input 
                                                                            size="small" value={item.children[0].fileInfo[0].url}  
                                                                            onPressEnter={handleImgChange}
                                                                            onChange={saveImgLink.bind(this)}
                                                                        /> : 
                                                                        <Input 
                                                                            size="small" defaultValue={props.vdcore.ImgLink}
                                                                            onBlur={saveImgLink.bind(this)}
                                                                            onPressEnter={handleImgChange}
                                                                        />
                                                                    }
                                                                    
                                                                </FormItem>
                                                            </Col>
                                                            <Col span={4}>
                                                                <FormItem>
                                                                    <Button onClick={handleImgChange} style={{marginLeft: '5px'}} size="small">应用</Button>
                                                                </FormItem>
                                                            </Col>  
                                                        </Row>
                                                    </Form>
                                                </div>
                                            </div>
										</div>

										<div className="bem-Frame">
											<div className="bem-Frame_Head">
												<div className="bem-Frame_Legend">
													<div className="bem-SpecificityLabel bem-SpecificityLabel-local bem-SpecificityLabel-text">
														大小
													</div>
												</div>
											</div>
											<div className="bem-Frame_Body">
												<Row>

												  	<Col span={11} style={{paddingRight: '5px'}}>
												      	<Form className="form-no-margin-bottom">
															<FormItem {...formItemLayout} label="宽度">
																<Input onChange={formProps.handleAttrFormInputChange.bind(this, item.children[2], attrType)} value={item.children[2].value} size="small" />
															</FormItem>
												      	</Form>
												  	</Col>
												  	<Col span={13} style={{paddingLeft: '5px'}}>
												      	<Form className="form-no-margin-bottom">
															<FormItem {...formItemLayout} label="高度">
																<Input onChange={formProps.handleAttrFormInputChange.bind(this, item.children[3], attrType)} value={item.children[3].value} size="small" />
															</FormItem>
												      	</Form>
												  	</Col>

												</Row>

											</div>
										</div>

								      	<Form className="form-no-margin-bottom">
											<FormItem {...formItemLayout} label={(
								              <span>
								                替换文本&nbsp;
								                <Tooltip title="当图片无法加载时显示此文字">
								                  <Icon type="question-circle-o" />
								                </Tooltip>
								              </span>
								            )}>
												<Input onChange={formProps.handleAttrFormInputChange.bind(this, item.children[1], attrType)} value={item.children[1].value} size="small" />
											</FormItem>
								      	</Form>

									</div>
								</div>

						    </Panel>
	    				);
	    			},

	    			'select-setting' (item, attrTypeIndex) {

                        const keyValueProps = {
                            valueChange(e){

                                props.dispatch({
                                    type: 'vdCtrlTree/handleChildrenAttrChange',
                                    payload: {
                                        index: props.vdCtrlTree.selectIndex,
                                        attr: {
                                            name: 'html',
                                            value: e.target.value,
                                        }
                                    }
                                });
                            },
                            keyValueChange(e){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleChildrenAttrChange',
                                    payload: {
                                        index: props.vdCtrlTree.selectIndex,
                                        attr: {
                                            name: 'value',
                                            value: e.target.value,
                                        }
                                    }
                                });
                            },
                            addKeyChange(e){

                                props.dispatch({
                                    type: 'vdCtrlTree/handleAddChildrenAttr',
                                    payload: {
                                        name: 'value',
                                        value: e.target.value,
                                    }
                                });
                            },
                            addHtmlChange(e){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleAddChildrenAttr',
                                    payload: {
                                        name: 'html',
                                        value: e.target.value,
                                    }
                                });
                            },
                        }
                        var selectItem =props.vdCtrlTree.activeCtrl.children[props.vdCtrlTree.selectIndex] || props.vdCtrlTree.activeCtrl.children[0];
					    const selectSettingProps = {

					    	creatorContent: (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="说明">
										<Input size="small"  value={props.vdCtrlTree.attr.html} onChange={keyValueProps.addHtmlChange} onPressEnter={formProps.childrenAdd.bind(this,0, 'forms', 'select', 0, [{level: 0, index: 0}])}/>
									</FormItem>
									<FormItem {...formItemLayout} label="值">
										<Input size="small" value={props.vdCtrlTree.attr.value} onChange={keyValueProps.addKeyChange} onPressEnter={formProps.childrenAdd.bind(this,0, 'forms', 'select', 0, [{level: 0, index: 0}])}/>
									</FormItem>
									<FormItem>
										<Button size="small" onClick={formProps.childrenAdd.bind(this,0, 'forms', 'select', 0, [{level: 0, index: 0}])} >保存</Button>
									</FormItem>
								</Form>
					    	),

					    	modifyContent: (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="说明">
										<Input size="small" value={selectItem.attrs[0].children[0].html} onChange={keyValueProps.valueChange} onPressEnter={formProps.childrenUpdate.bind(this,attrType)}/>
									</FormItem>
									<FormItem {...formItemLayout} label="值">
										<Input size="small" value={selectItem.attrs[0].children[0].value} onChange={keyValueProps.keyValueChange} onPressEnter={formProps.childrenUpdate.bind(this,attrType)}/>
									</FormItem>
									<FormItem>
										<Button size="small" onClick={formProps.childrenUpdate.bind(this,attrType)} >保存</Button>
									</FormItem>
								</Form>
					    	),

					    	createVisibleChange (value) {
                                props.dispatch({
                                    type: 'vdCtrlTree/handleCreateVisible',
                                    payload: value
                                });
					    	},
                            updateVisibleChange(value){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleUpdateVisible',
                                    payload: value
                                });
                            },
                            keyValueCreate(){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleCreateVisible',
                                    payload: true
                                });
                            },
                            keyValuesUpdate(){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleUpdateVisible',
                                    payload: true
                                });
                            },
                            editKeyValue(index) {
                                props.dispatch({
                                    type: 'vdCtrlTree/handleSelectIndex',
                                    payload: index
                                });
                            },
                            hidePopover(e){
                                e.stopPropagation();
                            },
					    }
                        const keyValues = props.vdCtrlTree.activeCtrl.children.map((item, index) =>{

                            return (
                                <li className="ant-dropdown-menu-item" role="menuitem" key={item.id}>
                                <Row>
                                  <Col span={18}>
                                    <p>{item.attrs[0].children[0].value} = {item.attrs[0].children[0].html}</p>
                                  </Col>
                                  <Col span={3}>
                                        <Icon type="edit" onClick={selectSettingProps.editKeyValue.bind(this, index)}/>
                                  </Col>
                                  <Col span={3}>
                                    <Popconfirm title="确认删除吗？" placement="left" onConfirm={formProps.childrenDelete.bind(this, item.attrs[0].children[0].value + '=' + item.attrs[0].children[0].html, item, index, 0, attrType)} okText="确定" cancelText="取消">
                                        <Icon type="delete" onClick={selectSettingProps.hidePopover}/>
                                        </Popconfirm>
                                  </Col>
                                </Row>
                              </li>
                            )
                        });
	    				return (
						    <Panel header={item.title} key={item.key}>
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="名称">
										<Input size="small" value={item.children[0].value} onChange={formProps.handleAttrFormInputChange.bind(this, item.children[0], attrType)}/>
									</FormItem>
									<FormItem {...formItemLayout} label="允许多选">
										<Switch size="small" onChange={formProps.handleAttrFormSwitchChange.bind(this, item.children[1], attrType)}  checked={item.children[1].value}/>
									</FormItem>
                                    <Popover
                                        content={selectSettingProps.creatorContent}
                                        title="添加 选项"
                                        trigger="click"
                                        visible={props.vdCtrlTree.keyValeCreateVisible}
                                        onVisibleChange = {selectSettingProps.createVisibleChange}
                                    >
        							    <Button type="circle" size="small"><Icon type="plus" /></Button>
                                    </Popover>
						      	</Form>
                                <Popover
                                    content={selectSettingProps.modifyContent}
                                    title="修改 选项"
                                    trigger="click"
                                    visible={props.vdCtrlTree.keyValeUpdateVisible}
                                    onVisibleChange = {selectSettingProps.updateVisibleChange}
                                >
    							    <ul  className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
                                        {keyValues}
    							    </ul>
                                </Popover>

						    </Panel>
	    				);
	    			},

	    			'tabs-setting' (item, attrTypeIndex) {

                        const keyValueProps = {

                            keyValueChange(e){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleChildrenAttrChange',
                                    payload: {
                                        index: props.vdCtrlTree.selectIndex,
                                        attr: {
                                            name: 'value',
                                            value: e.target.value,
                                            isTab: true
                                        }
                                    }
                                });
                            }
                        }
                        var tabItem = props.vdCtrlTree.activeCtrl.children[0].children[props.vdCtrlTree.selectIndex] || props.vdCtrlTree.activeCtrl.children[0].children[0];
					    const tabSettingProps = {
					    	modifyContent: (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="名称">
										<Input size="small" value={tabItem.children[0].attrs[0].children[4].value} onChange={keyValueProps.keyValueChange} onPressEnter={formProps.childrenUpdate.bind(this,attrType)}/>
									</FormItem>
									<FormItem>
										<Button size="small" onClick={formProps.childrenUpdate.bind(this,attrType)}>保存</Button>
									</FormItem>
								</Form>
					    	),

					    	onVisibleChange () {

					    	},
                            createVisibleChange (value) {
                                props.dispatch({
                                    type: 'vdCtrlTree/handleCreateVisible',
                                    payload: value
                                });
                            },
                            updateVisibleChange(value){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleUpdateVisible',
                                    payload: value
                                });
                            },
                            keyValueCreate(){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleCreateVisible',
                                    payload: true
                                });
                            },
                            keyValuesUpdate(){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleUpdateVisible',
                                    payload: true
                                });
                            },
                            editKeyValue(index) {
                                props.dispatch({
                                    type: 'vdCtrlTree/handleSelectIndex',
                                    payload: index
                                });

                                props.dispatch({
                                    type: 'vdCtrlTree/handleUpdateVisible',
                                    payload: !props.vdCtrlTree.keyValeUpdateVisible
                                });
                            },
                            hidePopover(e){
                                e.stopPropagation();
                            },
                            addTabs(){

                                var random =  randomString(8, 10);;

                                var tab = copyOperate.copyChildren(0, 'component','tabs', 2);
                                tab.children[0].attrs[0].children[0].value = '#' + random;
                                props.dispatch({
                                    type: 'vdCtrlTree/handleChildrenAdd',
                                    payload: {
                                        activeCtrl: props.vdCtrlTree.activeCtrl,
                                        children: tab,
                                        levelsInfo: [{ level:2, index: 0}],
                                        level: 2
                                    }
                                });
                                var content = copyOperate.copyChildren(0, 'component','tabs', 2, [{ level:0, index: 1}]);
                                content.attrs[0].children[0].value = random;
                                props.dispatch({
                                    type: 'vdCtrlTree/handleChildrenAdd',
                                    payload: {
                                        activeCtrl: props.vdCtrlTree.activeCtrl,
                                        children: content,
                                        levelsInfo: [{ level:0, index: 1}],
                                        level: 2
                                    }
                                });

                            },
                            chooseTab(item, index ,e){

                                //改变active tab 对应的panel active

                                props.dispatch({
                                    type: 'vdCtrlTree/handleActive',
                                    payload: {
                                        level: 2,
                                        levelsInfo: [],
                                        index: index,
                                    }
                                });
                                props.dispatch({
                                    type: 'vdCtrlTree/handleActive',
                                    payload: {
                                        level: 2,
                                        levelsInfo: [{level: 0, index:1}],
                                        index: index
                                    }
                                });
                                 e.stopPropagation();
                            },
                            handleFade(e){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleFade',
                                    payload: {
                                        value: e
                                    }
                                });
                            },
					    }
                        const keyValues = props.vdCtrlTree.activeCtrl.children[0].children.map((item, index) =>{

                            return (
                                <li className="ant-dropdown-menu-item" role="menuitem" key={index} onClick={tabSettingProps.chooseTab.bind(this,item, index)}>
                                <Row >
                                  <Col span={15}>
                                    <p>{item.children[0].attrs[0].children[4].value}</p>
                                  </Col>
                                  <Col span={3}>
                                    <Radio onChange={tabSettingProps.hidePopover} checked={index == props.vdCtrlTree.selectIndex}></Radio>
                                  </Col>
                                  <Col span={3}>
                                        <Icon type="edit" onClick={tabSettingProps.editKeyValue.bind(this, index)}/>
                                  </Col>
                                  <Col span={3}>
                                    <Popconfirm placement="topRight" title="确认删除吗？" onConfirm={formProps.childrenDelete.bind(this, item.children[0].attrs[0].children[0].value , item, index, 2, attrType)} okText="确定" cancelText="取消">
                                        <Icon type="delete" onClick={tabSettingProps.hidePopover}/>
                                        </Popconfirm>
                                  </Col>
                                </Row>
                              </li>
                            )
                        });
	    				return (
						    <Panel header={item.title} key={item.key}>


						      	<Form className="form-no-margin-bottom">
                                    <FormItem {...formItemLayout} label="过渡效果" >
                                        <Switch size="small" value={item.children[0].value} onChange={tabSettingProps.handleFade}/>
                                    </FormItem>
						      	</Form>

								<Button type="circle" size="small"><Icon type="plus"  onClick={tabSettingProps.addTabs}/></Button>

                                    <Popover
                                        content={tabSettingProps.modifyContent}
                                        title="修改 选项"
                                        trigger="click"
                                        visible={props.vdCtrlTree.keyValeUpdateVisible}
                                        onVisibleChange = {tabSettingProps.updateVisibleChange}
                                        placement="topRight"
                                    >
        							    <ul style={{background: '#f7f7f7'}}  className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
                                            {keyValues}
        							    </ul>
                                    </Popover>

						    </Panel>
	    				);
	    			},

	    			'dropdown-menu' (item, attrTypeIndex) {
	    				return (
						    <Panel header={item.title} key={item.key}>
						    	<Row>
						    		<Col span={12}>
						    			<Button size="small"><Icon type="bars" />打开菜单</Button>
						    		</Col>
						    		<Col span={12}>
						    			<Button size="small"><Icon type="plus" />新增菜单</Button>
						    		</Col>
						    	</Row>
						    </Panel>
	    				);
	    			},

	    			'slider-setting' (item, attrTypeIndex) {

                        const keyValueProps = {

                            keyValueChange(e){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleChildrenAttrChange',
                                    payload: {
                                        index: props.vdCtrlTree.selectIndex,
                                        attr: {
                                            name: 'value',
                                            value: e.target.value,
                                            isTab: true
                                        }
                                    }
                                });
                            },
                            handleAttrFormInputChange(index,target, attrType, dom){

                                let newVal = dom.target ? dom.target.value : dom;

                                props.dispatch({
                                    type: 'vdCtrlTree/handleAttrFormChangeNotRefreshActiveCtrl',
                                    payload: {
                                        index: index,
                                        target: target,
                                        attrType: attrType,
                                        newVal: newVal
                                    }
                                });
                            }
                        }
                        var itemImage = props.vdCtrlTree.activeCtrl.children[1].children[props.vdCtrlTree.selectIndex] || props.vdCtrlTree.activeCtrl.children[1].children[0] ;
                        const skipToImggallery = {

                            handleClick() {
                                props.dispatch({
                                    type: 'vdcore/changeTabsPane',
                                    payload: {
                                    	activeTabsPane: 'assets',
                                    	linkTo: 'settings'
                                    }

                                });
                            }

                        }

					    const sliderSettingProps = {


					    	onVisibleChange () {

					    	},
                            createVisibleChange (value) {
                                props.dispatch({
                                    type: 'vdCtrlTree/handleCreateVisible',
                                    payload: value
                                });
                            },
                            updateVisibleChange(value){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleUpdateVisible',
                                    payload: value
                                });
                            },
                            keyValueCreate(){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleCreateVisible',
                                    payload: true
                                });
                            },
                            keyValuesUpdate(){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleUpdateVisible',
                                    payload: true
                                });
                            },
                            editKeyValue(index) {
                                props.dispatch({
                                    type: 'vdCtrlTree/handleSelectIndex',
                                    payload: index
                                });
                            },
                            handleIndex(index) {
                                props.dispatch({
                                    type: 'vdCtrlTree/handleSelectIndex',
                                    payload: index
                                });

                            },
                            handleChooseImage(){
                                props.dispatch({
                                    type: 'vdcore/changeTabsPane',
                                    payload: {
                                    	activeTabsPane: 'assets',
                                    	linkTo: 'settings'
                                    }

                                });
                            },
                            hidePopover(){
                                setTimeout(function(){
                                    props.dispatch({
                                        type: 'vdCtrlTree/handleUpdateVisible',
                                        payload: false
                                    });
                                }, 10)
                            },
                            handleSliderDelete(target, parent, index, type){

                                props.dispatch({
                                    type: 'vdCtrlTree/handleComplextChildrenDelete',
                                    payload:{
                                        target: target,
                                        parent: parent,
                                        type: type,
                                        index: index
                                    }
                                });
                            }
                        }
                        const sliderProps = {
                            addSlider(){

                                var sliderId = props.vdCtrlTree.activeCtrl.attrs[0].children[1].value;

                                var slider = copyOperate.copyChildren(0, 'component','slider', 2);
                                slider.attrs[0].children[1].value = props.vdCtrlTree.activeCtrl.children[0].children.length;
                                slider.attrs[0].children[0].value = '#' + sliderId
                                props.dispatch({
                                    type: 'vdCtrlTree/handleChildrenAdd',
                                    payload: {
                                        activeCtrl: props.vdCtrlTree.activeCtrl,
                                        children: slider,
                                        levelsInfo: [{ level:2, index: 0}],
                                        level: 2
                                    }
                                });
                                var content = copyOperate.copyChildren(0, 'component','slider', 2, [{ level:0, index: 1}]);
                                var style = 'height: '+ props.vdCtrlTree.activeCtrl.attrs[0].children[3].value + props.vdCtrlTree.heightUnit +'; width: ' + props.vdCtrlTree.activeCtrl.attrs[0].children[4].value + props.vdCtrlTree.widthUnit + ';'
                                content.children[0].attrs[0].children[2].value = style;
                                props.dispatch({
                                    type: 'vdCtrlTree/handleChildrenAdd',
                                    payload: {
                                        activeCtrl: props.vdCtrlTree.activeCtrl,
                                        children: content,
                                        levelsInfo: [{ level:0, index: 1}],
                                        level: 2
                                    }
                                });
                            }
                        }
                        const images = props.vdCtrlTree.activeCtrl.children[1].children.map((item, index) =>{

                            return (
                                <li className="ant-dropdown-menu-item" role="menuitem" key={index} onClick={sliderSettingProps.handleIndex.bind(this, index)}>
                                <Row>
                                <Col span={3}>
                                      <Icon type="edit" onClick={sliderSettingProps.handleChooseImage.bind(this, index)}/>
                                </Col>
                                <Col span={3}>
                                  <Popconfirm title="确认删除吗？" onConfirm={sliderSettingProps.handleSliderDelete.bind(this, itemImage.vdid , itemImage.parent, index, 'slider-delete')} okText="确定" cancelText="取消">
                                      <Icon type="delete" onClick={sliderSettingProps.hidePopover}/>
                                      </Popconfirm>
                                </Col>
                                  <Col span={18}>
                                    <img alt="assets" style={{ width: '50px', textAlign: 'right' }} src={item.children[0].attrs[0].children[0].value} />
                                  </Col>
                                </Row>
                              </li>
                            )
                        });
                        const activeSliderProps = {

                            next(){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleActive',
                                    payload: {
                                        level: 2,
                                        levelsInfo: [{level: 0, index:1}],
                                        index: 0,
                                        action: 'next'
                                    }
                                });
                                props.dispatch({
                                    type: 'vdCtrlTree/handleActive',
                                    payload: {
                                        level: 2,
                                        levelsInfo: [],
                                        index: 0,
                                        action: 'next'
                                    }
                                });
                            },
                            last(){

                                props.dispatch({
                                    type: 'vdCtrlTree/handleActive',
                                    payload: {
                                        level: 2,
                                        levelsInfo: [{level: 0, index:1}],
                                        index: 0,
                                        action: 'last'
                                    }
                                });
                                props.dispatch({
                                    type: 'vdCtrlTree/handleActive',
                                    payload: {
                                        level: 2,
                                        levelsInfo: [],
                                        index: 0,
                                        action: 'last'
                                    }
                                });
                            },
                            handleSliderHeightAndWidth(item, value){

                            },
                            heightUnitChange(value) {
                                props.dispatch({
                                    type: 'vdCtrlTree/handleUnit',
                                    payload: {
                                        target: 'heightUnit',
                                        value: value
                                    }
                                });
                            },
                            widthUnitChange(value) {
                                props.dispatch({
                                    type: 'vdCtrlTree/handleUnit',
                                    payload: {
                                        target: 'widthUnit',
                                        value: value
                                    }
                                });
                            }
                        }
                        const heightSelectAfter = (
                          <Select defaultValue={props.vdCtrlTree.heightUnit} onChange={activeSliderProps.heightUnitChange} style={{ width: 50 }}>
                                <Option style={{marginLeft: '12px'}} value="%">%</Option>
                                <Option style={{marginLeft: '12px'}} value="px">px</Option>
                          </Select>
                        );
                        const widthSelectAfter = (
                          <Select defaultValue={props.vdCtrlTree.widthUnit} onChange={activeSliderProps.widthUnitChange} style={{ width: 50 }}>
                                <Option style={{marginLeft: '12px'}} value="%">%</Option>
                                <Option style={{marginLeft: '12px'}} value="px">px</Option>
                          </Select>
                        );
	    				return (
						    <Panel header={item.title} key={item.key}>
                            <Form className="form-no-margin-bottom">
                               <FormItem {...formItemLayout} label="高度">
                                    <Input size="small" value={props.vdCtrlTree.activeCtrl.attrs[0].children[3].value} onChange={formProps.handleAttrFormInputChange.bind(this, props.vdCtrlTree.activeCtrl.attrs[0].children[3], attrType)} addonAfter={heightSelectAfter}/>
                               </FormItem>
                               <FormItem {...formItemLayout} label="宽度">
                                    <Input size="small" value={props.vdCtrlTree.activeCtrl.attrs[0].children[4].value} onChange={formProps.handleAttrFormInputChange.bind(this, props.vdCtrlTree.activeCtrl.attrs[0].children[4], attrType)}  addonAfter={widthSelectAfter}/>
                               </FormItem>
                            </Form>
						    	<Row style={{marginTop: '15px'}}>
						    		<Col span={12}>
						    			<Button size="small" onClick={sliderProps.addSlider}><Icon type="plus"/>增加一个</Button>
						    		</Col>
						    		<Col span={12}>
						    			<Col span={12} style={{textAlign: 'right'}} >
							    			<Button size="small" style={{marginRight: '5px'}} onClick={activeSliderProps.last.bind(item)}><Icon type="left" /></Button>
						    			</Col>
						    			<Col span={12} style={{textAlign: 'left'}}>
							    			<Button size="small" style={{marginLeft: '5px'}} onClick={activeSliderProps.next.bind(item)}><Icon type="right" /></Button>
						    			</Col>
						    		</Col>
						    	</Row>
                                <ul style={{background: '#f7f7f7'}}  className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
                                    {images}
                                </ul>
						    </Panel>
	    				);
	    			},
                    'icon-setting' (item, attrTypeIndex){

                        const iconOperate = {

                            updateVisibleChange(value){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleUpdateVisible',
                                    payload: value
                                });
                            },
                            closeIconPanel(){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleUpdateVisible',
                                    payload: false
                                });
                            },
                            chooseIcon(item){
                                props.dispatch({
                                    type: 'vdCtrlTree/handleUpdateVisible',
                                    payload: false
                                });
                                props.dispatch({
                                    type: 'vdCtrlTree/handleClassNameChange',
                                    payload: {
                                        remove: props.vdCtrlTree.activeCtrl.attrs[0].children[1].value,
                                        replacement: item,
                                        level: 0,
                                        index: 1,
                                        levelsInfo: []
                                    }
                                });
                            },
                            onSelect(e){

                                props.dispatch({
                                    type: 'vdCtrlTree/handleClassNameChange',
                                    payload: {
                                        remove: props.vdCtrlTree.activeCtrl.attrs[0].children[2].value,
                                        replacement: e,
                                        level: 0,
                                        index: 2,
                                        levelsInfo: []
                                    }
                                });
                            },
                            switchSpin(e){
                                if(e){
                                    props.dispatch({
                                        type: 'vdCtrlTree/handleClassNameChange',
                                        payload: {
                                            remove: props.vdCtrlTree.activeCtrl.attrs[0].children[3].value,
                                            replacement: 'fa-spin',
                                            level: 0,
                                            index: 3,
                                            levelsInfo: []
                                        }
                                    });
                                }else {
                                    props.dispatch({
                                        type: 'vdCtrlTree/handleClassNameChange',
                                        payload: {
                                            remove: 'fa-spin',
                                            replacement: '',
                                            level: 0,
                                            index: 3,
                                            levelsInfo: []
                                        }
                                    });
                                }
                            }
                        }
                        const iconSettingProps = {
                            title: (
                                    <Row>
                                        <Col span={22}>
                                            选择 图标
                                        </Col>
                                        <Col span={2}>
                                            <Button size="small" type="primary" onClick={iconOperate.closeIconPanel} ><Icon type="shrink" />返回</Button>
                                        </Col>
                                    </Row>
                                ),

                            iconList: (<Tabs defaultActiveKey="0">
                                        
                                 { //<i className={item} onClick={iconOperate.chooseIcon.bind(this, item)} />
                                     props.vdCtrlTree.icons.map((item,index)=>{
                                         return (
                                             <TabPane style={{padding: '80px'}} tab={item.name} key={index}>
                                                <Row>
                                                    {
                                                        item.list.map((listItem,listIndex)=>{
                                                            return (
                                                                    <Col className="icon-page-list" onClick={iconOperate.chooseIcon.bind(this, listItem.icon)} span={6} key={listIndex}>
                                                                        <i className={listItem.icon} />
                                                                        <span className="icon-name">{listItem.icon.substring(6)}</span>
                                                                    </Col>
                                                                )
                                                         })
                                                    }
                                                </Row>
                                             </TabPane>
                                         );
                                     })
                                 }
                            </Tabs>)
                        }
                        return (
                            <Panel header={item.title} key={item.key}>

                                <Form className="form-no-margin-bottom">
                                   <FormItem {...formItemLayout} label="图标类型">
                                       <Select size="small" value="Font Awesome">
                                             <Option key="over-right" value="fa">Font Awesome</Option>
                                       </Select>
                                   </FormItem>
                                </Form>
	                            <Row>
	                                <Col span={12}>
                                    <Popover
                                        content={iconSettingProps.iconList}
                                        overlayClassName="icon-popover"
                                        title={iconSettingProps.title}
                                        visible={props.vdCtrlTree.keyValeUpdateVisible}
                                        onVisibleChange={iconOperate.updateVisibleChange}
                                        trigger="click">
	                                    <Button size="small" ><Icon type="bars" />选择图标</Button>
                                    </Popover>
	                                </Col>

	                            </Row>
                                <Form className="form-no-margin-bottom">
                                    <FormItem {...formItemLayout} label="旋转动画" key={item.id}>
                                        <Switch size="small" checked={props.vdCtrlTree.activeCtrl.attrs[0].children[3].value=="fa-spin"} onChange={iconOperate.switchSpin}/>
                                    </FormItem>
                                   <FormItem {...formItemLayout} label="图标大小">
                                       <Select size="small" onSelect={iconOperate.onSelect} value={props.vdCtrlTree.activeCtrl.attrs[0].children[2].value}>
                                             <Option key="over-right" value="fa-1x">1X</Option>
                                             <Option key="over-right" value="fa-2x">2X</Option>
                                             <Option key="over-right" value="fa-3x">3X</Option>
                                             <Option key="over-right" value="fa-4x">4X</Option>
                                             <Option key="over-right" value="fa-5x">5X</Option>
                                       </Select>
                                   </FormItem>
                               </Form>

                        	</Panel>
                        );
                    },
	    			'navbar-setting' (item, attrTypeIndex) {

                        const navbarSettingProps = {
                            onSelect: function(val, target) {

                                let remove = val == 'navbar-left' ? 'navbar-right' : 'navbar-left';

                                props.dispatch({
                                    type: 'vdCtrlTree/handleClassNameChange',
                                    payload: {
                                        remove: remove,
                                        replacement: val,
                                        level: 3,
                                        levelsInfo: [{level: 1, index: 1}]
                                    }
                                });
                            },
                            openMenu(){
                                if(props.vdcore.VDDesigner.activeSize == 'pc' || props.vdcore.VDDesigner.activeSize == 'alignTablet'){
                                    props.dispatch({
                    	        		type: 'vdcore/changeVDSize',
                    	        		payload: {
                    	        			VDSize: 'verticalTablet'
                    	        		}
                    	        	});
                                }
                                props.dispatch({
                                    type: 'vdCtrlTree/triggerMenu',
                                });
                            }
                        }
	    				return (
	    					<Panel header={item.title} key={item.key}>
	                            <Row style={{marginTop: '15px'}}>
	                                <Col span={12}>
	                                    <Button size="small" onClick={navbarSettingProps.openMenu}><Icon type="bars" />{props.vdCtrlTree.showLabel}</Button>
	                                </Col>
	                                <Col span={12}>
                                        <Button size="small" onClick={formProps.childrenAdd.bind(this,0, 'components', 'navbar', 4, [{level: 1,index:1}])}><Icon type="plus" />新增菜单</Button></Col>
	                            </Row>

	                            <Form className="form-no-margin-bottom">
	                                <FormItem {...formItemLayout} label="菜单类型">
	                                    <Select size="small" onSelect={navbarSettingProps.onSelect}>
	                                          <Option key="over-right" value="navbar-right">靠右</Option>
	                                          <Option key="over-left" value="navbar-left">靠左</Option>
	                                    </Select>
	                                </FormItem>
	                            </Form>
                        	</Panel>
                        );
	    			},
                    'dropdown-setting'(item, attrTypeIndex) {

	    				return (
	    					<Panel header={item.title} key={item.id}>
	                            <Row style={{marginTop: '15px'}}>
	                                <Col span={12}>
                                        <Button size="small" onClick={formProps.childrenAdd.bind(this,1, 'components', 'dropdown', 2, [{level: 0,index:1}])}><Icon type="plus" 	/>新增菜单</Button>
                                    </Col>
	                            </Row>
                        	</Panel>
                        );
	    			},
	    			'columns-setting' (item, attrTypeIndex) {

	    				const columnHandler = {
	    					handleColumnCountChange (e) {
	    						props.dispatch({
	    							type: 'vdcore/columnCountChange',
	    							payload: {
	    								value: e.target.value
	    							}
	    						});
	    					}
	    				}

						const makeColumnSliderDraggable = (id, index) => {
							var inter = setInterval(function() {
								if($('#' + id).length !== 0) {
									clearInterval(inter);

									if ($('#' + id).data('isBinded')) {
										return;
									}
									$('#' + id).data('isBinded', true);
									$('#' + id).dragging({
										move: 'x',

										onMoveToLeft: function() {
											props.dispatch({
												type: 'vdCtrlTree/shrinkLeftColumn',
												payload: {
													index
												}
											});
										},

										onMoveToRight: function() {
											props.dispatch({
												type: 'vdCtrlTree/expandLeftColumn',
												payload: {
													index
												}
											});
										}
									});
								}
							}, 100);
						}

	    				return (
	    					<Panel header={item.title} key={item.key}>
	                            <Form className="form-no-margin-bottom">
	                                <FormItem {...formItemLayout} label="栅格数">
	                                	<Input size="small" min="1" placeholder="只能输入1到12" max="12" onChange={columnHandler.handleColumnCountChange.bind(this)} value={item.children[0].value} type="number" />
	                                </FormItem>
	                            </Form>
	                            <div className="column-slider-box">
	                            	<div className="grid-slider">
	                            		<Row>
	                            		{
	                            			item.children[1].value.map((column, columnIndex) => {
	                            				return (
			                            			<Col key={columnIndex} span={column.span}>
					                            		<div className="column-slider-column">
					                            			{column.value}
					                            		</div>
					                            		{
					                            			columnIndex == item.children[0].value - 1 ? '' : (
							                            		<div id={'column-slider' + columnIndex} className="column-slider-gutter">
							                            			{makeColumnSliderDraggable('column-slider' + columnIndex, columnIndex)}
							                            			<div className="handle"></div>
							                            		</div>
					                            			)
					                            		}
			                            			</Col>
	                            				);
	                            			})
	                            		}
	                            		</Row>
	                            	</div>
	                            </div>
	    					</Panel>
	    				);
	    			}
				};
				return specialAttrHandler[item.key](item, index);
			}

    		const formTypeGenerator = (item) => {

    			if (item.backend) {
    				return false;
    			}

    			const formTypeList = {
    				input (item) {

    					var inputTpl = item.props ? (
							<Input onChange={formProps.handleAttrFormInputChange.bind(this, item, attrType)} {...item.props} value={item.value} size="small" onPressEnter={formProps.handleAttrFormInputChange.bind(this, item, attrType)}/>
    					) : (
							<Input onChange={formProps.handleAttrFormInputChange.bind(this, item, attrType)} value={item.value} size="small" onPressEnter={formProps.handleAttrFormInputChange.bind(this, item, attrType)}/>
    					);

		    			return (
							<FormItem key={item.id} {...formItemLayout} label={item.desc}>
								{inputTpl}
							</FormItem>
		    			);
    				},
                    buttonAdd (item) {
                        return (
                            <FormItem {...formItemLayout} label="" key={item.id}>
                                <Button size="small" onClick={formProps.handleComplexChildrenAdd.bind(this, 'components', 'navbar',item, 'navbar-drop-down')}><Icon type="plus" />增加一个</Button>
                            </FormItem>
                        );
                    },
                    switchType(item) {

                        const dropdownProps = {

                            switchDropDown(item){
                                let replacement = copyOperate.copyChildren(0, 'components', 'navbar', 5, [{level: 1,index:1}]);
                                replacement.parent = props.vdCtrlTree.activeCtrl.parent;
                                props.dispatch({
                                    type: 'vdCtrlTree/handleChangeCurrentCtrl',
                                    payload: {
                                        replacement: replacement,
                                    }
                                });
                            }
                        }
                        return (
                            <FormItem {...formItemLayout} label="普通菜单" key={item.id}>
                                <Switch size="small" onChange={dropdownProps.switchDropDown.bind(this, item)}/>
                            </FormItem>
                        )
                    },
                    buttonDelete (item) {
                        return (
                            <FormItem {...formItemLayout} label="" key={item.id}>
                                <Popconfirm title="确认删除吗？" onConfirm={formProps.handleComplextChildrenDelete.bind(this, '下拉菜单', 'navbar-drop-down')} >
                                    <Button size="small" ><Icon type="delete" />&nbsp;&nbsp;删除</Button>
                                </Popconfirm>
                            </FormItem>
                        );
                    },
    				multipleSelect (item) {
    					return (
							<FormItem key={item.id} {...formItemLayout} label={item.desc}>
								<Select
								    multiple
								    style={{ width: '100%', marginBottom: '5px'}}
								    value={item.value}
								    size="small"
								    onChange={formProps.handleAttrFormSelectChange.bind(this, item, attrType)}
								 >
								    {
								    	item.valueList.map((val, key) => {
								    		return (
									    	  <Option key={key} value={val.value}>{val.name}</Option>
								    		);
								    	})
								    }
							  	</Select>
							</FormItem>
    					);
    				},

    				select (item) {
    					return (
							<FormItem key={item.id} {...formItemLayout} label={item.desc}>
								<Select
								    style={{ width: '100%', marginBottom: '5px'}}
								    value={item.value}
								    size="small"
							     	onChange={formProps.handleAttrFormSelectChange.bind(this, item, attrType)}
								 >
								    {
								    	item.valueList.map((val, key) => {
								    		return (
									    	  <Option key={key} value={val}>{val}</Option>
								    		);
								    	})
								    }
							  	</Select>
							</FormItem>
    					);
    				},

    				toggle (item) {
						return (
							<FormItem key={item.id} {...formItemLayout}	label={item.desc}>
								<Switch size="small" onChange={formProps.handleAttrFormSwitchChange.bind(this, item, attrType)}  checked={item.value} />
							</FormItem>
						);
    				}
    			}

                if(item.type != null && item.type != undefined){
                    return formTypeList[item.type](item);
                }else {
                    return;
                }
    		}

    		const formGenerator = (items) => {
    			return (
			      	<Form className="form-no-margin-bottom">
			      		{
			    			items.map((item, index) => {
			    				return formTypeGenerator(item);
    						})
			      		}
			      	</Form>
    			);
    		}

			const panelGenerator = (attrItem) => {
				return (
			    	<Panel header={item.title} key={item.key}>
			    		{formGenerator(attrItem.children)}
					</Panel>
				);
			}

			let panel = panelGenerator(item);
			return panel;

    	});
    }

    const settingPanelDefaultActiveKey = ['container-attr', 'div-block-attr', 'list-attr', 'list-item-attr', 'h1-attr', 'paragraph-attr', 'text-link-attr', 'text-block-attr', 'blick-quote-attr', 'p-attr', 'video-attr', 'form-setting', 'label-attr', 'input-attr', 'textarea-attr', 'checkbox-attr', 'radio-attr', 'options-setting', 'slider-setting', 'section-attr', 'button-attr', 'link-block-attr','navbar-dropdown-setting','dropdown-setting', 'block-quote-attr', 'slider-label-setting', 'unctrl-setting', 'btn-dropdown'];

    for (var i = 0; i < specialAttrList.length; i++) {
    	var attr = specialAttrList[i];
    	settingPanelDefaultActiveKey.push(attr);
    };

    settingPanelDefaultActiveKey.push('basic');

  	return (

  		<div className="vdctrl-pane-wrapper">
			<Collapse bordered={false} defaultActiveKey={settingPanelDefaultActiveKey}>
				{attrsPanels()}
			</Collapse>
  		</div>

  	);

};

function mapSateToProps({ vdcore, vdctrl, vdCtrlTree, vdpm }) {
  return { vdcore, vdctrl, vdCtrlTree, vdpm };
}

export default connect(mapSateToProps)(Component);
