import React , {PropTypes} from 'react';
import dva from 'dva';
import { Icon, message } from 'antd';

var deepCopyObj = function(obj, result) {
	result = result || {};
	for(let key in obj) {
		if (typeof obj[key] === 'object') {
			result[key] = (obj[key].constructor === Array)? []: {};
			deepCopyObj(obj[key], result[key]);
		}else {
			result[key] = obj[key];
		}
	}
	return result;
}

window.deepCopyObj = deepCopyObj;

var styleAction = {

	findCSSPropertyByProperty: function(stylesList, property) {
		for(var prop in stylesList) {
			var currrentStyleProperty = stylesList[prop];
			if(typeof currrentStyleProperty == 'string' || typeof currrentStyleProperty.length != 'undefined') {
				if(prop == property) {
					return stylesList;
				}
			}else {
				var tmp = styleAction.findCSSPropertyByProperty(currrentStyleProperty, property);
				if(tmp) {
					return tmp;
				}
			}
		}
	},

	findComplexCSSPropertyByProperty: function(sty) {

	}
}

export default {
	namespace: 'vdstyles',
	state: {

		specialStyleProperty: ['border-advance', 'shadows-advance', 'effects-advance', 'tt-advance', 'border-radius-advance'],
		propertiesNeedRec: ['border-advance', 'shadows-advance', 'effects-advance', 'tt-advance', 'border-radius-advance', 'width-height', 'font-more'],

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
			'h-shadow': {
				value: '',
				attrName: 'hShadow',
				units: ['px'],
				activeUnit: 'px',
				type: 'sliderInput'
			},

			'v-shadow': {
				value: ''
			},

			blur: {
				value: ''
			},

			spread: {
				value: ''
			},

			color: {
				value: ''
			},

			inset: {
				value: 'outset'
			}
		},

		textShadow: {
			'h-shadow': {
				value: ''
			},
			'v-shadow': {
				value: ''
			},
			blur: {
				value: ''
			},
			color: {
				value: ''
			}
		},

		filterSetting: {
			value: '',
			unit: ''
		},

		transitionSetting: {
			'transition-property': 'all',
			'transition-duration': 0,
			'transition-timing-function': 'ease'
		},

		transformSetting: {
			x: 0,
			y: 0,
			name: 'translate'
		},

		unitList: {
			body: {
				width: {
					defaultUnit: 'px',
					unit: 'px'
				},
				height: {
					defaultUnit: 'px',
					unit: 'px'
				},
				'max-width': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'min-height': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'min-width': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'max-height': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'font-size': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'padding-top': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'padding-left': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'padding-right': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'padding-bottom': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'margin-top': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'margin-right': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'margin-left': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'margin-bottom': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'background-width': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'border-width': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'border-top-width': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'border-bottom-width': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'border-left-width': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'border-right-width': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'border-radius': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'border-bottom-right-radius': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'border-top-left-radius': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'border-top-right-radius': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'border-bottom-left-radius': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'h-shadow': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'v-shadow': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'blur': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'spread': {
					defaultUnit: 'px',
					unit: 'px'
				},
				'opacity': {
					defaultUnit: '',
					unit: ''
				},
				top: {
					defaultUnit: 'px',
					unit: 'px'
				},
				left: {
					defaultUnit: 'px',
					unit: 'px'
				}
			}
		},

		cssPropertyUnits: {
			width: {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			height: {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'max-width': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'min-height': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'min-width': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'max-height': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'font-size': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'padding-top': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'padding-left': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'padding-right': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'padding-bottom': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'margin-top': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'margin-right': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'margin-left': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'margin-bottom': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'background-width': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'border-width': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'border-top-width': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'border-bottom-width': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'border-left-width': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'border-right-width': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'border-radius': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'border-bottom-right-radius': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'border-top-left-radius': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'border-top-right-radius': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'border-bottom-left-radius': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'h-shadow': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'v-shadow': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'blur': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'spread': {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			'opacity': {
				defaultUnit: '',
				unit: '',
				important: false
			},
			top: {
				defaultUnit: 'px',
				unit: 'px',
				important: false
			},
			left: {
				defaultUnit: 'px',
				unit: 'px',
				important: false
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
				'letter-spacing': '',
				'z-index': '',
				top: '',
				left: '',

				padding: {
					'padding-top': '',
					'padding-bottom': '',
					'padding-right': '',
					'padding-left': ''
				},

				margin: {
					'margin-top': '',
					'margin-bottom': '',
					'margin-left': '',
					'margin-right': ''
				},

				background: {
					'background-width': '',
					'background-color': '',
					'background-size': ['', '', false, false],
					'background-position': ['center', 'center'],
					'background-image': '',
					'background-color': '',
					'background-repeat': '',
					'background-attachment': ''
				},

				border: {
					'border-position': 'border',
					'border-width': '',
					'border-style': '',
					'border-color': '',
				},

				'border-radius': {
					'border-radius-position': 'border',
					'border-radius': ''
				},

				'box-shadow': {
					state: {
						activeProp: 0
					},
					childrenProps: [{
						'h-shadow': '20',
						'v-shadow': '20',
						blur: '20',
						spread: '30',
						color: '#000000',
						inset: 'outset'
					}, {
						'h-shadow': '10',
						'v-shadow': '-5',
						blur: '10',
						spread: '10',
						color: '#dfdfdf',
						inset: 'outset'
					}]
				},

				'text-shadow': {
					state: {
						activeProp: 0
					},
					childrenProps: [{
						'h-shadow': '2',
						'v-shadow': '2',
						blur: '5',
						color: ''
					}]
				},

				transition: {
					state: {
						activeProp: 0
					},
					childrenProps: [{
						'transition-property': 'all',
						'transition-duration': '0.2',
						'transition-timing-function': 'ease'
					}]
				},

				transform: {
					state: {
						activeProp: 0
					},
					childrenProps: [{
						name: 'translate',
						value: ['10', '20']
					}, {
						name: 'scale',
						value: [1.5, 2.4]
					}]
				},

				opacity: '',
				cursor: '',

				filter: {
					filters: [{
						cssProp: 'blur',
						name: '高斯模糊'
					}, {
						cssProp: 'brightness',
						name: '亮度'
					}, {
						cssProp: 'contrast',
						name: '对比度'
					}, {
						cssProp: 'grayscale',
						name: '灰度图像'
					}, {
						cssProp: 'hue-rotate',
						name: '旋转'
					}, {
						cssProp: 'invert',
						name: '反转'
					}, {
						cssProp: 'saturate',
						name: '饱和度'
					}, {
						cssProp: 'sepia',
						name: '深褐色'
					}],

					childrenProps: [{
						name: 'blur',
						value: '20'
					}, {
						name: 'brightness',
						value: '20'
					}],

					state: {
						activeFilter: 0
					}
				}
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
			'text-transform': '',
			'letter-spacing': '',
			'z-index': '',
			top: '',
			left: '',

			padding: {
				'padding-top': '',
				'padding-bottom': '',
				'padding-right': '',
				'padding-left': ''
			},

			margin: {
				'margin-top': '',
				'margin-bottom': '',
				'margin-left': '',
				'margin-right': ''
			},

			background: {
				'background-width': '',
				'background-color': '',
				'background-size': ['', '', false, false],
				'background-position': [],
				'background-image': '',
				'background-color': '',
				'background-repeat': '',
				'background-attachment': ''
			},
			border: {
				'border-position': 'border',
				'border-width': '',
				'border-style': '',
				'border-color': '',
			},
			'border-radius': {
				'border-radius-position': 'border',
				'border-radius': ''
			},
			'box-shadow': {
				state: {
					activeProp: 0
				},
				childrenProps: []
			},
			'text-shadow': {
				state: {
					activeProp: 0
				},
				childrenProps: []
			},
			transition: {
				state: {
					activeProp: 0
				},
				childrenProps: []
			},

			transform: {
				state: {
					activeProp: 0
				},
				childrenProps: []
			},
			opacity: '',
			cursor: '',

			filter: {
				filters: [{
					cssProp: 'blur',
					name: '高斯模糊'
				}, {
					cssProp: 'brightness',
					name: '亮度'
				}, {
					cssProp: 'contrast',
					name: '对比度'
				}, {
					cssProp: 'grayscale',
					name: '灰度图像'
				}, {
					cssProp: 'hue-rotate',
					name: '旋转'
				}, {
					cssProp: 'invert',
					name: '反转'
				}, {
					cssProp: 'saturate',
					name: '饱和度'
				}, {
					cssProp: 'sepia',
					name: '深褐色'
				}],

				childrenProps: [],

				state: {
					activeFilter: 0
				}
			}
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

		popover: {
			newFilter: {
				visible: false
			},

			modifyFilter: {
				visible: false
			},

			cursor: {
				visible: false
			},

			newTransition: {
				visible: false
			},

			newTransform: {
				visible: false
			}
		}

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
		initState(state, { payload: params}){

			state.backgroundSetting = params.UIState.backgroundSetting;
			state.cssStyleList = params.UIState.cssStyleList;
			state.boxShadow = params.UIState.boxShadow;
			state.cssStyleLayout = params.UIState.cssStyleLayout;
			state.textShadow = params.UIState.textShadow;
			state.filterSetting = params.UIState.filterSetting;
			state.transitionSetting = params.UIState.transitionSetting;
			state.transformSetting = params.UIState.transformSetting;
			state.unitList = params.UIState.unitList;
			return {...state};
		},
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

		handleBGSettingBeforeUpload(state, { payload: params }) {
			state.backgroundSetting.backgroundImage.fileInfo.splice(0, params.length);
			return {...state};
		},

		setCurrentActivePageListItem(state, { payload: key }) {
			state.currentActivePageListItem = key;
			return {...state};
		},

		addStyle(state, { payload: params }) {

			if(params.cssState) {
				//给当前CSS加伪类
				if(params.cssState == 'none') {
					return {...state};
				}
				var tmpStyleName = params.activeStyle.split(':');
				state.newStyleName = tmpStyleName[0] + ':' + params.cssState;
			}

			state.activeStyle = state.newStyleName;
			state.newStyleName = '';

			var activeCSSStyleLayout = state.cssStyleLayout[params.activeStyle];

			for(var cssStyle in activeCSSStyleLayout) {
				if(cssStyle == state.activeStyle) {
					message.error('所加类名与已有类名冲突，请重新填写');
					return {...state};
				}
			}

			console.log('==================', state.cssStyleList);

			var cssTpl = deepCopyObj(state.cssStyleList),
				unitsTpl = deepCopyObj(state.cssPropertyUnits);

			state.cssStyleLayout[state.activeStyle] = cssTpl;
			state.unitList[state.activeStyle] = unitsTpl;

			console.log(state);
			return {...state};
		},

		handleNewStyleNameChange(state, { payload: value }) {
			state.newStyleName = value;
			return {...state};
		},

		handleBoxShadowInputChange(state, { payload: params }) {
			state[params.shadowType][params.name]['value'] = params.value;
			return {...state};
		},

		saveBoxShadow(state, { payload: params }) {
			var activeCSSStyleLayout = state.cssStyleLayout[params.activeStyle];

			var tmp = {};

			if(params.shadowType == 'box-shadow') {

				for(var key in state.boxShadow) {
					tmp[key] = state.boxShadow[key].value;
				}

				state.boxShadow = {
					'h-shadow': {
						value: '',
						attrName: 'hShadow',
						units: ['px'],
						activeUnit: 'px',
						type: 'sliderInput'
					},

					'v-shadow': {
						value: ''
					},

					blur: {
						value: ''
					},

					spread: {
						value: ''
					},

					color: {
						value: ''
					},

					inset: {
						value: 'outset'
					}
				}

			}else {

				for(var key in state.textShadow) {
					tmp[key] = state.textShadow[key].value;
				}

				state.textShadow = {
					'h-shadow': {
						value: ''
					},

					'v-shadow': {
						value: ''
					},

					blur: {
						value: ''
					},

					color: {
						value: ''
					}
				}
			}

			activeCSSStyleLayout[params.shadowType].childrenProps.push(tmp);
			return {...state};
		},

		applyCSSStyleIntoPage(state, { payload: params }) {

			var currentActiveRecStyleName = '';

			var specialStyle = {
				background(currentStyleParent, unit) {
					unit = unit || '';
					let styleText = '', important = '';
					for(let styleName in currentStyleParent) {
						let currentStyleValue = currentStyleParent[styleName];

						if(state.unitList[currentActiveRecStyleName][styleName]) {
							unit = state.unitList[currentActiveRecStyleName][styleName].unit;
							important = state.unitList[currentActiveRecStyleName][styleName].important ? '!important' : '';
						}

						if (currentStyleValue !== '') {
							if (typeof currentStyleValue === 'object') {
								let valueText = '';
								if(currentStyleValue.length === 4) {

									if(currentStyleValue[0] == '' && currentStyleValue[1] == '' && !currentStyleValue[2] && !currentStyleValue[3]) {
										continue;
									}

									//background-size
									if(currentStyleValue[0] == '' && currentStyleValue[1] == '') {
										if(currentStyleValue[2]) {
											valueText = 'cover';
										}

										if(currentStyleValue[3]) {
											valueText = 'contain';
										}
									}else {
										valueText = currentStyleValue[0] + ' ' + currentStyleValue[1];
									}
								}else {
									//background-position
									if(currentStyleValue.length > 0) {
										valueText = currentStyleValue.join(' ');										
									}else {
										continue;
									}
								}
								styleText += styleName + ':' + valueText + unit + important + ';';
							}else {
								styleText += styleName + ':' + currentStyleValue + unit + important + ';';
							}
						}

						unit = '';
					}

					return styleText;
				},

				padding (currentStyleParent, unit) {
					unit = unit || '';
					return specialStyle['border'](currentStyleParent, undefined, unit);
				},

				margin (currentStyleParent, unit) {
					unit = unit || '';
					return specialStyle['border'](currentStyleParent, undefined, unit);
				},

				border(currentStyleParent, extraProperty, unit) {
					extraProperty = extraProperty || 'border-position';
					if(!unit) {
						unit = unit || '';
						extraProperty = extraProperty;
					}
					let styleText = '', important;
					for(let styleName in currentStyleParent) {
						if(styleName != extraProperty) {

							if(state.unitList[currentActiveRecStyleName][styleName]) {
								unit = state.unitList[currentActiveRecStyleName][styleName].unit;
								important = state.unitList[currentActiveRecStyleName][styleName].important ? '!important' : '';
							}

							let currentStyleValue = currentStyleParent[styleName];
							if (currentStyleValue !== '') {
								styleText += styleName + ':' + currentStyleValue + unit + important + ';';
							}
						}
						unit = '';
					}

					return styleText;
				},

				'border-radius'(currentStyleParent, unit) {
					unit = unit || '';
					return specialStyle['border'](currentStyleParent, 'border-radius-position', unit);
				},

				'box-shadow'(currentStyleParent, unit) {
					unit = unit || 'px';
					let styleText = 'box-shadow';
					let childrenProps = currentStyleParent.childrenProps;
					let valueText = '';
					for(let i = 0; i < childrenProps.length; i ++) {
						let currentStyle = childrenProps[i];
						for(let property in currentStyle) {
							let currentTableStyle = currentStyle[property];
							if(currentTableStyle !== '' && currentTableStyle !== 'outset') {
								if(property == 'color' || property == 'inset') {
									valueText += currentTableStyle + ' ';
								}else {
									valueText += currentTableStyle + unit + ' ';
								}
							}
						}
						if (i !== childrenProps.length - 1) {
							valueText += ',';
						}
					}

					styleText += ':' + valueText + ';';
					return styleText;

				},

				'text-shadow'(currentStyleParent, unit) {
					unit = unit || 'px';
					let styleText = 'text-shadow';
					let childrenProps = currentStyleParent.childrenProps;
					let valueText = '';
					for(let i = 0; i < childrenProps.length; i ++) {
						let currentStyle = childrenProps[i];
						for(let property in currentStyle) {
							let currentTableStyle = currentStyle[property];
							if(currentTableStyle !== '') {
								if(property == 'color') {
									valueText += currentTableStyle + ' ';
								}else {
									valueText += currentTableStyle + unit + ' ';
								}
							}
						}
						if (i !== childrenProps.length - 1) {
							valueText += ',';
						}

					}

					styleText += ':' + valueText + ';';
					return styleText;
				},

				transition(currentStyleParent, unit) {
					unit = unit || 's';
					let styleText = 'transition';
					let childrenProps = currentStyleParent.childrenProps;
					let valueText = '';
					for(let i = 0; i < childrenProps.length; i ++) {
						let currentStyle = childrenProps[i];
						for(let property in currentStyle) {
							let currentTableStyle = currentStyle[property];
							if(currentTableStyle !== '') {
								if(property == 'transition-duration') {
									valueText += currentTableStyle + unit + ' ';
								}else {
									valueText += currentTableStyle + ' ';
								}
							}
						}
						if (i !== childrenProps.length - 1) {
							valueText += ',';
						}

					}

					styleText += ':' + valueText + ';';
					return styleText;
				},

				transform(currentStyleParent, unit) {
					unit = unit || '';
					let styleText = 'transform';
					let childrenProps = currentStyleParent.childrenProps;
					let valueText = '';
					for(let i = 0; i < childrenProps.length; i ++) {
						let currentStyle = childrenProps[i];
						valueText += currentStyle.name + '(';
						let values = currentStyle.value;

						if(currentStyle.name == 'translate') {
							unit = 'px';
						}

						if(currentStyle.name == 'scale') {
							unit = '';
						}

						if(currentStyle.name == 'rotate') {
							unit = 'deg';
						}

						if(currentStyle.name == 'skew') {
							unit = 'px';
						}

						valueText += values[0] + unit;
						for (let j = 1; j < values.length; j ++) {
							valueText += ',' + values[j] + unit;
						}

						if (i !== childrenProps.length - 1) {
							valueText += ') ';
						}else {
							valueText += ')';
						}
					}

					styleText += ':' + valueText + ';';
					return styleText;
				},

				filter(currentStyleParent, unit) {
					unit = unit || '';
					let childrenProps = currentStyleParent.childrenProps;
					let styleText = 'filter';
					let valueText = '';
					for(let i = 0, len = childrenProps.length; i < len; i ++) {
						let currentStyle = childrenProps[i];

						var unitTable = {
							blur: 'px',
							brightness: '%',
							contrast: '%',
							grayscale: '%',
							'hue-rotate': 'deg',
							invert: '%',
							opacity: '%',
							saturate: '%',
							sepia: '%'
						}

						if(unitTable[currentStyle.name]) {
							unit = unitTable[currentStyle.name];
						}

						if (i !== childrenProps.length - 1) {
							valueText += currentStyle.name + '(' + currentStyle.value + unit + ') ';
						}else {
							valueText += currentStyle.name + '(' + currentStyle.value + unit + ')';
						}
					}

					styleText = styleText + ':' + valueText;

					return styleText;
				}


			}

			const stylesGenerator = (cssStyleLayout) => {
				var cssText = '';
				for(var styleName in cssStyleLayout) {
					var currentStyle = cssStyleLayout[styleName],
						cssClass = '.' + styleName + '{';

						currentActiveRecStyleName = styleName;

					for(var property in currentStyle) {
						var currentTableStyle = currentStyle[property];
						var unit = '', important = '';
						if(state.unitList[styleName][property]) {
							unit = state.unitList[styleName][property].unit;
							important = state.unitList[styleName][property].important ? '!important' : '';
						}
						if(currentTableStyle != '' && typeof currentTableStyle !== 'object') {
							cssClass += property + ':' + currentTableStyle + unit + important + ';'
						}else if (typeof currentTableStyle === 'object') {
							cssClass += specialStyle[property](currentTableStyle);
						}
					}
					cssClass += '}';
					cssText += cssClass;
				}

				return cssText.toString();
			}

			window.stylesGenerator = stylesGenerator;

			var cssText = stylesGenerator(state.cssStyleLayout);

			window.VDDesignerFrame.postMessage({
				applyCSSIntoPage: {
					cssText: cssText,
					activeCtrl: params.activeCtrl
				}
			}, '*');

			return {...state};
		},

		setActiveBoxShadow(state, { payload: params }) {
			var activeCSSLayout = state.cssStyleLayout[params.activeStyle];
			if(activeCSSLayout) {
				console.log('setActiveBoxShadow', activeCSSLayout);
				if(activeCSSLayout[params.shadowType].childrenProps[params.cssPropertyIndex]) {
					activeCSSLayout[params.shadowType].state.activeProp = params.cssPropertyIndex;
				}
			}
			return {...state};
		},

		removeThisShadow(state, { payload: params }) {
			var activeCSSLayout = state.cssStyleLayout[params.activeStyle];
			activeCSSLayout[params.shadowType].state.activeProp = activeCSSLayout[params.shadowType].childrenProps.length - 2;
			activeCSSLayout[params.shadowType].state.activeProp = activeCSSLayout[params.shadowType].state.activeProp < 0 ? 0 : activeCSSLayout[params.shadowType].state.activeProp;
			activeCSSLayout[params.shadowType].childrenProps.splice(params.cssPropertyIndex, 1);
			console.log('removeThisShadow', activeCSSLayout);
			message.success('删除成功');
			return {...state};
		},

		handleCSSStyleLayoutChange(state, { payload: params }) {

			var property = params.stylePropertyName,
				value = params.stylePropertyValue,
				activeStyleName = params.activeStyleName;

				if(property == 'background-image') {
					value = 'url("' + value + '")';
				}

				if(property == 'border-position' || property == 'border-radius-position') {

					var parentType = property.split('-');
					parentType.pop();
					parentType = parentType.join('-');

					const prevBorderPosition = state.cssStyleLayout[activeStyleName][parentType][property];
					var activeBorderStyle = state.cssStyleLayout[activeStyleName][parentType];

					//清除其它border类型，并根据现有propertyName重新生成样式

					for(var props in activeBorderStyle) {
						if(props.indexOf(prevBorderPosition) != -1) {
							if(props != property) {
								var tmpActiveBorderStyle = activeBorderStyle[props];
								activeBorderStyle[props] = '';
								delete activeBorderStyle[props];
								var propsSplit = props.split('-');
								activeBorderStyle[value + '-' + propsSplit[propsSplit.length - 1]] = tmpActiveBorderStyle;
							}
						}
					}

				}

				if(params.parent) {
					var propertyParent = styleAction.findCSSPropertyByProperty(state.cssStyleLayout[activeStyleName], property);
					if(typeof params.parent.index !== 'undefined') {
						if(property === 'background-size') {
							console.log('background-size', value);
							if(params.parent.index == 2 || params.parent.index == 3) {
								var constractIndex = params.parent.index == 2 ? 3 : 2;
								propertyParent[property][0] = '';
								propertyParent[property][1] = '';
								propertyParent[property][constractIndex] = !value;
								propertyParent[property][params.parent.index] = value;
							}else {
								propertyParent[property][params.parent.index] = value;
								propertyParent[property][2] = false;
								propertyParent[property][3] = false;
							}
						}else {
							propertyParent[property][params.parent.index] = value;
						}
					}else if (property === 'background-position') {
						let vals = value.split(' ');
						console.log(propertyParent, property);
						if(typeof propertyParent[property] == 'string') {
							propertyParent[property] = [];
						}
						propertyParent[property][0] = vals[0];
						propertyParent[property][1] = vals[1];
					}else {
						propertyParent[property] = value;
					}

				}else {
					state.cssStyleLayout[activeStyleName][property] = value;
				}

			return {...state};
		},

		handleBoxShadowStylesChange(state, { payload: params }) {

			var cssProperty = state.cssStyleLayout[params.activeStyleName][params.parent];
			var activeProp = cssProperty.state.activeProp;
			var childrenProps = cssProperty.childrenProps[activeProp];

			childrenProps[params.property] = params.value

			return {...state};
		},

		handleFilterTypeChange(state, { payload: params }) {
			var cssProperty = state.cssStyleLayout[params.activeStyleName]['filter'];
			cssProperty.state.activeFilter = params.index;
			return {...state};
		},

		togglePopover(state, { payload: params }) {
			state.popover[params.popoverName].visible = !state.popover[params.popoverName].visible;
			return {...state};
		},

		saveFilter(state, { payload: params }) {
			var cssProperty = state.cssStyleLayout[params.activeStyleName]['filter'];

			if(state.filterSetting.value == '') {
				message.error('请填写值！');
				return {...state};
			}

			cssProperty.childrenProps.push({
				name: params.activeFilterName,
				value: state.filterSetting.value + state.filterSetting.unit
			});

			state.filterSetting.value = '';
			state.popover['newFilter'].visible = false;

			return {...state};
		},

		saveThisTransition(state, { payload: params }) {
			var cssProperty = state.cssStyleLayout[params.activeStyleName]['transition'];
			cssProperty.childrenProps.push(state.transitionSetting);
			state.transitionSetting = {
				'transition-property': 'all',
				'transition-duration': 0,
				'transition-timing-function': 'ease'
			}
			return {...state};
		},

		saveTransform(state, { payload: params }) {
			var cssProperty = state.cssStyleLayout[params.activeStyleName]['transform'];
			cssProperty.childrenProps.push({
				name: state.transformSetting.name,
				value: [state.transformSetting.x, state.transformSetting.y]
			});
			state.transformSetting = {
				x: 0,
				y: 0,
				name: 'translate'
			}
			state.popover.newTransform.visible = false;
			return {...state};
		},

		handleFilterInputChange(state, { payload: params }) {
			state.filterSetting.value = params.value;
			state.filterSetting.unit = '';
			return {...state};
		},

		removeThisFilter(state, { payload: params }) {
			var cssProperty = state.cssStyleLayout[params.activeStyleName]['filter'];
			cssProperty.childrenProps.splice(params.filterIndex, 1);
			return {...state};
		},

		removeThisTransition(state, { payload: params }) {
			var cssProperty = state.cssStyleLayout[params.activeStyleName]['transition'];
			cssProperty.childrenProps.splice(params.transitionIndex, 1);
			return {...state};
		},

		removeThisTransform(state, { payload: params }) {
			var cssProperty = state.cssStyleLayout[params.activeStyleName]['transform'];
			cssProperty.childrenProps.splice(params.transformIndex, 1);
			return {...state};
		},

		handleTransitionInputChange(state, { payload: params }) {
			state.transitionSetting[params.propsName] = params.value;
			return {...state};
		},

		changeTransformType(state, { payload: params }) {
			state.transformSetting.name = params.transformType;
			return {...state};
		},

		handleTransformInputChange(state, { payload: params }) {
			state.transformSetting[params.pos] = params.value;
			return {...state};
		},

		setThisPropertyNull(state, { payload: params }) {
			var propertyParent = styleAction.findCSSPropertyByProperty(state.cssStyleLayout[params.activeStyleName], params.property);
			propertyParent[params.property] = '';
			return {...state};
		},

		setThisPropertyImportant(state, { payload: params }) {
			var propertyParent = styleAction.findCSSPropertyByProperty(state.cssStyleLayout[params.activeStyleName], params.property);
			var activeCSSProperty = state.unitList[params.activeStyleName][params.property];
			activeCSSProperty.important = !activeCSSProperty.important;
			// if(propertyParent[params.property].indexOf('!important') == -1) {
			// 	propertyParent[params.property] += '!important';
			// }else {
			// 	propertyParent[params.property] = propertyParent[params.property].replace('!important', '');			
			// }
			console.log(activeCSSProperty);
			return {...state};
		},

		changeActiveUnit(state, { payload: params }) {
			state.unitList[params.activeStyleName][params.property].unit = params.value;
			return {...state};
		}


	}

}
