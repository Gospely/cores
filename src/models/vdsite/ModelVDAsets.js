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

				console.log("setup");
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
			console.log(images);
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
			console.log(fileList);
			fileList = fileList.data;
			console.log(fileList);
			var images = new Array();
			for (var i = 0; i < fileList.length; i++) {
				images.push({
					uid: fileList[i].id,
					name: fileList[i].text,
					status: 'done',
					url: 'http://' + localStorage.domain + '/images/' + fileList[i].text
				});
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
				return fetch('http://api.gospely.com/fs/image/upload',{
	      			method:'POST',
	      			//mode: "no-cors",
					headers: {
						"Content-Type": "application/json;charset=UTF-8",
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
				headers: {
					"Content-Type": "application/json;charset=UTF-8",
					'Authorization': localStorage.token
				},
				body: JSON.stringify({
					fileName: localStorage.dir + 'images/' + fileName
				})
			});
      		yield put({type: 'fetchFileList'});
			yield put({type: 'setUploadComplete'});
		}
	}

}
