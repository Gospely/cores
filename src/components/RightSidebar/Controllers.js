import React , {PropTypes} from 'react';
import { Tree } from 'antd';
import { Row, Col } from 'antd';
import { connect } from 'dva';

const TreeNode = Tree.TreeNode;

const DragSource = require('react-dnd').DragSource;

const Controllers = (props) => {

	var onSelect = function (controller) {
		console.log(controller);
	}

	var onCheck = function() {

	}

	console.log(props.designer.controllersList);

  	return (

	    <Row>
	    	{props.designer.controllersList.map(controller => (
				<Col span={12}>
	      			<div onClick={onSelect.bind(this, controller)} className={'app-components ' + controller.type}><span className="title">{controller.name}</span></div>
	      		</Col>
	    	))}
	    </Row>

  	);

};

function mapStateToProps({ designer }) {
  return { designer };
}

export default connect(mapStateToProps)(Controllers);
