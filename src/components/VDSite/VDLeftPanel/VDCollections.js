import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal, Tag } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip, Collapse, InputNumber } from 'antd';
import { Popover, notification } from 'antd';

import { Row, Col, Dropdown } from 'antd';

import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import { TreeSelect, message } from 'antd';
const TreeNode = TreeSelect.TreeNode;

import { Form, Input, Cascader, Select, Checkbox, Popconfirm, Radio} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

const formItemLayout = {
      nameCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
};

const openNotificationWithIcon = (type, title, description) => (
	  notification[type]({
	    message: title,
	    description: description,
	  })
);

// window.VDDnddata = '';

const Component = (props) => {

	const collectionsProps = {

			deleteCollections(item) {
				console.log(item);
				props.dispatch({
					type: 'vdCollections/deleteCollections',
					payload: item.key
				})

				props.dispatch({
					type: 'vdCollections/changeCollectionsItemVisible',
					payload: false
				})

				props.dispatch({
					type: 'vdCollections/setCollectionsItem',
					payload: {
						item:{
							list: []
						},
						index:-1 
					}
				})

				props.dispatch({
					type: 'vdCollections/changeCollectionsItemPreviewVisible',
					payload: false
				})
			},

			addNewCollections () {
				console.log(props.vdCollections.collections);
				const collections = props.vdCollections.collections;
				const newCollectionsName = props.vdCollections.newCollectionsName;
				for(let i=0;i < collections.length; i++) {

					if(newCollectionsName == "" || newCollectionsName == null){
				             openNotificationWithIcon('info', '请输入控件名');
             				return;
					}

					if(collections[i].name == newCollectionsName) {
						openNotificationWithIcon('info', '名称不能重复');
             				return;
					}
				}

				props.dispatch({
					type: 'vdCollections/setNewCollections',
				})

				props.dispatch({
					type: 'vdCollections/changeCollectionsItemVisible',
					payload: false
				})

				props.dispatch({
					type: 'vdCollections/setCollectionsItem',
					payload: {
						item:{
							list: []
						},
						index:-1 
					}
				})

				props.dispatch({
					type: 'vdCollections/changeCollectionsItemPreviewVisible',
					payload: false
				})

				props.dispatch({
					type: 'vdCollections/newCollectionsPopoverVisibleChange'
				})

				props.dispatch({
					type: 'vdCollections/getNewCollectionsName',
					payload: ""
				})
			},

			closePopover() {
				props.dispatch({
					type: 'vdCollections/changeCollectionsItemPreviewVisible',
					payload: false
				})

				props.dispatch({
					type: 'vdCollections/changeCollectionsItemVisible',
					payload: false
				})
			},

			listIsOpend(index,listIndex,isOpend) {
				console.log(listIndex,index,isOpend);
				props.dispatch({
					type: 'vdCollections/changelistIsOpend',
					payload: {
						listIndex:listIndex,
						index:index,
						isOpend:isOpend
					}
				})
			},

			deleteList(index,listItem) {
				props.dispatch({
					type: 'vdCollections/deleteCollectionsList',
					payload: {
						index:index,
						listKey: listItem.key
					}
				})
			},

			isRequired(index,listIndex) {

				props.dispatch({
					type:'vdCollections/changeIsRequired',
					payload: {
						index:index,
						listIndex:listIndex
					}
				})
			},

			closeListType() {
				props.dispatch({
					type: 'vdCollections/changeListTypeIsOpend',
					payload: false
				})
			},

			opendListType() {
				props.dispatch({
					type: 'vdCollections/changeListTypeIsOpend',
					payload: true
				})
			},

			addCollectionsList(index,icon,type) {

				props.dispatch({
					type: 'vdCollections/addCollectionsList',
					payload: {
						index:index,
						icon:icon,
						type:type
					}
				})			
			},

			getItem(item, index) {

				console.log(item)

				if(index == props.vdCollections.collectionsIndex){
					props.dispatch({
						type: 'vdCollections/changeCollectionsItemVisible',
						payload: false
					})

					props.dispatch({
						type: 'vdCollections/setCollectionsItem',
						payload: {
							item:item,
							index:-1 
						}
					})

					console.log('123------',props.vdCollections.collectionsItem)
					
					props.dispatch({
						type: 'vdCollections/changeCollectionsItemPreviewVisible',
						payload: false
					})

				}else{
					props.dispatch({
						type: 'vdCollections/changeCollectionsItemVisible',
						payload: true
					})

					props.dispatch({
						type: 'vdCollections/setCollectionsItem',
						payload: {
							item:item,
							index:index
						}
					})

					console.log('123+++++',props.vdCollections.collectionsItem)

					props.dispatch({
						type: 'vdCollections/changeCollectionsItemPreviewVisible',
						payload: false
					})
				}
			},

			changeCollectionsItemPreviewVisible() {
				props.dispatch({
					type: 'vdCollections/changeCollectionsItemPreviewVisible'
				})
			},

			addStyle(index,listIndex) {

				props.dispatch({
					type: 'vdCollections/addStyle',
					payload: {
						index:index,
						listIndex:listIndex
					}
				})

			},

			removeStyle(index,listIndex) {

				props.dispatch({
					type: 'vdCollections/removeStyle',
					payload: {
						index:index,
						listIndex:listIndex
					}
				})

			},

			changeNameInputStyle(boolean) {

				props.dispatch({
					type: 'vdCollections/changeNameInputStyle',
					payload: boolean
				})

			},

			changeState(index,collectionsAttr,e) {
				console.log(e.target.value)

				props.dispatch({
					type: 'vdCollections/changeState',
					payload: {
						index:index,
						attr:collectionsAttr,
						value:e.target.value,
					}
				})

				console.log("collections",props.vdCollections.collections)
			},

			newCollectionsPopoverVisibleChange() {
				props.dispatch({
					type: 'vdCollections/newCollectionsPopoverVisibleChange'
				})

				props.dispatch({
					type: 'vdCollections/getNewCollectionsName',
					payload: ""
				})
			},

			getNewCollectionsName(e) {
				props.dispatch({
					type: 'vdCollections/getNewCollectionsName',
					payload: e.target.value
				})
			},

			listItemAttrValueChange(index,listIndex,attr,e) {
				props.dispatch({
					type: 'vdCollections/listItemAttrValueChange',
					payload: {
						index:index,
						listIndex:listIndex,
						attr:attr,
						value:e.target.value
					}
				})
			}

	}

	const collectionsList = props.vdCollections.collectionsItem.list.map((listItem, listIndex) => {
		if(listItem.type == 'option') {
			var CollectionsListOption = listItem.value.map((option,optionIndex) => {
				return (
						<div className="collections-list-option-list" key={optionIndex}>
							{option}
						</div>	
					)
			})
		}
			
		const ReferenceOptions = []
			for(let i =0; i<props.vdCollections.collections.length; i++){
				ReferenceOptions.push({
					value:props.vdCollections.collections[i].name,
					label:props.vdCollections.collections[i].name
				})
			}
		return (
			<div className="collection-structure-list" 
				 onMouseMove={collectionsProps.addStyle.bind(this,props.vdCollections.collectionsIndex,listIndex)}
				 onMouseOut={collectionsProps.removeStyle.bind(this,props.vdCollections.collectionsIndex,listIndex)}  
				 key={listIndex}>
				<Row>
					<Col span={18} onClick={collectionsProps.listIsOpend.bind(this,props.vdCollections.collectionsIndex,listIndex,true)}>
						<Icon type={listItem.icon} /> <span className='collection-structure-list-text'>{listItem.name}</span>
					</Col>
					<Col span={6}>
						{listItem.isOpend ? <Row>
							<Col span={4}>
								<Popconfirm title="确定删除?" onConfirm={collectionsProps.deleteList.bind(this,props.vdCollections.collectionsIndex,listItem)} okText="确定" cancelText="取消">
									<a href="javascript:void(0)">
										<i className="fa fa-trash-o" aria-hidden="true"></i>
									</a>
								</Popconfirm>
							</Col>
							<Col span={10}>
								<Button type="primary" size='small' onClick={collectionsProps.listIsOpend.bind(this,props.vdCollections.collectionsIndex,listIndex,false)}>关闭</Button>
							</Col>
							<Col span={10}>
								<Button type="primary" size='small'> 保存</Button>
							</Col>
						</Row> : <div></div> }		
					</Col>
				</Row>
				{listItem.isOpend ? 
					<div className="collections-list-from">
						<p>标签名 :</p>
							<Input size="large" onChange={collectionsProps.listItemAttrValueChange.bind(this,props.vdCollections.collectionsIndex,listIndex,"name")} className="collections-poppver-input" defaultValue={listItem.name} />
						<p>提示文本 :</p>
							<Input size="large" onChange={collectionsProps.listItemAttrValueChange.bind(this,props.vdCollections.collectionsIndex,listIndex,"helpText")} className="collections-poppver-input" defaultValue={listItem.helpText}/><br/>

						{listItem.type == "text" || listItem.type == "textarea" ? 
							<div style={{marginTop: 10}}>
								<p>文本框类型 :</p>
									<RadioGroup defaultValue={listItem.type} onChange={collectionsProps.listItemAttrValueChange.bind(this,props.vdCollections.collectionsIndex,listIndex,"type")} style={{marginTop:10}}>
								        <Radio value='text'>普通文本框</Radio>
								        <Radio value='textarea'>长文本框</Radio>
							      	</RadioGroup>
							</div>: <div></div>
						}

						{listItem.type == "text" ? 
							<div style={{marginTop:10, marginBottom:10}}>
								<Row>
									<Col span={12}>
										最小输入字符:
									</Col>
									<Col span={12}>
										最大输入字符:
									</Col>
								</Row>
								<Row style={{marginTop:10}}>
									<Col span={12}>
									<InputNumber min={0} max={1000} defaultValue={0} style={{width: '85%'}}/>
									</Col>
									<Col span={12}>
									<InputNumber min={0} max={1000} defaultValue={0} style={{width: '85%'}}/>
									</Col>
								</Row>
							</div> : <div></div>
						}

						{listItem.type == "option" ?
							<div className="collections-list-option">
								{CollectionsListOption}
								<div className="collections-list-option-list">
									<a href="javascript:void(0)">
										<Icon type="plus" /><span>添加下拉选项</span>
									</a>
								</div>
							</div> : <div></div>

						}

						{listItem.type == "Reference" || listItem.type == "Multi-Reference" ? 
							<div>
								  <p>Collection:</p>
								  <Cascader popupPlacement="bottomLeft" placeholder="选择对应数据集" options={ReferenceOptions}/>	
							</div>  :<div></div>
						}

						{listItem.type == "date" ? <Checkbox>日期选择器</Checkbox> : <div></div>}

						<Checkbox onChange={collectionsProps.isRequired.bind(this,props.vdCollections.collectionsIndex,listIndex)}>必填</Checkbox>
					</div>:<div></div>
				}	
			</div>
		)
	})

	const collectionsPreview = props.vdCollections.collectionsItem.list.map((listItem, listIndex) => {

		if(listItem.type == 'text' || listItem.type == 'link' || listItem.type == 'video' || listItem.type == 'Email' || listItem.type == 'phone'|| listItem.type == 'Multi-Reference'){
			
			
			return (
					<div className={listItem.addStyle+" collections-preview-name"} key={listIndex}>
						<p>{listItem.name}:</p>
						<div className="collections-help-text">{listItem.helpText}</div>
						<div className={listItem.addInputStyle+" collections-preview-input"}></div>
					</div>
			)
		}

		if(listItem.type == 'textarea'){
			return (
				<div className={listItem.addStyle+" collections-preview-name"} key={listIndex}>
						<p>{listItem.name}:</p>
						<div className="collections-help-text">{listItem.helpText}</div>
						<div className={listItem.addInputStyle+' collections-preview-textarea'}>
							<div className=" collections-preview-textarea-img">
								<Icon type="ellipsis" />
							</div>
						</div>
				</div>
			)
		}

		if(listItem.type == 'date'){
			return (
				<div className={listItem.addStyle+" collections-preview-name"} key={listIndex}>
						<p>{listItem.name}:</p>
						<div className="collections-help-text">{listItem.helpText}</div>
						<div className={listItem.addInputStyle+' collections-preview-input'}>
							<div className=" collections-preview-textarea-date">
								<Icon type="calendar" />
							</div>
						</div>
				</div>
			)
		}

		if(listItem.type == 'image'){
			return (
				<div className={listItem.addStyle+" collections-preview-name"} key={listIndex}>
						<p>{listItem.name}:</p>
						<div className="collections-help-text">{listItem.helpText}</div>
						<div style={{lineHeight:'125px'}} className={listItem.addInputStyle+" collections-preview-textarea"}>
							<i className="fa fa-picture-o fa-4x" aria-hidden="true"></i>
						</div>
				</div>
			)
		}

		if(listItem.type == 'switch'){
			return (
				<div className={listItem.addStyle+" collections-preview-name"} key={listIndex}>
						<p>{listItem.name}:</p>
						<div className="collections-help-text">{listItem.helpText}</div>
						<div>
							<svg className="collections-preview-textarea-sync" width="42" height="25" viewBox="0 0 42 25"><circle fill="currentColor" cx="29.5" cy="12.5" r="10.5" opacity=".25"></circle><path fill="currentColor" d="M37.963 20.267c.077-.083.154-.165.228-.25.15-.168.287-.34.42-.516a10.226 10.226 0 0 0 .59-.834 11.544 11.544 0 0 0 .52-.903c.08-.154.156-.312.228-.47a10.7 10.7 0 0 0 .216-.49c.07-.176.135-.357.198-.537.056-.158.11-.314.16-.475.06-.2.108-.405.157-.61.035-.15.075-.296.105-.447.046-.24.077-.48.11-.72.016-.128.04-.25.052-.38.037-.373.058-.75.058-1.13s-.02-.76-.057-1.13c-.012-.13-.036-.254-.053-.38-.032-.24-.063-.483-.11-.72-.03-.15-.07-.298-.106-.447-.05-.205-.098-.41-.158-.61-.05-.162-.106-.318-.16-.476-.063-.18-.125-.36-.197-.538a10.7 10.7 0 0 0-.214-.49 10.562 10.562 0 0 0-.503-.97 12.463 12.463 0 0 0-.586-.91 15.9 15.9 0 0 0-.25-.33 11.454 11.454 0 0 0-.415-.516c-.072-.085-.15-.167-.225-.25a15.95 15.95 0 0 0-.51-.528c-.058-.053-.117-.103-.17-.155a12.7 12.7 0 0 0-.636-.546l-.036-.028A11.44 11.44 0 0 0 31 1.11V1H12v.025C5.883 1.29 1 6.318 1 12.5s4.883 11.21 11 11.475V24h19v-.11a11.425 11.425 0 0 0 5.612-2.365l.037-.028a14.7 14.7 0 0 0 .63-.548c.055-.057.114-.107.17-.16a8.7 8.7 0 0 0 .51-.527zm.99-6.845c-.013.13-.036.255-.054.382-.028.17-.05.34-.08.506-.03.16-.076.32-.11.478-.036.126-.066.252-.1.375a9.12 9.12 0 0 1-.176.522c-.035.1-.07.198-.108.295a10.01 10.01 0 0 1-.237.54c-.038.08-.075.16-.115.24a9.96 9.96 0 0 1-.778 1.28c-.036.05-.073.097-.11.146a9.19 9.19 0 0 1-.43.534l-.09.1a9.76 9.76 0 0 1-.507.53l-.04.037a9.45 9.45 0 0 1-5.28 2.52l-.366.047a9.08 9.08 0 0 1-.877.046c-5.238 0-9.5-4.262-9.5-9.5S24.262 3 29.5 3c.296 0 .587.018.876.044l.365.048a9.45 9.45 0 0 1 5.287 2.52 9.702 9.702 0 0 1 .547.566c.03.032.063.065.093.1a9.54 9.54 0 0 1 .54.68 9.863 9.863 0 0 1 .776 1.28c.04.078.077.157.115.237.084.178.163.357.236.54.04.098.073.198.108.296.063.176.123.35.175.526.038.124.068.25.1.375.04.158.08.316.11.478.033.167.055.337.08.506.017.127.04.253.053.382a9.147 9.147 0 0 1 0 1.846zM12.63 22l-.544-.023C6.99 21.757 3 17.594 3 12.5S6.99 3.22 12.086 3l.416-.023L23.022 3C19.992 5.07 18 8.552 18 12.5s1.99 7.43 5.022 9.5H12.63z"></path></svg>
							<span>NO</span>
						</div>
				</div>
			)
		}

		if(listItem.type == 'option' || listItem.type == 'Reference'){
			return (
				<div className={listItem.addStyle+" collections-preview-name"} key={listIndex}>
						<p>{listItem.name}:</p>
						<div className="collections-help-text">{listItem.helpText}</div>
						<div className={listItem.addInputStyle+' collections-preview-input'}>
							<div className=" collections-preview-textarea-option">
								<Icon type="down" />
							</div>
						</div>
				</div>
			)
		}

		if(listItem.type == 'color'){
			return (
				<div className={listItem.addStyle+" collections-preview-name"} key={listIndex}>
						<p>{listItem.name}:</p>
						<div className="collections-help-text">{listItem.helpText}</div>
						<div className={listItem.addInputStyle+' collections-preview-input'}>
							<div className=" collections-preview-textarea-color">
								<i className="fa fa-tint" aria-hidden="true"></i>
							</div>
						</div>
				</div>
			)
		}

		if(listItem.type == 'number'){
			return (
				<div className={listItem.addStyle+" collections-preview-name"} key={listIndex}>
						<p>{listItem.name}:</p>
						<div className="collections-help-text">{listItem.helpText}</div>
						<div className={listItem.addInputStyle+' collections-preview-input'}>
							<div className=" collections-preview-textarea-number">
								<div style={{width:15, height:15}}><Icon type="up" /></div>
								<div style={{width:15, height:15}}><Icon type="down" /></div>
							</div>
						</div>
				</div>
			)
		}

				
	})
	
	const collections = props.vdCollections.collections.map((item, index) => {

		const collectionsPreviewPopover = {
			content: (
					<div className='collections-preview-box'>
						<div className='collections-preview-title'>
							<i className="fa fa-file-text-o fa-3x" aria-hidden="true"></i>
							<span className="collections-preview-title-text">数据集预览</span>
						</div>
						<div className={props.vdCollections.addStyle+" collections-preview-name"}>
							<p>姓名:</p>
							<div className={props.vdCollections.addInputStyle+' collections-preview-input'}></div>
						</div>
						{collectionsPreview}	
					</div>
				)
		}
				
		const collectionsPopover = {

			title: (
				<Row>
					<Col span={20}>
						{props.vdCollections.collectionsItem.name}
					</Col>
					<Col span={4} style={{textAlign: 'right'}} onClick={collectionsProps.changeCollectionsItemPreviewVisible}>
						<Popover className="collections-popover" 
								 placement="right" 
								 title={""} 
								 content={collectionsPreviewPopover.content} 
								 trigger="click"
								 visible={props.vdCollections.collectionsItemPreviewVisible}
								 >
							<a href="#">
								数据集预览<Icon type="double-right" />
							</a>
						</Popover>	
					</Col>
				</Row>
			),

			content: (
				<div className="collections-popover-content">
					<h2>数据集设置</h2>
						<p>数据集名称</p>
							<Input size="large" onChange={collectionsProps.changeState.bind(this,index,'name')} className="collections-poppver-input" value={props.vdCollections.collectionsItem.name} /><br/>
						<p style={{marginTop:'10px'}}>数据集 URL</p>
							<Input size="large" className="collections-poppver-input" onChange={collectionsProps.changeState.bind(this,index,'url')} value={props.vdCollections.collectionsItem.url} /><br/>
							<Tag><Icon type="link" />http://www.{props.vdCollections.collectionsItem.url}.com</Tag><br/>
						<div className="collections-poppver-text">
							<Icon type="file" /> <span style={{marginLeft: '10px'}}>在页面面板中为团队成员创建集合页面模板.</span>
						</div>
						<div className="collections-poppver-text">
							<Icon type="user-add" /> <span style={{marginLeft: '10px'}}>作者可以在下面编辑每个数据的结构.</span>
						</div>
					<hr style={{marginTop: '20px', marginBottom: '20px'}}/>
					<Row style={{marginTop:'10px'}}>
						<Col span={18}><h2>每个单独数据的结构</h2></Col>
						<Col span={6}><Button type="primary" onClick={collectionsProps.opendListType} ><Icon type="plus" />添加新的字段</Button></Col>
					</Row>
					<div className="collection-structure">
						<div className="collection-structure-list"
							 onMouseMove={collectionsProps.changeNameInputStyle.bind(this,true)}
			 				 onMouseOut={collectionsProps.changeNameInputStyle.bind(this,false)}
						>
							<i className="fa fa-text-width" aria-hidden="true"></i> <span className='collection-structure-list-text'>名称</span>
						</div>
							{collectionsList}

						{props.vdCollections.listTypeIsOpend ? <div className="collection-structure-list">
							<Row>
								<Col span={20}>
									<a href="javascript:void(0)">
										<Icon type="arrow-down" /><span className='collection-structure-list-text'>选择字段类型</span>
									</a>
								</Col>
								<Col span={4} onClick={collectionsProps.closeListType}>
									<a href="javascript:void(0)">
										<Icon type="close" /><span className='collection-structure-list-text'>关闭</span>
									</a>
								</Col>
							</Row>
							<Row>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'file-text','text')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="48" height="22" viewBox="0 0 48 22" ><path d="M16.168 20.8l-1.846-4.55H5.29L3.47 20.8H1L8.936 2.792h2L18.642 20.8h-2.474zM9.608 5.74L6.01 14.466h7.563L9.98 5.616h-.268l-.104.124zM27.42 21.11c-.8 0-1.588-.177-2.346-.526-.752-.346-1.35-.84-1.778-1.465l-.06-.09h-.306l-.052.2v1.57h-1.94V1.54h1.94v9.1h.31l.11-.09c.394-.607.97-1.096 1.712-1.45a5.56 5.56 0 0 1 2.41-.54c.92 0 1.765.162 2.508.48.742.315 1.384.76 1.91 1.316a5.91 5.91 0 0 1 1.218 1.987c.285.763.43 1.6.43 2.49 0 .89-.145 1.724-.43 2.478a6.065 6.065 0 0 1-1.22 1.99 5.548 5.548 0 0 1-1.91 1.33c-.738.32-1.582.48-2.505.48zm-.285-10.762c-.648 0-1.244.115-1.77.342a3.97 3.97 0 0 0-1.34.93c-.364.393-.65.87-.848 1.423-.198.547-.298 1.15-.298 1.796s.1 1.24.29 1.79c.2.55.482 1.03.85 1.42a3.91 3.91 0 0 0 1.34.93 4.44 4.44 0 0 0 1.77.34 4.44 4.44 0 0 0 1.77-.342c.52-.226.973-.54 1.34-.93a4.11 4.11 0 0 0 .85-1.42 5.29 5.29 0 0 0 .3-1.798c0-.645-.1-1.25-.3-1.797a4.11 4.11 0 0 0-.85-1.42 3.96 3.96 0 0 0-1.34-.933 4.44 4.44 0 0 0-1.77-.342zm15.34 10.762c-.925 0-1.78-.15-2.54-.452a5.873 5.873 0 0 1-1.975-1.27 5.63 5.63 0 0 1-1.28-1.96c-.3-.76-.454-1.615-.454-2.54 0-.922.153-1.78.454-2.552a5.82 5.82 0 0 1 1.27-1.986c.54-.55 1.2-.984 1.96-1.294.763-.31 1.625-.467 2.564-.467a6.9 6.9 0 0 1 2.515.46 5.512 5.512 0 0 1 1.93 1.27l-1.48 1.345a5.052 5.052 0 0 0-1.29-.93c-.502-.246-1.104-.37-1.79-.37-.67 0-1.263.124-1.765.37a3.63 3.63 0 0 0-1.266 1.02 4.57 4.57 0 0 0-.763 1.47 5.74 5.74 0 0 0-.256 1.71c0 .592.1 1.162.3 1.693a4.3 4.3 0 0 0 .846 1.403c.365.4.81.72 1.315.945a4.174 4.174 0 0 0 1.72.346c.69 0 1.287-.124 1.78-.37a4.426 4.426 0 0 0 1.217-.917l1.38 1.38a5.032 5.032 0 0 1-1.91 1.264 7.22 7.22 0 0 1-2.49.43z" fill="currentColor"></path></svg>
										</div>
										<p className="collection-text">纯文本</p>
									</div>
								</Col>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'copy','textarea')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="51" height="32" viewBox="0 0 51 32" ><path fill="currentColor" d="M9 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm16 11V3c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2zM3 17V3h20v10.586l-5-5L9.586 17H3zm15-5.586l5 5V17H12.414L18 11.414zM28 5v2h22V5H28zm0 8h22v-2H28v2zm0 6h22v-2H28v2zM4 25h46v-2H4v2zm0 6h31v-2H4v2z"></path></svg>
										</div>
										<p className="collection-text">富文本</p>
									</div>
								</Col>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'picture','image')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="42" height="33" viewBox="0 0 42 33"><path fill="currentColor" d="M39 1H3c-1.1 0-2 .9-2 2v27c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM4.414 30L13 21.414 21.586 30H4.414zm20 0l-5.8-5.802 6.868-6.776L37.612 30h-13.2zM39 28.56L25.518 14.577l-8.32 8.206L13 18.586l-10 10V3h36v25.56zM13 15zm0-6a2.003 2.003 0 0 1 2 2 2.003 2.003 0 0 1-2 2 2.003 2.003 0 0 1-2-2 2.003 2.003 0 0 1 2-2z"></path></svg>
										</div>
										<p className="collection-text">图片</p>
									</div>
								</Col>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'play-circle-o','video')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="42" height="33" viewBox="0 0 42 33" ><path fill="currentColor" d="M38 1H4C2.35 1 1 2.35 1 4v25c0 1.65 1.35 3 3 3h34c1.65 0 3-1.35 3-3V4c0-1.65-1.35-3-3-3zm1 28c0 .542-.458 1-1 1H4c-.542 0-1-.458-1-1V4c0-.542.458-1 1-1h34c.542 0 1 .458 1 1v25zM19.117 11.328L16 9.528V23.47l3.123-1.8 5.85-3.452 2.912-1.72-2.874-1.718-5.89-3.452zM18 19.953v-6.907l5.8 3.453-5.8 3.45z"></path></svg>
										</div>
										<p className="collection-text">视频</p>
									</div>
								</Col>
							</Row>
							<Row>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'link','link')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="30" height="30" viewBox="0 0 30 30"><path fill="currentColor" d="M26.35 4.07l-.414-.413a7.974 7.974 0 0 0-5.657-2.333 7.978 7.978 0 0 0-5.66 2.333l-3.93 3.93c-3.11 3.11-3.11 8.202 0 11.314l.41.42c.33.33.682.62 1.052.88l.18-.18 1.26-1.26a5.95 5.95 0 0 1-1.08-.85l-.413-.413a5.957 5.957 0 0 1-1.748-4.242c0-1.61.62-3.115 1.747-4.242l3.93-3.93a5.957 5.957 0 0 1 4.243-1.746c1.61 0 3.118.62 4.245 1.75l.41.412a5.957 5.957 0 0 1 1.75 4.242 5.95 5.95 0 0 1-1.748 4.243l-.504.504c.32.75.48 1.55.472 2.353l1.444-1.444c3.11-3.11 3.11-8.204 0-11.316zm-7.45 6.623a7.924 7.924 0 0 0-1.055-.877l-.18.18-1.26 1.26c.387.24.752.522 1.082.85l.412.413a5.957 5.957 0 0 1 1.74 4.24A5.95 5.95 0 0 1 17.894 21l-3.93 3.93a5.96 5.96 0 0 1-4.244 1.748 5.95 5.95 0 0 1-4.24-1.748l-.41-.41a5.957 5.957 0 0 1-1.75-4.24c0-1.61.62-3.117 1.746-4.244l.505-.504a5.804 5.804 0 0 1-.47-2.352l-1.44 1.443c-3.11 3.11-3.11 8.202 0 11.314l.416.412a8 8 0 0 0 5.658 2.33c2.052 0 4.1-.78 5.658-2.34l3.93-3.93c3.11-3.11 3.11-8.203 0-11.315l-.412-.41z"></path></svg>
										</div>
										<p className="collection-text"> 链接</p>
									</div>
								</Col>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'mail','Email')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="38" height="28" viewBox="0 0 38 28"><path fill="currentColor" d="M35.1 1H2.9C1.9 1 1 1.9 1 2.9V25c0 1.1.9 2 1.9 2H35c1.1 0 1.9-.9 1.9-1.9V2.9c.1-1-.8-1.9-1.8-1.9zM2.9 4.2l10.5 9.6-10.5 9.6V4.2zm16.1 12L4.4 2.9h29.3L19 16.2zm-4.1-1.1l4.1 3.7 4.1-3.7 10.9 10H4l10.9-10zm9.6-1.3L35 4.2v19.2l-10.5-9.6z"></path></svg>
										</div>
										<p className="collection-text">电子邮件</p>
									</div>
								</Col>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'phone','phone')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="35" height="36" viewBox="0 0 35 36"><path fill="currentColor" d="M33.1 5.5l-9.4-3.7-5.4 10.6 4.3 4.5c-1.8 2.5-4.1 4.8-6.6 6.6L11.9 19 .7 24l3.9 10.3.8-.1C20.2 32.9 32 21.3 33.8 6.5l.1-.8-.8-.2zM5.9 32.2l-2.7-7.1 8.1-3.8 4.3 4.7.7-.5c3.3-2.2 6.1-5.1 8.3-8.3l.5-.7-4.5-4.6 3.9-7.7 7 2.8C29.8 20.2 19.2 30.6 5.9 32.2z"></path></svg>
										</div>
										<p className="collection-text">电话号码</p>
									</div>
								</Col>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'minus','number')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="31" height="29" viewBox="0 0 31 29" ><path fill="currentColor" d="M29.688 11L30 9h-7.888l1.482-8h-1.906l-1.482 8h-8l1.482-8h-2l-1.482 8H2.188l-.5 2h8.148L8.54 18H1.188l-.312 2H8.17l-1.482 8h2l1.482-8h8l-1.482 8h1.906l1.482-8h8.612L29 18h-8.554l1.296-7h7.946zm-11.15 7h-8l1.297-7h8l-1.296 7z"></path></svg>
										</div>
										<p className="collection-text">纯数字</p>
									</div>
								</Col>
							</Row>
							<Row>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'calendar','date')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="38" height="36" viewBox="0 0 38 36"><path fill="currentColor" d="M3 6h32v8H3z"></path><path fill="currentColor" d="M35 4h-7V1h-2v3H12V1h-2v3H3c-1.1 0-2 .9-2 2v27c0 1.1.9 2 2 2h32c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM3 6h7v3h2V6h14v3h2V6h7v8H3V6zm32 27H3V16h32v17z"></path></svg>
										</div>
										<p className="collection-text">日历</p>
									</div>
								</Col>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'sync','switch')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="42" height="25" viewBox="0 0 42 25"><circle fill="currentColor" cx="29.5" cy="12.5" r="10.5" opacity=".25"></circle><path fill="currentColor" d="M37.963 20.267c.077-.083.154-.165.228-.25.15-.168.287-.34.42-.516a10.226 10.226 0 0 0 .59-.834 11.544 11.544 0 0 0 .52-.903c.08-.154.156-.312.228-.47a10.7 10.7 0 0 0 .216-.49c.07-.176.135-.357.198-.537.056-.158.11-.314.16-.475.06-.2.108-.405.157-.61.035-.15.075-.296.105-.447.046-.24.077-.48.11-.72.016-.128.04-.25.052-.38.037-.373.058-.75.058-1.13s-.02-.76-.057-1.13c-.012-.13-.036-.254-.053-.38-.032-.24-.063-.483-.11-.72-.03-.15-.07-.298-.106-.447-.05-.205-.098-.41-.158-.61-.05-.162-.106-.318-.16-.476-.063-.18-.125-.36-.197-.538a10.7 10.7 0 0 0-.214-.49 10.562 10.562 0 0 0-.503-.97 12.463 12.463 0 0 0-.586-.91 15.9 15.9 0 0 0-.25-.33 11.454 11.454 0 0 0-.415-.516c-.072-.085-.15-.167-.225-.25a15.95 15.95 0 0 0-.51-.528c-.058-.053-.117-.103-.17-.155a12.7 12.7 0 0 0-.636-.546l-.036-.028A11.44 11.44 0 0 0 31 1.11V1H12v.025C5.883 1.29 1 6.318 1 12.5s4.883 11.21 11 11.475V24h19v-.11a11.425 11.425 0 0 0 5.612-2.365l.037-.028a14.7 14.7 0 0 0 .63-.548c.055-.057.114-.107.17-.16a8.7 8.7 0 0 0 .51-.527zm.99-6.845c-.013.13-.036.255-.054.382-.028.17-.05.34-.08.506-.03.16-.076.32-.11.478-.036.126-.066.252-.1.375a9.12 9.12 0 0 1-.176.522c-.035.1-.07.198-.108.295a10.01 10.01 0 0 1-.237.54c-.038.08-.075.16-.115.24a9.96 9.96 0 0 1-.778 1.28c-.036.05-.073.097-.11.146a9.19 9.19 0 0 1-.43.534l-.09.1a9.76 9.76 0 0 1-.507.53l-.04.037a9.45 9.45 0 0 1-5.28 2.52l-.366.047a9.08 9.08 0 0 1-.877.046c-5.238 0-9.5-4.262-9.5-9.5S24.262 3 29.5 3c.296 0 .587.018.876.044l.365.048a9.45 9.45 0 0 1 5.287 2.52 9.702 9.702 0 0 1 .547.566c.03.032.063.065.093.1a9.54 9.54 0 0 1 .54.68 9.863 9.863 0 0 1 .776 1.28c.04.078.077.157.115.237.084.178.163.357.236.54.04.098.073.198.108.296.063.176.123.35.175.526.038.124.068.25.1.375.04.158.08.316.11.478.033.167.055.337.08.506.017.127.04.253.053.382a9.147 9.147 0 0 1 0 1.846zM12.63 22l-.544-.023C6.99 21.757 3 17.594 3 12.5S6.99 3.22 12.086 3l.416-.023L23.022 3C19.992 5.07 18 8.552 18 12.5s1.99 7.43 5.022 9.5H12.63z"></path></svg>
										</div>
										<p className="collection-text">开关</p>
									</div>
								</Col>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'filter','color')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="38" height="38" viewBox="0 0 38 38" ><path fill="currentColor" d="M21.704 23.927C20.214 17.917 11.46 1 11.46 1S3.79 16.076 1.436 23.17C1.153 24.005 1 25.228 1 26.163l.015.132a2.68 2.68 0 0 0-.015.27c0 5.75 4.696 10.415 10.486 10.415 5.78 0 10.486-4.664 10.486-10.416l-.012-.205.012-.2c0-1.08-.268-2.24-.268-2.24zM11.486 34.98C6.806 34.98 3 31.203 3 26.563l.005-.072.01-.1v-.09L3 26.05c.013-.777.148-1.7.335-2.25 1.59-4.79 5.745-13.477 8.14-18.344 2.614 5.235 7.274 14.863 8.28 18.92.055.238.208 1.052.216 1.733l-.01.25c0 .08.01.16.02.25-.026 4.62-3.823 8.37-8.485 8.37zM37 15.67c0-.626-.153-1.303-.153-1.303-.85-3.505-5.85-13.37-5.85-13.37s-4.38 8.79-5.725 12.928c-.162.486-.25 1.2-.25 1.745l.008.077-.008.157c0 3.354 2.682 6.073 5.99 6.073 3.3 0 5.988-2.72 5.988-6.073l-.007-.12.007-.115zm-5.99 4.307c-2.2 0-3.988-1.828-3.99-4.038l.01-.1v-.1l-.007-.17c.01-.39.08-.826.15-1.03.742-2.287 2.488-6.13 3.837-8.98 1.57 3.28 3.443 7.42 3.886 9.24.02.084.095.484.103.81l-.01.17v.17c-.03 2.222-1.807 4.02-3.99 4.02z"></path></svg>
										</div>
										<p className="collection-text">颜色</p>
									</div>
								</Col>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'caret-down','option')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="57" height="26" viewBox="0 0 57 26"><path fill="currentColor" d="M25 12H10v2h15v-2zM54.1 1H2.9C1.9 1 1 1.9 1 2.9v20.2c0 1 .9 1.9 1.9 1.9h51.2c1.1 0 1.9-.9 1.9-1.9V2.9c0-1-.9-1.9-1.9-1.9zm0 22.1H2.9V2.9h51.2v20.2zm-5.5-11.4l-1.1-1.3-2.9 2.5-2.9-2.5-1.1 1.3 4.1 3.5 3.9-3.5z"></path></svg>
										</div>
										<p className="collection-text">下拉选项</p>
									</div>
								</Col>
							</Row>
							<Row>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'database','Reference')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="38" height="27" viewBox="0 0 38 27"><path fill="currentColor" d="M15 14L9 9v4H6c-1.654 0-3-1.346-3-3V5H1.046v5.452C1.28 12.99 3.406 15 6 15h3v4l6-5z"></path><path fill="currentColor" d="M27.478 8C23.25 8 20.593 6.966 20 6.364v-1.63c.592-.602 3.25-1.637 7.478-1.637s6.884 1.034 7.477 1.636v1.63C34.36 6.967 31.705 8 27.478 8m0-6.903C22.243 1.097 18 2.627 18 4.513v2.072C18 8.47 22.243 10 27.478 10c5.234 0 9.477-1.53 9.477-3.415V4.513c0-1.887-4.243-3.416-9.477-3.416" opacity=".5"></path><path opacity=".15" fill="currentColor" d="M27.478 8C23.25 8 20.593 6.966 20 6.364v-1.63c.592-.602 3.25-1.637 7.478-1.637s6.884 1.034 7.477 1.636v1.63C34.36 6.967 31.705 8 27.478 8"></path><path fill="currentColor" d="M34.954 11.975v2.345c-.59.602-3.248 1.637-7.477 1.637-4.23 0-6.886-1.035-7.478-1.637v-2.345c-.824-.273-1.498-.59-2-.94v3.505c0 1.888 4.24 3.417 9.475 3.417 5.234 0 9.477-1.53 9.477-3.417v-3.506c-.505.35-1.18.668-2 .94z"></path><path fill="currentColor" d="M19.64 11.845c.12.044.234.09.36.13v2.345c.592.602 3.25 1.637 7.478 1.637 4.23 0 6.885-1.035 7.477-1.637v-2.345c.126-.042.243-.087.362-.13C33.4 12.55 30.603 13 27.477 13c-3.124 0-5.92-.448-7.837-1.155z" opacity=".25"></path><path opacity=".5" fill="currentColor" d="M34.954 19.94v2.346c-.59.602-3.248 1.637-7.477 1.637-4.23 0-6.886-1.035-7.478-1.637V19.94c-.824-.272-1.498-.59-2-.94v3.506c0 1.888 4.24 3.417 9.475 3.417 5.234 0 9.477-1.53 9.477-3.417V19c-.505.35-1.18.67-2 .94z"></path><path fill="currentColor" d="M19.64 19.81c.12.045.234.09.36.13v2.346c.592.602 3.25 1.637 7.478 1.637 4.23 0 6.885-1.035 7.477-1.637V19.94c.126-.04.243-.086.362-.13-1.916.708-4.713 1.156-7.84 1.156-3.124 0-5.92-.447-7.837-1.155z" opacity=".15"></path></svg>
										</div>
										<p className="collection-text">一级菜单</p>
									</div>
								</Col>
								<Col className="collection-structure-list-btn" onClick={collectionsProps.addCollectionsList.bind(this,index,'database','Multi-Reference')} span={6}>
									<div className="collection-btn-content">
										<div className="collection-btn-img">
											<svg width="38" height="32" viewBox="0 0 38 32"><path opacity=".5" fill="currentColor" d="M35 16.018v2.345c-.59.602-3.248 1.637-7.477 1.637-4.23 0-6.886-1.035-7.478-1.637v-2.345c-.82-.273-1.495-.59-2-.94v3.505c0 1.888 4.243 3.417 9.478 3.417C32.758 22 37 20.47 37 18.583v-3.506c-.505.35-1.18.668-2 .94z"></path><path fill="currentColor" d="M19.686 15.888c.12.044.234.09.36.13v2.345c.592.602 3.248 1.637 7.477 1.637 4.23 0 6.885-1.035 7.477-1.637v-2.345c.126-.042.243-.087.362-.13-1.916.707-4.713 1.155-7.84 1.155-3.123 0-5.92-.448-7.836-1.155z" opacity=".15"></path><path fill="currentColor" d="M27.523 11.903c-4.228 0-6.885-1.034-7.478-1.636v-1.63C20.638 8.034 23.295 7 27.523 7S34.408 8.034 35 8.636v1.63c-.593.603-3.25 1.637-7.477 1.637m0-6.903c-5.234 0-9.477 1.53-9.477 3.416v2.072c0 1.886 4.243 3.415 9.477 3.415S37 12.373 37 10.488V8.416C37 6.53 32.758 5 27.523 5"></path><path opacity=".25" fill="currentColor" d="M27.523 11.903c-4.228 0-6.885-1.034-7.478-1.636v-1.63C20.638 8.034 23.295 7 27.523 7S34.408 8.034 35 8.636v1.63c-.593.603-3.25 1.637-7.477 1.637"></path><path fill="currentColor" d="M35 23.845v2.345c-.59.602-3.248 1.637-7.477 1.637-4.23 0-6.886-1.035-7.478-1.637v-2.345c-.82-.273-1.495-.59-2-.94v3.505c0 1.888 4.243 3.417 9.478 3.417 5.234 0 9.477-1.53 9.477-3.417v-3.506c-.505.35-1.18.668-2 .94z"></path><path fill="currentColor" d="M19.686 23.714c.12.044.234.09.36.13v2.345c.592.6 3.25 1.635 7.478 1.635 4.23 0 6.885-1.035 7.477-1.637v-2.346c.128-.042.245-.087.364-.13-1.916.707-4.713 1.155-7.84 1.155-3.124 0-5.92-.448-7.837-1.156z" opacity=".25"></path><path fill="currentColor" d="M14.954 10L9 5v4H5.954c-1.654 0-3-1.346-3-3V1H1v5.452C1.234 8.99 3.36 11 5.954 11H9v4l5.954-5z"></path><path fill="currentColor" d="M14.954 26L9 21v4H5.954c-1.654 0-3-1.346-3-3V7H1v15.452C1.234 24.99 3.36 27 5.954 27H9v4l5.954-5z"></path></svg>
										</div>
										<p className="collection-text"> 多级菜单</p>
									</div>
								</Col>
							</Row>
						</div> : <div className="collection-structure-list" onClick={collectionsProps.opendListType}>
									<a href="javascript:void(0)">
										<Icon type="plus" /><span className='collection-structure-list-text'>添加新的字段</span>
									</a>
								 </div>}	
					</div>
					<Button type="primary" style={{marginRight:20}}>保存数据集</Button>
					<Button type="danger">删除数据集</Button>
				</div>
			)

		};

		return (
	          <Row key={index} className="collections-list">
	            <Col span={4}>
	            	<Icon type="hdd" />
	            </Col>
	            <Col span={16} style={{paddingLeft: '10px'}} >
	              <p>{item.name}</p>
	            </Col>
	            <Col span={2}>
	              <Popconfirm title="确定要删除这个数据集吗？" onConfirm={collectionsProps.deleteCollections.bind(this,item)} okText="是" cancelText="否">
	                <a href="#">
	                  <Icon type="delete" />
	                </a>
	              </Popconfirm>
	            </Col>
	            <Col span={2} onClick={collectionsProps.getItem.bind(this,item,index)}>
					<Popover className="collections-popover" 
							 placement="right" title={collectionsPopover.title} 	
							 content={collectionsPopover.content} 
							 trigger="click" 
							 visible={props.vdCollections.collectionsItemVisible}>
						<a href="#">
	              			<Icon type="edit"/>
              			</a>
              		</Popover>
	            </Col>
	          </Row>
		)
	})

	const newCollectionsPopover = {
		content: (
				<Row>
			        <Col span={14}>
			          <Input size="small" value={props.vdCollections.newCollectionsName} onPressEnter={collectionsProps.addNewCollections} placeholder="请输入数据集名称" onChange={collectionsProps.getNewCollectionsName.bind(this)} />
			        </Col>
			        <Col span={10} style={{textAlign: 'right'}}>
			          <Button size="small" onClick={collectionsProps.addNewCollections} >添加</Button>
			        </Col>
			    </Row>
			)
	}

  	return (
  		<div className="vdctrl-pane-wrapper">
					<Collapse bordered={false} defaultActiveKey='collections-manager'>
		    			<Panel header="数据集管理" key="collections-manager">
		    				<Popover placement="right" trigger={['click']} content={newCollectionsPopover.content} visible={props.vdCollections.newCollectionsPopoverVisible} onVisibleChange={collectionsProps.newCollectionsPopoverVisibleChange}>
				    			<Tooltip placement="left" title="添加数据集">
									<Button onClick={collectionsProps.closePopover} className="collections-header-btn"><Icon type="plus"/></Button>
								</Tooltip>
							</Popover>
							{collections}
		    			</Panel>
					</Collapse>



  		</div>
  	);

};

function mapSateToProps({ vdCollections }) {
  return { vdCollections };
}

export default connect(mapSateToProps)(Component);
