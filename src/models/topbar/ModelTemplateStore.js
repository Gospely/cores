import dva from 'dva';
import VDPackager from '../vdsite/VDPackager.js';
import { message } from 'antd';
import request from '../../utils/request.js';

export default {
	namespace: 'templateStore',

	state: {
		loadnumber:4,
		weChatLink: placeholderImgBase64,
		visible:false,
		pay: 'weChat',
		types: [],
		templateAttr:[],
	},

	reducers: {

		loadnumberAdd(state) {
			state.loadnumber = state.loadnumber+4;
			return {...state}
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
			state.types = params.types;
			state.templateAttr =  params.templates
			return {...state};
		}
	},
	effects:{
		*initTypesAndTemplates({payload: params}, {call, select, put}){
			var types = yield request('types/?parent=vd.type', {
				method: 'get',
			});
			var templates = yield select(state=> state.templateStore.templateAttr);
			var limit = yield select(state=> state.templateStore.loadnumber);
			console.log(templates);
			if(templates.length <= 0){
				templates = yield request('templates/?cur=1&limit=' + limit + '&show=id_name_price_description_type_author_url', {
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
		},
		*flashTemplates({payload: parmas}, {call, select, put}){

			console.log(flashTemplates);
		},
		*setSelectTagValue({payload: parmas}, {call, select, put}) {

			// var query =
		},
	}
}
