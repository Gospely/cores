import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import { Select } from 'antd';
import { Card, Upload } from 'antd';

const Option = Select.Option;

const TabPane = Tabs.TabPane;

import { Collapse, Menu, Dropdown } from 'antd';
import { Row, Col, Popover } from 'antd';

import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import { Tree, Form, Switch, Input, Cascader, Checkbox, message, Tag, Table, Popconfirm, Slider, InputNumber} from 'antd';

const FormItem = Form.Item;

const Panel = Collapse.Panel;

import { SketchPicker } from 'react-color';
import css2json from 'css2json';

// <SketchPicker style={{display: 'none'}} defaultValue="#345678" />

const Component = (props) => {

	const cssAction = {

		getAllClasses () {
			var classes = [];
			for(var key in props.vdstyles.stylesList) {
				classes.push(key);
			}
			return classes;
		}

	}

	const cssSelector = {

		cssClassNameList () {
  			return cssAction.getAllClasses().map((item, key) => {
		    	return <Option key={key} value={item.replace('.', '')}>{item.replace('.', '')}</Option>
  			});
		},

		cssClassListForDropdown: (
		  	<Menu>
		  		{
		  			cssAction.getAllClasses().map((item, key) => {
				    	return <Menu.Item key={key}>{item}</Menu.Item>
		  			})
		  		}
		  	</Menu>
		),

		newStylePopover: {
			content: (
		      	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label="类名">
						<Input size="small" />
					</FormItem>

					<FormItem {...formItemLayout} label="">
						<Button style={{float: 'right'}} size="small">增加</Button>
					</FormItem>
		      	</Form>
			)
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

    	imageSetter: (

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
											<Input size="small" />
										</FormItem>
							      	</Form>
							  	</Col>
							  	<Col span={13} style={{paddingLeft: '5px'}}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="Cover">
											<Switch size="small" />
										</FormItem>
							      	</Form>
							  	</Col>

							</Row>

							<Row>

							  	<Col span={11} style={{paddingRight: '5px'}}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="高度">
											<Input size="small" />
										</FormItem>
							      	</Form>
							  	</Col>
							  	<Col span={13} style={{paddingLeft: '5px'}}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="Contain">
											<Switch size="small" />
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
											<Button size="small"><Icon type="arrow-up" style={{transform: 'rotate(-45deg)'}} /></Button>
										</Col>
										<Col span={8}>
											<Button size="small"><Icon type="arrow-up" /></Button>
										</Col>
										<Col span={8}>
											<Button size="small"><Icon type="arrow-up" style={{transform: 'rotate(45deg)'}} /></Button>
										</Col>
									</Row>
									<Row style={{marginBottom: '5px'}}>
										<Col span={8}>
											<Button size="small"><Icon type="arrow-left" /></Button>
										</Col>
										<Col span={8}>
											<Button size="small"><Icon type="plus" /></Button>
										</Col>
										<Col span={8}>
											<Button size="small"><Icon type="arrow-right" /></Button>
										</Col>
									</Row>
									<Row>
										<Col span={8}>
											<Button size="small"><Icon type="arrow-down" style={{transform: 'rotate(45deg)'}} /></Button>
										</Col>
										<Col span={8}>
											<Button size="small"><Icon type="arrow-down" /></Button>
										</Col>
										<Col span={8}>
											<Button size="small"><Icon type="arrow-down" style={{transform: 'rotate(-45deg)'}} /></Button>
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

					        <RadioGroup defaultValue="repeat" size="small">
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

					        <RadioGroup defaultValue="scroll" size="small">
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

    	),

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

  	return (
  		<div className="vdctrl-pane-wrapper">
			<Collapse bordered={false} defaultActiveKey={['css', 'layout', 'typo', 'background', 'borders', 'shadows', 'tt', 'effects']}>
			    <Panel header={<span><i className="fa fa-css3"></i>&nbsp;CSS类选择器</span>} key="css">
				  	<p style={{marginBottom: '10px'}}>选择类名：</p>
			    	<Row>
					  	<Col span={18} className="css-selector">
					      	<Select
						    	multiple
						    	style={{ width: '100%' }}
						    	placeholder="请选择CSS类"
						    	defaultValue={
						    		props.vdCtrlTree.activeCtrl.className
						    	}
						    	size="small"
						  	>
						    	{cssSelector.cssClassNameList()}
						  	</Select>
					  	</Col>
	      				<Col span={3}>
	      				    <Dropdown overlay={cssSelector.cssClassListForDropdown}>
							  	<Button style={{marginBottom: '10px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', marginLeft: '-1px'}} size="small">
			  		              	<Tooltip placement="left" title="选择CSS类进行编辑">
								  		<i className="fa fa-pencil"></i>
			      					</Tooltip>
							  	</Button>
					  	    </Dropdown>
	      				</Col>
	      				<Col span={3}>
	      				    <Popover placement="left" content={cssSelector.newStylePopover.content} trigger={['click']}>
							  	<Button style={{marginBottom: '10px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', marginLeft: '-1px'}} size="small">
			  		              	<Tooltip placement="left" title="新增一个样式">
								  		<i className="fa fa-plus"></i>
			      					</Tooltip>
							  	</Button>
					  	    </Popover>
	      				</Col>
      				</Row>
			    </Panel>
			    <Panel header="布局" key="layout">

					<div className="guidance-panel-wrapper">
						<div className="guidance-panel-child">
							<div className="bem-Frame">
								<div className="bem-Frame_Head">
									<div className="bem-Frame_Legend">
										<div className="bem-SpecificityLabel bem-SpecificityLabel-local bem-SpecificityLabel-text">
											Display 设置
										</div>
									</div>
								</div>
								<div className="bem-Frame_Body">
						
							        <RadioGroup defaultValue="block" size="small">
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
								<FormItem {...formItemLayout} label="宽度">
									<Input size="small" />
								</FormItem>
					      	</Form>
					  	</Col>
					  	<Col span={12} style={{paddingLeft: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="高度">
									<Input size="small" />
								</FormItem>
					      	</Form>
					  	</Col>

				  	</Row>

			    	<Row>

					  	<Col span={12} style={{paddingRight: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="最大">
									<Input size="small" />
								</FormItem>
					      	</Form>
					  	</Col>
					  	<Col span={12} style={{paddingLeft: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="最大">
									<Input size="small" />
								</FormItem>
					      	</Form>
					  	</Col>

				  	</Row>

			    	<Row>

					  	<Col span={12} style={{paddingRight: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="最小">
									<Input size="small" />
								</FormItem>
					      	</Form>
					  	</Col>
					  	<Col span={12} style={{paddingLeft: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="最小">
									<Input size="small" />
								</FormItem>
					      	</Form>
					  	</Col>

				  	</Row>

			      	<li className="ant-dropdown-menu-item-divider"></li>

			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="浮动">
					        <RadioGroup defaultValue="block" size="small">
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
						<FormItem {...formItemLayout} label="清除">
					        <RadioGroup defaultValue="block" size="small">
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
						<FormItem {...formItemLayout} label="溢出">
					        <RadioGroup defaultValue="block" size="small">
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
						<FormItem {...formItemLayout} label="位置">
					        <RadioGroup defaultValue="block" size="small">
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
			    <Panel header="字体" key="typo">
			    	<Row>

					  	<Col span={12} style={{paddingRight: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="字体">
		        				    <Select size="small" value="选择字体">
						      			<Option key="sss" value="h1">h1</Option>
						    		</Select>
								</FormItem>
					      	</Form>
					  	</Col>
					  	<Col span={12} style={{paddingLeft: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="颜色">
									<Input type="color" size="small" />
								</FormItem>
							</Form>
					  	</Col>

			    	</Row>

			    	<Row>

					  	<Col span={12} style={{paddingRight: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="粗细">
		        				    <Select size="small" value="选择">
						      			<Option key="sss" value="h1">h1</Option>
						    		</Select>
								</FormItem>
							</Form>
					  	</Col>
					  	<Col span={12} style={{paddingLeft: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="样式">

									<RadioGroup defaultValue="normal" size="small">
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
								<FormItem {...formItemLayout} label="缩进">
									<Input type="number" size="small" />
								</FormItem>
						  	</Form>				  	
					  	</Col>
					  	<Col span={12} style={{paddingLeft: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="大小">
									<Input type="number" size="small" />
								</FormItem>
					      	</Form>
					  	</Col>

			    	</Row>

			    	<Row>

					  	<Col span={12} style={{paddingRight: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="行间距">
									<Input type="number" size="small" />
								</FormItem>
							</Form>
					  	</Col>
					  	<Col span={12} style={{paddingLeft: '5px'}}>
					      	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="词间距">
									<Input type="number" size="small" />
								</FormItem>
					      	</Form>
					  	</Col>

				  	</Row>

			      	<li className="ant-dropdown-menu-item-divider"></li>

			      	<Form className="form-no-margin-bottom">

						<FormItem {...formItemLayout} label="排列方式">

							<RadioGroup defaultValue="left" size="small">
						      	<RadioButton value="normal">
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

						<FormItem {...formItemLayout} label="阅读顺序">

							<RadioGroup defaultValue="left" size="small">
						      	<RadioButton value="从左到右">
			  		              	<Tooltip placement="top" title="从左到右">
										<i className="fa fa-indent"></i>
						      		</Tooltip>
					      		</RadioButton>
						      	<RadioButton value="从右到左">
			  		              	<Tooltip placement="top" title="从右到左">
										<i style={{transform:'rotate(180deg)'}} className="fa fa-indent"></i>
						      		</Tooltip>
						      	</RadioButton>
						    </RadioGroup>

						</FormItem>

						<FormItem {...formItemLayout} label="渲染">

							<RadioGroup defaultValue="none" size="small">
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

						<FormItem {...formItemLayout} label="大小写">

							<RadioGroup defaultValue="none" size="small">
						      	<RadioButton value="none">
			  		              	<Tooltip placement="top" title="none">
										<Icon type="close" />
						      		</Tooltip>
					      		</RadioButton>
						      	<RadioButton value="大写">
			  		              	<Tooltip placement="top" title="大写">
			  		              		<span>TT</span>
						      		</Tooltip>
						      	</RadioButton>
						      	<RadioButton value="首字母大写">
			  		              	<Tooltip placement="top" title="首字母大写">
			  		              		<span>Tt</span>
						      		</Tooltip>
						      	</RadioButton>
						      	<RadioButton value="小写">
			  		              	<Tooltip placement="top" title="小写">
			  		              		<span>tt</span>
						      		</Tooltip>
						      	</RadioButton>
						    </RadioGroup>

						</FormItem>

			      	</Form>

			    </Panel>
			    <Panel header="背景" key="background">

			    	<Form className="form-no-margin-bottom">

						<FormItem {...formItemLayout} label="图片和渐变">

							<RadioGroup defaultValue="图片" size="small">
						      	<RadioButton value="图片">
									<Popover
							        	content={backgroundImageAndGradient.imageSetter}
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

				    <ul style={{marginBottom: '10px'}} className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
				      <li className="ant-dropdown-menu-item" role="menuitem">
				        <Row>
				          <Col span={18}>
				            <p>key1="val2"</p>
				          </Col>
				          <Col span={3}>

							<Popover
					        	content={backgroundImageAndGradient.modifyContent}
					        	title="修改 自定义属性"
					        	trigger="click"
					      	>
				            	<Icon type="edit" />
					      	</Popover>

				          </Col>
				          <Col span={3}>
				            <Popconfirm title="确认删除吗？" okText="确定" cancelText="取消">
								<Icon type="delete" />
							</Popconfirm>
				          </Col>
				        </Row>
				      </li>
				      <li className="ant-dropdown-menu-item-divider"></li>

				      <li className="ant-dropdown-menu-item" role="menuitem">
				        <Row>
				          <Col span={18}>
				            <p>key="val"</p>
				          </Col>
				          <Col span={3}>
							<Popover
					        	content={backgroundImageAndGradient.modifyContent}
					        	title="修改 自定义属性"
					        	trigger="click"
					      	>
				            	<Icon type="edit" />
					      	</Popover>
				          </Col>
				          <Col span={3}>
				            <Popconfirm title="确认删除吗？" okText="确定" cancelText="取消">
								<Icon type="delete" />
								</Popconfirm>
				          </Col>
				        </Row>
				      </li>
				      <li className=" ant-dropdown-menu-item-divider"></li>
				    </ul>

			    	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="背景色">
							<Input type="color" size="small" />
						</FormItem>
			    	</Form>

			    </Panel>
			    <Panel header="边框" key="borders">

					<Row>
						<Col span={8}>
							<Row style={{marginBottom: '5px'}}>
								<Col span={8}></Col>
								<Col span={8}>
									<Button size="small"><i className="fa fa-window-maximize"></i></Button>
								</Col>
								<Col span={8}></Col>
							</Row>
							<Row style={{marginBottom: '5px'}}>
								<Col span={8}>
									<Button size="small"><i className="fa fa-window-maximize" style={{transform: 'rotate(-90deg)'}}></i></Button>
								</Col>
								<Col span={8}>
									<Button style={{width: '27px'}} size="small"><i className="fa fa-square-o"></i></Button>
								</Col>
								<Col span={8}>
									<Button size="small"><i className="fa fa-window-maximize" style={{transform: 'rotate(90deg)'}}></i></Button>
								</Col>
							</Row>
							<Row>
								<Col span={8}></Col>
								<Col span={8}>
									<Button size="small"><i className="fa fa-window-maximize" style={{transform: 'rotate(180deg)'}}></i></Button>
								</Col>
								<Col span={8}></Col>
							</Row>
						</Col>

						<Col span={16} style={{paddingLeft: '15px'}}>
					    	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="宽度">
									<Input size="small" />
								</FormItem>

								<FormItem {...formItemLayout} label="颜色">
									<Input size="small" type="color" />
								</FormItem>
					    	</Form>
						</Col>
					</Row>

			    	<Form className="form-no-margin-bottom">

						<FormItem {...formItemLayout} label="样式">

							<RadioGroup defaultValue="none" size="small">
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

									<Button style={{borderTopLeftRadius: '28px', width: '28px', height: '28px'}} size="small"><i className="fa fa-window-maximize"></i></Button>									
									<Button style={{borderBottomLeftRadius: '28px', width: '28px', height: '28px', marginTop: '3px'}} size="small"><i className="fa fa-window-maximize"></i></Button>									

								</Col>
								<Col span={8}>
									<Button style={{marginTop: '16px', marginRight: '1px'}} size="small"><i className="fa fa-window-maximize"></i></Button>
								</Col>
								<Col span={8}>
									<Button style={{borderTopRightRadius: '28px', width: '28px', height: '28px'}} size="small"><i className="fa fa-window-maximize"></i></Button>
									<Button style={{borderBottomRightRadius: '28px', width: '28px', height: '28px', marginTop: '3px'}} size="small"><i className="fa fa-window-maximize"></i></Button>
								</Col>
							</Row>
						</Col>

						<Col span={16} style={{paddingLeft: '15px'}}>
					    	<Form className="form-no-margin-bottom">
								<FormItem {...formItemLayout} label="弧度">
									<Input size="small" />
								</FormItem>
					    	</Form>
						</Col>
					</Row>

			    </Panel>
			    <Panel header="阴影" key="shadows">
			    	<Form className="form-no-margin-bottom">
    					<FormItem {...formItemLayout} label="盒子阴影">

							<RadioGroup defaultValue="none" size="small">
						      	<RadioButton style={{borderBottom: 'none'}} value="outerRightBottom">
			  		              	<Tooltip placement="top" title="外面右下">
										<Icon type="close" />
						      		</Tooltip>
					      		</RadioButton>
						      	<RadioButton style={{borderBottom: 'none'}} value="outerWrapper">
			  		              	<Tooltip placement="top" title="外面四周">
										<Icon type="minus" />
						      		</Tooltip>
						      	</RadioButton>
						      	<RadioButton style={{borderBottom: 'none'}} value="insideWrapper">
			  		              	<Tooltip placement="top" title="里面四周">
										<i className="fa fa-ellipsis-h"></i>
						      		</Tooltip>
						      	</RadioButton>
						      	<RadioButton style={{borderBottom: 'none'}} value="insideTop">
			  		              	<Tooltip placement="top" title="里面上方">
										<Icon type="ellipsis" />
						      		</Tooltip>
						      	</RadioButton>
						    </RadioGroup>

    					</FormItem>
    					<FormItem wrapperCol={{ span: 23 }} style={{position: 'relative', top: -5}}>
    						<div style={{border: '1px solid #d9d9d9', minHeight: 10, display: 'flex', justifyContent: 'space-around'}}>
    							<div>
    								<i className="fa fa-eye"></i>
    							</div>
    							<div style={{}}>暂无</div>
    							<div>
    								<i className="fa fa-circle"></i>
    							</div>
    							<div>
    								<i className="fa fa-trash-o"></i>
    							</div>
    						</div>
    					</FormItem>

			    	</Form>
			    </Panel>
			    <Panel header="过度和变换" key="tt">
			      	<p>组件</p>
			    </Panel>
			    <Panel header="效果" key="effects">
			      	<p>组件</p>
			    </Panel>
			</Collapse>
  		</div>
  	);

};

function mapSateToProps({ vdstyles, vdCtrlTree }) {
  return { vdstyles, vdCtrlTree };
}

export default connect(mapSateToProps)(Component);