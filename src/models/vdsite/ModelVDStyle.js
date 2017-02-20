import React , {PropTypes} from 'react';
import dva from 'dva';
import { Icon, message } from 'antd';

var styleAction = {

	findCSSPropertyByProperty: function(stylesList, property) {
		for(var prop in stylesList) {
			var currrentStyleProperty = stylesList[prop];
			if(typeof currrentStyleProperty == 'string' || typeof currrentStyleProperty.length != 'undefined') {
				if(prop == property) {
					return stylesList;
				}
			}else {
				return styleAction.findCSSPropertyByProperty(currrentStyleProperty, property);
			}
		}
	}

}

export default {
	namespace: 'vdstyles',
	state: {

		specialStyleProperty: ['border-advance', 'shadows-advance', 'effects-advance', 'tt-advance', 'border-radius-advance'],
		propertiesNeedRec: ['border-advance', 'shadows-advance', 'effects-advance', 'tt-advance', 'border-radius-advance', 'width-height', 'font-more'],

		stylesList: {
		    ".body":{
		        "height": "100%"
		    },
		    ".designer-wrapper": {
		        "width": "100%",
		        "background": "url(./assets/preview_device_bg.png)",
		        "overflow": "auto"
		    },
		    ".designer-header": {
		        "padding-right": "10px",
		        "padding-left": "10px",
		        "padding-top": "5px",
		        "padding-bottom": "5px",
		        "background": "#fff"
		    },
		    ".dynamic-delete-button": {
		        "cursor": "pointer",
		        "position": "relative",
		        "top": "4px",
		        "font-size": "24px",
		        "color": "#999",
		        "transition": "all .3s"
		    },
		    ".vd-right-panel": {
		        "height": "100vh"
		    },
		    ".vd-right-panel .ant-tabs": {
		        "height": "100%"
		    },
		    ".vd-right-panel .ant-tabs-content": {
		        "height": "e(\"calc(100vh - 39px)\")"
		    },
		    ".vd-right-panel .ant-tabs-tab": {
		        "margin-right": "0!important",
		        "padding-left": "16px!important",
		        "padding-right": "16px!important",
		        "padding-top": "10px!important",
		        "padding-bottom": "9px!important"
		    }
		},

		borderSetting: {
			border: {
				propertyName: 'border',
				width: '',
				color: ''
			},

			borderRadius: {
				propertyName: 'border-radius',
				borderRadius: ''
			}
		},

		backgroundSetting: {
			backgroundSize: {
				width: '',
				height: '',
				cover: false,
				contain: false
			},

			backgroundImage: {
				fileInfo: []
			}
		},

		boxShadow: {
			hShadow: {
				value: '',
				attrName: 'hShadow',
				units: ['px'],
				activeUnit: 'px',
				type: 'sliderInput'
			},

			vShadow: {

			},

			blur: {

			},

			spread: {

			},

			color: {

			},

			inset: {

			}
		},

		cssStyleLayout: {
			body: {
				display: '',
				width: '',
				height: '',
				'max-width': '',
				'min-width': '',
				'max-height': '',
				'min-height': '',
				float: '',
				overflow: '',
				clear: '',
				position: '',
				'font-family': '',
				color: '',
				'font-weight': '',
				'font-style': '',
				'text-indent': '',
				'font-size': '',
				'line-height': '',
				'text-align': '',
				'write-mode': '',
				'text-decoration': '',
				'text-transform': '',
				background: {
					'background-width': '',
					'background-color': '',
					'background-size': ['', '', false, false],
					'background-position': '',
					'background-image': '',
					'background-color': '',
					'background-repeat': '',
					'background-attachment': ''
				},
				border: {

				},

			}
		},

		cssStyleList: {
			display: '',
			width: '',
			height: '',
			'max-width': '',
			'min-width': '',
			'max-height': '',
			'min-height': '',
			float: '',
			overflow: '',
			clear: '',
			position: '',
			'font-family': '',
			color: '',
			'font-weight': '',
			'font-style': '',
			'text-indent': '',
			'font-size': '',
			'line-height': '',
			'text-align': '',
			'write-mode': '',
			'text-decoration': '',
			capitalize: '',
			'background-color': ''
		},

		cssStates: [{
			key: 'none',
			name: '无状态'
		}, {
			key: 'hover',
			name: '悬浮'
		}, {
			key: 'pressed',
			name: '按下'
		}, {
			key: 'focused',
			name: '聚焦'
		}],

		activeCSSState: 'none',
		activeCSSStateName: '无状态',

		newStyleName: '',
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
	      		dispatch({
	      			type: 'appendStyleIntoOfficialStyle'
	      		});
	      	});
		}
	},

	effects: {

		*handleStylesChange(params, { call, put, select }) {
			var activeCtrl = yield select(state => state.vdCtrlTree.activeCtrl),
				activeCtrlCustomClass = activeCtrl.customClassName;

			yield put({
				type:"changeStyle",
				payload: {
					className: params.className,
					value: params.value,
					property: params.property
				}
			});
		},

		*handleClassChange({ payload: params }, { call, put, select }) {
			var activeCtrl = yield select(state => state.vdCtrlTree.activeCtrl),
				activeCtrlCustomClass = activeCtrl.customClassName;

			yield put({
				type: "vdCtrlTree/changeCustomClass",
				payload: params
			});

		}

	},

	reducers: {

		handleCSSStateChange(state, { payload: params }) {
			state.activeCSSState = params.selectedKeys;
			state.activeCSSStateName = params.stateName;
			return {...state};
		},

		appendStyleIntoOfficialStyle(state) {

			// for (var i = 0; i < state.cssPropertyState.length; i++) {
			// 	var cssProperty = state.cssPropertyState[i];
			// 	cssProperty.cssProperty = state.cssPropertyList;
			// };

			// console.log('appendStyleIntoOfficialStyle', state.cssPropertyState);

			return {...state};
		},

		changeBorderPosition(state, { payload: params }) {
			const prevBorderPosition = state.borderSetting.border.propertyName;
			state.borderSetting.border.propertyName = params.position;
			var activeStyle = state.stylesList['.' + params.activeStyleName];

			//清除其它border类型，并根据现有propertyName重新生成样式

			for(var property in activeStyle) {
				if(property.indexOf(prevBorderPosition) != -1) {
					activeStyle[property] = '';
					delete state.stylesList['.' + params.activeStyleName][property];
					delete activeStyle[property];
				}
				activeStyle[params.position + '-width'] = state.borderSetting.border.width;
				activeStyle[params.position + '-color'] = state.borderSetting.border.color;
			}

			return {...state};
		},

		changeBorderRadiusPosition(state, { payload: params }) {
			const prevBorderPosition = state.borderSetting.borderRadius.propertyName;
			state.borderSetting.borderRadius.propertyName = params.position;
			var activeStyle = state.stylesList['.' + params.activeStyleName];

			//清除其它border类型，并根据现有propertyName重新生成样式

			for(var property in activeStyle) {
				if(property.indexOf(prevBorderPosition) != -1) {
					activeStyle[property] = '';
					delete state.stylesList['.' + params.activeStyleName][property];
					delete activeStyle[property];
				}
				activeStyle[params.position + '-radius'] = state.borderSetting.borderRadius.borderRadius;
			}

			return {...state};
		},

		handleBorderInputChange(state, { payload: params }) {
			state.borderSetting.border[params.propertyName] = params.value;
			return {...state};
		},

		handleBorderRadiusInputChange(state, { payload: params }) {
			state.borderSetting.borderRadius[params.propertyName] = params.value;
			return {...state};
		},

		handleBGSettingBeforeUpload(state, { payload: params }) {
			state.backgroundSetting.backgroundImage.fileInfo.splice(0, params.length);
			return {...state};
		},

		setCurrentActivePageListItem(state, { payload: key }) {
			state.currentActivePageListItem = key;
			return {...state};
		},

		changeStyle(state, { payload: params }) {
			state.stylesList[params.className][params.property] = params.value;
			return {...state};
		},

		addStyle(state, { payload: params }) {

			if(params.cssState) {
				//给当前CSS加伪类
				if(params.cssState == 'none') {
					params.cssState = '';
				}
				state.newStyleName = params.activeStyle + ':' + params.cssState;
			}

			state.stylesList['.' + state.newStyleName] = {};
			state.activeStyle = state.newStyleName;
			state.newStyleName = '';

			var activeCSSStyleLayout = state.cssStyleLayout[params.activeStyle];

			for(var cssStyle in activeCSSStyleLayout) {
				if(cssStyle == state.newStyleName) {
					message.error('所加类名与已有类名冲突，请重新填写');
					return {...state};
				}
			}

			state.cssStyleLayout[state.activeStyle] = state.cssStyleList;
			console.log(state.cssStyleLayout);
			return {...state};
		},

		handleStylesChanges(state, { payload: params }) {
			var keys = params.target.split(' ');
			if(keys.length == 2){
				state.stylesList[keys[0]][keys[1]] = params.value;
			}else{
				state.stylesList[params.target] = params.value;
			}
			return {...state}
		},

		handleNewStyleNameChange(state, { payload: value }) {
			state.newStyleName = value;
			return {...state};
		},

		applyCSSStyleIntoPage(state, { payload: params }) {

			const stylesGenerator = (cssStyleLayout) => {
				var cssText = '';
				for(var styleName in cssStyleLayout) {
					var currentStyle = cssStyleLayout[styleName],
						cssClass = '.' + styleName + '{';
					for(var property in currentStyle) {
						var currentTableStyle = currentStyle[property];
						if(currentTableStyle != '') {
							cssClass += property + ':' + currentTableStyle + ';'							
						}
					}
					cssClass += '}';
					cssText += cssClass;
				}

				return cssText.toString();				
			}

			var cssText = stylesGenerator(state.cssStyleLayout);

			window.VDDesignerFrame.postMessage({
				applyCSSIntoPage: {
					cssText: cssText,
					activeCtrl: params.activeCtrl
				}
			}, '*');

			return {...state};
		},

		handleCSSStyleLayoutChange(state, { payload: params }) {

			var property = params.stylePropertyName,
				value = params.stylePropertyValue,
				activeStyleName = params.activeStyleName;

				if(property == 'background-image') {
					value = 'url("' + value + '")';
				}

				if(params.parent) {
					var propertyParent = styleAction.findCSSPropertyByProperty(state.cssStyleLayout[activeStyleName], property);
					if(typeof params.parent.BGSizeIndex == 'undefined') {
						propertyParent[property] = value;
					}else {
						propertyParent[property][params.parent.BGSizeIndex] = value;
					}

				}else {
					state.cssStyleLayout[activeStyleName][property] = value;
				}

				console.log(state.cssStyleLayout);

			return {...state};
		}

	}

}