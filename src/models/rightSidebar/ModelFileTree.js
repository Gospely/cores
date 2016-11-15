import dva from 'dva';
import request from '../../utils/request.js';

export default {
	namespace: 'file',
	state: {
		treeData: []
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
          		dispatch({
            		type: 'fetchFileList',
          		});
	      	});
		}
	},

	effects: {
		*fetchFileList(payload, {call, put}) {
      		var fileList = yield request('fs/list/file/?id=node-hello_ivydom');
	      	yield put({ type: 'list', payload: fileList });
      	}
	},

	reducers: {
		move (state, {payload: key}) {
			return {...state, current: key};
		},

		rename (state, {payload: key}) {
			return {...state, current: key};
		},

		copy (state, {payload: key}) {
			return {...state, current: key};
		},

		paste (state, {payload: key}) {
			return {...state, current: key};
		},

		'delete' (state, {payload: key}) {
			return {...state, current: key};
		},

		cut (state, {payload: key}) {
			return {...state, current: key};
		},

		read (state, {payload: key}) {
			return {...state, current: key};
		},

		write (state, {payload: key}) {
			return {...state, current: key};
		},

		list (state, {payload: list}) {
			console.log(list);

			var data = list.data, 
				tree = [];

			for (var i = data.length - 1; i >= 0; i--) {
				var curr = data[i],
					tmpTree = {};

				tmpTree.name = curr.text;
				tmpTree.key = curr.id;
				tmpTree.isLeaf = curr.children;
				tmpTree.original = curr;

				tree.push(tmpTree);
			};

			return {...state, treeData: tree};
		},

		treeOnSelect (state, {payload: key}) {

		},

		treeOnCheck (state, {payload: key}) {

		},

		treeOnLoadData (state, {payload: treeNode}) {
		    return new Promise((resolve) => {
		      	setTimeout(() => {
		        	const treeData = [...state.treeData];
		        	getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
		        	this.setState({ treeData });
		        	resolve();
		      	}, 1000);
		    });
		}
	}

}