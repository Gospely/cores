import React , {PropTypes} from 'react';
import dva from 'dva';

import request from '../../utils/request.js';
import VDPackager from '../vdsite/VDPackager.js';

import { message, Modal } from 'antd';
const confirm = Modal.confirm;


export default {
	namespace: 'vdcore',
	state: {
		accessVisible: false,
		templateLoading: false,
		customAttr: {
			visible: false
		},
		TemplateType: [],
		TemplateSavingModal: {
			visible: false,
			confirmLoading: false,
			name: '',
			type: '',
			description:'',
			previewUrl: '',
			isFree: false,
			price: 0
		},
		loading: false,
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
				width: '768px',
				height: '1024px'
			},

			alignTablet: {
				width: '1024px',
				height: '768px'
			},

			verticalPhone: {
				width: '375px',
				height: '667px'
			},

			alignPhone: {
				width: '667px',
				height: '375px'
			}
		},

		rightTabsPane: {
			activeTabsPane: 'style',
			linkTo: ''
		},

		actions: {

			dom: {

				add: [],

				remove: [],

				move: [],

				attrEdited: []
			},

			css: {
				add: [],

				remove: [],

				propertyEdited: []
			},

			actionList: [{
				actionType: 'dom',
				actionName: 'add'
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

	effects: {

		*packAndDownloadVDSiteProject( { payload: params },  { call, put, select }) {

			var layout = yield select(state => state.vdCtrlTree.layout),
	            pages = yield select(state => state.vdpm.pageList),
	            css = yield select(state => state.vdstyles.cssStyleLayout),
	            currPage = yield select(state => state.vdpm.currentActivePageListItem),
	            interaction = yield select(state => state.vdanimations);

	        var struct = VDPackager.pack({layout, pages, css, interaction});

	        message.success('正在打包.....');
	        struct.folder = localStorage.dir;
			struct.isBeautify = true;

	        var packResult = yield request('vdsite/pack', {
	            method: 'POST',
	            headers: {
	                "Content-Type": "application/json;charset=UTF-8",
	            },
	            body: JSON.stringify(struct)
	        });
			console.log(packResult);
			window.open(localStorage.baseURL + 'vdsite/download?token=' + localStorage.token + '&folder=' + localStorage.dir + '&project=' + localStorage.currentProject)
		},
		*deploy({ payload: params }, { call, put, select }){

			var layout = yield select(state => state.vdCtrlTree.layout),
	            pages = yield select(state => state.vdpm.pageList),
	            css = yield select(state => state.vdstyles.cssStyleLayout),
	            currPage = yield select(state => state.vdpm.currentActivePageListItem),
	            interaction = yield select(state => state.vdanimations);

	        var struct = VDPackager.pack({layout, pages, css, interaction});

	        message.success('正在发布.....');
	        struct.folder = localStorage.dir;
			// struct.isBeautify = false;

	        var packResult = yield request('vdsite/pack', {
	            method: 'POST',
	            headers: {
	                "Content-Type": "application/json;charset=UTF-8",
	            },
	            body: JSON.stringify(struct)
	        });
			console.log(packResult);
			yield request('vdsite/deploy?folder=' + localStorage.dir, {
	            method: 'GET',
	        });
			yield put({
				type: 'handleAccessVisibleChange',
				payload: true,
			});

		},
		*initAddTemplatesFrom({ payload: params }, { call, put, select }){

			var types = yield request('types/?parent=vd.type', {
				method: 'get',
			});

			yield put({
				  type: 'changeTemplateSavingVisible',
				  payload: {
					  visible: true,
					  confirmLoading: false,
					  types: types.data.fields,
					  templateLoading: true
				  }
			});
		},
		*TemplateSaving( { payload: params },  { call, put, select }) {

			var layout = yield select(state => state.vdCtrlTree.layout),
				pages = yield select(state => state.vdpm.pageList),
				css = yield select(state => state.vdstyles.cssStyleLayout),
				currPage = yield select(state => state.vdpm.currentActivePageListItem),
				name = yield select(state => state.vdcore.TemplateSavingModal.name),
				src = yield select(state => state.vdcore.TemplateSavingModal.previewUrl),
				description = yield select(state => state.vdcore.TemplateSavingModal.description),
				type = yield select(state => state.vdcore.TemplateSavingModal.type),
				types = yield select(state => state.vdcore.TemplateType),
				isFree = yield select(state => !state.vdcore.TemplateSavingModal.isFree),
				price = yield select(state => state.vdcore.TemplateSavingModal.price),
				interaction = yield select(state => state.vdanimations);
			console.log('TemplateSaving', isFree);
			if(isFree){
				price = 0;
			}else {
				if(!isFree && !/^[1-9]\d*(\.\d+)?$/.test(price)){
					message.error('请输入大于 0 的价格');
					yield put({
						type: 'changeTemplateSavingVisible',
						payload: {
						   visible:true,
						   confirmLoading:false,
						   types: types
						}
					});
					return;
				}
			}
			console.log(name, description, type,price);
			if(name == '' || description == '' || type == ''){
				message.error('请完善表单');
				yield put({
					type: 'changeTemplateSavingVisible',
					payload: {
					   visible:true,
					   confirmLoading:false,
					   types: types
					}
				});
				return;
			}
			console.log(types);
			var struct = JSON.parse(localStorage.UIState);
			console.log(name);
			struct.creator = localStorage.user;
			struct.name = name;
			struct.description = description;
			struct.type = type;
			struct.price = price;
			struct.application = localStorage.applicationId;
			struct.src = src;
			struct.userName = localStorage.userName;
			struct.url = 'http://' + localStorage.domain;
			//struct.type = 'custom';
			var packResult = yield request('vdsite/template', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json;charset=UTF-8",
				},
				body: JSON.stringify(struct)
			});
			console.log(packResult);
			yield put({
				type: 'changeTemplateSavingVisible',
				payload: {
				   visible:false,
				   confirmLoading:false,
				   types: types
				}
			});
		},
		*getTemplate({ payload: params }, { call, put, select }){

			var packResult = yield request('templates/?cur=1&limit=1&application=' + localStorage.applicationId, {
				method: 'get',
			});
			console.log(packResult);

			if(packResult.data.fields.length > 0){
				yield put({
					type: 'initForm',
					payload: packResult.data.fields[0]
				});
			}else {
				yield put({
					type: 'initForm',
				});
			}

		},

		*changeVDSize({ payload: params }, { call, put, select }) {
			yield put({
				type: 'changeVDSizeA',
				payload: params
			});

			console.log(params);

			if(params.VDSize == 'pc') {
				yield put({
					type: 'vdstyles/setCurrentScreenSize',
					payload: {
						size: '100%'
					}
				});
				return false;
			}

			let cores = yield select(state => state.vdcore),
				vdstyles = yield select(state => state.vdstyles),
				vdCtrlTree = yield select(state => state.vdCtrlTree);

			let activeStyle = vdCtrlTree.activeCtrl.activeStyle;

			let VDDesignerActiveSize = cores.VDDesigner.activeSize,
				maxWidth = cores.VDDesigner[VDDesignerActiveSize].width;

			//改变屏幕大小，增加一个queryList，用户改变样式时，继承活跃类名的上级属性然后做出相应更改

			// yield put({
			// 	type: 'vdstyles/addMediaQuery',
			// 	payload: {
			// 		maxWidth: maxWidth
			// 	}
			// });

			yield put({
				type: 'vdstyles/addMediaQuery',
				payload: {
					maxWidth: maxWidth,
					style: {
						styleName: activeStyle,
						styles: vdstyles.cssStyleLayout[activeStyle]
					},
					unitList: vdstyles.unitList[activeStyle]
				}
			});

		},

		*columnCountChange({ payload: params }, { call, put, select }) {

			//生成对应栅格的格数 col 等
			let tmpColumns = [];
			let span = (24 / params.value).toString();
			span = span.split('.');
			span = parseInt(span[0]);

			let value = (12 / params.value).toString();
			value = value.split('.');
			value = parseInt(value[0]);

			for (var i = 0; i < params.value; i++) {
				var tmpColumn = {
					span: span,
					value: value
				};
				tmpColumns.push(tmpColumn);
			};

			// alert(params.value);

			if (params.value !== '') {

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

				//当减少格子数时判断被删的格子是否有子元素，有就询问
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
						column,
						tmpColumns,
						currentRootVdid
					}
				})

			}

			yield put({
				type: 'handleColumnCountChange',
				payload: {
					value: params.value,
					tmpColumns: tmpColumns
				}
			});

		}
	},

	reducers: {
		changeTemplateIsFree(state){
			state.TemplateSavingModal.isFree = !state.TemplateSavingModal.isFree;
			return {...state}
		},
		TemplateSavingPreviewUrl(state, { payload: params}){

			state.templateLoading = false;
			state.TemplateSavingModal.previewUrl = params;
			return {...state}
		},

		handleLoading(state, { payload: value}){

			state.loading = value;
			return {...state};
		},
		handleAccessVisibleChange(state, { payload: value}){

			state.accessVisible = value;
			return {...state};
		},
		initState(state, {payload: params}){

			// state.VDDesigner = params.UIState.VDDesigner || state.VDDesigner;
			// state.loading = false;
			return  {...state};
		},

		changeVDSizeA(state, { payload: params }) {
			state.VDDesigner.activeSize = params.VDSize;
			return {...state};
		},

		changeTabsPane(state, { payload: params }) {

			state.rightTabsPane.activeTabsPane = params.activeTabsPane;
			state.rightTabsPane.linkTo = params.linkTo;
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

			state.columnSlider.count = params.value;

			state.columnSlider.columns = params.tmpColumns;

			return {...state};
		},
		changeTemplateSavingVisible(state, { payload: params}) {
			state.TemplateSavingModal.visible = params.visible;
			state.TemplateSavingModal.confirmLoading = params.confirmLoading;
			state.TemplateType = params.types || state.TemplateType;
			state.templateLoading = params.templateLoading || false;
			return {...state}
		},
		changeTemplateSavingState(state, { payload: params }) {

			// state.TemplateSaving.key = params.key;
			// state.TemplateSaving.title = params.title;
			// state.TemplateSaving.iconType = params.iconType;
			state.TemplateSavingModal[params.target] = params.value;
			return {...state};
		},
		initForm(state, {payload: params}){
			console.log(params);
			if(params){
				state.TemplateSavingModal.name = params.name;
				state.TemplateSavingModal.price = params.price;
				state.TemplateSavingModal.description = params.description;
				state.TemplateSavingModal.type = params.type;
				state.TemplateSavingModal.isFree = (params.price != 0);
			}

			state.templateLoading = false;
			return {...state};
		}
	}

}
