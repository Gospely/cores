import React , {PropTypes} from 'react';
import {Table, Popconfirm, Button} from 'antd';

const ProductList = ({onDelete, products}) => {

	const columns = [{
			title: 'Name',
			dataIndex: 'name'
		}, {
			title: 'id',
			dataIndex: 'id'
		},{
			title: 'Actions',
			render(text, record) {
				return (
		          	<Popconfirm title="确定要删除吗?" onConfirm={onDelete.bind(this, record.id)}>
		            	<Button>删除</Button>
		          	</Popconfirm>
				);
			}
	}];

	return (
    	<Table
      		dataSource={products}
      		columns={columns} />
	);

}

ProductList.proptypes = {
	onDelete: PropTypes.func.isRequired,
	products: PropTypes.array.isRequired
}

export default ProductList;
