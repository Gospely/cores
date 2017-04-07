import dva from 'dva';
import VDPackager from '../vdsite/VDPackager.js';
import { message } from 'antd';
import request from '../../utils/request.js';
import uuid from 'node-uuid'
import _md5 from 'md5'

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
		review: '',
		reviewUrl: '',
		templateAttr:[],
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
				templates = yield request('templates/?cur=1&limit=' + limit + '&show=creator_id_name_price_description_type_author_url_src', {
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

			var result = yield request('templates/?cur=' + cur + '&limit=' + limit + '&show=creator_id_name_price_description_type_author_url_src'+ query, {
				method: 'get',
			});
			console.log(result);
			for (var i = 0; i < result.data.fields.length; i++) {
				templates.push(result.data.fields[i])
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

			templates = yield request('templates/?cur=1&limit=' + limit + '&show=creator_id_name_price_description_type_author_url_src' + query, {
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
				query = query + '&creator=' + localStorage.user;
			}else if (type.key == 'free') {
				query = query + '&price=0';
			}else {
				query = query + '&type=' + type.key;
			}

			templates = yield request('templates/?cur=1&limit=' + limit + '&show=creator_id_name_price_description_type_author_url_src' + query, {
				method: 'get',
			});
			templates = templates.data.fields;
			console.log(templates);
			yield put({
				type: 'setTypesAndTemplates',
				payload: {
					templates: templates,
					types: types
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
		}
	}
}
