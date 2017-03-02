import React , {PropTypes} from 'react';
import dva from 'dva';

import request from '../../utils/request.js';

import { message, Modal } from 'antd';
const confirm = Modal.confirm;

import VDPackager from './VDPackager.js';

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
			}],

			decreaseTable: {
				'1': 0,
				'2': 1,
				'3': 1,
				'4': 1,
				'6': 2,
				'12': 6,
				'11': 5
			},

			increseTable: {
				'1': 1,
				'2': 1,
				'3': 1,
				'4': 2,
				'6': 6,
				'12': 0,
				'11': 1
			}
		},

		VDDesigner: {

			activeSize: 'pc',

			pc: {
				width: '100%',
				height: '100%'
			},

			verticalTablet:{
				width: '40%',
				height: '90%'
			},

			alignTablet: {
				width: '68%',
				height: '70%'
			},

			verticalPhone: {
				width: '23%',
				height: '70%'
			},

			alignPhone: {
				width: '40%',
				height: '38%'
			}
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

	effects: {

		*packAndDownloadVDSiteProject( { payload: params },  { call, put, select }) {
			var layout = yield select(state => state.vdCtrlTree.layout),
				pages = yield select(state => state.vdpm.pageList),
				css = yield select(state => state.vdstyles.cssStyleLayout);

			var struct = VDPackager.pack({layout, pages, css});

			message.success('请稍等，正在打包……');

			console.log(JSON.stringify(struct));

			var packResult = yield request('vdsite/pack', {
	  			method: 'POST',
	  			headers: {
					"Content-Type": "application/json;charset=UTF-8",
				},
	  			body: JSON.stringify(struct)
	  		});

	  		if(packResult.data.code == 200) {
				message.success('即将下载……');
		  		var fileSrc = packResult.data.fields;
		  		fileSrc = fileSrc.split('/');
		  		fileSrc = fileSrc.pop();
		  		window.open('http://api.gospely.com/vdsite/download/' + fileSrc);
	  		}
		},

		*columnCountChange({ payload: params }, { call, put, select }) {

			if (params.value !== '') {

				let invalid = [1, 2, 3, 4, 6, 12];
				if(invalid.indexOf(parseInt(params.value)) === -1) {
					message.error('只能输入1, 2, 3, 4, 6和12');
					return false;
				}

				if(params.value < 1 || params.value > 12) {
						message.error('栅格数不能超过12，且不能小于1');						
						return false;
				}

				//每个格子原来的配置数据
				let originalCtrl = yield select(state => state.vdctrl.controllers[0].content);
				let column;
				for(let i = 0; i < originalCtrl.length; i ++) {
					if (originalCtrl[i].key === 'columns') {
						column = originalCtrl[i].details.children[0];
						break;
					}
				}

				//找出当前活跃的栅格
				let currentRootVdid = yield select(state => state.vdCtrlTree.activeCtrl.root);
				let activePage = yield select(state => state.vdCtrlTree.activePage.key);
				let ctrlTree = yield select(state => state.vdCtrlTree.layout[activePage]);

				let findCtrlByVdId = function (ctrlTree,VdId) {
					
					for(let i = 0; i < ctrlTree.length; i ++) {
						if (ctrlTree[i].children) {
							let ctrl = findCtrlByVdId(ctrlTree[i].children, VdId);
							if (ctrl) {
								return ctrl;
							}
						}
						if (ctrlTree[i].vdid === VdId) {
							return ctrlTree[i];
						}
					}

				}

				let currentColums = findCtrlByVdId(ctrlTree, currentRootVdid);//当前的栅格

				let currentCount = currentColums.children.length;

					
				if (currentCount > params.value) {
					
					for(let i = params.value; i < currentCount; i ++){
						if (currentColums.children[i].children && currentColums.children[i].children.length !==0) {
							confirm({
			    			    title: '减少栅格',
			    			    content: '您确定要减少栅格数吗？后面栅格的内容将丢失',
			    			    onOk() {
									
			    			    },
			    			    onCancel() {
			    			    	return false;
			    			    },
			    			});
						}
					}
				}

				yield put({
					type: 'vdCtrlTree/handleColumnCountChange',
					payload: {
						value: params.value,
						column
					}
				})
				
			}
			yield put({
				type: 'handleColumnCountChange',
				payload: {
					value: params.value
				}
			})
			
		}
	},

	reducers: {

		changeVDSize(state, { payload: params }) {
			state.VDDesigner.activeSize = params.VDSize;
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
			if(params.value < 1 || params.value > 12) {
				if(params.value != '') {
					message.error('栅格数不能超过12，且不能小于1');						
					return {...state};
				}
			}

			state.columnSlider.count = params.value;
			var tmpColumns = [];

			var span = (24 / params.value).toString();
			span = span.split('.');
			span = parseInt(span[0]);

			var value = (12 / params.value).toString();
			value = value.split('.');
			value = parseInt(value[0]);

			for (var i = 0; i < state.columnSlider.count; i++) {
				var tmpColumn = {
					span: span,
					value: value
				};
				tmpColumns.push(tmpColumn);
			};

			console.log(tmpColumns);

			state.columnSlider.columns = tmpColumns;

			return {...state};
		},

		shrinkLeftColumn(state, { payload: params }) {
			var increaseNum = state.columnSlider.increseTable[(state.columnSlider.columns[params.index].value).toString()],
				decreaseNum = state.columnSlider.decreaseTable[(state.columnSlider.columns[params.index].value).toString()];

			if(state.columnSlider.columns[params.index].value >= 0 && state.columnSlider.columns[params.index + 1].value < 12) {
				if(state.columnSlider.columns[params.index].value < 1) {
					state.columnSlider.columns[params.index].span = 2;
					state.columnSlider.columns[params.index].value = 1;
				}else {
					state.columnSlider.columns[params.index].span -= decreaseNum;
					state.columnSlider.columns[params.index].value -= decreaseNum;
					if(state.columnSlider.columns[params.index].value === 0) {
						state.columnSlider.columns[params.index].span = 2;
						state.columnSlider.columns[params.index].value = 1;
					}
				}

				state.columnSlider.columns[params.index + 1].span += decreaseNum;				
				state.columnSlider.columns[params.index + 1].value += decreaseNum;

			}

			return {...state};
		},

		expandLeftColumn(state, { payload: params }) {

			var increaseNum = state.columnSlider.increseTable[(state.columnSlider.columns[params.index].value).toString()],
				decreaseNum = state.columnSlider.decreaseTable[(state.columnSlider.columns[params.index].value).toString()];

			if(state.columnSlider.columns[params.index + 1].value >= 0 && state.columnSlider.columns[params.index].value < 12 ) {
				console.log('valid shrinkRightColumn', state.columnSlider.columns[params.index].value);
				if(state.columnSlider.columns[params.index].value >= 11) {
					state.columnSlider.columns[params.index].span = 22;
					state.columnSlider.columns[params.index].value = 11;

					state.columnSlider.columns[params.index + 1].span = 2;
					state.columnSlider.columns[params.index + 1].value = 1;

					console.log('>=11', state.columnSlider.columns);
				}else {
					state.columnSlider.columns[params.index].span += increaseNum;
					state.columnSlider.columns[params.index].value += increaseNum;

					state.columnSlider.columns[params.index + 1].span -= increaseNum;
					state.columnSlider.columns[params.index + 1].value -= increaseNum;

					if(state.columnSlider.columns[params.index].value === 12) {
						state.columnSlider.columns[params.index].span = 22;
						state.columnSlider.columns[params.index].value = 11;

						state.columnSlider.columns[params.index + 1].span = 2;
						state.columnSlider.columns[params.index + 1].value = 1;

					}
				}
			}
			return {...state};
		}

	}

}