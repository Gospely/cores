import React , {PropTypes} from 'react';
import dva from 'dva';
import { message, Modal } from 'antd';
import request from '../../utils/request';
import fetch from 'dva/fetch';

export default {
	namespace: 'vdassets',
	state: {
	    previewVisible: false,
	    previewImage: '',
		isUploading: false,
	    fileList: []
	},
	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(({ pathname }) => {
				if(localStorage.image == "vd:site"){
					dispatch({
						type: 'fetchFileList'
					});
				}
				return true;
			});
		}
	},
	reducers: {
		initState(state, { payload: params}){
			state.fileList = [];
			return {...state};
		},
		getInitialData(state, {payload: params}){
			state.fileList = [];
			return {...state};
		},
		handlePreview(state, { payload: params }) {
			state.previewImage = params.previewImage;
			state.previewVisible = params.previewVisible;
			return {...state};
		},

		handleChange(state, { payload: fileList }) {
			state.fileList = fileList;
			return {...state};
		},

		handleCancel(state) {
			state.previewVisible = false;
			return {...state};
		},
		list(state, {payload: images}){

			state.fileList = images;
			return {...state};
		},
		setUploading(state){

			state.isUploading = true;
			return {...state};
		},
		setUploadComplete(state){
			state.isUploading = false;
			return {...state};
		}

	},
	effects: {
		*fetchFileList(payload, {put, select}){
			console.log('fetchFileList');
			var fileList = yield request('fs/list/file?id=' + localStorage.dir + '/images');
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
			fileList = fileList.data;
			var images = new Array();
			for (var i = 0; i < fileList.length; i++) {
				if(fileList[i].text != '.gitkeep') {
					images.push({
						uid: fileList[i].id,
						name: fileList[i].text,
						status: 'done',
						url: 'http://' + localStorage.domain + '/images/' + fileList[i].text
					});
				}
			}
			yield put({ type: 'list', payload: images });
		},
		*uploadImage({payload: image}, {select, put}){

			yield put({type: 'setUploading'});
			var formdata = new FormData();
      		formdata.append('folder',localStorage.dir);
      		formdata.append('fileUp',image.file);
			formdata.append('remoteIp',localStorage.host);

			var result = yield upload(formdata);
			if(result.status == 200){
				// yield put({type: 'fetchFileList'});
				message.success('文件上传成功')
			}
			function upload(formdata){
				return fetch(localStorage.baseURL + 'fs/image/upload',{
	      			method:'POST',
	      			//mode: "no-cors",
					headers: {
						'Authorization': localStorage.token
					},
	      			body:formdata,
	      		})
			}
			yield put({ type: 'fetchFileList'});
			yield put({type: 'setUploadComplete'});
		},
		*deletImage({payload: fileName}, {select , put}){

			yield put({type: 'setUploading'});
			var mkResult = yield request('fs/remove', {
				method: 'POST',
				body: JSON.stringify({
					fileName: localStorage.dir + 'images/' + fileName
				})
			});
      		yield put({type: 'fetchFileList'});
			yield put({type: 'setUploadComplete'});
		}
	}

}
