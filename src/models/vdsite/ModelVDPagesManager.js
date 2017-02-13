import React , {PropTypes} from 'react';
import dva from 'dva';

import request from '../../utils/request.js';

export default {
	namespace: 'vdpm',
	state: {
		currentActivePageListItem: 'sub1',
		treeNodes: [],
		pageManager: {
			treeSelect: {
				value: ''
			},
			newPageVisible: false,
			newFolderVisible: false
		},
		newPageFrom: {
			key: '',
			name: '',
			seo: {
				title: '',
				description: ''
			},
			script: {
				head: '',
				script: ''
			},
		},
		newFolderForm: {
			key: '',
			name: '',
			parent: ''
		},
		activePage: 'index.html',

		pageList: [{
			key: 'index.html',
			name: '主页面',
			seo: {
				title: '主页面',
				description: '介绍'
			},
			script: {
				head: '',
				body: ''
			}
		}, {
			key: 'folder1',
			name: '文件夹1',
			children: [{
				key: 'folder1/account.html',
				name: '账户',
				seo: {
					title: '账户',
					description: '介绍'
				},
				script: {
					head: '',
					body: ''
				}
			}, {
				key: 'folder1/folder2',
				name: '文件夹2',
				children: [{
					key: 'folder1/folder2/pw.html',
					name: '忘记密码',
					seo: {
						title: '忘记密码',
						description: '介绍'
					},
					script: {
						head: '',
						body: ''
					}
				}]
			}]
		}]
	},

	reducers: {

		setCurrentActivePageListItem(state, { payload: key }) {
			state.currentActivePageListItem = key;
			return {...state};
		},
		handleNewPageVisible(state, { payload: params }){
			state.pageManager.newPageVisible = params.value;
			state.newPageFrom = {
				key: '',
				name: '',
				seo: {
					title: '',
					description: ''
				},
				script: {
					head: '',
					script: ''
				},
			};
			return {...state};
		},
		handleNewFolderVisible(state, { payload: params }){
			state.pageManager.newFolderVisible = params.value;
			return {...state};
		},
		handleRreeSelect(state, { payload: params }){

			console.log(params);
			state.pageManager.treeSelect.value = params.value;
			if(localStorage.creatType == 'page'){
				state.pageManager.newPageVisible = true;
			}else{
				state.pageManager.newFolderVisible = true;
			}
			return {...state};
		},
		handNewPageFormChange(state, { payload: params}){

			var keys = params.target.split('.');
			if(keys.length == 2){
				state.newPageFrom[keys[0]][keys[1]] = params.value;
			}else{
				state.newPageFrom[params.target] = params.value;
			}
			return { ...state};
		},
		handleCreatePage(state, { payload: params}){

			var tree = state.pageManager.treeSelect.value;
			console.log(tree);
			state.newPageFrom.key = tree + state.newPageFrom.name + '.html'
			for (var i = 0; i < state.pageList.length; i++) {
				console.log(state.pageList[i].key);
				if(state.pageList[i].key == tree){
					state.pageList[i].children.push(state.newPageFrom);
				}
			}

			return {...state};
		},
		list(state, { payload: params}){

			var data = params.data,
				tree = [];
			console.log(data);
			if(data.length < 1) {
				return {...state};
			}

			for (var i = 0; i <= data.length - 1; i++) {
				var curr = data[i],
					tmpTree = {};
				if(curr.children) {
					tmpTree.name = curr.text;
					tmpTree.key = curr.id;
					tmpTree.isLeaf = !curr.children;
					tmpTree.original = curr;

					tree.push(tmpTree);
				}
			};
			for (var i = 0; i <= data.length - 1; i++) {
				var curr = data[i],
					tmpTree = {};
				if(!curr.children) {
					tmpTree.name = curr.text;
					tmpTree.key = curr.id;
					tmpTree.isLeaf = !curr.children;
					tmpTree.original = curr;

					tree.push(tmpTree);
				}
			};
			console.log(tree);
			return {...state, treeNodes: [{
				isLeaf: false,
				key: localStorage.dir,
				name: localStorage.currentProject,
				children: tree,
				original: {
					folder: 'null'
				}
			}]};
		}
	},
	effects: {
		*fetchFileList(payload, {call, put}) {
			if(location.hash.indexOf('project') != -1) {
				// yield put({
				// 	type: 'setTreeLoadingStatus',
				// 	payload: true
				// });
	  			var fileList = yield request('fs/list/file?id=' + localStorage.dir);
				localStorage.currentFolder = localStorage.dir;

				if(fileList.err) {
					const openNotification = () => {
					  	notification['error']({
					    	description: fileList.err.message,
					    	message: '文件树请求出错',
					    	duration: 5000
					  	});
					};openNotification();

					return false;
				}

	    		yield put({ type: 'list', payload: fileList });
				// yield put({
				// 	type: 'setTreeLoadingStatus',
				// 	payload: false
				// });
			}

  		},
	}

}
