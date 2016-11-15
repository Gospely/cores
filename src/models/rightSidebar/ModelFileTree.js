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
      	},

      	*fetchFileNode({payload: params}, {call, put}) {
      		console.log(params);
      		const dirName = params.treeNode.props.eventKey;
      		var fileList = yield request('fs/list/file/?id=' + dirName);
      		yield put({ type: 'treeOnLoadData', payload: fileList });
      		params.resolve();
      	},

      	*mkdir({payload: dirName}, {call, put}) {

      	},

      	*touch({payload: dirName}, {call, put}) {

      	},

      	*renameFile({payload: dirName, newDirName}, {call, put}) {

      	},

      	removeFile({payload: fileName}, {call, put}) {

      	},

      	mvFile({payload: fileName, newFileName}, {call, put}) {

      	},

      	readFile({payload: fileName}, {call, put}) {

      	},

      	writeFile({payload: fileName, content}, {call, put}) {

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
			var data = list.data, 
				tree = [];

			for (var i = 0; i <= data.length - 1; i++) {
				var curr = data[i],
					tmpTree = {};

				tmpTree.name = curr.text;
				tmpTree.key = curr.id;
				tmpTree.isLeaf = !curr.children;
				tmpTree.original = curr;

				tree.push(tmpTree);
			};

			return {...state, treeData: tree};
		},

		treeOnSelect (state, {payload: key}) {

		},

		treeOnCheck (state, {payload: key}) {

		},

		treeOnLoadData (state, {payload: fileList }) {
			var files = fileList.data,
				parentDirName = '';

			if(files.length > 0) {
				parentDirName = files[0].folder;
			}

			var treeData = state.treeData,
				childNode = [],
				parentNodeIndex;

			treeData.map((node, key) => {
				if(node.key + '/' == parentDirName) {

					files.map(file => {

						parentNodeIndex = key;
						var tmpChild = {};
						tmpChild.name = file.text;
						tmpChild.key = file.id;
						tmpChild.isLeaf = !file.children;
						tmpChild.original = file;

						childNode.push(tmpChild);

					})
				}
			});

			if(parentNodeIndex == undefined) {
				throw '不匹配的文件树'
			}

			state.treeData[parentNodeIndex].children = childNode;

			return {...state};
		}
	}

}












