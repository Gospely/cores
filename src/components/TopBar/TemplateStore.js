import React , {propTypes} from 'react';
import { connect } from 'dva';
import { Spin, Button, Modal, Layout, Row, Col, Input, Menu, Radio } from 'antd';

const Search = Input.Search;
const TemplateStore = (props) => {

	const templateStoreProps = {

		changePay(e){

			props.dispatch({
				type: 'templateStore/changePay',
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

		handleClick(activeMenu) {

		}
	};

	const templateList= props.templateStore.templateAttr.map(function(item,index){
							return (
								<div className="template-store-content-list" key={index}>
									<Row>
										<Col span={12} style={{ height:296}}>
											<img src={item.imgUrl} className="template-store-content-list-img" />
										</Col>
		  								<Col span={12} style={{ paddingLeft:20, paddingTop:20}}>

		  									<div className="template-store-card-header">
		  										<span className="template-store-card-title">
		  										{item.name}
		  										</span>&nbsp;
		  										<span className="template-store-card-price">
		  										{item.price}
		  										</span>
		  									</div>

		  									<p className='template-author'>
												{item.author}
		  									</p>

		  									<div>
												<a className="template-tag">{item.tag.free}</a>
		  									</div>

		  									<div className="template-introduce">
		  										<p className="template-introduce-text">
												  {item.introduceText}	  										
												</p>
												<div className="template-introduce-text-fead"></div>
		  									</div>

											<div className="template-btn-box">
												<Button type="primary">预览模板</Button>
												<Button onClick={templateStoreProps.buytemplate.bind(this,index)} type="primary">购买模板</Button>
												{
													item.isBuy ?<Button type="primary">使用模板</Button> : <Button type="primary" disabled >使用模板</Button>
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
												 模板价格: {item.price}
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
											{ props.templateStore.pay == "weChat" ? <img src={item.weChatLink} className="template-weChat-link" /> : <div></div>}
										</div>
										<div className="templates-pay-btn">
											<Button onClick={templateStoreProps.hideBuytemplate.bind(this,index)}>取消</Button>
											{ props.templateStore.pay == "alipay" ? <Button>确认支付</Button> : <div></div>}
										</div>
									</Modal>
								</div>
								)
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
							<h1 className="template-store-page-title">Responsive Event Website Templates</h1>
							<p className="template-store-subhead">
								Browse our HTML5 responsive event templates below. You can easily customize any of our event website templates with Webflow's code-free design tools, then connect your new event website to our powerful CMS, and launch it today.
							</p>
							<div className="template-store-search">
								<Search
								    placeholder="input search text"
								    style={{ width: '30%' }}
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
									<Menu.Item key="free" className="template-store-menu-item">
										免费
									</Menu.Item>
									<Menu.Item key="cms" className="template-store-menu-item">
										CMS
									</Menu.Item>
									<Menu.Item key="sale" className="template-store-menu-item">
										折扣
									</Menu.Item>
									<Menu.Item key="there" className="template-store-menu-item">
										xxx
									</Menu.Item>
									<Menu.Item key="four" className="template-store-menu-item">
										xxx
									</Menu.Item>
								</Menu>
						</div>
					</div>
					<div className="template-store-content">
						{templateList}
					</div>
				</div>

			</Modal>
		</div>
	);

};

function mapSateToProps({ templateStore }) {
	return { templateStore };
}

export default connect(mapSateToProps)(TemplateStore);