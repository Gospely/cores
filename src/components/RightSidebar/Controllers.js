import React , {PropTypes} from 'react';
import { Tree } from 'antd';
import { Row, Col } from 'antd';
import { connect } from 'dva';

const TreeNode = Tree.TreeNode;

const Controllers = (props) => {

	var onSelect = function () {

	}

	var onCheck = function() {

	}

	console.log(props.designer.controllersList);

  	return (

	    <Row>
	    	{props.designer.controllersList.map(controller => (
				<Col span={12}>
	      			<div className={'app-components ' + controller.type}><span className="title">{controller.name}</span></div>
	      		</Col>
	    	))}

	    </Row>


  	);

};

function mapStateToProps({ designer }) {
  return { designer };
}

export default connect(mapStateToProps)(Controllers);
