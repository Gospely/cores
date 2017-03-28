import dva from 'dva';
import VDPackager from '../vdsite/VDPackager.js';
import { message } from 'antd';
import request from '../../utils/request.js';

export default {
	namespace: 'templateStore',

	state: {

		weChatLink: placeholderImgBase64,
		visible:false,
		pay: 'weChat',
		templateAttr:[{
					imgUrl: placeholderImgBase64,
					name: 'Evento',
					price: '￥49',
					author: '张三',
					introduceText: '习近平指出，中尼友好合作符合两国和两国人民的根本利益。当前，中尼关系深入发展。两国保持了政府、政党等各层级密切往来，稳步推进互联互通、灾后重建、基础设施、人文交流等领域合作。我对此感到高兴。双方要继续一道努力，维护中尼关系发展积极势头，开创中尼友好合作新局面。',
					isBuy: false,
					buyTemplateVisible: false,
					weChatLink: placeholderImgBase64,
					tag: {
						free: '免费',
					}
				},{
					imgUrl: placeholderImgBase64,
					name: 'Evento2',
					price: '￥39',
					author: '张三2',
					introduceText: '习近平指出，中尼友好合作符合两国和两国人民的根本利益。当前，中尼关系深入发展。两国保持了政府、政党等各层级密切往来，稳步推进互联互通、灾后重建、基础设施、人文交流等领域合作。我对此感到高兴。双方要继续一道努力，维护中尼关系发展积极势头，开创中尼友好合作新局面。',
					isBuy: false,
					buyTemplateVisible: false,
					weChatLink: placeholderImgBase64,
					tag: {
						free: '免费',
					}
				}],
	},

	reducers: {
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
		}
	}
}