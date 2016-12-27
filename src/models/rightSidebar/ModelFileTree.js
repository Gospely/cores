import dva from 'dva';
import request from '../../utils/request.js';
import randomWord from '../../utils/randomString.js';
import { message } from 'antd';
import fetch from 'dva/fetch';

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

export default {
	namespace: 'file',
	state: {
		treeData: [],
		files: [],
		root: true,
		isLeaf: true,

		focus: false,

		fileInfo :{},

		newFileInput: {
			value: '未命名',
			visible: false
		},

		newFolderInput: {
			value: '未命名',
			visible: false
		},

		uploadInput: {
			value: [],
			visible: false
		},

		searchInput: {
			value: '',
			visible: false
		},

		contextMenuStyles: {
		    position: 'fixed',
		    top: '',
		    left: '',
		    display: 'none'
		},

		renameModal: {
			visible: false,
			value: ''
		},
		saveModal: {
			visible: false,
			title: ''
		},
		newFileNameModal: {
			visible: false,
			value: '',
			title: ''
		},
		uploadModal: {
			visible: false,
			title: '上传文件',
			folderValue: '',
			needUnZip: false,
			isUnZip: false,
			unZiping: false,
		},
		searchFilePane: {
			visible: false,
			currentIndex: 0,
			currentFolder: '',
			files: [
				{text: 'index.js',id: 0},
				{text: 'readme.md',id: 1},
				{text: 'require.js',id: 2},
			],
			inputValue: ''
		},
		treeLoading: true
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {

	      	});
		}
	},

	effects: {
		*fetchFileList(payload, {call, put}) {
			yield put({
				type: 'setTreeLoadingStatus',
				payload: true
			});
  			var fileList = yield request('fs/list/file/?id=' + localStorage.dir);
			localStorage.currentFolder = localStorage.dir;
    		yield put({ type: 'list', payload: fileList });
			yield put({
				type: 'setTreeLoadingStatus',
				payload: false
			});
  		},

      	*fetchFileNode({payload: params}, {call, put}) {
      		const dirName = params.treeNode.props.eventKey;
      		var fileList = yield request('fs/list/file/?id=' + dirName);
      		yield put({ type: 'treeOnLoadData', payload: {
	      			fileList,
	      			dirName
	      		}
	      	});
      		params.resolve();
      	},

      	//上传文件
      	*fetchUploadFile({payload:info},{call, put, select}){
      		console.log("fetchUploadFile");
      		var formdata = new FormData();
      		formdata.append('username','zx');
      		formdata.append('projectName','node');
      		formdata.append('fileUp',info.file);
      		console.log('formdata:',formdata);
      		var result = fetch('http://localhost:8089/fs/upload',{
      			method:'POST',
      			//mode: "no-cors",
      			body:formdata,
      		}).then(function(response) {
		    console.log(response.headers);
		});
      	},

      	*mkdir({payload: dirName}, {call, put, select}) {
      		var val = yield select(state => state.file.newFolderInput.value);
      		var mkResult = yield request('fs/mkdir', {
      			method: 'POST',
      			body: JSON.stringify({
      				dirName: localStorage.currentFolder + val
      			})
      		});
      		yield put({type: 'fetchFileList'});
      		yield put({type: 'handleNewFolderInputVisible'})
      	},

      	*touch({payload: dirName}, {call, put, select}) {
      		var val = yield select(state => state.file.newFileInput.value);
		var mkResult = yield request('fs/write', {
    			method: 'POST',
    			body: JSON.stringify({
    				fileName: localStorage.currentFolder + val,
    				data: ''
    			})
      		});
      		yield put({type: 'fetchFileList'});
      	},

      	*renameFile({payload: params}, {call, put, select}) {
      		var val = yield select(state => state.file.renameModal.value);
		var mkResult = yield request('fs/rename', {
    			method: 'POST',
    			body: JSON.stringify({
    				fileName: localStorage.currentFolder + params.fileName,
    				newFileName: localStorage.currentFolder + val
    			})
      		});
      		yield put({type: 'fetchFileList'});
      	},

      	*removeFile({payload: fileName}, {call, put}) {
      		localStorage.isSave = true;
			var mkResult = yield request('fs/remove/', {
				method: 'POST',
				body: JSON.stringify({
					fileName: localStorage.currentFolder + fileName
				})
			});
      		yield put({type: 'fetchFileList'});
      	},

      	*rmdir({payload: dirName}, {call, put}) {
			var mkResult = yield request('fs/rmdir/', {
				method: 'POST',
				body: JSON.stringify({
					dirName: localStorage.currentFolder + dirName
				})
			});
      		yield put({type: 'fetchFileList'});
      	},

      	*mvFile({payload: params}, {call, put}) {
			var mkResult = yield request('fs/move/', {
				method: 'POST',
				body: JSON.stringify({
					fileName: localStorage.currentFolder + params.fileName,
					newFileName: params.newFileName,
					move: true
				})
			});
      		yield put({type: 'fetchFileList'});
      	},

      	*copyFile({payload: params}, {call, put}) {
			var mkResult = yield request('fs/copy/', {
				method: 'POST',
				body: JSON.stringify({
					file: localStorage.currentFolder + params.fileName,
					newFile: params.newFileName
				})
			});
      		yield put({type: 'fetchFileList'});
      	},

      	*readFile({payload: fileName}, {call, put, select}) {

      		let file = localStorage.currentFolder + fileName;

			let splits = file.split('/');
					// console.log(splits);
			file = file.replace(splits[0] + '/','');
					// console.log(content.fileName);
			file = file.replace(splits[1] + '/', localStorage.currentProject);

			let panes = yield select(state => state.devpanel.panels.panes);

			for(let i = 0; i < panes.length; i ++) {
				for(let j = 0; j < panes[i].tabs.length; j ++) {
					// console.log(panes[i].tabs[j])
					if (file === panes[i].tabs[j].file) {
						message.error('您已打开此文件!')
						yield put({
							type: 'devpanel/setActivePaneAndTab',
							payload: {
								paneKey: i + '',
								paneIndex: i,
								tabKey: j + 1 + '',
								tabIndex: j
							}
						})
						return false;
					}
				}
			}
			let editorId = randomWord(8,10);
			yield put({
				type: 'devpanel/add',
				payload: {
					type: 'editor',
					title: fileName,
					loading: true,
					file,
					editorId
				}
			})

			var readResult = yield request('fs/read', {
      			method: 'POST',
      			body: JSON.stringify({
      				fileName: localStorage.currentFolder + fileName,
      			})
      		});
      		let content = readResult.data
      		content = content.fields;
			

			yield put({
				type: 'devpanel/pushContentToEditors',
				payload: {
					content: content.content,
					loading: false,
					editorId
				}
			})

      	},

      	*writeFile({payload: params}, {call, put, select}) {

					var fileName = '';
					if(params.fileName == null){
						fileName = localStorage.currentSelectedFile;
					}else{
						fileName = params.fileName;
					}
					var mkResult = yield request('fs/write/', {
						method: 'POST',
						body: JSON.stringify({
							fileName: fileName,
							data: params.content
						})
					});
					console.log(params);
					yield put({type: 'fetchFileList'});

					var debug = yield select(state => state.devpanel.debug.value);
					if(debug){
						if(debug.alert){
							debug.postMessage({codeSaved: true},"*");
						}
					}
      	},

      	*handleSearch({payload: params}, {call, put, select}) {

					var files = yield select(state => state.files);
					if(localStorage.files == null || localStorage.files == undefined) {
						if(files ==null || files == undefined || files.length < 1){
							var url = "fs/list/all?id=" + localStorage.currentFolder;
							var res = yield request(url, {
				      			method: 'GET',
				      			});

							var result = res.data;
							for(var i = 0; i<res.data.length; i++){
								res.data[i].folder = res.data[i].id.replace(localStorage.currentFolder,localStorage.currentProject);
							}

							console.log(result);
							localStorage.files = JSON.stringify(result);
							yield put({type: 'showSearchPane',payload: {result}});
						}
					}else{

							var result = JSON.parse(localStorage.files);
							yield put({type: 'showSearchPane',payload: {result}});
					}

      	},

		*initFiles({payload: params}, {call, put, select}){
			var url = "fs/list/all?id=" + localStorage.currentFolder;
			var res = yield request(url, {
						method: 'GET',
						});

			var result = res.data;
			for(var i = 0; i<res.data.length; i++){
				res.data[i].folder = res.data[i].id.replace(localStorage.currentFolder,localStorage.currentProject + "/");
			}
			localStorage.files = JSON.stringify(result);
		},

      	*unZipFile({payload: params}, {call, put, select}) {
      		var folder = yield select(state => state.file.uploadModal.folderValue);
      		if (folder == '') {
      			message.error('请选择解压文件夹');
      			return;
      		}
      		yield put({type: 'switchUnZipState', payload: true});
      		var mkResult = yield request('fs/', {
      			method: 'POST',
      			body: folder
      		});
      		yield put({type: 'switchUnZipState', payload: false});
      		yield put({type: 'switchIsUnZip', payload: false});
      		yield put({type: 'switchIsNeedUnZip', payload: false});
      	}
	},

	reducers: {

		setTreeLoadingStatus(state,  { payload: bool}) {
			state.treeLoading = bool;
			return {...state};
		},

		showSearchPane(state,{payload:params}) {

			state.searchFilePane.visible = true;
			state.searchInput.visible = false;
			state.files = params.result;
			var newFiles = new Array();

			for(var i = 0; i<state.files.length; i++) {
				console.log("search");
				if(state.files[i].text.indexOf(state.searchInput.value) != -1){
					newFiles.push(state.files[i]);
				}
				if(newFiles.length>100){
					break;
				}
			}
			state.searchFilePane.files = newFiles;
			return {...state};
		},

		hideSearchPane(state) {
			state.searchFilePane.visible = false;
			return {...state};
		},

		searchPaneInputChange(state,{payload: value}){

			state.searchFilePane.inputValue = value;
			var newFiles = new Array();

			if(value != null && value != ''){
				for(var i = 0; i<state.files.length; i++) {
					if(state.files[i].text.indexOf(value) != -1){
						newFiles.push(state.files[i]);
					}
					if(newFiles.length > 100){
						break;
					}
				}
			}

			state.searchFilePane.files = newFiles;
			state.searchFilePane.visible = true;
			return {...state};
		},

		searchPrvFile(state) {
			let index = state.searchFilePane.currentIndex;
			let container = document.getElementById('toSetScroll');
			let acvOpt = document.getElementById('activeFileOption');
			if (acvOpt.offsetTop - container.scrollTop < 150 && container.scrollTop != 0) {
				container.scrollTop -= acvOpt.offsetHeight;
			}

			if (index > 0) {
				state.searchFilePane.currentIndex --;
			}
			state.searchFilePane.currentFolder = state.searchFilePane.files[index + 1].folder;
			return {...state}
		},

		searchNextFile(state) {
			let index = state.searchFilePane.currentIndex;
			let acvOpt = document.getElementById('activeFileOption');
			let container = document.getElementById('toSetScroll');
			if (index >= 4 && acvOpt.offsetTop - container.scrollTop >= acvOpt.offsetHeight * 4) {
				container.scrollTop = acvOpt.offsetHeight * (index - 4);
			}

			if (index < state.searchFilePane.files.length - 1) {
				state.searchFilePane.currentIndex ++;
			}
			state.searchFilePane.currentFolder = state.searchFilePane.files[index + 1].folder;
			return {...state}
		},

		showContextMenu(state, {payload: params}) {

			console.log(params.event.node);
			var evt = params.event.event;
			return {...state, contextMenuStyles: {
				display: 'block',
				position: 'fixed',
				top: params.event.event.clientY,
				left: params.event.event.clientX
			},root: params.root, isLeaf: !params.event.node.props.isLeaf  }
		},

		hideContextMenu(state) {
			if(state.contextMenuStyles.display != 'none') {
				return {...state, contextMenuStyles: {
					display: 'none',
					position: 'fixed',
					top: 0,
					left: 0
				}};
			}
			return {...state};
		},

		handleNewFileInputChange(state, {payload: val}) {
			return {...state, newFileInput: {
				value: val
			}};
		},

		handleNewFolderInputVisible(state) {
			console.log('handleNewFolderInputVisible');
			return {...state, newFolderInput: {
				visible: false,
				value: ''
			}};
		},

		handleNewFolderInputChange(state, {payload: val}) {
			return {...state, newFolderInput: {
				value: val,
				visible: true
			}};
		},
		handleSearchInputChange(state, {payload: val}) {
			state.searchInput.value = val;
			state.searchFilePane.inputValue = val;
			// state.searchFilePane.inputValue = val
			// console.log('seacrh');
			// console.log(state.files);
			// var result = state.files.find(function(item){
			//
			// 		if(item.children == false){
			// 			if(item.text == val){
			// 				return item;
			// 			}
			// 		}
			// });
			// console.log(result);
			// state.searchFilePane.files = result;
			return {...state};
		},
		handleUploadInputChange(state, {payload: info}) {
			console.log(info)
			if (info.file.status == 'done') {
				let suffix = info.file.name.split('.').pop();
				let compressionSuffix = ['rar','zip','cab','arj','lzh','ace','7-zip','tar','gzip','uue','bz2','jar','iso','z'];
				compressionSuffix.forEach(suf => {
				    if (suf == suffix) {
				        state.uploadModal.needUnZip = true;
				    }
				})
			}
			return {...state};
		},
		initFileInfo(state,{payload:info}){
			state.fileInfo=info;
			return {...state};
		},

		handleUploadFolderChange(state, {payload: val}) {
			state.uploadModal.folderValue = val;
			return {...state};
		},

		switchIsUnZip(state, {payload: checked}) {
			// alert(checked)
			state.uploadModal.isUnZip = checked;
			return {...state};
		},

		switchUnZipState(state, {payload: val}) {
			state.uploadModal.unZiping = val;
			return {...state};
		},

		switchIsNeedUnZip(state, {payload: val}) {
			state.uploadModal.needUnZip = val;
			return {...state};
		},

		hideRenameModal(state) {
			return {...state, renameModal: {
				visible: false
			}};
		},

		showRenameModal(state) {
			return {...state, renameModal: {
				visible: true
			}};
		},
		handleRenameInputChange(state, {payload: val}) {
			return {...state, renameModal: {
				value: val,
				visible: true
			}}
		},
		hideSaveModal(state) {
			return {...state, saveModal: {
				visible: false,
				showInput: false
			}};
		},

		hideUploadModal(state) {
			state.uploadModal.visible = false;
			return {...state}
		},

		showUploadModal(state) {
			state.uploadModal.visible = true;
			return {...state}
		},

		showSaveModal(state, {payload: params}) {


			console.log(params.targetKey);
			if(params.action == 'remove') {
				console.log("saveModal");
				return {...state, saveModal: {
					visible: true,
					title: '保存文件？'
				}};
			}else{
				return {...state, saveModal: {
					visible: false
				}};
			}

		},

		hideSaveModal(state) {
			return {...state, saveModal: {
				visible: false,
				showInput: false
			}};
		},

		showNewFileNameModal(state, {payload: params}) {

			if(params.type == 'editor') {
				console.log("saveModal");
				return {...state, newFileNameModal: {
					visible: true,
					value: localStorage.currentProject + '/',
					title: '您正在关闭一个文件，请确定是否保存？不保存请点击取消'
				}};
			}

		},
		hideNewFileNameModal(state) {
			return {...state, newFileNameModal: {
				visible: false,
				showInput: false
			}};
		},

		handleNewFileModelInputChange(state, {payload: val}) {
			console.log(val);
			return {...state, newFileNameModal: {
				value: val,
				visible: true,
				title: '请输入文件名'
			}}
		},

		write (state, {payload: key}) {
			return {...state, current: key};
		},

		list (state, {payload: list}) {

			var data = list.data,
				tree = [];

			if(list.length > 1) {
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

			return {...state, treeData: [{
				isLeaf: false,
				key: localStorage.dir,
				name: localStorage.currentProject,
				children: tree,
				original: {
					folder: 'null'
				}
			}]};
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

			var parentNode = findParentNode(state.treeData, parentDirName, 1);
			
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

			if(parentNode.node.key + '/' == parentDirName || parentNode.node.key == parentDirName) {
				childNode = generatorNode(files);
			}

			if(parentNode.index == undefined) {
				throw '不匹配的文件树'
			}

			parentNode.node.children = childNode;

			return {...state, treeData};
		},

		flashFiles(state,{payload: result}){
			console.log('falsh');
			state.files = result;
			return {...state};
		}
	}

}
