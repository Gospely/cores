import React , {PropTypes} from 'react';
import { Tree } from 'antd';
import { Row, Col } from 'antd';
import { connect } from 'dva';

const TreeNode = Tree.TreeNode;

const DragSource = require('react-dnd').DragSource;

const Controllers = (props) => {

	const controllersProps = {

		onSelect (controller) {
			console.log('start dragging', controller);
			window.dndData = controller;
		},

	}

	if(props.designer.loaded) {

	  	return (
		    <Row id="dnd-row">
		    	{props.designer.controllersList.map((controller, index) => {
		    		if(!controller.backend) {
		    			return (
							<Col span={12} key={index}>
				      			<div onMouseDown={controllersProps.onSelect.bind(this, controller)} className={'app-components ' + controller.type}><span className="title">{controller.name}</span></div>
				      		</Col>
		    			);
		    		}
		    	})}
		    </Row>

	  	);

	}else {
		return (
			<p>无处理对象</p>
		);
	}

};

function mapStateToProps({ designer, rightbar }) {
  return { designer, rightbar };
}

export default connect(mapStateToProps)(Controllers);
