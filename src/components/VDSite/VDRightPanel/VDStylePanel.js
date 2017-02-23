import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';

const ButtonGroup = Button.Group;

import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import { Select } from 'antd';
import { Card, Upload } from 'antd';

const Option = Select.Option;
const OptGroup = Select.OptGroup;

const TabPane = Tabs.TabPane;

import { Collapse, Menu, Dropdown } from 'antd';
import { Row, Col, Popover } from 'antd';

import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import { Tree, Form, Switch, Input, Cascader, Checkbox, message, Tag, Table, Popconfirm, Slider, InputNumber} from 'antd';

const FormItem = Form.Item;

const InputGroup = Input.Group;

const Panel = Collapse.Panel;

import { SketchPicker } from 'react-color';
import css2json from 'css2json';

import ColorPicker from '../../Panel/ColorPicker.js';

// <SketchPicker style={{display: 'block'}} defaultValue="#345678" />

const VDStylePanel = (props) => {

	const activeCSSStyleState = props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle];

	const cssAction = {

		getAllClasses () {
			var classes = [];
			for(var key in props.vdstyles.cssStyleLayout) {
				classes.push(key);
			}
			return classes;
			// return props.vdstyles.cssPropertyState;
		}

	}

	const handleStylesChange = (stylePropertyName, parent, proxy) =>  {

		console.log('================proxy==============', proxy, parent);

		if(proxy == undefined) {
			proxy = parent;
		}

		var stylePropertyValue = '';

		if(typeof proxy == 'string') {
			stylePropertyValue = proxy;
		}else {
			stylePropertyValue = proxy.target.value;
		}

		if(!props.vdCtrlTree.activeCtrl.activeStyle) {
			message.error('执行错误，当前无活跃类名');
			return false;
		}

		props.dispatch({
			type: 'vdstyles/handleCSSStyleLayoutChange',
			payload: {
				stylePropertyName,
				stylePropertyValue,
				activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle,
				parent,
			}
		});

		props.dispatch({
			type: 'vdstyles/applyCSSStyleIntoPage',
			payload: {
				activeCtrl: props.vdCtrlTree.activeCtrl
			}
		});
	}

	const setThisPropertyNull = (property) => {
		props.dispatch({
			type: 'vdstyles/setThisPropertyNull',
			payload: {
				property,
				activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
			}
		});
	}

	const cssSelector = {

		cssClassNameList () {
  			return cssAction.getAllClasses().map((item, key) => {
		    	return <Option key={key} value={item}>{item}</Option>
  			});
		},

		cssClassListForDropdown () {

			const onSelect = (e) => {
				props.dispatch({
					type: 'vdCtrlTree/setActiveStyle',
					payload: e.selectedKeys[0]
				});
			}

			return (
			  	<Menu selectedKeys={[props.vdCtrlTree.activeCtrl.activeStyle]} onSelect={onSelect}>
			  		{
			  			props.vdCtrlTree.activeCtrl.customClassName.map((item, key) => {
					    	return <Menu.Item key={item}>{
					    		props.vdCtrlTree.activeCtrl.activeStyle == item ? (
					    			<Tag color="#87d068"><span style={{color: 'rgb(255, 255, 255)'}}>{item}</span></Tag>
					    		) : (item)
					    	}</Menu.Item>
			  			})
			  		}
			  	</Menu>
			)
		},

		newStylePopover: {
			content () {

				const newStyleName = props.vdstyles.newStyleName;

				const onClick = () => {

					if(newStyleName == '') {
						message.error('请输入类名!');
						return false;
					}

					props.dispatch({
						type: 'vdstyles/addStyle',
						payload: {
							activeStyle: props.vdCtrlTree.activeCtrl.activeStyle
						}
					});

					props.dispatch({
						type: 'vdstyles/applyCSSStyleIntoPage',
						payload: {
							activeCtrl: props.vdCtrlTree.activeCtrl
						}
					});

					props.dispatch({
						type: 'vdstyles/handleClassChange',
						payload: {
		    				value: [newStyleName],
		    				push: true
		    			}
					});
				}

				const handleNewStyleNameChange = (e) => {
					props.dispatch({
						type: 'vdstyles/handleNewStyleNameChange',
						payload: e.target.value
					});
				}

				return (
			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="类名">
							<Input onPressEnter={onClick} onChange={handleNewStyleNameChange} value={newStyleName} size="small" />
						</FormItem>

						<FormItem {...formItemLayout} label="">
							<Button onClick={onClick.bind(this)} style={{float: 'right'}} size="small">添加并应用</Button>
						</FormItem>
			      	</Form>
				);
			}
		}

	}

    const formItemLayout = {
      	labelCol: { span: 8 },
      	wrapperCol: { span: 16 }
    };

    const bgUploaderProps = {
 		listType: 'picture',
	  	defaultFileList: [{
	    	uid: -1,
	    	name: 'xxx.png',
	    	status: 'done',
	    	url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
	    	thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
	  	}]
    }

    const bgGradientLinearAngelMarks = {
		0: '0',
		45: '45',
		90: '90',
		135: '135',
		180: '180',
		225: '225',
		270: '270',
		315: '315',
		360: '360'
    }

    const popOverStyle = {
    	width: parseInt($(document).width()) / 3
    }

    const backgroundImageAndGradient = {
    	modifyContent: <div>222</div>,

    	imageSetter () {

    		var backgroundSizeParams = props.vdstyles.backgroundSetting.backgroundSize;

    		const handleBackgroundSizeInputChange = (cssProperty, parent, e) => {

    			var val = e.target ? e.target.value : e;

    			const packBGSizeParams = () => {

    				var result = '';

    				if(backgroundSizeParams.width != '') {
    					result += backgroundSizeParams.width + ' ';
    				}

    				if(backgroundSizeParams.height != '') {
    					result += backgroundSizeParams.height + ' ';
       				}

    				if(backgroundSizeParams.cover) {
    					result = 'cover';
    				}

    				if(backgroundSizeParams.contain) {
    					result = 'contain';
    				}

    				return result;
    			}

    			handleStylesChange(cssProperty, parent, {
    				target: {
    					value: val
    				}
    			});
    		}

    		const cssBGUploadProps = {
		 		listType: 'picture',
			  	defaultFileList: props.vdstyles.backgroundSetting.backgroundImage.fileInfo,

			  	beforeUpload () {
			  		props.dispatch({
			  			type: 'vdstyles/handleBGSettingBeforeUpload',
			  			payload: props.vdstyles.backgroundSetting.backgroundImage.fileInfo
			  		});
			  	},

			  	onChange (object) {
			  		handleStylesChange('background-image', {
			  			parent: 'background'
			  		}, {
			  			target: {
			  				value: object.file.thumbUrl
			  			}
			  		});
			  	}

    		}

    		const handleBGPosChange = (pos) => {
    			handleStylesChange('background-position', {
    				parent: 'background'
    			} ,{
    				target: {
    					value: pos
    				}
    			});
    		}

    		return (
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
							<Upload {...cssBGUploadProps}>
								<Button><i className="fa fa-cloud-upload"></i>&nbsp;上传图片</Button>
						  	</Upload>

							<Button style={{position: 'absolute', right: '30px', top: '60px'}}><i className="fa fa-picture-o"></i>&nbsp;图片资源</Button>
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
											<Input
												value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['background']['background-size'][0]}
												onChange={handleBackgroundSizeInputChange.bind(this, 'background-size', {parent: 'background', BGSizeIndex: 0})} size="small" />
										</FormItem>
							      	</Form>
							  	</Col>
							  	<Col span={13} style={{paddingLeft: '5px'}}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="填充">
											<Switch
												checked={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['background']['background-size'][2]}
												onChange={handleBackgroundSizeInputChange.bind(this, 'background-size', {parent: 'background', BGSizeIndex: 2})} size="small" />
										</FormItem>
							      	</Form>
							  	</Col>

							</Row>

							<Row>

							  	<Col span={11} style={{paddingRight: '5px'}}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="高度">
											<Input
												value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['background']['background-size'][1]}
												onChange={handleBackgroundSizeInputChange.bind(this, 'background-size', {parent: 'background', BGSizeIndex: 1})} size="small" />
										</FormItem>
							      	</Form>
							  	</Col>
							  	<Col span={13} style={{paddingLeft: '5px'}}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="适应">
											<Switch
												checked={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['background']['background-size'][3]}
												onChange={handleBackgroundSizeInputChange.bind(this, 'background-size', {parent: 'background', BGSizeIndex: 3})} size="small" />
										</FormItem>
							      	</Form>
							  	</Col>

							</Row>

						</div>
					</div>

					<div className="bem-Frame">
						<div className="bem-Frame_Head">
							<div className="bem-Frame_Legend">
								<div className="bem-SpecificityLabel bem-SpecificityLabel-local bem-SpecificityLabel-text">
									位置
								</div>
							</div>
						</div>
						<div className="bem-Frame_Body">

							<label style={{marginBottom: '5px'}}>预设值：</label>
							<Row>
								<Col span={10}>
									<Row style={{marginBottom: '5px'}}>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'top left')} size="small"><Icon type="arrow-up" style={{transform: 'rotate(-45deg)'}} /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'top center')} size="small"><Icon type="arrow-up" /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'top right')} size="small"><Icon type="arrow-up" style={{transform: 'rotate(45deg)'}} /></Button>
										</Col>
									</Row>
									<Row style={{marginBottom: '5px'}}>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'center left')} size="small"><Icon type="arrow-left" /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'center center')} size="small"><Icon type="plus" /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'center right')} size="small"><Icon type="arrow-right" /></Button>
										</Col>
									</Row>
									<Row>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'bottom left')} size="small"><Icon type="arrow-down" style={{transform: 'rotate(45deg)'}} /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'bottom center')} size="small"><Icon type="arrow-down" /></Button>
										</Col>
										<Col span={8}>
											<Button onClick={handleBGPosChange.bind(this, 'bottom right')} size="small"><Icon type="arrow-down" style={{transform: 'rotate(-45deg)'}} /></Button>
										</Col>
									</Row>
								</Col>

								<Col span={14}>

								</Col>
							</Row>

						</div>
					</div>

			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="重复">

					        <RadioGroup defaultValue="repeat" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['background']['background-repeat']} onChange={handleStylesChange.bind(this, 'background-repeat', 'background')}>
						      	<RadioButton value="repeat">
			  		              	<Tooltip placement="top" title="repeat">
										<Icon type="appstore-o" />
						      		</Tooltip>
					      		</RadioButton>
						      	<RadioButton value="repeat-x">
			  		              	<Tooltip placement="top" title="repeat-x">
										<Icon type="ellipsis" />
						      		</Tooltip>
						      	</RadioButton>
						      	<RadioButton value="repeat-y">
			  		              	<Tooltip placement="top" title="repeat-y">
										<Icon type="ellipsis" style={{transform: 'rotate(90deg)'}} />
									</Tooltip>
						      	</RadioButton>
						      	<RadioButton value="no-repeat">
			  		              	<Tooltip placement="top" title="no-repeat">
										<Icon type="close" />
									</Tooltip>
						      	</RadioButton>
						    </RadioGroup>

						</FormItem>
			      	</Form>

			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="固定">

					        <RadioGroup defaultValue="scroll" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['background']['background-attachment']} size="small" onChange={handleStylesChange.bind(this, 'background-attachment', 'background')}>
						      	<RadioButton value="fixed">
			  		              	<Tooltip placement="top" title="fixed">
										<Icon type="check" />
						      		</Tooltip>
					      		</RadioButton>
						      	<RadioButton value="scroll">
			  		              	<Tooltip placement="top" title="scroll">
										<Icon type="close" />
						      		</Tooltip>
						      	</RadioButton>
						    </RadioGroup>

						</FormItem>
			      	</Form>

				</div>
			</div>

    	);
		},

		gradientSetter: (

			<div style={{width: '320px'}}>

		      	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label="类型">

				        <RadioGroup defaultValue="linear" size="small">
					      	<RadioButton value="linear">
		  		              	<Tooltip placement="top" title="线性渐变">
									<Icon type="swap-right" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="radial">
		  		              	<Tooltip placement="top" title="放射渐变">
									<Icon type="chrome" />
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

					<FormItem {...formItemLayout} label="角度">
					</FormItem>

		      	</Form>

			    <Slider min={0} max={360} marks={bgGradientLinearAngelMarks} defaultValue={0} />

			    <Row style={{marginTop: '25px'}}>
			    	<Col span={12} style={{paddingRight: '15px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label="从">
								<Input type="color" size="small" />
							</FormItem>
				      	</Form>
			    	</Col>

			    	<Col span={12} style={{paddingLeft: '15px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label="渐变到">
								<Input type="color" size="small" />
							</FormItem>
				      	</Form>
			    	</Col>
			    </Row>

			</div>

		)
    }

    const shadowProps = {
    	settingPopover () {

    		const saveBoxShadow = () => {
    			props.dispatch({
    				type: 'vdstyles/saveBoxShadow',
    				payload: {
    					activeStyle: props.vdCtrlTree.activeCtrl.activeStyle,
    					shadowType: 'box-shadow'
    				}
    			});
    		}

    		const handleBoxShadowInputChange = (name, e) => {
    			var val = e.target ? e.target.value : e;

    			props.dispatch({
    				type: 'vdstyles/handleBoxShadowInputChange',
    				payload: {
    					value: val,
    					name,
    					shadowType: 'boxShadow'
    				}
    			});

    		}

    		return (
    		<div style={{width: 300}}>
		      	<Form className="form-no-margin-bottom">

					<FormItem {...formItemLayout} label="水平阴影">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onChange={handleBoxShadowInputChange.bind(this, 'h-shadow')} value={props.vdstyles.boxShadow['h-shadow'].value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="垂直阴影">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onChange={handleBoxShadowInputChange.bind(this, 'v-shadow')} value={props.vdstyles.boxShadow['v-shadow'].value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="模糊距离">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onChange={handleBoxShadowInputChange.bind(this, 'blur')} value={props.vdstyles.boxShadow.blur.value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="阴影尺寸">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onChange={handleBoxShadowInputChange.bind(this, 'spread')} value={props.vdstyles.boxShadow.spread.value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="颜色">
						<Input onChange={handleBoxShadowInputChange.bind(this, 'color')} value={props.vdstyles.boxShadow.color.value} type="color" size="small" />
					</FormItem>

					<FormItem {...formItemLayout} label="类型">
				        <RadioGroup onChange={handleBoxShadowInputChange.bind(this, 'inset')} value={props.vdstyles.boxShadow.inset.value} defaultValue="outset" size="small">
					      	<RadioButton value="outset">
								外阴影
				      		</RadioButton>
					      	<RadioButton value="inset">
								内阴影
					      	</RadioButton>
					    </RadioGroup>
					</FormItem>

					<Button onClick={saveBoxShadow} size="small">保存</Button>

		      	</Form>
    		</div>
    	);
		},

		modifyPopover () {

    		const saveBoxShadow = () => {
    			props.dispatch({
    				type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
    			});
				message.success('保存成功');
    		}

    		const activeProp = props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['box-shadow'].state.activeProp;

    		const handleBoxShadowEditorChange = (property, e) => {

    			props.dispatch({
    				type: 'vdstyles/handleBoxShadowStylesChange',
    				payload: {
    					value: e.target.value,
    					property,
    					parent: 'box-shadow',
    					activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
    				}
    			})

    		}

    		return (
	    		<div style={{width: 300}}>
			      	<Form className="form-no-margin-bottom">

						<FormItem {...formItemLayout} label="水平阴影">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onChange={handleBoxShadowEditorChange.bind(this, 'h-shadow')} value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['box-shadow'].childrenProps[activeProp]['h-shadow']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="垂直阴影">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onChange={handleBoxShadowEditorChange.bind(this, 'v-shadow')} value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['box-shadow'].childrenProps[activeProp]['v-shadow']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="模糊距离">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onChange={handleBoxShadowEditorChange.bind(this, 'blur')} value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['box-shadow'].childrenProps[activeProp]['blur']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="阴影尺寸">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onChange={handleBoxShadowEditorChange.bind(this, 'spread')} value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['box-shadow'].childrenProps[activeProp]['spread']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="颜色">
							<Input onChange={handleBoxShadowEditorChange.bind(this, 'color')} value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['box-shadow'].childrenProps[activeProp]['color']} type="color" size="small" />
						</FormItem>

						<FormItem {...formItemLayout} label="类型">
					        <RadioGroup onChange={handleBoxShadowEditorChange.bind(this, 'inset')} value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['box-shadow'].childrenProps[activeProp]['inset']} defaultValue="outset" size="small">
						      	<RadioButton value="outset">
									外阴影
					      		</RadioButton>
						      	<RadioButton value="inset">
									内阴影
						      	</RadioButton>
						    </RadioGroup>
						</FormItem>

						<Button onClick={saveBoxShadow} size="small">保存</Button>

			      	</Form>
	    		</div>
	    	);

		}
    }

    const textShadowProps = {
    	settingPopover () {

    		const saveBoxShadow = () => {
    			props.dispatch({
    				type: 'vdstyles/saveBoxShadow',
    				payload: {
    					activeStyle: props.vdCtrlTree.activeCtrl.activeStyle,
    					shadowType: 'text-shadow'
    				}
    			});
    		}

    		const handleBoxShadowInputChange = (name, e) => {
    			var val = e.target ? e.target.value : e;

    			props.dispatch({
    				type: 'vdstyles/handleBoxShadowInputChange',
    				payload: {
    					value: val,
    					name,
    					shadowType: 'textShadow'
    				}
    			});

    		}

    		return (
    		<div style={{width: 300}}>
		      	<Form className="form-no-margin-bottom">

					<FormItem {...formItemLayout} label="水平阴影">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onChange={handleBoxShadowInputChange.bind(this, 'h-shadow')} value={props.vdstyles.textShadow['h-shadow'].value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="垂直阴影">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onChange={handleBoxShadowInputChange.bind(this, 'v-shadow')} value={props.vdstyles.textShadow['v-shadow'].value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="模糊距离">
						<Row>
					        <Col span={14} style={{paddingRight: '10px'}}>
					          	<Input onChange={handleBoxShadowInputChange.bind(this, 'blur')} value={props.vdstyles.textShadow.blur.value} size="small"/>
					        </Col>
					        <Col span={4}>
					        	PX
					        </Col>
					    </Row>
					</FormItem>

					<FormItem {...formItemLayout} label="颜色">
						<Input onChange={handleBoxShadowInputChange.bind(this, 'color')} value={props.vdstyles.textShadow.color.value} type="color" size="small" />
					</FormItem>

					<Button onClick={saveBoxShadow} size="small">保存</Button>

		      	</Form>
    		</div>
    	);
		},

		modifyPopover () {

    		const saveBoxShadow = () => {
    			props.dispatch({
    				type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
    			});
				message.success('保存成功');
    		}

    		const activeProp = props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['text-shadow'].state.activeProp;

    		const handleBoxShadowEditorChange = (property, e) => {

    			props.dispatch({
    				type: 'vdstyles/handleBoxShadowStylesChange',
    				payload: {
    					value: e.target.value,
    					property,
    					parent: 'text-shadow',
    					activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
    				}
    			})

    		}

    		return (
	    		<div style={{width: 300}}>
			      	<Form className="form-no-margin-bottom">

						<FormItem {...formItemLayout} label="水平阴影">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onChange={handleBoxShadowEditorChange.bind(this, 'h-shadow')} value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['text-shadow'].childrenProps[activeProp]['h-shadow']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="垂直阴影">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onChange={handleBoxShadowEditorChange.bind(this, 'v-shadow')} value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['text-shadow'].childrenProps[activeProp]['v-shadow']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="模糊距离">
							<Row>
						        <Col span={14} style={{paddingRight: '10px'}}>
						          	<Input onChange={handleBoxShadowEditorChange.bind(this, 'blur')} value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['text-shadow'].childrenProps[activeProp]['blur']} size="small"/>
						        </Col>
						        <Col span={4}>
						        	PX
						        </Col>
						    </Row>
						</FormItem>

						<FormItem {...formItemLayout} label="颜色">
							<Input onChange={handleBoxShadowEditorChange.bind(this, 'color')} value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['text-shadow'].childrenProps[activeProp]['color']} type="color" size="small" />
						</FormItem>

						<Button onClick={saveBoxShadow} size="small">保存</Button>

			      	</Form>
	    		</div>
	    	);

		}
    }

    const transformAndTransitionProps = {
    	transformSettingPopover () {

    		const handleTransitionInputChange = (propsName, e) => {

    			var val = e.target ? e.target.value : e;

    			props.dispatch({
    				type: 'vdstyles/handleTransitionInputChange',
    				payload: {
    					value: val,
    					propsName
    				}
    			});
    		}

    		const saveThisTransition = () => {
    			props.dispatch({
    				type: 'vdstyles/saveThisTransition',
					payload: {
						activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
					}
    			});
    		}

    		return (
    		<Form>
    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="属性" className='fa fa-search'></i>)}>
    				<Select
    				    showSearch
    				    placeholder="选择变化属性"
    				    optionFilterProp="children"
    				    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    				    value={props.vdstyles.transitionSetting['transition-property']}
    				    size="small"
    				    onChange={handleTransitionInputChange.bind(this, 'transition-property')}
    				>
    				  	<OptGroup key="advanced" label="高级">
    				        <Option key="all">所有</Option>
	    				</OptGroup>

    				  	<OptGroup key="common" label="通用">
    				        <Option key="opacity">透明度</Option>
    				        <Option key="margin">外边距</Option>
	    				    <Option key="padding">内边距</Option>
	    				    <Option key="border">边框</Option>
	    				    <Option key="transform">变换</Option>
	    				    <Option key="fllter">滤镜</Option>
	    				    <Option key="flex">Flex</Option>
	    				</OptGroup>

	    				<OptGroup key="background" label="背景">
	    					<Option key="background-color">背景颜色</Option>
	    					<Option key="background-position">背景位置</Option>
	    				</OptGroup>

	    				<OptGroup key="shadows" label="阴影">
	    					<Option key="text-shadows">文字阴影</Option>
	    					<Option key="box-shadows">盒子阴影</Option>
	    				</OptGroup>

	    				<OptGroup key="size" label="大小">
	    					<Option key="width">宽度</Option>
	    					<Option key="height">高度</Option>
	    					<Option key="min-height">最小高度</Option>
	    					<Option key="max-height">最大高度</Option>
	    					<Option key="min-width">最小高度</Option>
	    					<Option key="max-width">最大高度</Option>
	    				</OptGroup>

	    				<OptGroup key="borders" label="边框">
	    					<Option key="border-radius">边框弧度</Option>
	    					<Option key="border-color">边框颜色</Option>
	    					<Option key="border-width">边框宽度</Option>
	    				</OptGroup>

	    				<OptGroup key="typo" label="字体">
	    					<Option key="color">颜色</Option>
	    					<Option key="font-size">大小</Option>
	    					<Option key="line-height">行高</Option>
	    					<Option key="letter-spacing">词间距(letter)</Option>
	    					<Option key="word-spacing">词间距(word)</Option>
	    					<Option key="text-indent">缩进</Option>
	    				</OptGroup>

	    				<OptGroup key="position" label="位置">
	    					<Option key="top">顶部</Option>
	    					<Option key="left">左部</Option>
	    					<Option key="right">右部</Option>
	    					<Option key="bottom">底部</Option>
	    					<Option key="z-index">z-index</Option>
	    				</OptGroup>

	    				<OptGroup key="margin" label="外边距">
	    					<Option key="margin-left">左外边距</Option>
	    					<Option key="margin-right">右外边距</Option>
	    					<Option key="margin-top">顶外边距</Option>
	    					<Option key="margin-bottom">底外边距</Option>
	    				</OptGroup>

	    				<OptGroup key="padding" label="内边距">
	    					<Option key="padding-left">左内边距</Option>
	    					<Option key="padding-right">右内边距</Option>
	    					<Option key="padding-top">上内边距</Option>
	    					<Option key="padding-bottom">底内边距</Option>
	    				</OptGroup>

	    				<OptGroup key="flex" label="Flex">
	    					<Option key="flex-grow">Flex Grow</Option>
	    					<Option key="flex-shrink">Flex Shrink</Option>
	    					<Option key="flex-basis">Flex Basis</Option>
	    				</OptGroup>

    				</Select>
    			</FormItem>

    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="时间" className='fa fa-clock-o'></i>)}>
					<Row>
				        <Col span={18}>
				          	<Input
    				    		onChange={handleTransitionInputChange.bind(this, 'transition-duration')}
				          		value={props.vdstyles.transitionSetting['transition-duration']} type="number" size="small" />
				        </Col>
				        <Col span={6} style={{paddingLeft: '15px'}}>
				        	MS
				        </Col>
				    </Row>
				</FormItem>

				<InputGroup compact>
					<Row>
						<Col span={4}>
							曲线：
						</Col>
						<Col span={8}>
			      			<Input size="small" disabled={false} value="ease" />
						</Col>
						<Col span={12} style={{paddingLeft: '15px'}}>
					      	<Select
    				    		onChange={handleTransitionInputChange.bind(this, 'transition-timing-function')}
		    				    placeholder="变化速度曲线"
								value={props.vdstyles.transitionSetting['transition-timing-function']}
		    				    size="small"
		    				>
		    					<Option key="ease">Ease</Option>
		    					<Option key="linear">Linear</Option>
		    					<Option key="ease-in">Ease In</Option>
		    					<Option key="ease-out">Ease Out</Option>
		    					<Option key="ease-in-out">Ease In Out</Option>
		    					<Option key="cubic-bezier">cubic Bezier</Option>
		    				</Select>
						</Col>
					</Row>
			    </InputGroup>
    			<FormItem wrapperCol={{span: 24}} label="">
				    <Button onClick={saveThisTransition.bind(this)} size="small" style={{marginTop: '15px', float: 'right'}}>保存</Button>
    			</FormItem>
    		</Form>
    	);
		},

    	transitionSttingPopover: (
			<Form className="form-no-margin-bottom">
				<FormItem label="起始位置" {...formItemLayout}></FormItem>

				<div style={{border: 'solid 1px #d9d9d9', padding: 5}}>
					<InputGroup compact>
						<div style={{width: '30%', display: 'inline-block'}}>
							水平方向:
						</div>
						<Input style={{ width: '40%' }} defaultValue="0" />
				      	<Select
	    				    placeholder="选择单位"
	    				    defaultValue="PX"
	    				    style={{ width: '30%' }}
	    				>
	    					<Option key="PX">PX</Option>
	    					<Option key="%">%</Option>
	    				</Select>
				    </InputGroup>

    				<InputGroup compact style={{marginTop: 5}}>
						<div style={{width: '30%', display: 'inline-block'}}>
							垂直方向:
						</div>
						<Input style={{ width: '40%' }} defaultValue="0" />
				      	<Select
	    				    placeholder="选择单位"
	    				    defaultValue="PX"
	    				    style={{ width: '30%' }}
	    				>
	    					<Option key="PX">PX</Option>
	    					<Option key="%">%</Option>
	    				</Select>
				    </InputGroup>
				</div>

				<FormItem {...formItemLayout} label="从自身看">
					<Row>
				        <Col span={13}>
				          	<Slider min={1} max={2000}/>
				        </Col>
				        <Col span={3}>
				          	<InputNumber/>
				        </Col>
				        <Col span={1}>PX</Col>
				    </Row>
				</FormItem>

				<FormItem {...formItemLayout} label="背面">
					<RadioGroup defaultValue="cansee" size="small">
				      	<RadioButton value="cansee">
	  		              	<i className="fa fa-eye"></i>
			      		</RadioButton>
			      		<RadioButton value="nosee">
	  		              	<i className="fa fa-eye-slash"></i>
			      		</RadioButton>
			      	</RadioGroup>
				</FormItem>
			</Form>
    	),

    	transitionAddPopover () {

    		const saveTransform = () => {
    			props.dispatch({
    				type: 'vdstyles/saveTransform',
					payload: {
						activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
					}
    			});
    		}

    		const handleTabChange = (transformType) => {
    			props.dispatch({
    				type: 'vdstyles/changeTransformType',
					payload: {
						transformType
					}
    			});
    		}

    		const handleTransformInputChange = (pos, e) => {
    			props.dispatch({
    				type: 'vdstyles/handleTransformInputChange',
    				payload: {
    					pos,
    					value: e.target.value
    				}
    			});
    		}

    		return (
			<Tabs activeKey={props.vdstyles.transformSetting.name} size="small" animated={false} onChange={handleTabChange}>
			    <TabPane tab="移动" key="translate" style={{padding: 10}}>

			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="x轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'x')} value={props.vdstyles.transformSetting.x}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									px
								</Col>
							</Row>
						</FormItem>

						<FormItem {...formItemLayout} label="y轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'y')} value={props.vdstyles.transformSetting.y}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									px
								</Col>
							</Row>
						</FormItem>
			      	</Form>

					<Button onClick={saveTransform} style={{float: 'right'}} size="small">保存</Button>
			    </TabPane>
			    <TabPane tab="缩放" key="scale" style={{padding: 10}}>
			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="x轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'x')} value={props.vdstyles.transformSetting.x}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									px
								</Col>
							</Row>
						</FormItem>

						<FormItem {...formItemLayout} label="y轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'y')} value={props.vdstyles.transformSetting.y}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									px
								</Col>
							</Row>
						</FormItem>

			      	</Form>
					<Button onClick={saveTransform} style={{float: 'right'}} size="small">保存</Button>
			    </TabPane>
			    <TabPane tab="旋转" key="rotate" style={{padding: 10}}>
			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="x轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'x')} value={props.vdstyles.transformSetting.x}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									deg
								</Col>
							</Row>
						</FormItem>

						<FormItem {...formItemLayout} label="y轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'y')} value={props.vdstyles.transformSetting.y}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									deg
								</Col>
							</Row>
						</FormItem>
			      	</Form>
					<Button onClick={saveTransform} style={{float: 'right'}} size="small">保存</Button>
			    </TabPane>
			    <TabPane tab="倾斜" key="skew" style={{padding: 10}}>
			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="x轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'x')} value={props.vdstyles.transformSetting.x}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									px
								</Col>
							</Row>
						</FormItem>

						<FormItem {...formItemLayout} label="y轴">
							<Row>
								<Col span={18} style={{paddingRight: '15px'}}>
									<Input onPressEnter={saveTransform} type="number" size="small" onChange={handleTransformInputChange.bind(this, 'y')} value={props.vdstyles.transformSetting.y}/>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									px
								</Col>
							</Row>
						</FormItem>

			      	</Form>
					<Button onClick={saveTransform} style={{float: 'right'}} size="small">保存</Button>
			    </TabPane>
			</Tabs>
    	);}
    }

    const effectProps = {
    	cursorPopover () {

    		const changeCursor = (cursor) => {
				handleStylesChange('cursor', {
					target: {
						value: cursor
					}
				});

				props.dispatch({
					type: 'vdstyles/togglePopover',
					payload: { popoverName: 'cursor' }
				});
    		}

    		return (
	    		<div>
	    			<p>普通的</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'default')} style={{cursor: 'default'}}>default</Button>
	    				<Button onClick={changeCursor.bind(this, 'none')} style={{cursor: 'none'}}>none</Button>
	    			</ButtonGroup>

	    			<li style={{marginBottom: 8, marginTop: 8}} className="ant-dropdown-menu-item-divider"></li>

	    			<p>链接 & 状态</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'pointer')} style={{cursor: 'pointer'}}>pointer</Button>
	    				<Button onClick={changeCursor.bind(this, 'not-allowed')} style={{cursor: 'not-allowed'}}>not-allowed</Button>
	    				<Button onClick={changeCursor.bind(this, 'wait')} style={{cursor: 'wait'}}>wait</Button>
	    				<Button onClick={changeCursor.bind(this, 'progress')} style={{cursor: 'progress'}}>progress</Button>
	    				<Button onClick={changeCursor.bind(this, 'help')} style={{cursor: 'help'}}>help</Button>
	    				<Button onClick={changeCursor.bind(this, 'context-menu')} style={{cursor: 'context-menu'}}>context-menu</Button>
	    			</ButtonGroup>

	    			<li style={{marginBottom: 8, marginTop: 8}} className="ant-dropdown-menu-item-divider"></li>

	    			<p>选择</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'cell')} style={{cursor: 'cell'}}>cell</Button>
	    				<Button onClick={changeCursor.bind(this, 'crosshair')} style={{cursor: 'crosshair'}}>crosshair</Button>
	    				<Button onClick={changeCursor.bind(this, 'text')} style={{cursor: 'text'}}>text</Button>
	    				<Button onClick={changeCursor.bind(this, 'vertical-text')} style={{cursor: 'vertical-text'}}>vertical-text</Button>
	    			</ButtonGroup>

	    			<li style={{marginBottom: 8, marginTop: 8}} className="ant-dropdown-menu-item-divider"></li>

	    			<p>拖拽</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'grab')} style={{cursor: 'grab'}}>grab</Button>
	    				<Button onClick={changeCursor.bind(this, 'grabbing')} style={{cursor: 'grabbing'}}>grabbing</Button>
	    				<Button onClick={changeCursor.bind(this, 'alias')} style={{cursor: 'alias'}}>alias</Button>
	    				<Button onClick={changeCursor.bind(this, 'copy')} style={{cursor: 'copy'}}>copy</Button>
	    				<Button onClick={changeCursor.bind(this, 'move')} style={{cursor: 'move'}}>move</Button>
	    			</ButtonGroup>

	    			<li style={{marginBottom: 8, marginTop: 8}} className="ant-dropdown-menu-item-divider"></li>

	    			<p>缩放</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'zoom-in')} style={{cursor: 'zoom-in'}}>zoom-in</Button>
	    				<Button onClick={changeCursor.bind(this, 'zoom-out')} style={{cursor: 'zoom-out'}}>zoom-out</Button>
	    			</ButtonGroup>

	    			<li style={{marginBottom: 8, marginTop: 8}} className="ant-dropdown-menu-item-divider"></li>

	    			<p>改变大小</p>
	    			<ButtonGroup>
	    				<Button onClick={changeCursor.bind(this, 'col-resize')} style={{cursor: 'col-resize'}}>col-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'row-resize')} style={{cursor: 'row-resize'}}>row-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'nesw-resize')} style={{cursor: 'nesw-resize'}}>nesw-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'nwse-resize')} style={{cursor: 'nwse-resize'}}>nwse-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'ew-resize')} style={{cursor: 'ew-resize'}}>ew-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'ns-resize')} style={{cursor: 'ns-resize'}}>ns-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'n-resize')} style={{cursor: 'n-resize'}}>n-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'w-resize')} style={{cursor: 'w-resize'}}>w-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 's-resize')} style={{cursor: 's-resize'}}>s-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'e-resize')} style={{cursor: 'e-resize'}}>e-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'nw-resize')} style={{cursor: 'nw-resize'}}>nw-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'ne-resize')} style={{cursor: 'ne-resize'}}>ne-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'sw-resize')} style={{cursor: 'sw-resize'}}>sw-resize</Button>
	    				<Button onClick={changeCursor.bind(this, 'se-resize')} style={{cursor: 'se-resize'}}>se-resize</Button>
	    			</ButtonGroup>

	    		</div>
	    	);
		}
    }

    const cssClassProps = {

    	onClassNameSelectChange (selected) {
    		props.dispatch({
    			type: 'vdstyles/handleClassChange',
    			payload: {
    				value: selected
    			}
    		})
    	}

    }

    const vdctrlCollapse = () => {

    	const cssStateMenu = () => {

    		const onSelect = ({ item, key, selectedKeys }) => {

    			console.log(selectedKeys);

    			props.dispatch({
    				type: 'vdstyles/handleCSSStateChange',
    				payload: {
    					selectedKeys: selectedKeys[0],
    					stateName: item.props.children
    				}
    			});

    			if(selectedKeys[0] == 'none') {
    				var acs = props.vdCtrlTree.activeCtrl.activeStyle;

					props.dispatch({
						type: 'vdCtrlTree/setActiveStyle',
						payload: props.vdCtrlTree.activeCtrl.activeStyle.split(':')[0]
					});
    			}else {

	    			props.dispatch({
	    				type: 'vdstyles/addStyle',
	    				payload: {
							activeStyle: props.vdCtrlTree.activeCtrl.activeStyle,
							cssState: selectedKeys[0]
	    				}
	    			});

					props.dispatch({
						type: 'vdstyles/applyCSSStyleIntoPage',
						payload: {
							activeCtrl: props.vdCtrlTree.activeCtrl
						}
					});

					props.dispatch({
						type: 'vdstyles/handleClassChange',
						payload: {
		    				value: props.vdCtrlTree.activeCtrl.activeStyle.split(':')[0] + ':' + selectedKeys[0],
		    				push: true,
		    				dontChangeAttr: true
		    			}
					});

    			}

    		}

	    	return (
			  	<Menu onSelect={onSelect} selectedKeys={[props.vdstyles.activeCSSState]}>
			  		{
			    		props.vdstyles.cssStates.map( (state, index) => {
			    			return(
			    				<Menu.Item key={state.key}>{state.name}</Menu.Item>
			    			);
			    		})
			  		}
			  	</Menu>
	    	);
    	}

    	const cssPanel = (

			<Panel header={<span><i className="fa fa-css3"></i>&nbsp;CSS类选择器</span>} key="css">
				<Row>
					<Col span={18}>
					  	<p style={{marginBottom: '10px'}}>当前类名：<Tag color="#87d068"><span style={{color: 'rgb(255, 255, 255)'}}>{props.vdCtrlTree.activeCtrl.activeStyle || '无活跃类名'}</span></Tag></p>
					</Col>
					<Col span={6} style={{textAlign: 'right'}}>
					  	<Dropdown overlay={cssStateMenu()}>
					    	<p hidden={!props.vdCtrlTree.activeCtrl.activeStyle} style={{cursor: 'pointer'}}>
					      		{props.vdstyles.activeCSSStateName} <Icon type="down" />
					    	</p>
					  	</Dropdown>
					</Col>
				</Row>
		    	<Row>
      				<Col span={3}>
      				    <Popover placement="bottom" content={cssSelector.newStylePopover.content()} trigger={['click']}>
						  	<Button style={{marginBottom: '10px', marginLeft: '-1px'}} size="small">
		  		              	<Tooltip placement="left" title="新增一个样式并应用">
							  		<i className="fa fa-plus"></i>
		      					</Tooltip>
						  	</Button>
				  	    </Popover>
      				</Col>
				  	<Col span={18} className="css-selector">
				      	<Select
					    	multiple
					    	style={{ width: '100%' }}
					    	placeholder="选择CSS类名应用到控件上"
					    	onChange={cssClassProps.onClassNameSelectChange.bind(this)}
					    	value={
					    		props.vdCtrlTree.activeCtrl.customClassName
					    	}
					    	size="small"
					  	>
					    	{cssSelector.cssClassNameList()}
					  	</Select>
				  	</Col>
      				<Col span={3}>
      				    <Dropdown overlay={cssSelector.cssClassListForDropdown()}>
						  	<Button style={{marginBottom: '10px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', marginLeft: '-1px'}} size="small">
		  		              	<Tooltip placement="left" title="选择CSS类进行编辑">
							  		<i className="fa fa-pencil"></i>
		      					</Tooltip>
						  	</Button>
				  	    </Dropdown>
      				</Col>
  				</Row>
		    </Panel>

    	);

		const layoutPanel = () => {
			return (
		    <Panel header="布局" key="layout">
											  	<Popconfirm onConfirm={setThisPropertyNull.bind(this, 'display')} title="删除属性？" okText="是" cancelText="否">
		 											<a href="#">Display 设置</a>
		  										</Popconfirm>

				<div className="guidance-panel-wrapper">
					<div className="guidance-panel-child">
						<div className="bem-Frame">
							<div className="bem-Frame_Head">
								<div className="bem-Frame_Legend">
									<div className="bem-SpecificityLabel bem-SpecificityLabel-local bem-SpecificityLabel-text">
										{
											activeCSSStyleState['display'] == '' ? <span>Display 设置</span> : (
											  	<Popconfirm onConfirm={setThisPropertyNull.bind(this, 'display')} title="删除属性？" okText="是" cancelText="否">
		 											<a href="#">Display 设置</a>
		  										</Popconfirm>
											)
										}
									</div>
								</div>
							</div>
							<div className="bem-Frame_Body">

						        <RadioGroup defaultValue="block" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['display']} size="small" onChange={handleStylesChange.bind(this, 'display')}>
							      	<RadioButton value="block">
				  		              	<Tooltip placement="top" title="block">
							      			<svg width="18" height="14" viewBox="0 0 22 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".15" fill="currentColor" d="M19 3v8H3V3h16m1-1H2v10h18V2z"></path><path fill="currentColor" d="M19.8 1H2.2A1.2 1.2 0 0 0 1 2.2v9.6A1.2 1.2 0 0 0 2.2 13h17.6a1.2 1.2 0 0 0 1.2-1.2V2.2A1.2 1.2 0 0 0 19.8 1zm.2 11H2V2h18v10z"></path><path opacity=".35" fill="currentColor" d="M3 3h16v8H3z"></path></svg>
							      		</Tooltip>
						      		</RadioButton>
							      	<RadioButton value="inline-block">
				  		              	<Tooltip placement="top" title="inline-block">
											<svg width="28" height="14" viewBox="0 0 28 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M25 3v8H3V3h22m1-1H2v10h24V2z" opacity=".15"></path><path opacity=".35" fill="currentColor" d="M8.418 9.8H7.66L7.25 11h1.58l-.232-.676-.18-.525zM3 11h.567l2.916-7.94h3.15L11 6.78V3H3v8zm15.12-1.002a3.302 3.302 0 0 1-.48-.586c-.173.343-.42.653-.73.888.002 0 .004-.002.005-.003l-.008.006.003-.003a3.145 3.145 0 0 1-1.092.55c-.4.11-.825.15-1.303.15h6.017a4.416 4.416 0 0 1-1.12-.215 3.51 3.51 0 0 1-1.292-.787zM14.237 3c.49 0 .853.014 1.167.06.335.05.656.16.953.314h.003l.004.003c.365.19.694.492.898.866.13.234.197.49.24.747.16-.298.343-.58.578-.82v-.002c.358-.366.8-.643 1.287-.826a4.373 4.373 0 0 1 1.557-.272 5.67 5.67 0 0 1 1.442.18l.01.002.01.003c.205.06.4.126.59.208.15.064.283.125.407.185l.562.274v3.016h-1.54l-.28-.24a7.018 7.018 0 0 0-.233-.188 2.703 2.703 0 0 0-.26-.175 1.594 1.594 0 0 0-.277-.125h-.006l-.2-.03a.772.772 0 0 0-.26.042l-.16.102a.63.63 0 0 0-.13.22 1.486 1.486 0 0 0-.075.516c0 .266.04.436.074.513a.59.59 0 0 0 .13.212l.15.09h.003a.868.868 0 0 0 .265.045l.236-.037h.008a1.04 1.04 0 0 0 .25-.113l.007-.004.01-.005.24-.16a6.41 6.41 0 0 0 .216-.17l.285-.254h1.536v3.017l-.59.266c-.15.066-.292.13-.422.184a4.19 4.19 0 0 1-.53.19 5.918 5.918 0 0 1-.636.15c-.076.012-.16.02-.24.026H25V3H14.237z"></path><path fill="currentColor" d="M25.8 1H2.2A1.2 1.2 0 0 0 1 2.2v9.6A1.2 1.2 0 0 0 2.2 13h23.6a1.2 1.2 0 0 0 1.2-1.2V2.2A1.2 1.2 0 0 0 25.8 1zm.2 11H2V2h24v10zm-7.186-2.72c.258.248.567.435.927.56s.76.19 1.18.19c.29 0 .51-.014.68-.042.167-.028.34-.07.53-.123.143-.04.28-.09.41-.146l.412-.19V8.16h-.154c-.07.06-.157.134-.265.22a3.337 3.337 0 0 1-.35.237 2.11 2.11 0 0 1-.485.22 1.798 1.798 0 0 1-1.1-.01 1.403 1.403 0 0 1-.523-.3c-.15-.14-.28-.33-.38-.57a2.36 2.36 0 0 1-.152-.9c0-.347.047-.64.14-.88s.216-.433.367-.58c.157-.15.33-.26.517-.325a1.786 1.786 0 0 1 1.116-.014c.164.056.316.125.457.206a4.868 4.868 0 0 1 .644.466h.17V4.54a13.03 13.03 0 0 0-.367-.168 3.667 3.667 0 0 0-1.005-.27 4.736 4.736 0 0 0-.65-.04c-.436 0-.837.07-1.205.207s-.675.333-.924.59c-.26.262-.457.58-.59.95S18 6.6 18 7.055c0 .488.07.918.213 1.29s.343.683.6.933zm-3.264.607c.272-.076.52-.2.75-.38.195-.15.35-.338.46-.567.113-.23.17-.488.17-.778 0-.4-.11-.722-.332-.967-.22-.245-.52-.406-.896-.484v-.03a1.46 1.46 0 0 0 .623-.51 1.36 1.36 0 0 0 .22-.77c0-.25-.052-.47-.16-.665a1.15 1.15 0 0 0-.49-.465 2.065 2.065 0 0 0-.64-.215A7.67 7.67 0 0 0 14.237 4H12v6h2.515c.418 0 .763-.037 1.035-.113zM13.478 5.1h.14c.29 0 .517.002.678.006s.296.027.404.07c.12.05.206.123.253.223a.69.69 0 0 1 .072.29.86.86 0 0 1-.062.34c-.042.1-.13.18-.263.24a1.05 1.05 0 0 1-.39.08c-.166.007-.366.01-.6.01h-.233V5.1zm.108 3.8h-.108V7.405h.324c.222 0 .434 0 .638.004.203 0 .363.02.48.05.17.05.29.13.36.23s.106.25.106.44c0 .144-.03.272-.087.384s-.17.2-.32.27a1.257 1.257 0 0 1-.5.104c-.18.003-.48.004-.9.004zm-6.64-.1h2.187l.41 1.2h1.574L8.935 4.06H7.182L5 10h1.535l.412-1.2zM8.04 5.58l.727 2.13H7.313l.727-2.13z"></path></svg>
							      		</Tooltip>
							      	</RadioButton>
							      	<RadioButton value="inline">
				  		              	<Tooltip placement="top" title="inline">
											<svg width="18" height="8" viewBox="0 0 20 8" className="bem-Svg " style={{marginTop:'5px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M14.814 6.25c.258.248.567.435.927.56s.76.19 1.18.19c.29 0 .51-.014.68-.042.167-.028.34-.07.53-.123.143-.04.28-.09.41-.146l.41-.19V5.13h-.153c-.07.06-.157.134-.265.22a3.337 3.337 0 0 1-.35.237 2.11 2.11 0 0 1-.484.22 1.798 1.798 0 0 1-1.1-.01 1.403 1.403 0 0 1-.523-.3 1.566 1.566 0 0 1-.38-.57c-.1-.24-.152-.54-.152-.9 0-.346.048-.638.14-.878s.217-.437.368-.58c.16-.155.33-.26.52-.33a1.786 1.786 0 0 1 1.117-.013c.165.055.317.124.458.205a4.385 4.385 0 0 1 .643.47h.17V1.52c-.107-.05-.23-.107-.37-.168a3.613 3.613 0 0 0-1.003-.27 4.736 4.736 0 0 0-.65-.04c-.436 0-.837.07-1.205.207s-.674.33-.923.59c-.26.26-.458.58-.59.95S14 3.57 14 4.02c0 .488.07.918.213 1.29s.343.683.6.933zm-3.264.608c.272-.075.52-.2.75-.377a1.5 1.5 0 0 0 .46-.56 1.72 1.72 0 0 0 .17-.77c0-.4-.11-.72-.332-.96-.22-.244-.52-.404-.896-.48v-.04a1.46 1.46 0 0 0 .623-.516c.147-.22.22-.474.22-.763 0-.25-.052-.47-.16-.66a1.152 1.152 0 0 0-.49-.46 2.06 2.06 0 0 0-.64-.212A7.67 7.67 0 0 0 10.237 1H8v5.97h2.515c.418 0 .763-.037 1.035-.112zM9.478 2.095h.14c.29 0 .517.002.678.006.162.01.296.03.404.07a.46.46 0 0 1 .253.23.69.69 0 0 1 .072.298.85.85 0 0 1-.062.34.492.492 0 0 1-.263.24 1.052 1.052 0 0 1-.39.08c-.166.006-.366.01-.6.01h-.232v-1.27zm.108 3.78h-.108V4.388h.324c.222 0 .434 0 .638.004a1.8 1.8 0 0 1 .48.056c.17.05.29.127.36.23.07.104.106.25.106.44 0 .144-.03.272-.087.383s-.17.2-.32.27-.32.1-.5.11c-.18.004-.48.004-.9.004zm-6.64-.106h2.187l.41 1.2h1.574L4.935 1.03H3.182L1 6.97h1.535l.412-1.2zM4.04 2.55l.727 2.13H3.313l.727-2.13z"></path></svg>
										</Tooltip>
							      	</RadioButton>
							      	<RadioButton value="flex">
				  		              	<Tooltip placement="top" title="flex">
											<svg width="18" height="14" viewBox="0 0 23 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><g fill="currentColor" fillRule="evenodd"><path d="M21 2v10H2V2h19zm1-1H1v12h21V1z" opacity=".15"></path><path d="M1.2 0A1.2 1.2 0 0 0 0 1.2v11.6A1.2 1.2 0 0 0 1.2 14h20.6a1.2 1.2 0 0 0 1.2-1.2V1.2A1.2 1.2 0 0 0 21.8 0H1.2zM22 13H1V1h21v12z"></path><path opacity=".4" d="M3 3h5v8H3z"></path><path d="M4 4v6h3V4H4zm4-1v8H3V3h5z"></path><path opacity=".4" d="M9 3h5v8H9z"></path><path d="M10 4v6h3V4h-3zm4-1v8H9V3h5z"></path><path opacity=".4" d="M15 3h5v8h-5z"></path><path d="M16 4v6h3V4h-3zm4-1v8h-5V3h5z"></path></g></svg>
										</Tooltip>
							      	</RadioButton>
							      	<RadioButton value="none">
				  		              	<Tooltip placement="top" title="none">
											<svg width="15" height="15" viewBox="0 0 15 15" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M12.146 5.27l-1.29 1.29c.084.3.144.612.144.94C11 9.434 9.434 11 7.502 11c-.33 0-.64-.06-.943-.145l-.797.795c.554.214 1.135.35 1.738.35 3.59 0 6.5-4.56 6.5-4.56s-.71-1.078-1.854-2.17zm.5-3.624l-2.26 2.26C9.516 3.38 8.54 3 7.5 3 3.91 3 1 7.44 1 7.44s1.112 1.724 2.8 3.053l-2.153 2.153.707.707 11-11-.708-.707zM8.25 6.044a1.62 1.62 0 0 0-.748-.2c-.918 0-1.658.74-1.658 1.654 0 .274.083.523.2.75l-1.328 1.33A3.433 3.433 0 0 1 4 7.5 3.5 3.5 0 0 1 7.502 4a3.43 3.43 0 0 1 2.075.716L8.25 6.044z"></path></svg>
										</Tooltip>
							      	</RadioButton>
							    </RadioGroup>

							</div>
						</div>
					</div>
				</div>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['width'] == '' ? <span>宽度</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">宽度</a>
										</Popconfirm>
								)
							}>
								<Input size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['width']} onChange={handleStylesChange.bind(this, 'width')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['height'] == '' ? <span>高度</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">高度</a>
										</Popconfirm>
								)
							}>
								<Input size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['height']} onChange={handleStylesChange.bind(this, 'height')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['max-width'] == '' ? <span>最大</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">最大</a>
										</Popconfirm>
								)
							}>
								<Input size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['max-width']} onChange={handleStylesChange.bind(this, 'max-width')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['min-width'] == '' ? <span>最小</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">最小</a>
										</Popconfirm>
								)
							}>
								<Input size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['min-width']} onChange={handleStylesChange.bind(this, 'min-width')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['max-height'] == '' ? <span>最大</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">最大</a>
										</Popconfirm>
								)
							}>
								<Input size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['max-height']} onChange={handleStylesChange.bind(this, 'max-height')}/>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['min-height'] == '' ? <span>最小</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">最小</a>
										</Popconfirm>
								)
							}>
								<Input size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['min-height']} onChange={handleStylesChange.bind(this, 'min-height')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		      	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label={
								activeCSSStyleState['float'] == '' ? <span>浮动</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">浮动</a>
										</Popconfirm>
								)
							}>
				        <RadioGroup defaultValue="block" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['float']} onChange={handleStylesChange.bind(this, 'float')}>
					      	<RadioButton value="none">
		  		              	<Tooltip placement="top" title="none">
									<Icon type="close" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="left">
		  		              	<Tooltip placement="top" title="left">
									<Icon type="menu-fold" />
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="right">
		  		              	<Tooltip placement="top" title="right">
									<Icon type="menu-unfold" />
								</Tooltip>
					      	</RadioButton>
					    </RadioGroup>
					</FormItem>
		      	</Form>

		      	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label={
								activeCSSStyleState['clear'] == '' ? <span>清除</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">清除</a>
										</Popconfirm>
								)
							}>
				        <RadioGroup defaultValue="block" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['clear']} size="small" onChange={handleStylesChange.bind(this, 'clear')}>
					      	<RadioButton value="none">
		  		              	<Tooltip placement="top" title="none">
									<Icon type="close" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="left">
		  		              	<Tooltip placement="top" title="left">
									<Icon type="fast-backward" />
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="right">
		  		              	<Tooltip placement="top" title="right">
									<Icon type="fast-forward" />
								</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="both">
		  		              	<Tooltip placement="top" title="both">
									<Icon type="swap" />
								</Tooltip>
					      	</RadioButton>
					    </RadioGroup>
					</FormItem>
		      	</Form>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		      	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label={
								activeCSSStyleState['overflow'] == '' ? <span>溢出</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">溢出</a>
										</Popconfirm>
								)
							}>
				        <RadioGroup defaultValue="block" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['overflow']} size="small" onChange={handleStylesChange.bind(this, 'overflow')}>
					      	<RadioButton value="visible">
		  		              	<Tooltip placement="top" title="visible">
									<Icon type="smile-o" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="hidden">
		  		              	<Tooltip placement="top" title="hidden">
									<Icon type="frown-o" />
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="scroll">
		  		              	<Tooltip placement="top" title="scroll">
		  		              		<span>滚动</span>
								</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="auto">
		  		              	<Tooltip placement="top" title="auto">
		  		              		<span>自动</span>
								</Tooltip>
					      	</RadioButton>
					    </RadioGroup>
					</FormItem>
		      	</Form>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		      	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label={
								activeCSSStyleState['position'] == '' ? <span>位置</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">位置</a>
										</Popconfirm>
								)
							}>
				        <RadioGroup defaultValue="block" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['position']} size="small" onChange={handleStylesChange.bind(this, 'position')}>
					      	<RadioButton value="auto">
		  		              	<Tooltip placement="top" title="auto">
									<Icon type="check" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="relative">
		  		              	<Tooltip placement="top" title="relative">
									<Icon type="shrink" />
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="absolute">
		  		              	<Tooltip placement="top" title="absolute">
		  		              		<span>绝对</span>
								</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="fixed">
		  		              	<Tooltip placement="top" title="fixed">
		  		              		<span>固定</span>
								</Tooltip>
					      	</RadioButton>
					    </RadioGroup>
					</FormItem>
		      	</Form>

		    </Panel>
		);
		}

		const typoPanel = () => {
			return (
		    <Panel header="字体" key="typo">
		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['font-family'] == '' ? <span>字体</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">字体</a>
										</Popconfirm>
								)
							}>
	        				    <Select size="small" value="选择字体" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['font-family']} onChange={handleStylesChange.bind(this, 'font-family')}>
					      			<Option key="sss" value="h1">h1</Option>
					    		</Select>
							</FormItem>
				      	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['color'] == '' ? <span>颜色</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">颜色</a>
										</Popconfirm>
								)
							}>
								<Input type="color" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['color']} size="small" onChange={handleStylesChange.bind(this, 'color')}/>
							</FormItem>
						</Form>
				  	</Col>

		    	</Row>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['font-weight'] == '' ? <span>粗细</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">粗细</a>
										</Popconfirm>
								)
							}>
	        				    <Select size="small" value="选择" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['font-weight']} onChange={handleStylesChange.bind(this, 'font-weight')}>
					      			<Option key="100" value="100">100 - 极细</Option>
					      			<Option key="200" value="200">200 - 稍细</Option>
					      			<Option key="300" value="300">300 - 细</Option>
					      			<Option key="400" value="400">400 - 正常</Option>
					      			<Option key="400" value="500">500 - 中等</Option>
					      			<Option key="400" value="700">700 - 粗</Option>
					      			<Option key="400" value="800">800 - 稍粗</Option>
					      			<Option key="400" value="900">900 - 极粗</Option>
					    		</Select>
							</FormItem>
						</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['font-style'] == '' ? <span>样式</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">样式</a>
										</Popconfirm>
								)
							}>

								<RadioGroup defaultValue="normal" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['font-style']} size="small" onChange={handleStylesChange.bind(this, 'font-style')}>
							      	<RadioButton value="normal">
				  		              	<Tooltip placement="top" title="normal">
											<i className="fa fa-font"></i>
							      		</Tooltip>
						      		</RadioButton>
							      	<RadioButton value="italic">
				  		              	<Tooltip placement="top" title="italic">
											<i className="fa fa-italic"></i>
							      		</Tooltip>
							      	</RadioButton>
							    </RadioGroup>

							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
					  	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['text-indent'] == '' ? <span>缩进</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">缩进</a>
										</Popconfirm>
								)
							}>
								<Input type="text" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['text-indent']} onChange={handleStylesChange.bind(this, 'text-indent')}/>
							</FormItem>
					  	</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['font-size'] == '' ? <span>大小</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">大小</a>
										</Popconfirm>
								)
							}>
								<Input type="text" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['font-size']} onChange={handleStylesChange.bind(this, 'font-size')}/>
							</FormItem>
				      	</Form>
				  	</Col>

		    	</Row>

		    	<Row>

				  	<Col span={12} style={{paddingRight: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['line-height'] == '' ? <span>行间距</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">行间距</a>
										</Popconfirm>
								)
							}>
								<Input type="text" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['line-height']} onChange={handleStylesChange.bind(this, 'line-height')}/>
							</FormItem>
						</Form>
				  	</Col>
				  	<Col span={12} style={{paddingLeft: '5px'}}>
				      	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['letter-spacing'] == '' ? <span>词间距</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">词间距</a>
										</Popconfirm>
								)
							}>
								<Input type="text" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['letter-spacing']} onChange={handleStylesChange.bind(this, 'letter-spacing')}/>
							</FormItem>
				      	</Form>
				  	</Col>

			  	</Row>

		      	<li className="ant-dropdown-menu-item-divider"></li>

		      	<Form className="form-no-margin-bottom">

					<FormItem {...formItemLayout} label={
								activeCSSStyleState['text-align'] == '' ? <span>排列方式</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">排列方式</a>
										</Popconfirm>
								)
							}>

						<RadioGroup defaultValue="left" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['text-align']} onChange={handleStylesChange.bind(this, 'text-align')}>
					      	<RadioButton value="left">
		  		              	<Tooltip placement="top" title="left">
									<i className="fa fa-align-left"></i>
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="center">
		  		              	<Tooltip placement="top" title="center">
									<i className="fa fa-align-center"></i>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="right">
		  		              	<Tooltip placement="top" title="right">
									<i className="fa fa-align-right"></i>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="justify">
		  		              	<Tooltip placement="top" title="justify">
									<i className="fa fa-align-justify"></i>
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

					<FormItem {...formItemLayout} label={
								activeCSSStyleState['write-mode'] == '' ? <span>阅读顺序</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">阅读顺序</a>
										</Popconfirm>
								)
							}>

						<RadioGroup defaultValue="left" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['write-mode']} onChange={handleStylesChange.bind(this, 'write-mode')}>
					      	<RadioButton value="lr-tb">
		  		              	<Tooltip placement="top" title="从左到右">
									<i className="fa fa-indent"></i>
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="tb-rl">
		  		              	<Tooltip placement="top" title="从右到左">
									<i style={{transform:'rotate(180deg)'}} className="fa fa-indent"></i>
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

					<FormItem {...formItemLayout} label={
								activeCSSStyleState['text-decoration'] == '' ? <span>渲染</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">渲染</a>
										</Popconfirm>
								)
							}>

						<RadioGroup defaultValue="none" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['text-decoration']} onChange={handleStylesChange.bind(this, 'text-decoration')}>
					      	<RadioButton value="none">
		  		              	<Tooltip placement="top" title="none">
									<Icon type="close" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="underline">
		  		              	<Tooltip placement="top" title="underline">
									<i className="fa fa-underline"></i>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="line-through">
		  		              	<Tooltip placement="top" title="line-through">
									<i className="fa fa-strikethrough"></i>
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

					<FormItem {...formItemLayout} label={
								activeCSSStyleState['text-transform'] == '' ? <span>大小写</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">大小写</a>
										</Popconfirm>
								)
							}>

						<RadioGroup defaultValue="none" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['text-transform']} onChange={handleStylesChange.bind(this, 'text-transform')}>
					      	<RadioButton value="none">
		  		              	<Tooltip placement="top" title="none">
									<Icon type="close" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="uppercase">
		  		              	<Tooltip placement="top" title="大写">
		  		              		<span>TT</span>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="capitalize">
		  		              	<Tooltip placement="top" title="首字母大写">
		  		              		<span>Tt</span>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="lowercase">
		  		              	<Tooltip placement="top" title="小写">
		  		              		<span>tt</span>
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

		      	</Form>

		    </Panel>
		);
		}

		const backgroundPanel = () => {
		 	return (
			    <Panel header="背景" key="background">

			    	<Form className="form-no-margin-bottom">

						<FormItem {...formItemLayout} label="图片和渐变">

							<RadioGroup defaultValue="图片" size="small">
						      	<RadioButton value="图片">
									<Popover
							        	content={backgroundImageAndGradient.imageSetter()}
							        	title="图片处理"
							        	trigger="click"
							        	placement="left"
							      	>
				  		              	<Tooltip placement="top" title="图片">
											<i className="fa fa-picture-o"></i>
							      		</Tooltip>
							      	</Popover>
					      		</RadioButton>
						      	<RadioButton value="渐变色">
									<Popover
							        	content={backgroundImageAndGradient.gradientSetter}
							        	title="渐变处理"
							        	trigger="click"
							        	placement="bottom"
							      	>
				  		              	<Tooltip placement="top" title="渐变">
											<i className="fa fa-barcode"></i>
							      		</Tooltip>
						      		</Popover>
						      	</RadioButton>
						    </RadioGroup>

						</FormItem>

			    	</Form>

			    	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label={
								activeCSSStyleState['background']['background-color'] == '' ? <span>背景色</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">背景色</a>
										</Popconfirm>
								)
							}>
							<Input type="color" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['background']['background-color']} onChange={handleStylesChange.bind(this, 'background-color', 'background')}/>
						</FormItem>
			    	</Form>

			    </Panel>
			);
		}

		const bordersPanel = () => {

			var borderPosition = props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['border']['border-position'];
			var borderRadiusPosition = props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['border-radius']['border-radius-position']

			const handleBorderTypeChange = (position) => {
				handleStylesChange('border-position', {
					target: {
						value: position
					}
				});
			};

			const handleBorderInputChange = (propertyName, e) => {
				handleStylesChange(borderPosition + '-' + propertyName, {
					target: {
						value: e.target.value
					}
				});
			};

			const handleBorderRadiusPositionChange = (position) => {
				handleStylesChange('border-radius-position', {
					target: {
						value: position
					}
				});
			};

			const handleBorderRadiusInputChange = (propertyName, e) => {
				handleStylesChange(borderRadiusPosition + '-radius', {
					target: {
						value: e.target.value
					}
				});
			}

			return (
		    <Panel header="边框" key="borders">

				<Row>
					<Col span={8}>
						<Row style={{marginBottom: '5px'}}>
							<Col span={8}></Col>
							<Col span={8}>
								<Tooltip title="上边框">
									<Button onClick={handleBorderTypeChange.bind(this, 'border-top')} size="small"><i className="fa fa-window-maximize"></i></Button>
								</Tooltip>
							</Col>
							<Col span={8}></Col>
						</Row>
						<Row style={{marginBottom: '5px'}}>
							<Col span={8}>
								<Tooltip placement="left" title="左边框">
									<Button onClick={handleBorderTypeChange.bind(this, 'border-left')} size="small"><i className="fa fa-window-maximize" style={{transform: 'rotate(-90deg)'}}></i></Button>
								</Tooltip>
							</Col>
							<Col span={8}>
								<Tooltip title="全边框">
									<Button onClick={handleBorderTypeChange.bind(this, 'border')} style={{width: '27px'}} size="small"><i className="fa fa-square-o"></i></Button>
								</Tooltip>
							</Col>
							<Col span={8}>
								<Tooltip placement="right" title="右边框">
									<Button onClick={handleBorderTypeChange.bind(this, 'border-right')} size="small"><i className="fa fa-window-maximize" style={{transform: 'rotate(90deg)'}}></i></Button>
								</Tooltip>
							</Col>
						</Row>
						<Row>
							<Col span={8}></Col>
							<Col span={8}>
								<Tooltip placement="bottom" title="下边框">
									<Button onClick={handleBorderTypeChange.bind(this, 'border-bottom')} size="small"><i className="fa fa-window-maximize" style={{transform: 'rotate(180deg)'}}></i></Button>
								</Tooltip>
							</Col>
							<Col span={8}></Col>
						</Row>
					</Col>

					<Col span={16} style={{paddingLeft: '15px'}}>
				    	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['border'][borderPosition + '-width'] == '' ? <span>宽度</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">宽度</a>
										</Popconfirm>
								)
							}>
								<Input size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['border'][borderPosition + '-width']} onChange={handleBorderInputChange.bind(this, 'width')}/>
							</FormItem>

							<FormItem {...formItemLayout} label={
								activeCSSStyleState['border'][borderPosition + '-color'] == '' ? <span>颜色</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">颜色</a>
										</Popconfirm>
								)
							}>
								<Input size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['border'][borderPosition + '-color']} onChange={handleBorderInputChange.bind(this, 'color')} type="color"/>
							</FormItem>
				    	</Form>
					</Col>
				</Row>

		    	<Form className="form-no-margin-bottom">

					<FormItem {...formItemLayout} label={
								activeCSSStyleState['border'][borderPosition + '-style'] == '' ? <span>样式</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">样式</a>
										</Popconfirm>
								)
							}>

						<RadioGroup defaultValue="none" size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['border'][borderPosition + '-style']} onChange={handleBorderInputChange.bind(this, 'style')}>
					      	<RadioButton value="none">
		  		              	<Tooltip placement="top" title="无">
									<Icon type="close" />
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="solid">
		  		              	<Tooltip placement="top" title="直线">
									<Icon type="minus" />
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="dashed">
		  		              	<Tooltip placement="top" title="虚线">
									<i className="fa fa-ellipsis-h"></i>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="dotted">
		  		              	<Tooltip placement="top" title="点线">
									<Icon type="ellipsis" />
					      		</Tooltip>
					      	</RadioButton>
					    </RadioGroup>

					</FormItem>

		    	</Form>

		      	<li style={{marginTop: '15px', marginBottom: '15px'}} className="ant-dropdown-menu-item-divider"></li>

				<Row>
					<Col span={8}>
						<Row style={{marginBottom: '5px'}}>
							<Col span={8}>
								<Tooltip placement="top" title="弧 - 左上">
									<Button onClick={handleBorderRadiusPositionChange.bind(this, 'border-top-left')} style={{borderTopLeftRadius: '28px', width: '28px', height: '28px'}} size="small"><i className="fa fa-window-maximize"></i></Button>
								</Tooltip>
								<Tooltip placement="bottom" title="弧 - 左下">
									<Button onClick={handleBorderRadiusPositionChange.bind(this, 'border-bottom-left')} style={{borderBottomLeftRadius: '28px', width: '28px', height: '28px', marginTop: '3px'}} size="small"><i className="fa fa-window-maximize"></i></Button>
								</Tooltip>
							</Col>
							<Col span={8}>
								<Button onClick={handleBorderRadiusPositionChange.bind(this, 'border')} style={{marginTop: '16px', marginRight: '1px'}} size="small"><i className="fa fa-window-maximize"></i></Button>
							</Col>
							<Col span={8}>
								<Tooltip placement="top" title="弧 - 右上">
									<Button onClick={handleBorderRadiusPositionChange.bind(this, 'border-top-right')} style={{borderTopRightRadius: '28px', width: '28px', height: '28px'}} size="small"><i className="fa fa-window-maximize"></i></Button>
								</Tooltip>
								<Tooltip placement="bottom" title="弧 - 右下">
									<Button onClick={handleBorderRadiusPositionChange.bind(this, 'border-bottom-right')} style={{borderBottomRightRadius: '28px', width: '28px', height: '28px', marginTop: '3px'}} size="small"><i className="fa fa-window-maximize"></i></Button>
								</Tooltip>
							</Col>
						</Row>
					</Col>

					<Col span={16} style={{paddingLeft: '15px'}}>
				    	<Form className="form-no-margin-bottom">
							<FormItem {...formItemLayout} label={
								activeCSSStyleState['border-radius'][borderRadiusPosition + '-radius'] == '' ? <span>弧度</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">弧度</a>
										</Popconfirm>
								)
							}>
								<Input value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['border-radius'][borderRadiusPosition + '-radius']} size="small" onChange={handleBorderRadiusInputChange.bind(this, 'radius')} />
							</FormItem>
				    	</Form>
					</Col>
				</Row>

		    </Panel>);
		}

		const shadowsPanel = () => {

			const onVisibleChange = (cssPropertyIndex, shadowType, e) => {
				if(e) {
					props.dispatch({
						type: 'vdstyles/setActiveBoxShadow',
						payload: {
							cssPropertyIndex,
							shadowType,
							activeStyle: props.vdCtrlTree.activeCtrl.activeStyle
						}
					});
				}
			}

			const removeThisShadow = (cssPropertyIndex, shadowType) => {
				props.dispatch({
					type: 'vdstyles/removeThisShadow',
					payload: {
						cssPropertyIndex,
						shadowType,
						activeStyle: props.vdCtrlTree.activeCtrl.activeStyle
					}
				});
			}

			return (<Panel header="阴影" key="shadows">
		    	<Form className="form-no-margin-bottom">
					<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right'}} label="盒子阴影">

		      			<Tooltip placement="top" title="添加盒子阴影">
		      				<Popover title='添加盒子阴影' placement="leftTop" trigger="click" content={shadowProps.settingPopover(this)}>
								<Button size="small"><Icon type="plus" /></Button>
				      		</Popover>
			      		</Tooltip>

					</FormItem>
					<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -5}}>
						{
							props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['box-shadow'].childrenProps.map((cssProperty, cssPropertyIndex) => {
								return (
							      	<Popover onVisibleChange={onVisibleChange.bind(this, cssPropertyIndex, 'box-shadow')} key={cssPropertyIndex} placement="left" title="编辑盒子阴影" content={shadowProps.modifyPopover()} trigger="click">

										<div key={cssPropertyIndex} style={{border: '1px solid #d9d9d9', minHeight: 10, marginTop: '10px'}}>
											<Row>
												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<Tag color={cssProperty['color']}></Tag>
												</Col>
												<Col span={16} style={{textAlign: 'center', cursor: 'pointer'}}>
													<span>{cssProperty['inset']}</span>
												</Col>
												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<i onClick={removeThisShadow.bind(this, cssPropertyIndex, 'box-shadow')} className="fa fa-trash-o"></i>
												</Col>
											</Row>
										</div>

							      	</Popover>
								);
							})
						}
					</FormItem>

		    	</Form>

		    	<li style={{marginTop: '15px', marginBottom: '15px'}} className="ant-dropdown-menu-item-divider"></li>

		    	<Form className="form-no-margin-bottom">
					<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right'}} label="文字阴影">

		      			<Tooltip placement="top" title="添加文字阴影">
		      				<Popover title='添加文字阴影' placement="leftTop" trigger="click" content={textShadowProps.settingPopover()}>
								<Button size="small"><Icon type="plus" /></Button>
				      		</Popover>
			      		</Tooltip>

					</FormItem>
					<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -5}}>
						{
							props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['text-shadow'].childrenProps.map((cssProperty, cssPropertyIndex) => {
								return (
							      	<Popover onVisibleChange={onVisibleChange.bind(this, cssPropertyIndex, 'text-shadow')} key={cssPropertyIndex} placement="left" title="编辑文字阴影" content={textShadowProps.modifyPopover()} trigger="click">

										<div key={cssPropertyIndex} style={{border: '1px solid #d9d9d9', minHeight: 10, marginTop: '10px'}}>
											<Row>
												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<Tag color={cssProperty['color']}></Tag>
												</Col>
												<Col span={16} style={{textAlign: 'center', cursor: 'pointer'}}>
													<span>{cssProperty['h-shadow']},{cssProperty['v-shadow']}</span>
												</Col>
												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<i onClick={removeThisShadow.bind(this, cssPropertyIndex, 'text-shadow')} className="fa fa-trash-o"></i>
												</Col>
											</Row>
										</div>

							      	</Popover>
								);
							})
						}
					</FormItem>

		    	</Form>

		    </Panel>
		);
		}

		/*
			<Tooltip placement="top" title="变换设置">
					<Popover title='变换设置' placement="leftTop" trigger="click" content={transformAndTransitionProps.transitionSttingPopover}>
	      			<Button size="small" style={{textAlign: 'center'}}>
	      				<i className="fa fa-cog"></i>
	      			</Button>
	      		</Popover>
	  		</Tooltip>
		*/

		const transitionsTransformsPanel = () => {

			const removeThisTransition = (transitionIndex) => {
				props.dispatch({
					type: 'vdstyles/removeThisTransition',
					payload: {
						transitionIndex,
						activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
					}
				});
			}

			const removeThisTransform = (transformIndex) => {
				props.dispatch({
					type: 'vdstyles/removeThisTransform',
					payload: {
						transformIndex,
						activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
					}
				});
			}

		 	return (
			    <Panel header="过渡和变换" key="transitions-transforms">
			      	<Form className="form-no-margin-bottom">
			      		<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right', marginTop: 5, marginBottom: 6}} label="过渡">
			      			<Tooltip placement="top" title="添加过渡">
			      				<Popover title='添加过渡' placement="leftTop" trigger="click" visible={props.vdstyles.popover.newTransition.visible} content={transformAndTransitionProps.transformSettingPopover()}>
					      			<Button size="small" onClick={() => { props.dispatch({type: 'vdstyles/togglePopover', payload: { popoverName: 'newTransition' }}) }} style={{borderBottom: 'none'}}>
					      				<i className="fa fa-plus"></i>
					      			</Button>
					      		</Popover>
				      		</Tooltip>
			      		</FormItem>

			      		<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -5}}>
			      			{
			      				props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['transition'].childrenProps.map((cssProperty, cssPropertyIndex) => {
			      					return (
										<div key={cssPropertyIndex} className="filter-list">
											<Row>
												<Col span={20} style={{textAlign: 'left', cursor: 'pointer', paddingLeft: '15px'}}>
													{cssProperty['transition-timing-function']}({cssProperty['transition-duration']},{cssProperty['transition-property']})
												</Col>
												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<i onClick={removeThisTransition.bind(this, cssPropertyIndex)} className="fa fa-trash-o"></i>
												</Col>
											</Row>
										</div>
			      					);
			      				})
			      			}
						</FormItem>

						<li className="ant-dropdown-menu-item-divider"></li>

						<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right', marginTop: 5}} label="变换">
							<ButtonGroup size="small" style={{marginBottom: '6px'}}>
				      			<Tooltip placement="top" title="添加变换">
				      				<Popover visible={props.vdstyles.popover.newTransform.visible} title='添加变换' placement="left" trigger="click" content={transformAndTransitionProps.transitionAddPopover()}>
						      			<Button onClick={() => { props.dispatch({type: 'vdstyles/togglePopover', payload: { popoverName: 'newTransform' }}) }} size="small" style={{textAlign: 'center'}}>
						      				<i className="fa fa-plus"></i>
						      			</Button>
						      		</Popover>
					      		</Tooltip>
							</ButtonGroup>
			      		</FormItem>

			      		<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -3}}>
			      			{
			      				props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['transform'].childrenProps.map((cssProperty, cssPropertyIndex) => {
			      					return (
										<div key={cssPropertyIndex} className="filter-list">
											<Row>
												<Col span={20} style={{textAlign: 'left', cursor: 'pointer', paddingLeft: '15px'}}>
													{cssProperty.name}({cssProperty.value.join(',')})
												</Col>
												<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
													<i onClick={removeThisTransform.bind(this, cssPropertyIndex)} className="fa fa-trash-o"></i>
												</Col>
											</Row>
										</div>
			      					);
			      				})
			      			}
						</FormItem>

			      	</Form>
			    </Panel>
			);
		}

		const effectsPanel = () => {

			var activeFilter = props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['filter'].state.activeFilter;

			const effectsProps = {
				newfilterEditor () {

					var filterProps = {
						onChange (value, option) {
							console.log(value, option);
							props.dispatch({
								type: 'vdstyles/handleFilterTypeChange',
								payload: {
									value,
									index: option.props.index,
									activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
								}
							});
						}
					}

					var filterFormGenerator = (cssProp) => {

						const handleFilterInputChange = (unit, e) => {
							props.dispatch({
								type: 'vdstyles/handleFilterInputChange',
								payload: {
									value: e.target.value,
									unit
								}
							});
						}

						var filter = {
							blur () {
								return (
			    					<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="高斯模糊" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, 'px')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	px
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							brightness () {
								return (
					    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="亮度" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	％
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							contrast () {
								return (
					    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="对比度" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	％
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							grayscale () {
								return (
					    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="灰度图像" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	％
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							'hue-rotate' () {
								return (
					    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="旋转" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, 'deg')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	deg
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							invert () {
								return (
		    						<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="反转" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	%
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							saturate () {
								return (
					    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="饱和度" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	%
									        </Col>
									    </Row>
									</FormItem>
								);
							},

							sepia () {
								return (
									<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="深褐色" className='fa fa-clock-o'></i>)}>
										<Row>
									        <Col span={18} style={{paddingRight: '10px'}}>
									          	<Input type="number" onPressEnter={saveFilter} onChange={handleFilterInputChange.bind(this, '%')} value={props.vdstyles.filterSetting.value} size="small"/>
									        </Col>
									        <Col span={4}>
									        	%
									        </Col>
									    </Row>
									</FormItem>
								);
							}

						}

						return filter[cssProp]();

					}

					const saveFilter = () => {
						props.dispatch({
							type: 'vdstyles/saveFilter',
							payload: {
								activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle,
								activeFilterName: props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['filter'].filters[activeFilter].cssProp
							}
						});
					}

					return (

			    		<Form>
			    			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="属性" className='fa fa-search'></i>)}>
			    				<Select
			    					size="small"
			    					onSelect={filterProps.onChange}
			    				    showSearch
			    				    placeholder="选择滤镜"
			    				    optionFilterProp="children"
			    				    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
			    				    value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['filter'].filters[activeFilter].cssProp}
			    				>
			    				{
			    					props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['filter'].filters.map((filter, filterIndex) => {
			    						return (
				    				        <Option key={filter.cssProp} value={filter.cssProp}>{filter.name}</Option>
			    						);
			    					})
			    				}
			    				</Select>
			    			</FormItem>

			    			{filterFormGenerator(props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['filter'].filters[activeFilter].cssProp)}

			    			<Button onClick={saveFilter} size="small">保存</Button>

			    		</Form>

					);

				}
			}

			const newFilterPopoverTrigger = () => {
				props.dispatch({
					type: 'vdstyles/togglePopover',
					payload: {
						popoverName: 'newFilter'
					}
				});
			}

			const removeThisFilter = (filterIndex) => {
				props.dispatch({
					type: 'vdstyles/removeThisFilter',
					payload: {
						filterIndex,
						activeStyleName: props.vdCtrlTree.activeCtrl.activeStyle
					}
				});
			}

			return (
		    <Panel header="效果" key="effects">
		    	<Form className="form-no-margin-bottom">
  	    			<FormItem labelCol={{span: 6}} wrapperCol={{span: 16}} label={
								activeCSSStyleState['opacity'] == '' ? <span>透明度</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">透明度</a>
										</Popconfirm>
								)
							}>
  						<Row>
  					        <Col span={15} style={{paddingRight: '10px'}}>
  					          	<Input size="small" value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['opacity']} onChange={handleStylesChange.bind(this, 'opacity')}/>
  					        </Col>
  					    </Row>
  					</FormItem>

  					<li className="ant-dropdown-menu-item-divider"></li>

  					<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right', marginTop: 5}} label="滤镜">
		      			<Tooltip placement="top" title="添加滤镜">
		      				<Popover title='添加滤镜' placement="leftTop" trigger="click" visible={props.vdstyles.popover.newFilter.visible} content={effectsProps.newfilterEditor()}>
				      			<Button onClick={newFilterPopoverTrigger} style={{borderBottom: 'none'}}>
				      				<i className="fa fa-plus"></i>
				      			</Button>
				      		</Popover>
			      		</Tooltip>
		      		</FormItem>

		      		<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -5}}>
			      			{
			      				props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['filter'].childrenProps.map((cssProperty, cssPropertyIndex) => {
			      					return (
											<div className="filter-list" key={cssPropertyIndex}>
												<Row>
													<Col span={20} style={{textAlign: 'left', cursor: 'pointer', paddingLeft: '15px'}}>
														{cssProperty.name}, {cssProperty.value}
													</Col>
													<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
														<i onClick={removeThisFilter.bind(this, cssPropertyIndex)} className="fa fa-trash-o"></i>
													</Col>
												</Row>
											</div>
			      					);
			      				})
			      			}
					</FormItem>

					<li className="ant-dropdown-menu-item-divider"></li>

					<FormItem style={{marginTop: 20}} labelCol={{span: 8}} wrapperCol={{span: 16}} label={
								activeCSSStyleState['cursor'] == '' ? <span>鼠标样式</span> : (
								  	<Popconfirm title="删除属性？" okText="是" cancelText="否">
											<a href="#">鼠标样式</a>
										</Popconfirm>
								)
							}>
						<Input addonBefore={<Popover
    											content={effectProps.cursorPopover()}
									        	title="鼠标样式"
									        	trigger="click"
									        	placement="leftTop"
									        	visible={props.vdstyles.popover.cursor.visible}
									        >
    											<Icon onClick={() => { props.dispatch({type: 'vdstyles/togglePopover', payload: { popoverName: 'cursor' }}) }} type="setting"/>
    										</Popover>}
    							size="small"
 								onChange={handleStylesChange.bind(this, 'cursor')}
    							value={props.vdstyles.cssStyleLayout[props.vdCtrlTree.activeCtrl.activeStyle]['cursor']}
						/>
					</FormItem>

				</Form>
		    </Panel>
		);
		}

		var tpl = '';

		if(props.vdCtrlTree.activeCtrl.activeStyle) {
			tpl = (

				<Collapse bordered={false} defaultActiveKey={['css', 'layout', 'typo', 'background', 'borders', 'shadows', 'transitions-transforms', 'effects']}>
					{cssPanel}
					{layoutPanel()}
					{typoPanel()}
					{backgroundPanel()}
					{bordersPanel()}
					{shadowsPanel()}
					{transitionsTransformsPanel()}
					{effectsPanel()}
				</Collapse>

			);
		}else {

			var tipPanel = (
				<Card style={{ width: 'auto', margin: '15px', background: '#f7f7f7' }}>
				    <p>添加<Tag color="#87d068"><span style={{color: 'rgb(255, 255, 255)'}}>类名</span></Tag>后可以调整以下属性：</p>
				    <ol>
				    	<li>1、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>元素位置</span></Tag>和<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>大小</span></Tag></li>
				    	<li>2、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>字体</span></Tag>属性</li>
				    	<li>3、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>背景</span></Tag>属性</li>
				    	<li>4、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>边框</span></Tag>属性</li>
				    	<li>5、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>阴影</span></Tag>属性</li>
				    	<li>6、<Tag color="cyan"><span style={{color: 'rgb(255, 255, 255)'}}>交互动画</span></Tag></li>
				    </ol>
				</Card>
			);

			tpl = (

				<div>
					<Collapse bordered={false} defaultActiveKey={['css', 'layout', 'typo', 'background', 'borders', 'shadows', 'tt', 'effects']}>
						{cssPanel}
					</Collapse>
					{tipPanel}
				</div>
			);
		}

		return tpl;

    }

  	return (
  		<div className="vdctrl-pane-wrapper">
  			{vdctrlCollapse()}
  		</div>
  	);

};


function mapSateToProps({ vdstyles, vdCtrlTree }) {
  return { vdstyles, vdCtrlTree };
}

export default connect(mapSateToProps)(VDStylePanel);
