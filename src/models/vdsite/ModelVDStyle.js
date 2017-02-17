import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'vdstyles',
	state: {

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

		cssSelector: {
			
		},

		typoSetting: {
			
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
			}
		},

		newStyleName: ''
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
	      	});
		}
	},

	effects: {

		*handleStylesChange(params, { call, put, select }) {
			var activeCtrl = yield select(state=> state.vdCtrlTree.activeCtrl),
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
			var activeCtrl = yield select(state=> state.vdCtrlTree.activeCtrl),
				activeCtrlCustomClass = activeCtrl.customClassName;

			yield put({
				type: "vdCtrlTree/changeCustomClass",
				payload: params
			});

		}

	},

	reducers: {

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
					console.log('indexOf', property, activeStyle, activeStyle[property]);
					activeStyle[property] = '';
					delete state.stylesList['.' + params.activeStyleName][property];
					delete activeStyle[property];
					console.log(activeStyle);
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

		handleBackgroundSizeInputChange(state, { payload: params }) {
			state.backgroundSetting.backgroundSize[params.cssProperty] = params.value;
			console.log(state.backgroundSetting.backgroundSize);
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

		addStyle(state) {
			state.stylesList[state.newStyleName] = {};
			state.activeStyle = state.newStyleName;
			state.newStyleName = '';
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

		handleClassValueChange(state, { payload: params }) {
			var property = params.stylePropertyName,
				value = params.stylePropertyValue,
				activeStyleName = params.activeStyleName;

			state.stylesList['.' + activeStyleName][property] = value;

			return {...state};
		},		

		applyStyleIntoPage(state, { payload: params }) {

			const generateCSSText = (stylesList) => {
				var cssText = '';
				for(var styleName in stylesList) {
					var currentStyle = stylesList[styleName],
						cssClass = styleName + '{';
					for(var property in currentStyle) {
						var currentTableStyle = currentStyle[property];
						cssClass += property + ':' + currentTableStyle + ';'
					}
					cssClass += '}';
					cssText += cssClass;
				}

				return cssText;
			}

			console.log(params);

			const cssText = generateCSSText(state.stylesList);

			window.VDDesignerFrame.postMessage({
				applyCSSIntoPage: {
					cssText: cssText,
					activeCtrl: params.activeCtrl
				}
			}, '*');

			return {...state};
		}

	}

}