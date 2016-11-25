import React , {PropTypes} from 'react';
import { Tree, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const TreeNode = Tree.TreeNode;

const Attr = (props) => {

	var onSelect = function () {

	}

	var onCheck = function() {

	}
	return (
		<div></div>
	);

};

function mapStateToProps({ designer }) {
  return { designer };
}

export default connect(mapStateToProps)(Attr);
