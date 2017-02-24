import React , { PropTypes } from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';
import { Collapse } from 'antd';
import { Radio, Popover, Upload, Slider } from 'antd';

import randomString from '../../../utils/randomString.js';

import { Tree, Form, Switch, Input, Cascader, Select, Row, Col, Checkbox, Menu, Dropdown, message, Tag, Table, Popconfirm } from 'antd';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

const Option = Select.Option;
const confirm = Modal.confirm;
const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const Component = (props) => {

    const formItemLayout = {
      	labelCol: { span: 8 },
      	wrapperCol: { span: 16 }
    };
    const vdCtrlOperate = {
        /**
         * 查找当前活跃控件的配置数据
         */
        findCtrlOriginConfig(fatherKey, key){

            for (var i = 0; i < props.vdctrl.controllers.length; i++) {
                console.log(props.vdctrl.controllers[i].key);
                console.log(key);
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
        loopAttr(controller, parent) {

            let childCtrl = {},
                tmpAttr = {},
                ctrl = {};

            tmpAttr = controller.attrs;
            for(let i = 0, len = tmpAttr.length; i < len; i ++) {
                // console.log(tmpAttr[i]);
                if(specialAttrList.indexOf(tmpAttr[i].key) != -1) {
                    continue;
                }
                for (var j = 0; j < tmpAttr[i].children.length; j++) {
                    var attr = tmpAttr[i].children[j];
                    attr['id'] = randomString(8, 10);
                };
            }
            if(controller.vdid == null || controller.vdid == undefined){
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
                    parent: parent || '',
                    unActive: controller.unActive
                };
            }else{
                ctrl = {
                    vdid: parent,
                    attrs: tmpAttr,
                    tag: controller.tag,
                    className: controller.className,
                    customClassName: [],
                    activeStyle: '',
                    children: [],
                    isRander: controller.isRander || '',
                    ignore: controller.ignore || false,
                    parent: parent || '',
                    unActive: false,
                };
            }

            if(controller.children) {
                for (var i = 0; i < controller.children.length; i++) {
                    var currentCtrl = controller.children[i];
                    childCtrl = vdCtrlOperate.loopAttr(currentCtrl, parent);
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
            console.log(levelsInfo);
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
                        console.log(i, comonIndex);
                        copyByLevel(parent.children[comonIndex]);
                    }else{
                        result = vdCtrlOperate.deepCopyObj(parent.children[0], result)
                    }
                }
            copyByLevel(parent);
            result = vdCtrlOperate.loopAttr(result, parent.vdid);
            console.log('copyChildren', result);
            return result;
        }
    }
	const formProps = {
		handleAttrFormInputChange (item, attType, dom) {
			var newVal = dom.target.value;
			var attrName = item.name;
            //
			console.log('============', newVal, attrName, item);

			props.dispatch({
				type: 'vdCtrlTree/handleAttrFormChange',
				payload: {
					newVal: newVal,
					attrName: attrName
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

		handleAttrFormSwitchChange (item, attType, checked) {
			var attrName = item.name;
			props.dispatch({
				type: 'vdCtrlTree/handleAttrFormChange',
				payload: {
					newVal: checked,
					attrName: attrName,
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
			var attrName = item.name;
			props.dispatch({
				type: 'vdCtrlTree/handleAttrFormChange',
				payload: {
					newVal: selectedVal,
					attrName: attrName
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
        childrenUpdate(attType){

            console.log('update');
            props.dispatch({
                type: 'vdCtrlTree/handleChildrenUpdate',
                payload: {
                    activeCtrl: props.vdCtrlTree.activeCtrl.children[props.vdCtrlTree.selectIndex],
                    attrType: attType
                }
            });
        },
        childrenAdd(index, fatherKey, key, level, levelsInfo){

            console.log('navbar');
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
        }

	}

   	const specialAttrList = props.vdctrl.specialAttrList;

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
										<Input value={customAttrCreator.key} onChange={customAttrCreator.onChange.bind(customAttrCreator, 'key')} size="small" />
									</FormItem>
									<FormItem {...formItemLayout} label="value">
										<Input value={customAttrCreator.value} onChange={customAttrCreator.onChange.bind(customAttrCreator, 'value')} size="small" />
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
											<Input onChange={handleInputChange.bind(this, index, 'key')} value={val.key} size="small" />
										</FormItem>
										<FormItem {...formItemLayout} label="value">
											<Input onChange={handleInputChange.bind(this, index, 'value')} value={val.value} size="small" />
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
											<Button type="circle" size="small"><Icon type="plus" /></Button>
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

	    				const handleLinkSettingValueChange = (item, attType, dom) => {

				    		// props.dispatch({
				    		// 	type: 'vdcore/handleLinkSettingValueChange',
				    		// 	payload: dom.target.value
				    		// });

				    		props.dispatch({
		    					type: 'vdCtrlTree/saveCustomAttr',
		    					payload: {
		    						key: 'href',
		    						value: dom.target.value,
		    						attrTypeIndex: attrTypeIndex,
		    						attrType: attrType
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
				    	};

					    const linkSettingProps = {

					    	linkSettingTemplate: props.vdcore.linkSetting.list.map( (item, index) => {
								return (
									<RadioButton key={item.value} value={item.value}>
						              	<Tooltip placement="top" title={item.tip}>
						      				<Icon type={item.icon} />
						      			</Tooltip>
							      	</RadioButton>
								);
							}),

					    	tpl: [(
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="链接地址">
										<Input size="small" value={item.children[0].value} onChange={formProps.handleAttrFormInputChange.bind(this, item.children[0], attrType)}/>
									</FormItem>

									<FormItem {...formItemLayout} label="新窗口">
										<Switch value={item.children[1].value} onChange={formProps.handleAttrFormSwitchChange.bind(this, item.children[1], attrType)} size="small" />
									</FormItem>
                                    <FormItem {...formItemLayout} label="显示文本">
										<Input value={item.children[2].value} onChange={formProps.handleAttrFormInputChange.bind(this, item.children[2], attrType)} size="small" />
									</FormItem>
						      	</Form>
					    	), (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="邮箱地址">
										<Input value={item.children[0].value} size="small" onChange={formProps.handleAttrFormInputChange.bind(this, item.children[0], attrType)}/>
									</FormItem>
						      	</Form>
					    	), (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="手机号码">
										<Input value={item.children[0].value} size="small" onChange={formProps.handleAttrFormInputChange.bind(this, item.children[0], attrType)}/>
									</FormItem>
						      	</Form>
					    	), (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="页面">
									    <Select size="small" value="请选择页面">
									      	<Option key="sss" value="h1">h1</Option>
									    </Select>
									</FormItem>
									<FormItem {...formItemLayout} label="新窗口">
										<Switch size="small" />
									</FormItem>
						      	</Form>
					    	), (
								<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="元素">
									    <Select size="small" value="请选择元素">
									      	<Option key="sss" value="h1">h1</Option>
									    </Select>
									</FormItem>
						      	</Form>
					    	)],

					    	onChange (e) {
					    		props.dispatch({
					    			type: 'vdcore/handleLinkSettingTypeChange',
					    			payload: e.target.value
					    		});
					    	}

					    }

	    				return (
						    <Panel header={item.title} key={item.key}>
								<RadioGroup onChange={linkSettingProps.onChange} defaultValue="link" size="small">
									{linkSettingProps.linkSettingTemplate}
							    </RadioGroup>

						    	{linkSettingProps.tpl[props.vdcore.linkSetting.activeLinkType]}
						    </Panel>
	    				);
	    			},

	    			'list-setting' (item, attrTypeIndex) {

                        const listSettingProps = {

                            listTypeChoose(e){

                                console.log(attrType);
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

                                console.log(attrType);
                                console.log(e);
                                var value = e? 'decimal inside': 'circle inside'
                                console.log(value);
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
												<Upload {...bgUploaderProps}>
													<Button><i className="fa fa-cloud-upload"></i>&nbsp;上传图片</Button>
											  	</Upload>

												<Button style={{float: 'right', bottom: '102px'}}><i className="fa fa-picture-o"></i>&nbsp;图片资源</Button>
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
					    const selectSettingProps = {

					    	creatorContent: (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="说明">
										<Input size="small"  value={props.vdCtrlTree.attr.html} onChange={keyValueProps.addHtmlChange}/>
									</FormItem>
									<FormItem {...formItemLayout} label="值">
										<Input size="small" value={props.vdCtrlTree.attr.value} onChange={keyValueProps.addKeyChange}/>
									</FormItem>
									<FormItem>
										<Button size="small" onClick={formProps.childrenAdd.bind(this,0, 'forms', 'select', 0, [{level: 0, index: 0}])}>保存</Button>
									</FormItem>
								</Form>
					    	),

					    	modifyContent: (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="说明">
										<Input size="small" value={props.vdCtrlTree.activeCtrl.children[props.vdCtrlTree.selectIndex].attrs[0].children[0].html} onChange={keyValueProps.valueChange} />
									</FormItem>
									<FormItem {...formItemLayout} label="值">
										<Input size="small" value={props.vdCtrlTree.activeCtrl.children[props.vdCtrlTree.selectIndex].attrs[0].children[0].value} onChange={keyValueProps.keyValueChange}/>
									</FormItem>
									<FormItem>
										<Button size="small" onClick={formProps.childrenUpdate.bind(this,attrType)}>保存</Button>
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
                            hidePopover(){
                                setTimeout(function(){
                                    props.dispatch({
                                        type: 'vdCtrlTree/handleUpdateVisible',
                                        payload: false
                                    });
                                }, 10)
                            }
					    }
                        const keyValues = props.vdCtrlTree.activeCtrl.children.map((item, index) =>{

                            return (
                                <li className="ant-dropdown-menu-item" role="menuitem" key={index}>
                                <Row>
                                  <Col span={18}>
                                    <p>{item.attrs[0].children[0].value} = {item.attrs[0].children[0].html}</p>
                                  </Col>
                                  <Col span={3}>
                                        <Icon type="edit" onClick={selectSettingProps.editKeyValue.bind(this, index)}/>
                                  </Col>
                                  <Col span={3}>
                                    <Popconfirm title="确认删除吗？" onConfirm={formProps.childrenDelete.bind(this, item.attrs[0].children[0].value + '=' + item.attrs[0].children[0].html, item, index, 0, attrType)} okText="确定" cancelText="取消">
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
                        console.log(props.vdCtrlTree.activeCtrl.children[0].children[props.vdCtrlTree.selectIndex]);
					    const tabSettingProps = {
					    	modifyContent: (
						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="名称">
										<Input size="small" value={props.vdCtrlTree.activeCtrl.children[0].children[props.vdCtrlTree.selectIndex].children[0].attrs[0].children[0].value} onChange={keyValueProps.keyValueChange}/>
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
                            },
                            hidePopover(){
                                setTimeout(function(){
                                    props.dispatch({
                                        type: 'vdCtrlTree/handleUpdateVisible',
                                        payload: false
                                    });
                                }, 10)
                            },
                            addTabs(){

                                var tab = copyOperate.copyChildren(0, 'component','tabs', 2);
                                props.dispatch({
                                    type: 'vdCtrlTree/handleChildrenAdd',
                                    payload: {
                                        activeCtrl: props.vdCtrlTree.activeCtrl,
                                        children: tab,
                                        levelsInfo: [{ level:2, index: 0}],
                                        level: 2
                                    }
                                });

                                var content = copyOperate.copyChildren(1, 'component','tabs', 2, [{ level:0, index: 1}]);
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
                        const keyValues = props.vdCtrlTree.activeCtrl.children[0].children.map((item, index) =>{

                            console.log(item);
                            return (
                                <li className="ant-dropdown-menu-item" role="menuitem" key={index}>
                                <Row>
                                  <Col span={18}>
                                    <p>{item.children[0].attrs[0].children[0].value}</p>
                                  </Col>
                                  <Col span={3}>
                                        <Icon type="edit" onClick={tabSettingProps.editKeyValue.bind(this, index)}/>
                                  </Col>
                                  <Col span={3}>
                                    <Popconfirm title="确认删除吗？" onConfirm={formProps.childrenDelete.bind(this, item.children[0].attrs[0].children[0].value , item, index, 2, attrType)} okText="确定" cancelText="取消">
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
                                    <FormItem {...formItemLayout} label="淡入时间">
                                        <Input size="small" />
                                    </FormItem>
                                </Form>
                                <Form className="form-no-margin-bottom">
                                    <FormItem {...formItemLayout} label="淡出时间">
                                        <Input size="small" />
                                    </FormItem>
                                </Form>

						      	<Form className="form-no-margin-bottom">
									<FormItem {...formItemLayout} label="过渡效果">
										<Select
										    style={{ width: '100%' }}
										    defaultValue={item.value}
										    size="small"
										>
								    	  <Option key="111">111</Option>
									  	</Select>
									</FormItem>
						      	</Form>

								<Button type="circle" size="small"><Icon type="plus"  onClick={tabSettingProps.addTabs}/></Button>

                                    <Popover
                                        content={tabSettingProps.modifyContent}
                                        title="修改 选项"
                                        trigger="click"
                                        visible={props.vdCtrlTree.keyValeUpdateVisible}
                                        onVisibleChange = {tabSettingProps.updateVisibleChange}
                                    >
        							    <ul  className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
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

	    			'slider-settings' (item, attrTypeIndex) {
	    				return (
						    <Panel header={item.title} key={item.key}>
						    	<Row>
						    		<Col span={12}>
						    			<Button size="small"><Icon type="plus" />增加一个</Button>
						    		</Col>
						    		<Col span={12}>
						    			<Col span={12} style={{textAlign: 'right'}}>
							    			<Button size="small"><Icon type="left" /></Button>
						    			</Col>
						    			<Col span={12} style={{textAlign: 'left'}}>
							    			<Button size="small"><Icon type="right" /></Button>
						    			</Col>
						    		</Col>
						    	</Row>
						    </Panel>
	    				);
	    			},

	    			'navbar-setting' (item, attrTypeIndex) {

	    				return (
	    					<Panel header={item.title} key={item.key}>
	                            <Row>
	                                <Col span={12}>
	                                    <Button size="small"><Icon type="bars" />打开菜单</Button>
	                                </Col>
	                                <Col span={12}>
                                        <Button size="small" onClick={formProps.childrenAdd.bind(this,1, 'components', 'navbar', 4, [{level: 1,index:1}])}><Icon type="plus" />新增菜单</Button></Col>
	                            </Row>

	                            <Form className="form-no-margin-bottom">
	                                <FormItem {...formItemLayout} label="菜单类型">
	                                    <Select size="small">
	                                          <Option key="drop-down" value="drop-down">向下</Option>
	                                          <Option key="over-right" value="over-right">靠右</Option>
	                                          <Option key="over-left" value="over-left">靠左</Option>
	                                    </Select>
	                                </FormItem>
	                            </Form>
                        	</Panel>
                        );
	    			},
                    'dropdown-setting'(item, attrTypeIndex) {

	    				return (
	    					<Panel header={item.title} key={item.key}>
	                            <Row style={{marginTop: '15px'}}>
	                                <Col span={12}>
                                        <Button size="small" onClick={formProps.childrenAdd.bind(this,1, 'components', 'dropdown', 2, [{level: 0,index:1}])}><Icon type="plus" 	/>新增菜单</Button>
                                    </Col>
	                            </Row>
                        	</Panel>
                        );
	    			},
	    			'columns-setting' (item, attrTypeIndex) {

	    				var columnHandler = {
	    					handleColumnCountChange (e) {
	    						props.dispatch({
	    							type: 'vdcore/handleColumnCountChange',
	    							payload: {
	    								value: e.target.value
	    							}
	    						});
	    					}
	    				}

						jQuery.fn.extend({
						    dragging:function(data){
								var $this = jQuery(this);
								var xPage;
								var yPage;
								var X;//
								var Y;//
								var father = $this.parent();
								var defaults = {
									move : 'both',
									hander:1
								}
								var opt = jQuery.extend({},defaults,data);
								var movePosition = opt.move;

								var hander = opt.hander;

								if(hander == 1){
									hander = $this;
								}else{
									hander = $this.find(opt.hander);
								}

								//初始化
								hander.css({"cursor":"move"});
								$width=$this.width();
								$height=$this.height();
								// $this.css({"width":$width+"px","height":$height+"px"});

								// $this.css({"width": '100%'});

								var faWidth = father.width();
								var faHeight = father.height();
								var thisWidth = $this.width()+parseInt($this.css('padding-left'))+parseInt($this.css('padding-right'));
								var thisHeight = $this.height()+parseInt($this.css('padding-top'))+parseInt($this.css('padding-bottom'));

								var mDown = false;//
								var positionX;
								var positionY;
								var moveX ;
								var moveY ;
								var $width,$height;

								var prevX = 0,
									prevLeft = parseInt($this.css('left'));

								hander.mousedown(function(e){
									father.children().css({"zIndex":"0"});
									$this.css({"zIndex":"1"});
									mDown = true;
									X = e.pageX;
									Y = e.pageY;
									positionX = $this.position().left;
									positionY = $this.position().top;
									if(opt.onMouseDown) {
										opt.onMouseDown(e);
									}
									return false;
								});

								jQuery(document).mouseup(function(e){
									mDown = false;
									if(opt.onMouseUp) {
										opt.onMouseUp(e);
									}
								});

								jQuery(document).mousemove(function(e){
									xPage = e.pageX;//--
									moveX = positionX + xPage - X;
									yPage = e.pageY;//--
									moveY = positionY + yPage - Y;
									$this.css({"position":"absolute"});
									function thisXMove(){ //x轴移动
										if(mDown == true){

											if(prevX - moveX < 0) {

												console.log('moveX - prevMoveX = ', moveX - prevLeft);

												if(moveX - prevLeft >= 25) {
													prevLeft = moveX;
													$this.css({"left": moveX});
													if(opt.onMoveToRight) {
														opt.onMoveToRight();
													}
												}

											}else {

												if(prevLeft - moveX >= 20 ) {
													prevLeft = moveX
													$this.css({"left": moveX});
													if(opt.onMoveToLeft) {
														opt.onMoveToLeft();
													}
												}

											}

										}else{
											return;
										}
										if(moveX < 0){
											$this.css({"left":"0"});
										}
										if(moveX > (faWidth-thisWidth)){
											// $this.css({"left":faWidth-thisWidth});
										}
										return moveX;
									}

									function thisYMove(){ //y轴移动
										if(mDown == true){
											$this.css({"top":moveY});
										}else{
											return;
										}
										if(moveY < 0){
											$this.css({"top":"0"});
										}
										if(moveY > (faHeight-thisHeight)){
											$this.css({"top":faHeight-thisHeight});
										}
										return moveY;
									}

									function thisAllMove(){ //全部移动
										if(mDown == true){
											$this.css({"left":moveX,"top":moveY});
										}else{
											return;
										}
										if(moveX < 0){
											$this.css({"left":"0"});
										}
										if(moveX > (faWidth-thisWidth)){
											$this.css({"left":faWidth-thisWidth});
										}

										if(moveY < 0){
											$this.css({"top":"0"});
										}
										if(moveY > (faHeight-thisHeight)){
											$this.css({"top":faHeight-thisHeight});
										}
									}

									var moveFlag = true;

									if(opt.onMouseMove) {
										moveFlag = opt.onMouseMove(e, movePosition.toLowerCase, moveX, moveY);
									}

									if(movePosition.toLowerCase() == "x" && moveFlag){
										thisXMove();
									}else if(movePosition.toLowerCase() == "y" && moveFlag){
										thisYMove();
									}else if(movePosition.toLowerCase() == 'both' && moveFlag){
										thisAllMove();
									}

									prevX = moveX;

								});
						    }
						});

						const makeColumnSliderDraggable = (id, index) => {
							var inter = setInterval(function() {
								if($('#' + id).length !== 0) {
									clearInterval(inter);
									$('#' + id).dragging({
										move: 'x',

										onMoveToLeft: function() {
											console.log('left');
											props.dispatch({
												type: 'vdcore/shrinkLeftColumn',
												payload: {
													index
												}
											});
										},

										onMoveToRight: function() {
											console.log('right');
											props.dispatch({
												type: 'vdcore/expandLeftColumn',
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
	                                	<Input size="small" min="1" placeholder="只能输入1, 2, 3, 4, 6和12" max="12" onChange={columnHandler.handleColumnCountChange.bind(this)} value={props.vdcore.columnSlider.count} type="number" />
	                                </FormItem>
	                            </Form>
	                            <div className="column-slider-box">
	                            	<div className="grid-slider">
	                            		<Row>
	                            		{
	                            			props.vdcore.columnSlider.columns.map((column, columnIndex) => {
	                            				return (
			                            			<Col key={columnIndex} span={column.span}>
					                            		<div className="column-slider-column">
					                            			{column.value}
					                            		</div>
					                            		{
					                            			columnIndex == props.vdcore.columnSlider.columns.length - 1 ? '' : (
							                            		<div id={'column-slider' + columnIndex} className="column-slider-gutter">{makeColumnSliderDraggable('column-slider' + columnIndex, columnIndex)}<div className="handle"></div></div>
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
							<Input onChange={formProps.handleAttrFormInputChange.bind(this, item, attrType)} {...item.props} value={item.value} size="small" />
    					) : (
							<Input onChange={formProps.handleAttrFormInputChange.bind(this, item, attrType)} value={item.value} size="small" />
    					);

		    			return (
							<FormItem key={item.id} {...formItemLayout} label={item.desc}>
								{inputTpl}
							</FormItem>
		    			);
    				},

    				multipleSelect (item) {
    					return (
							<FormItem key={item.id} {...formItemLayout} label={item.desc}>
								<Select
								    multiple
								    style={{ width: '100%' }}
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
								    style={{ width: '100%' }}
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

    const settingPanelDefaultActiveKey = [];

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

function mapSateToProps({ vdcore, vdctrl, vdCtrlTree }) {
  return { vdcore, vdctrl, vdCtrlTree };
}

export default connect(mapSateToProps)(Component);
