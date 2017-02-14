import React , {PropTypes} from 'react';
import dva from 'dva';
import { notification } from 'antd';

import request from '../../utils/request.js';

const openNotificationWithIcon = (type, title, description) => (
  notification[type]({
    message: title,
    description: description,
  })
);

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
			state.pageManager.treeSelect.value = 'root';
			console.log(key);
			let getPageInfoByKey = function(pages){

				for (var i = 0; i < pages.length; i++) {
					console.log(pages[i].key);
					if(pages[i].key == key){
						return pages[i];
					}

				}
				for (var i = 0; i < pages.length; i++) {
					if(pages[i].children != null){
						state.pageManager.treeSelect.value = pages[i].key;
						return pages.children = getPageInfoByKey(pages[i].children);
					}
				}
			}
			console.log(state.pageList);
			state.newPageFrom = getPageInfoByKey(state.pageList);
			console.log(state.newPageFrom);
			return {...state};
		},
		handleNewPageVisible(state, { payload: params }){
			state.pageManager.newPageVisible = params.value;
			return {...state};
		},
		handleNewFolderVisible(state, { payload: params }){
			state.pageManager.newFolderVisible = params.value;
			return {...state};
		},
		handleRreeSelect(state, { payload: params }){

			state.pageManager.treeSelect.value = params.value;
			state.pageManager.newFolderVisible = true;
			return {...state};
		},
		handleNewPageRreeSelect(state, { payload: params }){
			state.pageManager.treeSelect.value = params.value;
			state.pageManager.newPageVisible = true;
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

			let pushPage = function(pages){

				for (var i = 0; i < pages.length; i++) {

					if(pages[i].children != null && pages[i].key == tree){

						//检查是否同名
						for (var j = 0; j < pages[i].children.length; j++) {
							if(pages[i].children[j].name == state.newPageFrom.name && pages[i].children[j].children == null){
								openNotificationWithIcon('error', '文件同名,请重命名');
								bool = true;
								return pages;
							}
						}
						pages.children = pages[i].children.push(state.newPageFrom);

						return pages;
					}else {
						if(pages[i].children != null){
							pages.children = pushPage(pages[i].children);
						}
					}
				}
				return pages;
			}

			var tree = state.pageManager.treeSelect.value;
			var bool = false;


			if(tree != 'root') {
				state.newPageFrom.key = tree + state.newPageFrom.name + '.html'
				state.pageList = pushPage(state.pageList);
			}else {
				state.newPageFrom.key = state.newPageFrom.name + '.html'
				for (var j = 0; j < state.pageList.length; j++) {

					if(state.pageList[j].name == state.newPageFrom.name && state.pageList[j].children == null){
						openNotificationWithIcon('error', '文件同名,请重命名');
						bool = true;
						state.pageManager.newPageVisible = bool;
						if(!bool){
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
						}
						return {...state};
					}
				}
				state.pageList.push(state.newPageFrom);
			}
			state.pageManager.newPageVisible = bool;
			if(!bool){
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
			}
			return {...state};
		},
		handleCreateFolder(state, { payload: params}){

			var bool = false;
			var tree = state.pageManager.treeSelect.value;
			state.newFolderForm.key = tree + '/' + state.newFolderForm.name
			state.newFolderForm.children = [];
			let pushPage = function(pages){

				for (var i = 0; i < pages.length; i++) {

					if(pages[i].children != null && pages[i].key == tree){
						//检查是否同名
						for (var j = 0; j < pages[i].children.length; j++) {
							if(pages[i].children[j].name == state.newFolderForm.name && pages[i].children[j].children != null){
								openNotificationWithIcon('error', '文件夹同名,请重命名');
								bool = true;
								return pages;
							}
						}
						pages.children = pages[i].children.push(state.newFolderForm);
						return pages;
					}else {
						if(pages[i].children != null){

							pages.children = pushPage(pages[i].children);
						}
					}
				}
				return pages;
			}


			if(tree != 'root') {
				state.pageList = pushPage(state.pageList);
			}else {
				for (var j = 0; j < state.pageList.length; j++) {
					if(state.pageList[j].name == state.newFolderForm.name && state.pageList[j].children != null){
						openNotificationWithIcon('error', '文件同名,请重命名');
						bool = true;
						state.pageManager.newFolderVisible = bool;
						if(!bool){
							state.newFolderForm = {
								key: '',
								name: '',
							};
						}
						return {...state};
					}
				}
				state.pageList.push(state.newFolderForm);
			}
			state.pageManager.newFolderVisible = bool;
			if(!bool){
				state.newFolderForm = {
					key: '',
					name: '',
				};
			}
			return {...state};
		},
		handleFolderName(state, { payload: params}){
			state.newFolderForm.name = params.value;
			return { ...state};
		},
		list(state, { payload: params}){

			var data = params.data,
				tree = [];
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
			return {...state, treeNodes: [{
				isLeaf: false,
				key: localStorage.dir,
				name: localStorage.currentProject,
				children: tree,
				original: {
					folder: 'null'
				}
			}]};
		},
		initState(state, {payload: params}){

			if(params.pageList != undefined){
				state.pageList = params.UIState.pageList;
			}
			return { ...state};
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

  		*elemAdded({payload: ctrl}, {call, put, select}) {
  			var activePage = yield select(state => state.vdpm.activePage);
  			yield put({
  				type: 'vdCtrlTree/handleElemAdded',
  				payload: {
  					ctrl,
  					activePage
  				}
  			});
  		}
	}

}
