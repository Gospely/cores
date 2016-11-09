import React from 'react';
import {connect} from 'dva';
import ProductList from '../components/ProductList';

const Products = (props) => {

	function handleDelete(id) {
		props.dispatch({
			type: 'products/delete',
			payload: id
		});
	}

	return (
		<div>
			<h2>List of P</h2>
			<ProductList onDelete={handleDelete} products={props.products} />
		</div>
	);

};

// 指定订阅数据，这里关联了 products
function mapStateToProps({ products }) {
  return {products};
}

export default connect(mapStateToProps)(Products);