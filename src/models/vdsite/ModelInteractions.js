import React , {PropTypes} from 'react';
import dva from 'dva';

import { message } from 'antd';

export default {
	namespace: 'vdanimations',
	state: {

		interactionCreator: {
			modalCreator: {
				visible: false
			},

			modalAddInitalAppearabce: {
				visible: false
			},

			modalEtitorTrigger: {
				visible: false,
				title: '',
				isAffectOtherElem: false
			},

			modalNewStep: {
				visible: false
			},

		},

		animations: [{
			name: '提醒动画',
			children: [{
				name: 'bounce',
				title: '弹跳'
			},{
				name: 'flash',
				title: '闪烁'
			},{
				name: 'pulse',
				title: '脉动'
			},{
				name: 'rubberBand',
				title: '拉弹'
			},{
				name: 'shake',
				title: '颤抖'
			},{
				name: 'swing',
				title: '摇摆'
			},{
				name: 'tada',
				title: '内拉'
			},{
				name: 'wobble',
				title: '晃动'
			}]
		}, {
			name: '弹跳进入动画',
			children: [{
				name: 'bounceIn',
				title: '弹跳进入'
			},{
				name: 'bounceInDown',
				title: '向下弹跳进入'
			},{
				name: 'bounceInLeft',
				title: '从右弹跳进入'
			},{
				name: 'bounceInRight',
				title: '从左弹跳进入'
			},{
				name: 'bounceInUp',
				title: '向上弹跳进入'
			}]
		}, {
			name: '弹跳退出动画',
			children: [{
				name: 'bounceOut',
				title: '弹跳退出'
			},{
				name: 'bounceOutDown',
				title: '向下弹跳退出'
			},{
				name: 'bounceOutLeft',
				title: '从左弹跳退出'
			},{
				name: 'bounceOutRight',
				title: '从右弹跳退出'
			},{
				name: 'bounceOutUp',
				title: '向上弹跳退出'
			}]
		},{
			name: '淡入动画',
			children: [{
				name: 'fadeIn',
				title: '淡入'
			},{
				name: 'fadeInDown',
				title: '向下淡入'
			},{
				name: 'fadeInDownBig',
				title: '间隔向下快速淡入'
			},{
				name: 'fadeInLeft',
				title: '从左淡入'
			},{
				name: 'fadeInLeftBig',
				title: '间隔从左快速淡入'
			},{
				name: 'fadeInRight',
				title: '从右淡入'
			},{
				name: 'fadeInRightBig',
				title: '间隔从右快速淡入'
			},{
				name: 'fadeInUp',
				title: '向上淡入'
			},{
				name: 'fadeInUpBig',
				title: '间隔向上快速淡入'
			}]
		},{
			name: '淡出动画',
			children: [{
				name: 'fadeOut',
				title: '淡出'
			},{
				name: 'fadeOutDown',
				title: '向下淡出'
			},{
				name: 'fadeOutDownBig',
				title: '间隔向下快速淡出'
			},{
				name: 'fadeOutLeft',
				title: '从左淡出'
			},{
				name: 'fadeOutLeftBig',
				title: '间隔从左快速淡出'
			},{
				name: 'fadeOutRight',
				title: '从右淡出'
			},{
				name: 'fadeOutRightBig',
				title: '间隔从右快速淡出'
			},{
				name: 'fadeOutUp',
				title: '向上淡出'
			},{
				name: 'fadeOutUpBig',
				title: '间隔向上快速淡出'
			}]
		},{
			name: '立体翻转进入/退出',
			children: [{
				name: 'flip',
				title: '立体翻转'
			},{
				name: 'flipInX',
				title: 'X轴立体翻转进入'
			},{
				name: 'flipIny',
				title: 'Y轴立体翻转进入'
			},{
				name: 'flipOutX',
				title: 'X轴立体翻转退出'
			},{
				name: 'flipOutY',
				title: 'Y轴立体翻转退出'
			}]
		},{
			name: '快速进入/退出',
			children: [{
				name: 'lightSpeedIn',
				title: '快速进入'
			},{
				name: 'lightSpeedOut',
				title: '快速退出'
			}]
		},{
			name: '平面翻转进入',
			children: [{
				name: 'rotateIn',
				title: '平面翻转进入'
			},{
				name: 'rotateInDownLeft',
				title: '左侧向下翻转进入'
			},{
				name: 'rotateInDownRight',
				title: '右侧向下翻转进入'
			},{
				name: 'rotateInUpLeft',
				title: '左侧向上翻转进入'
			},{
				name: 'rotateInUpRight',
				title: '右侧向上翻转进入'
			}]
		},{
			name: '平面翻转退出',
			children: [{
				name: 'rotateIn',
				title: '平面翻转退出'
			},{
				name: 'rotateInDownLeft',
				title: '左侧向下翻转退出'
			},{
				name: 'rotateInDownRight',
				title: '右侧向下翻转退出'
			},{
				name: 'rotateInUpLeft',
				title: '左侧向上翻转退出'
			},{
				name: 'rotateInUpRight',
				title: '右侧向上翻转退出'
			}]
		},{
			name: 'Specials',
			children: [{
				name: 'hinge',
				title: '掉落'
			},{
				name: 'rollIn',
				title: '翻转型进入'
			},{
				name: 'rollOut',
				title: '翻转型退出'
			}]
		},{
			name: '突增进入',
			children: [{
				name: 'zoomIn',
				title: '突增进入'
			},{
				name: 'zoomInDown',
				title: '从下突增进入'
			},{
				name: 'zoomInLeft',
				title: '从左突增进入'
			},{
				name: 'zoomInRight',
				title: '从右突增进入'
			},{
				name: 'zoomInUp',
				title: '从上突增进入'
			}]
		},{
			name: '突减退出',
			children: [{
				name: 'zoomOut',
				title: '突减退出'
			},{
				name: 'zoomOutDown',
				title: '突减从下退出'
			},{
				name: 'zoomOutLeft',
				title: '突减从左退出'
			},{
				name: 'zoomOutRight',
				title: '突减从右退出'
			},{
				name: 'zoomOutUp',
				title: '突减从上退出'
			}]
		}],

		newInteractionForm: {
			name: '',
			animate: '',
			duration: '',
			condition: 'load'
		},

		interactionModifierForm: {
			visible: false
		},

		interactions: [{
			animate: '',
			name: 'None',
			duration: '',
			condition: 'none',
			vdid: []
		}, {
			animate: 'bounce',
			name: '弹跳',
			duration: '',
			condition: 'click',
			vdid: []
		}, {
			animate: 'bounceIn',
			name: '弹跳进入',
			duration: '',
			condition: 'hover',
			vdid: []
		}],

		script: {
			text: ``
		},

		needOffEffects: [{
			vdid: '',
			condition: ''
		}],

		activeInteraction: 0,

		activeInteractionIndex: 0

	},

	effects: {

		*handleInteractionOnSelect({payload: params}, {call, put, select}) {

			var interactions = yield select(state => state.vdanimations.interactions);
			var animateName = interactions[params.key].animate;

			if (params.key !== 0) {
				yield put({
					type: 'vdCtrlTree/handleInteractionOnSelect',
					payload: {
						animateName
					}
				});
			}

			yield put({
				type: 'setActiveInteraction',
				payload: {
					interactionIndex: params.key,
					vdid: params.vdid
				}
			})
		}

	},

	reducers: {

		initState(state, { payload: params }){

			// state.newInteractionForm = params.UIState.newInteractionForm;
			// state.interactionModifierForm = params.UIState.interactionModifierForm;
			// state.interactions = params.UIState.interactions;
			// state.activeInteraction = params.UIState.activeInteraction;
			// state.activeInteractionIndex = params.UIState.activeInteractionIndex;
			// state.interactionCreator = params.UIState.interactionCreator;
			// state.animations = params.UIState.animations;
			return {...state};
		},
		removeInteraction(state, { payload: index }) {
			state.interactions.splice(index, 1);
			return {...state};
		},

		showInteractionCreator(state, { payload: fileList }) {
			state.interactionCreator.modalCreator.visible = true;
			return {...state};
		},

		hideInteractionCreator(state, { payload: fileList }) {
			state.interactionCreator.modalCreator.visible = false;
			return {...state};
		},

		showModalAddInitalAppearance(state) {
			state.interactionCreator.modalAddInitalAppearabce.visible = true;
			return {...state};
		},

		hideModalAddInitalAppearabce(state) {
			state.interactionCreator.modalAddInitalAppearabce.visible = false;
			return {...state};
		},

		showModelEditTrigger(state) {
			state.interactionCreator.modalEtitorTrigger.visible = true;
			return {...state};
		},

		hideModelEditTrigger(state) {
			state.interactionCreator.modalEtitorTrigger.visible = false;
			return {...state};
		},

		triggerSelected(state, {payload: name}) {
			state.interactionCreator.modalEtitorTrigger.title = name;
			return {...state};
		},

		switchAffectOtherElem(state) {
			state.interactionCreator.modalEtitorTrigger.isAffectOtherElem = !state.interactionCreator.modalEtitorTrigger.isAffectOtherElem;
			return {...state};
		},


		handleNewInteractionFormChange(state, { payload: params }) {

			if(!params.edit) {
				state.newInteractionForm[params.attrName] = params.value;

				if(params.attrName == 'name') {
					state.newInteractionForm.animate = params.animate;
				}
			}else {
				var activeInteraction = state.interactions[state.activeInteractionIndex];
				activeInteraction[params.attrName] = params.value

				if(params.attrName == 'name') {
					activeInteraction.animate = params.animate;
				}
			}

			return {...state};
		},

		saveInteraction(state) {
			if(state.newInteractionForm.name == '') {
				message.error('请选择动画效果');
				return {...state};
			}

			state.interactions.push(state.newInteractionForm);
			state.newInteractionForm = {
				name: '',
				animate: '',
				duration: '',
				condition: 'load'
			}
			return {...state};
		},

		toggleInteactionEditor(state) {
			state.interactionModifierForm.visible = !state.interactionModifierForm.visible;
			return {...state};
		},

		showInteractionEditor(state) {
			state.interactionModifierForm.visible = true;
			return {...state};
		},

		hideInteractionEditor(state) {
			state.interactionModifierForm.visible = false;
			return {...state};
		},

		setActiveInteraction(state, { payload: params }) {
			let prevActiveInteraction = state.interactions[state.activeInteractionIndex];
			let prevVdids = prevActiveInteraction.vdid;
			let prevIndex = prevVdids.indexOf(params.vdid);
			state.needOffEffects.push({
				vdid: params.vdid,
				condition: prevActiveInteraction.condition
			});
			if (prevIndex !== -1) {
				prevVdids.splice(prevIndex, 1);
			}
			
			state.activeInteractionIndex = params.interactionIndex;
			state.interactions[state.activeInteractionIndex].vdid.push(params.vdid);
			let scriptText = ``;
			for(let i = 1; i < state.interactions.length; i ++) {
				let currentInteraction = state.interactions[i];
				
				let currentVdid = currentInteraction.vdid
				for(let j = 0; j < currentVdid.length; j ++) {

					if (currentInteraction.condition === 'hover') {
						scriptText += `\njQuery('[vdid="${currentVdid[j]}"]').${currentInteraction.condition}(function (e) {
	jQuery(e.target).animateCss('${currentInteraction.animate}');
});`
					}else if (currentInteraction.condition === 'click') {
						scriptText += `\njQuery('[vdid="${currentVdid[j]}"]').on('${currentInteraction.condition}', function (e) {
	jQuery(e.target).animateCss('${currentInteraction.animate}');
});`
					}else if (currentInteraction.condition === 'scroll') {
						scriptText += `\njQuery(window).scroll(function (e) {
							var elem = jQuery('[vdid="${currentVdid[j]}"]');
							if (elem.offset().top === jQuery(window).innerHeight()) {
								elem.animateCss('${currentInteraction.animate}');
							}
						})`
					}
					

				}
			}

			for(let i = 0; i < state.needOffEffects.length; i ++) {
				let currentOff = state.needOffEffects[i];
				scriptText += `\njQuery('[vdid="${currentOff.vdid}"]').off('${currentOff.condition}');`
			}
			
			 state.needOffEffects = [];
			console.log(scriptText)
			window.VDDesignerFrame.postMessage({
				applyScriptIntoPage: scriptText
			}, "*");
			return {...state};
		}

	}

}
