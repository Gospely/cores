import React , {PropTypes} from 'react';
import AceEditor from 'react-ace';
import EditorStyle from './Editor.css';
import { Button, Icon, Input, Switch, Menu, Dropdown, message } from 'antd';
import { Row, Col } from 'antd';

const ButtonGroup  = Button.Group;

const EditorTop = () => {

	var styles = {
		margin: {
			marginRight: '10px',
			marginLeft: '30px'
		}
	}

	function handleButtonClick(e) {
	  	message.info('Click on left button.');
	  	console.log('click left button', e);
	}

	function handleMenuClick(e) {
	  	message.info('Click on menu item.');
	  	console.log('click', e);
	}

	const menu = (
	  	<Menu onClick={handleMenuClick}>
	    	<Menu.Item key="1">HTML</Menu.Item>
	    	<Menu.Item key="2">CSS</Menu.Item>
	    	<Menu.Item key="3">JavaScript</Menu.Item>
	    	<Menu.Item key="4">Shell</Menu.Item>
	    	<Menu.Item key="5">Java</Menu.Item>
	    	<Menu.Item key="6">C/C++</Menu.Item>
	  	</Menu>
	);

  	return (
		<div className={EditorStyle.topbar}>
			<ButtonGroup>
				<Button className={EditorStyle.topbarBtn}><Icon type="save" />保存</Button>
				<Button className={EditorStyle.topbarBtn}><Icon type="search" />搜索</Button>
			</ButtonGroup>
			<div className={EditorStyle.topbarRight}>
				<ButtonGroup>
					<Button className={EditorStyle.topbarBtn}>行: 4 列: 32</Button>
					<Dropdown overlay={menu} trigger={['click']}>
						<Button className={EditorStyle.topbarBtn}>JavaScript</Button>
					</Dropdown>
					<Button className={EditorStyle.topbarBtn}><Icon type="up" /></Button>
				</ButtonGroup>
			</div>
			<div className={EditorStyle.searchBar}>
			    <Row gutter={16}>
			      	<Col className="gutter-row" span={6}>
			        	<div className="gutter-box">
						    <Input className={EditorStyle.textarea} type="textarea" placeholder="搜索文本..." autosize />
			        	</div>
			      	</Col>
			      	<Col className="gutter-row" span={3}>
			        	<div className="gutter-box">
		        		    <Button type="ghost" style={styles.margin} shape="circle-outline" icon="left" />
		        		    <Button type="ghost" shape="circle-outline" icon="right" />
			        	</div>
			      	</Col>
			      	<Col className="gutter-row" span={6}>
			        	<div className="gutter-box">
						    <Input className={EditorStyle.textarea} type="textarea" placeholder="请输入要替换成的文本..." autosize />
			        	</div>
			      	</Col>
			      	<Col className="gutter-row" span={6}>
			        	<div className="gutter-box">
				        	<Switch checkedChildren={'全部'} unCheckedChildren={'单个'} />
		        		    <Button type="ghost" style={styles.margin} shape="circle-outline" icon="check" />
			        	</div>
			      	</Col>
			    </Row>
			</div>
			<div className={EditorStyle.jumpLine}>
				跳行至: <Input defaultValue="27:30" />
			</div>
		</div>
  	);

};

export default EditorTop;
