import dva from 'dva';
import VDPackager from '../vdsite/VDPackager.js';
import { message , notification} from 'antd';
import request from '../../utils/request.js';
import initUIState from '../../utils/initUIState'
import initData from '../../utils/initData'

import uuid from 'node-uuid';
import _md5 from 'md5';
import config from '../../configs.js';
import { Modal } from 'antd';


export default {
	namespace: 'templateStore',

	state: {
		loadnumber:4,
		pageSize: 4,
		weChatLink: placeholderImgBase64,
		visible:false,
		pay: 'weChat',
		wechat: 'http://www.baidu.com',
		alipay:'http://www.baidu.com',
		selectTemplateValue: '',
		types: [],
		query: '',
		isLoading: false,
		review: false,
		create: false,
		isShow: false,
		reviewUrl: '',
		templateAttr:[],
		tips: '请耐心等待...',
		createForm: {
			name: '',
			layout: '',
			loading: false
		},
		available: false,
		selectId: ''
	},

	reducers: {
		setSelectTemplateValue(state, {payload: value}) {
			state.selectTemplateValue = value;
			return {...state}
		},

		loadnumberAdd(state) {
			state.loadnumber = state.loadnumber + 4;
			return {...state}
		},
		initLoadingNum(state) {

			state.loadnumber = 4;
			return {...state};
		},
		changeBuyTemplateVisible(state, { payload: params}) {

			console.log(params);
			state.templateAttr[params.index].buyTemplateVisible = params.visible
			return {...state}
		},
		changeTemplateStoreVisible(state, { payload: params}) {
			state.visible = params
			return {...state}
		},

		buyTemplate(state, { payload: params}) {
			state.templateAttr[params].isBuy = true;
			return {...state}
		},

		changePay(state, { payload: params}) {
			state.pay = params;
			return {...state}
		},
		hanleLoading(state, {payload: value}){

			console.log('isLoading');
			console.log(value);
			state.isLoading = value;
			return {...state};
		},
		setTypesAndTemplates(state, {payload: params}){

			console.log('setTypesAndTemplates');
			console.log(params);
			for (var i = 0; i < params.templates.length; i++) {
				if(params.templates[i].creator == localStorage.user){
					params.templates[i].visible = false;
				}else {
					params.templates[i].visible = true;
				}
			}
			console.log(params);
			state.templateAttr =  params.templates;
			state.types = params.types;
			return {...state};
		},
		setQuery(state, {payload: query}){
			state.query = query;
			return {...state};
		},
		initPay(state, {payload: params}){

			state.alipay = params.alipay;
			state.wechat =  params.wechat;
			return {...state};
		},
		reviewTemplate(state, {payload: params}){

			console.log(params);
			state.review = true;
			state.reviewUrl = params.src || params.url;
			return {...state};
		},
		hideReviewTemplate(state){

			state.review = false;
			return {...state};
		},
		hideCreateTemplate(state,{payload: params}){

			state.create = !state.create;
			return {...state}
		},
		handleCreateTemplate(state,{payload: params}){

			state.selectId = params.item;
			state.create = true;
			return {...state}
		},
		valueChange(state, {payload: value}){

			state.createForm.name = value;
			return {...state};
		},
		handleCreatLoading(state, {payload: value}){

			state.createForm.loading = value;
			if(value = false){
				state.tips = '请耐心等待...'
			}
			return {...state};
		},
		handleTips(state, {payload: value}){

			state.tips = value;
			return {...state};
		},
		setProjectNameAvailabel(state, {payload: value}){

			state.available = value;
			return {...state};
		},
		handleShow(state, { payload: value}){

			state.isShow = value;
			return {...state};
		}
	},
	effects:{
		*initTypesAndTemplates({payload: params}, {call, select, put}){

			yield put({
				type: 'hanleLoading',
				payload: true
			});
			var types = yield request('types/?parent=vd.type', {
				method: 'get',
			});
			var templates = yield select(state=> state.templateStore.templateAttr);
			var limit = yield select(state=> state.templateStore.pageSize);
			console.log(templates);
			if(templates.length <= 0){
				templates = yield request('templates/?cur=1&limit=' + limit + '&creator=' + localStorage.user, {
					method: 'get',
				});
				templates = templates.data.fields;
			}
			yield put({
				type: 'hanleLoading',
				payload: false
			});
			yield put({
				type: 'setTypesAndTemplates',
				payload: {
					types: types.data.fields,
					templates: templates
				}
			})

			yield put({
				type: 'initLoadingNum'
			});
			yield put({
				type: 'handleShow',
				payload: false
			});
		},
		*flashTemplates({payload: type}, {call, select, put}){

			yield put({
				type: 'hanleLoading',
				payload: true
			});
			var templates = yield select(state=> state.templateStore.templateAttr);
			var limit = yield select(state=> state.templateStore.pageSize);
			var query = yield select(state=> state.templateStore.query);


			var types = yield select(state=> state.templateStore.types);
			var cur = Math.ceil((templates.length + limit) / limit);

			var result = yield request('templates/?cur=' + cur + '&limit=' + limit + '&creator=' + localStorage.user+ query, {
				method: 'get',
			});
			console.log(result);
			for (var i = 0; i < result.data.fields.length; i++) {
				templates.push(result.data.fields[i])
			}
			console.log(result.data.length);
			if(result.data.fields.length == 0){
				yield put({
					type: 'handleShow',
					payload: true
				});
			}else {
				yield put({
					type: 'handleShow',
					payload: false
				});
			}
			yield put({
				type: 'hanleLoading',
				payload: false
			});
			yield put({
				type: 'setTypesAndTemplates',
				payload: {
					types: types,
					templates: templates
				}
			})
		},
		*searchTemplate({payload: value }, {call, select, put}){

			yield put({
				type: 'hanleLoading',
				payload: true
			});
			var limit = yield select(state=> state.templateStore.pageSize);
			var templates = yield select(state=> state.templateStore.templateAttr);
			var types = yield select(state=> state.templateStore.types);

			yield put({
				type: 'initLoadingNum'
			});
			var query = '&likeq=' + value;

			templates = yield request('templates/?cur=1&limit=' + limit + '&creator=' + localStorage.user + query, {
				method: 'get',
			});
			templates = templates.data.fields;
			yield put({
				type: 'hanleLoading',
				payload: false
			});
			yield put({
				type: 'setTypesAndTemplates',
				payload: {
					templates: templates,
					types: types
				}
			})
			yield put({
				type: 'setQuery',
				payload: query,
			})
			yield put({
				type: 'handleShow',
				payload: false
			});

		},
		*setSelectTagValue({payload: type}, {call, select, put}) {

			console.log(type);
			yield put({
				type: 'hanleLoading',
				payload: true
			});
			var limit = yield select(state=> state.templateStore.pageSize);
			var templates = yield select(state=> state.templateStore.templateAttr);
			var types = yield select(state=> state.templateStore.types);

			var query = '';
			if(type.key == 'all'){

			}else if(type.key == 'mine'){
				query = query + '&owner=' + localStorage.user;
			}else if (type.key == 'free') {
				query = query + '&price=0';
			}else {
				query = query + '&type=' + type.key;
			}

			templates = yield request('templates/?cur=1&limit=' + limit + '&creator=' + localStorage.user + query, {
				method: 'get',
			});
			templates = templates.data.fields;
			console.log(templates);
			yield put({
				type: 'setTypesAndTemplates',
				payload: {
					templates: templates,
					types: types,
				}
			})
			yield put({
				type: 'hanleLoading',
				payload: false
			});
			yield put({
				type: 'setQuery',
				payload: query,
			})
			yield put({
				type: 'handleShow',
				payload: false
			});
		},
		*addOrders({payload: params}, {call,select, put}){


			var result = yield request('orders/?creator='+localStorage.user + '&products=' + params.id, {
				method: 'get',
			});
			var alipay = '',
				wechat = '';
			console.log(result);

			if(result.data.fields.length < 1){
				var order = {
					creator: localStorage.user,
					name: '模板购买',
					orderNo:  _md5(uuid.v4()),
					timeSize: 1,
					timeUnit: "个",
					products: params.id,
					price: params.price,
					unitPrice: params.price,
					type: 'template'
				}

				result = yield request('orders', {
					method: 'POST',
					body: JSON.stringify(order)
				})
				console.log(result);
				alipay = result.data.fields.alipay;
				wechat = result.data.fields.wechat;
			}else {
				alipay = result.data.fields[0].alipay;
				wechat = result.data.fields[0].wechat;
			}
			yield put({
				type: 'initPay',
				payload: {
					alipay: alipay,
					wechat: wechat,
				}
			})
		},
		*checkProjectAvailable( { payload: params }, { call, put, select }) {

			var available = true;
			var url = 'applications/validator?name=' + params.name + '&userName=' + localStorage.userName + '&creator=' + localStorage.user;

			var result = yield request(url, {
				method: 'get',
			});
			if(result.data.code == 1){
				available = true;
			}else{
				available = false;
			}
			yield put({
				type: 'setProjectNameAvailabel',
				payload: available
			});

			if(!available) {
				notification.open({
					message: params.name + '与已有项目重复，请重新填写'
				});
			}

		},
		*createApp({payload: params}, {call, select, put}){
			console.log(params);
			yield put({
				type: 'handleCreatLoading',
				payload: true,
			})

			var createForm = yield select(state=> state.templateStore.createForm);
			var selectId = yield select(state=> state.templateStore.selectId);
			console.log(createForm);
			var form ={
				name: createForm.name,
				git: '',
				fromGit: false,
				languageType: "vd:latest",
				languageVersion: '',
				databaseType: '',
				password: '',
				dbUser: '',
				framework: "vd:site",
				creator: localStorage.user
			};
			const showConfirm = (data) => {
				Modal.error({
					title: '服务器提了一个问题',
					content: '创建失败，请重试,' + data.message
				});
			}

			const errorHandler = (response) => {
				if (response.status >= 200 && response.status < 300) {
					return response;
				}
				return {
					data: {
						message: '服务器提了一个问题',
						code: 500
					}
				};
			}

			const parseJSON = (response) => {
				return response.json();
			}

			const taskHandler = (data) => {

				if(data.code == 200 || data.code == 1) {
					if(data.message != null) {
						message.success(data.message);
					}
				}else {
					if(typeof data.length == 'number') {
						return {
							data: data
						};
					}
					return {
						data: {
							message: '服务器提了一个问题' + data.message,
							code: 500
						}
					};
				}

				return {
					data: data
				};
			}

			var url = 'applications';
			var result = yield fetch(config.baseURL + url, {
			   'headers': { 'Authorization': localStorage.token },
				method:'POST',
				body: JSON.stringify(form),
			})
			.then(errorHandler)
			.then(parseJSON)
			.then(taskHandler)
			.catch(errorHandler);

			if(result.data.code == 1){
				yield put({
					type: 'setAppCreatorCompleted'
				});
				yield put({
					type: 'hideModalNewApp',
				});

				notification.open({
					message: '创建应用成功，即将加加载新项目....',
					title: '创建应用'
				});

				window.location.hash = 'project/' + result.data.fields.id;
				initData(params.ctx, result.data.fields.id);
				yield request('vdsite/static?creator=' + localStorage.user + '&template=' + selectId.application +'&folder=' + result.data.fields.docker.replace('gospel_project_', '') + '&host=' + localStorage.host ,{
					method: 'GET'
				});
				//window.location.reload();
				props.dispatch({
	                type: 'sidebar/getDomains'
	            })

				yield put({
					type: 'handleTips',
					payload: '正在初始化应用'
				})
				var data = yield request('templates/' + selectId.id,{
					method: 'GET'
				});

				yield put({
					type: 'handleCreatLoading',
					payload: false,
				})
				yield put({
					type: 'hideCreateTemplate',
				})

				yield put({
					type: 'changeTemplateStoreVisible',
					payload: false
				});
				console.log(data);
				data.data.fields.content = data.data.fields.content.replace(new RegExp(selectId.url, 'gm'), 'http://' + localStorage.domain);
				console.log(data.data.fields);
				var UIState = JSON.parse(data.data.fields.content);
				console.log(UIState);
				console.log(result.data.fields.id);
				UIState.applicationId = result.data.fields.id;
				console.log(UIState);
				initUIState(params.ctx, result.data.fields.id, UIState);

			}else {

				showConfirm(result.data);

			}

			yield put({
				type: 'handleCreatLoading',
				payload: false,
			})

		}
	}
}
