import React , {propTypes} from 'react';
import { connect } from 'dva';
import { Spin, Button, Modal, Layout, Row, Col, Input, Menu } from 'antd';

const Search = Input.Search;
const MouldStore = (props) => {
	
	const mouldStoreProps = {
		hide() {
			props.dispatch({
					type: 'mouldStore/changeMouldStoreVisible',
					payload: false
				})
		},

		handleClick(activeMenu) {

		}
	};

	return (
		<div className="designer-wrapper">
			<Modal
			  title="Gospel 模板商城"
              wrapClassName="vertical-center-modal"
              visible={props.mouldStore.visible}
              wrapClassName="mould-wrapper"
              onCancel={mouldStoreProps.hide}
			>
				<div className="mould-store">

					<div className="mould-store-header">
						<div className="mould-store-header-box">
							<h1 className="mould-store-page-title">Responsive Event Website Templates</h1>
							<p className="mould-store-subhead">
								Browse our HTML5 responsive event templates below. You can easily customize any of our event website templates with Webflow's code-free design tools, then connect your new event website to our powerful CMS, and launch it today.
							</p>
							<div className="mould-store-search">
								<Search
								    placeholder="input search text"
								    style={{ width: '30%' }} />
							</div>
						</div>	
					</div>
					<div style={{backgroundColor: '#FFFFFF'}}>
						<div className="mould-store-menu-box">
								<Menu
									onClick={mouldStoreProps.handleClick}
		      						mode="horizontal"
		      						className="mould-store-menu">
									<Menu.Item key="free" className="mould-store-menu-item">
										免费
									</Menu.Item>
									<Menu.Item key="one" className="mould-store-menu-item">
										xxx
									</Menu.Item>
									<Menu.Item key="two" className="mould-store-menu-item">
										xxx
									</Menu.Item>
									<Menu.Item key="there" className="mould-store-menu-item">
										xxx
									</Menu.Item>
									<Menu.Item key="four" className="mould-store-menu-item">
										xxx
									</Menu.Item>
								</Menu>
						</div>
					</div>
					<div className="mould-store-content">
						<div className="mould-store-content-list">
							<Row>
								<Col span={12} style={{ height:296}}>
									<img src={props.mouldStore.mouldAttr.imgUrl} className="mould-store-content-list-img" />
								</Col>
  								<Col span={12} style={{ paddingLeft:20}}>
  									<div className="mould-store-card-header">
  										<span className="mould-store-card-title">
  										{props.mouldStore.mouldAttr.name}
  										</span>&nbsp;
  										<span className="mould-store-card-price">
  										{props.mouldStore.mouldAttr.price}
  										</span>
  									</div>
  									<p className='mould-author'>
										{props.mouldStore.mouldAttr.author}
  									</p>
  								</Col>
							</Row>
						</div>

						<div className="mould-store-content-list">
							<Row>
								<Col span={12}>
									<img src={props.mouldStore.mouldAttr.imgUrl} className="mould-store-content-list-img" />
								</Col>
  								<Col span={12}>col-12</Col>
							</Row>
						</div>
					</div>

				</div>

			</Modal>
		</div>
	);

};

function mapSateToProps({ mouldStore }) {
	return { mouldStore };
}

export default connect(mapSateToProps)(MouldStore);