import React , {PropTypes} from 'react';
import { Tree, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const TreeNode = Tree.TreeNode;

const Attr = () => {

	var onSelect = function () {

	}

	var onCheck = function() {

	}

	const residences = [{
	  value: 'zhejiang',
	  label: 'Zhejiang',
	  children: [{
	    value: 'hangzhou',
	    label: 'Hangzhou',
	    children: [{
	      value: 'xihu',
	      label: 'West Lake',
	    }],
	  }],
	}, {
	  value: 'jiangsu',
	  label: 'Jiangsu',
	  children: [{
	    value: 'nanjing',
	    label: 'Nanjing',
	    children: [{
	      value: 'zhonghuamen',
	      label: 'Zhong Hua Men',
	    }],
	  }],
	}];

	return (

	  	<div>

	  	</div>

	);

};

export default Attr;
