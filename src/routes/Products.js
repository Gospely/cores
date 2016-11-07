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

export default connect(({products}) => ({
	products
}))(Products);