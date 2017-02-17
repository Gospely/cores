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