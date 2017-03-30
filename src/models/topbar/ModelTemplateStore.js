import dva from 'dva';
import VDPackager from '../vdsite/VDPackager.js';
import { message } from 'antd';
import request from '../../utils/request.js';

export default {
	namespace: 'templateStore',

	state: {
		loadnumber:4,
		pageSize: 4,
		weChatLink: placeholderImgBase64,
		visible:false,
		pay: 'weChat',
		selectTemplateValue: '',
		types: [],
		query: '',
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
		changeBuyTemplateVisible(state, { payload: parmas}) {
			state.templateAttr[parmas.index].buyTemplateVisible = parmas.visible
			return {...state}
		},
		changeTemplateStoreVisible(state, { payload: parmas}) {
			state.visible = parmas
			return {...state}
		},

		buyTemplate(state, { payload: parmas}) {
			state.templateAttr[parmas].isBuy = true;
			return {...state}
		},

		changePay(state, { payload: parmas}) {
			state.pay = parmas;
			return {...state}
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
	},
	effects:{
		*initTypesAndTemplates({payload: params}, {call, select, put}){
			var types = yield request('types/?parent=vd.type', {
				method: 'get',
			});
			var templates = yield select(state=> state.templateStore.templateAttr);
			var limit = yield select(state=> state.templateStore.pageSize);
			console.log(templates);
			if(templates.length <= 0){
				templates = yield request('templates/?cur=1&limit=' + limit + '&show=creator_id_name_price_description_type_author_url', {
					method: 'get',
				});
				templates = templates.data.fields;
			}
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

			var templates = yield select(state=> state.templateStore.templateAttr);
			var limit = yield select(state=> state.templateStore.pageSize);
			var query = yield select(state=> state.templateStore.query);


			var types = yield select(state=> state.templateStore.types);
			var cur = Math.ceil((templates.length + limit) / limit);

			var result = yield request('templates/?cur=' + cur + '&limit=' + limit + '&show=creator_id_name_price_description_type_author_url'+ query, {
				method: 'get',
			});
			console.log(result);
			for (var i = 0; i < result.data.fields.length; i++) {
				templates.push(result.data.fields[i])
			}
			yield put({
				type: 'setTypesAndTemplates',
				payload: {
					types: types,
					templates: templates
				}
			})
		},
		*searchTemplate({payload: value }, {call, select, put}){

			var limit = yield select(state=> state.templateStore.pageSize);
			var templates = yield select(state=> state.templateStore.templateAttr);
			var types = yield select(state=> state.templateStore.types);

			yield put({
				type: 'initLoadingNum'
			});
			var query = '&likeq=' + value;

			templates = yield request('templates/?cur=1&limit=' + limit + '&show=creator_id_name_price_description_type_author_url' + query, {
				method: 'get',
			});
			templates = templates.data.fields;

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

			templates = yield request('templates/?cur=1&limit=' + limit + '&show=creator_id_name_price_description_type_author_url' + query, {
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
				type: 'setQuery',
				payload: query,
			})
		},
	}
}
