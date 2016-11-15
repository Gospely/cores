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
      		const dirName = params.treeNode.props.eventKey;
      		var fileList = yield request('fs/list/file/?id=' + dirName);
      		yield put({ type: 'treeOnLoadData', payload: {
      			fileList,
      			dirName
      		} });
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

		treeOnLoadData (state, {payload: params }) {
			var files = params.fileList.data,
				parentDirName = params.dirName;

			var treeData = state.treeData,
				childNode = [],
				parentNodeIndex;

			const findParentNode = (treeData, parentDirName, lvl) => {
				var parentNode;
				for (var i = 0; i < treeData.length; i++) {
					var node = treeData[i];

					if(node.key + '/' == parentDirName || node.key == parentDirName) {
						parentNode = {
							node: node,
							index: i,
							lvl: lvl
						};
						return parentNode;
					}

					if(node.children) {
						parentNode = findParentNode(node.children, parentDirName, lvl + 1);
						if(parentNode) {
							return parentNode;
						}
					}
				};
			}

			var parentNode = findParentNode(state.treeData, parentDirName, 1);

			console.log('currentNode', parentNode);

			const generatorNode = (files) => {
				var childNode = [];
				files.map(file => {
					var tmpChild = {};
					tmpChild.name = file.text;
					tmpChild.key = file.id;
					tmpChild.isLeaf = !file.children;
					tmpChild.original = file;
					childNode.push(tmpChild);
				});
				return childNode;
			}

			const setLeaf = (treeData, parentNode) => {

			  	const loopLeaf = (data, parent) => {
			  		var parentNodeA = parent.node.original.folder;
			  		parentNodeA = findParentNode(data, parentNodeA, parent.lvl - 1);

			  		console.log('parentNodeA', parentNodeA);
			  		if(!parentNodeA) {
						// state.treeData[parentNode.index].children = childNode;
						data[parentNode.index].children = childNode;
			  		}else {
			  			console.log(data, parent);
			  			var currNode = data[parentNodeA.index];
			  			console.log(currNode);
			  			if(!currNode) {
			  				loopLeaf(parentNodeA.node.children, parent);
			  			}else {
			  				currNode = currNode.children;
							currNode[parent.index].children = childNode;			  				
			  			}
			  		}
			  	};

			  	loopLeaf(treeData, parentNode);
			}

			if(parentNode.node.key + '/' == parentDirName || parentNode.node.key == parentDirName) {
				childNode = generatorNode(files);
			}

			if(parentNode.index == undefined) {
				throw '不匹配的文件树'
			}

			setLeaf(treeData, parentNode);

			return {...state, treeData};
		}
	}

}












