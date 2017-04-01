import React , {propTypes} from 'react';
import { connect } from 'dva';
import { Spin, Button, Modal, Layout, Row, Col, Input, Menu, Radio } from 'antd';
import QRCode from 'qrcode.react';

const Search = Input.Search;

const TemplateStore = (props) => {
	var count = 0;

	const templateStoreProps = {

		changePay(e){

			props.dispatch({
				type: 'templateStore/addOrders',
				payload: e.target.value
			})
		},

		buytemplate(index) {

			props.dispatch({
				type: 'templateStore/changeBuyTemplateVisible',
				payload: {
					visible:true,
					index: index,
				}
			}),

			props.dispatch({
				type: 'templateStore/buyTemplate',
				payload: index
			})
		},
		searchTemplate(value){
			console.log('searchTemplate');
			props.dispatch({
				type: 'templateStore/searchTemplate',
				payload: value
			})
		},
		hideBuytemplate(index) {

			props.dispatch({
				type: 'templateStore/changeBuyTemplateVisible',
				payload: {
					visible:false,
					index: index,
				}
			})
		},

		hide() {

			props.dispatch({
				type: 'templateStore/changeTemplateStoreVisible',
				payload: false
			})
		},

		loadMore() {
			props.dispatch({
				type: 'templateStore/loadnumberAdd',
			})
			props.dispatch({
				type: 'templateStore/flashTemplates'
			});
		},

		selectTemplate(value) {
			console.log(value);

			props.dispatch({
				type: 'templateStore/setSelectTemplateValue',
				payload: value,
			})
		},

		handleClick(activeMenu) {
			console.log(activeMenu);
			props.dispatch({
				type: 'templateStore/setSelectTagValue',
				payload: activeMenu
			})
		}
	};
	const types = props.templateStore.types.map(function(item){
		return(
			<Menu.Item key={item.id} className="template-store-menu-item">
				{item.name}
			</Menu.Item>
		)
	})
	const templateList= props.templateStore.templateAttr.map(function(item,index){
							const selectValue = props.templateStore.selectTemplateValue;
							const selectTag = props.templateStore.selectTag;
							if(count < props.templateStore.loadnumber){
										  count++;
										  return (
											  <div className="template-store-content-list" key={index}>
												  <Row>
													  <Col span={12} style={{ height:296}}>
														  <img src={item.url} className="template-store-content-list-img" />
													  </Col>
													  <Col span={12} style={{ paddingLeft:20, paddingTop:20}}>

														  <div className="template-store-card-header">
															  <span className="template-store-card-title">
															  {item.name}
															  </span>&nbsp;
															  <span className="template-store-card-price">
															  ￥  {item.price == 0 ? '免费' : item.price}
															  </span>
														  </div>

														  <p className='template-author'>
															  {item.author}
														  </p>
														  <div className="template-introduce">
															  <p className="template-introduce-text">
																{item.description}
															  </p>
															  <div className="template-introduce-text-fead"></div>
														  </div>

														  <div className="template-btn-box">
															  <Button type="primary">预览模板</Button>
															  {!(!item.visible || item.price == 0) && <Button onClick={templateStoreProps.buytemplate.bind(this,index)} type="primary">购买模板</Button>}
															  {
																  (!item.visible || item.price == 0) ?<Button type="primary">使用模板</Button> : <Button type="primary" disabled >使用模板</Button>
															  }
														  </div>

													  </Col>
												  </Row>

												  <Modal
													  title="Gospel | 购买模板"
													  wrapClassName="vertical-center-modal"
													  visible={item.buyTemplateVisible}
													  onCancel={templateStoreProps.hideBuytemplate.bind(this,index)}
													  footer={null}
												  >
													  <div className="buy-template-header">
														  <div className="goods-name">
															  模板名称: {item.name}
														  </div>
														  <div className="goods-price">
															   模板价格: ￥ {item.price == 0 ? '免费' : item.price}
														  </div>
													  </div>

													  <div className="buy-template-pay">
														  <Radio.Group value={props.templateStore.pay} onChange={templateStoreProps.changePay}>
															  <Radio.Button className="buy-template-pay-btn"  value="weChat" >
																  <i className="fa fa-weixin" aria-hidden="true"></i>微信支付
															  </Radio.Button>
															  <Radio.Button className="buy-template-pay-btn" value="alipay" >
																  <i className="fa fa-paypal" aria-hidden="true"></i>支付宝
															  </Radio.Button>
														  </Radio.Group>
													  </div>

													  <div className="templates-pay">
														  { props.templateStore.pay == "weChat" ? <div>扫描二维码支付</div> : <div></div>}
														  { props.templateStore.pay == "weChat" ? <div style={{'margin-top': '15px'}} ><QRCode value={props.templateStore.wechat}></QRCode></div> : <div></div>}
													  </div>
													  <div className="templates-pay-btn" style={{'margin-top': '15px'}}>
														  <Button onClick={templateStoreProps.hideBuytemplate.bind(this,index)}>取消</Button>
														  { props.templateStore.pay == "alipay" ? <Button type="primary" style={{'margin-left': '20px'}}>确认支付</Button> : <div></div>}
													  </div>
												  </Modal>
											  </div>
										  )
							}

						})



	return (
		<div className="designer-wrapper">
			<Modal
			  title="Store|Gospel 模板商城 "
              wrapClassName="vertical-center-modal"
              visible={props.templateStore.visible}
              wrapClassName="template-wrapper"
              onCancel={templateStoreProps.hide}
			>
				<div className="template-store">

					<div className="template-store-header">
						<div className="template-store-header-box">
							<h1 className="template-store-page-title">Gospel  VD模板商城</h1>
							<p className="template-store-subhead">
								海量可个性定制化，多行业，可修改编辑的模板，任你挑选
							</p>
							<div className="template-store-search">
								<Search
								    placeholder="input search text"
								    style={{ width: '30%' }}
								    onSearch= {value => templateStoreProps.selectTemplate(value)}
									onSearch={templateStoreProps.searchTemplate}
								  />
							</div>
						</div>
					</div>
					<div style={{backgroundColor: '#FFFFFF'}}>
						<div className="template-store-menu-box">
								<Menu
									onClick={templateStoreProps.handleClick}
		      						mode="horizontal"
		      						className="template-store-menu"
								>
									<Menu.Item key="all" className="template-store-menu-item">
										全部
									</Menu.Item>
									<Menu.Item key="mine" className="template-store-menu-item">
										我的
									</Menu.Item>
									<Menu.Item key="free" className="template-store-menu-item">
										免费
									</Menu.Item>
									{types}
								</Menu>
						</div>
					</div>
					<Spin spinning={props.templateStore.isLoading}>
						<div className="template-store-content">
							{ props.templateStore.templateAttr.length > 0 ? templateList : <Button className="load-more">暂无数据</Button>}
						</div>
					</Spin>
					{props.templateStore.templateAttr.length == 0 || props.templateStore.templateAttr.length%props.templateStore.pageSize != 0 ? <div></div> :<Button onClick={templateStoreProps.loadMore} className="load-more">加载更多</Button>}

				</div>


			</Modal>
		</div>
	);

};

function mapSateToProps({ templateStore }) {
	return { templateStore };
}

export default connect(mapSateToProps)(TemplateStore);
