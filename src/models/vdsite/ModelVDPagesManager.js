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
		currentActivePageListItem: 'index.html',
		treeNodes: [],
		pageManager: {
			treeSelect: {
				value: ''
			},
			newPageVisible: false,
			newFolderVisible: false,
			updatePopoverVisible: false
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
		}]
	},

	reducers: {

		setCurrentActivePageListItem(state, { payload: key }) {

			state.currentActivePageListItem = key;
			state.pageManager.treeSelect.value = 'root'
			let getPageInfoByKey = function(pages){
				for (var i = 0; i < pages.length; i++) {
					if(pages[i].key == key){
						state.newPageFrom = pages[i];
                        break;
					}
				}
				for (var i = 0; i < pages.length; i++) {
					if(pages[i].children != null && pages[i].children != undefined){
						state.pageManager.treeSelect.value = pages[i].key;
						getPageInfoByKey(pages[i].children) || null;
					}
				}
			}
			getPageInfoByKey(state.pageList);
            delete state.pageList['children'];
			return {...state};
		},
		handleNewPageVisible(state, { payload: params }){

			state.pageManager.newPageVisible = params.value;
            state.pageManager.treeSelect.value = 'root'
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
            state.pageManager.treeSelect.value = 'root'
            state.newFolderForm = {
                key: '',
                name: '',
            };
			return {...state};
		},
		handleUpdatePopoverVisible(state){

			state.pageManager.updatePopoverVisible = !state.pageManager.updatePopoverVisible;
			return { ...state};
		},
        visibleChange(state){

            state.pageManager.updatePopoverVisible = true;
            return { ...state};
        },
		handleRreeSelect(state, { payload: params }){

            state.pageManager.treeSelect.value = params.value;
            if(params.value == undefined || params.value == null){
                state.pageManager.treeSelect.value = 'root';
            }
			state.pageManager.newFolderVisible = true;
			return {...state};
		},
		handleNewPageRreeSelect(state, { payload: params }){

			state.pageManager.treeSelect.value = params.value;
            if(params.value == undefined || params.value == null){
                state.pageManager.treeSelect.value = 'root';
            }
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
					if(pages[i].children != null && pages[i].children != undefined && pages[i].key == tree){
						//检查是否同名
						for (var j = 0; j < pages[i].children.length; j++) {
							if(pages[i].children[j].name == state.newPageFrom.name && pages[i].children[j].children == null){
								openNotificationWithIcon('error', '文件同名,请重命名');
								bool = true;
								return pages;
							}
						}
						pages.children = pages[i].children.push(state.newPageFrom)
						return pages;
					}else {
						if(pages[i].children != null && pages[i].children != undefined){
							pages.children = pushPage(pages[i].children)  || null;
						}
					}
				}
				return pages;
			}

			var tree = state.pageManager.treeSelect.value;
			var bool = false;
            console.log('tree');
            console.log(tree);
			if(tree != 'root') {
				state.newPageFrom.key = tree + '/' + state.newPageFrom.name + '.html'
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
				state.activePage = state.newPageFrom.key;
			}
            delete state.pageList['children'];
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
        updatePage(state){

            let updatePageInfoByKey = function(pages){

				for (var i = 0; i < pages.length; i++) {
					if(pages[i].key == state.currentActivePageListItem && pages[i].children == null){
                        pages[i].seo = state.newPageFrom.seo;
                        pages[i].script = state.newPageFrom.script;
						break;
					}else {
                        if(pages[i].children != null && pages[i].children != undefined){
                            pages[i].children = updatePageInfoByKey(pages[i].children)
                        }
					}
				}
                return pages;
			}

            state.pageList = updatePageInfoByKey(state.pageList);
            delete state.pageList['children'];
            state.pageManager.updatePopoverVisible = false;
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
        deletePage(state, {payload: key}) {


            let deletPageInfoByKey = function(pages, key) {

				for (var i = 0; i < pages.length; i++) {
					if(pages[i].key == key ) {
                        pages.splice(i,1);
                        break;
					}else {
                        if(pages[i].children != null && pages[i].children != undefined) {
    					    pages[i].children = deletPageInfoByKey(pages[i].children, key);
    					}
					}
				}
                return pages;

			}
            if(key == null || key == undefined){
                state.pageList = deletPageInfoByKey(state.pageList,state.currentActivePageListItem);
                state.pageManager.updatePopoverVisible = false;
            }else {
                state.pageList = deletPageInfoByKey(state.pageList, key);
            }

            delete state.pageList['children'];
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
            return { ...state};
        },
		handleCreateFolder(state, { payload: params}){

			var bool = false;
			var tree = state.pageManager.treeSelect.value;
            if(tree == 'root'){
                state.newFolderForm.key = state.newFolderForm.name
            }else {
                state.newFolderForm.key = tree + '/' + state.newFolderForm.name
            }

			state.newFolderForm.children = [];
			let pushPage = function(pages){

				for (var i = 0; i < pages.length; i++) {
					if(pages[i].children != null && pages[i].children != undefined && pages[i].key == tree){
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
						if(pages[i].children != null && pages[i].children != undefined){
							pages.children = pushPage(pages[i].children) || null;
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
            delete state.pageList['children'];
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
            state.pageList = params.UIState.pageList;
            state.currentActivePageListItem = params.UIState.currentActivePageListItem;
            state.activePage = params.UIState.activePage;
			return { ...state};
		},

		setActivePage(state, { payload: params }) {
			state.activePage = params.activePage;
			return {...state};
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
  			var activePage = yield select(state => state.vdCtrlTree.activePage.key);
  			yield put({
  				type: 'vdCtrlTree/handleElemAdded',
  				payload: {
  					ctrl,
  					activePage
  				}
  			});
  		},
        *savePage({payload: key}, {call, put, select}){

            var pages = yield select(state=> state.vdpm.pageList),
                page;
            let getPageInfoByKey = function(pages){
				for (var i = 0; i < pages.length; i++) {
					if(pages[i].key == key){
						page = pages[i];
                        break;
					}
				}
				for (var i = 0; i < pages.length; i++) {
					if(pages[i].children != null && pages[i].children != undefined){
						getPageInfoByKey(pages[i].children);
					}
				}
			}

            //根据当前key 遍历获取编辑页面的数据
			getPageInfoByKey(pages);

            //获取元素数据

            //请求后台文件文件写入

            var result = yield request('vd', {
                method: 'POST',
                body: JSON.stringify({
                    page: page,
                    project: localStorage.dir + page.key
                })
            });

        },
        *removeFile({payload: fileName}, {call, put, select}) {

            var key = yield select(state=> state.vdpm.currentActivePageListItem);
			var result = yield request('fs/remove', {
				method: 'POST',
				body: JSON.stringify({
					fileName: localStorage.dir + key
				})
			});
      		yield put({type: 'deletePage'});
      	},
	}

}
