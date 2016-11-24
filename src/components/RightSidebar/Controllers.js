import React , {PropTypes} from 'react';
import { Tree } from 'antd';
import { Row, Col } from 'antd';

const TreeNode = Tree.TreeNode;

const ConstructionTree = () => {

	var onSelect = function () {

	}

	var onCheck = function() {

	}

  	return (

	    <Row>
	      	<Col span={12}>
	      		<div className="app-components button-bar"><span className="title">按钮组</span></div>
	      	</Col>

	      	<Col span={12}>
	      		<div className="app-components button"><span className="title">按钮</span></div>
	      	</Col>

	      	<Col span={12}>
	      		<div className="app-components card"><span className="title">按钮组</span></div>
	      	</Col>

	      	<Col span={12}>
	      		<div className="app-components header"><span className="title">按钮组</span></div>
	      	</Col>

	      	<Col span={12}>
	      		<div className="app-components checkbox"><span className="title">选择框</span></div>
	      	</Col>

	      	<Col span={12}>
	      		<div className="app-components form"><span className="title">按钮组</span></div>
	      	</Col>

	      	<Col span={12}>
	      		<div className="app-components footer"><span className="title">按钮组</span></div>
	      	</Col>

	      	<Col span={12}>
	      		<div className="app-components heading"><span className="title">按钮组</span></div>
	      	</Col>

	    </Row>



  	);

};

export default ConstructionTree;
