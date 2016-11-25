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

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select className="icp-selector">
        <Option value="86">+86</Option>
      </Select>
    );

	return (

	);

};

function mapStateToProps({ designer }) {
  return { designer };
}

export default connect(mapStateToProps)(Attr);
