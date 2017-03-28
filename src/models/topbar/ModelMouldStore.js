import dva from 'dva';
import VDPackager from '../vdsite/VDPackager.js';
import { message } from 'antd';
import request from '../../utils/request.js';

export default {
	namespace: 'mouldStore',

	state: {
		visible:false,
		mouldAttr:{
			imgUrl: placeholderImgBase64,
			name: 'Evento',
			price: '$49',
			author: 'xxx'
		}
	},

	reducers: {
		changeMouldStoreVisible(state, { payload: parmas}) {
			state.visible = parmas
			return {...state}
		}
	}
}