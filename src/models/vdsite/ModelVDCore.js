import React , {PropTypes} from 'react';
import dva from 'dva';

import { message } from 'antd';

export default {
	namespace: 'vdcore',
	state: {
		customAttr: {
			visible: false
		},

		linkSetting: {
			list: [{
				tip: '跳转到一个链接',
				icon: 'link',
				value: 'link',
				tpl: ''
			}, {
				tip: '跳转到一个邮箱',
				icon: 'mail',
				value: 'mail',
				tpl: ''
			}, {
				tip: '跳转到一个手机',
				icon: 'phone',
				value: 'phone',
				tpl: ''
			}, {
				tip: '跳转到一个页面',
				icon: 'file',
				value: 'page',
				tpl: ''
			}, {
				tip: '跳转到一个元素',
				icon: 'menu-unfold',
				value: 'section',
				tpl: ''
			}],

			activeLinkType: 0,
			actvieValue: 'link'
		},

		customAttr: {
			creator: {
				key: '',
				value: ''
			}
		},

		columnSlider: {
			count: 2,

			columns: [{
				span: 12,
				value: 6
			}, {
				span: 12,
				value: 6
			}]
		}

	},

	subscriptions: {

		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
	      		dispatch({
	      			type: 'initSessionActiveLinkType'
	      		})
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

		initSessionActiveLinkType(state, { payload: value }) {
			sessionStorage.currentActiveLinkType = value;
			return {...state};
		},

		handleLinkSettingTypeChange(state, { payload: value }) {
			state.linkSetting.actvieValue = value;
			sessionStorage.currentActiveLinkType = value;

			for (var i = 0; i < state.linkSetting.list.length; i++) {
				var list = state.linkSetting.list[i];
				if(list.value == value) {
					state.linkSetting.activeLinkType = i;
				}
			};

			return {...state};
		},

		handleCustomAttrCreatorInputChange(state, { payload: params }) {
			state.customAttr.creator[params.attrName] = params.value;
			return {...state};
		},

		handleColumnCountChange(state, { payload: params }) {
			if([5, 7, 8, 9, 10, 11].indexOf(parseInt(params.value)) != -1) {
				message.error('只能输入1, 2, 3, 4, 6和12');
				return {...state};
			}

			if(params.value < 1 || params.value > 12) {
				if(params.value != '') {
					message.error('栅格数不能超过12，且不能小于1');						
					return {...state};
				}
			}

			state.columnSlider.count = params.value;
			var tmpColumns = [];

			for (var i = 0; i < state.columnSlider.count; i++) {
				var tmpColumn = {
					span: 24 / params.value,
					value: 24 / params.value / 2
				};
				tmpColumns.push(tmpColumn);
			};

			console.log(tmpColumns);

			state.columnSlider.columns = tmpColumns;
			return {...state};
		}
	}

}