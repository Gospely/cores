import React , {PropTypes} from 'react';
import dva from 'dva';
import randomString from '../../utils/randomString.js';

import { message } from 'antd';

const vdanimationActions = {
	writeScript(state) {
		let scrollAnimations = [];
		let scriptText = '';

		let handlers = {
			'hover'(currentVdid, animate, duration) {
				for(let j = 0; j < currentVdid.length; j ++) {

					scriptText += `\n	jQuery('[vdid="${currentVdid[j]}"]').on('mouseenter', {animate: '${animate}'} ,animationTrigger);`
					scriptText += `\n	jQuery('[vdid="${currentVdid[j]}"]').on('mouseleave', {animate: '${animate}'} ,animationTrigger);`
					if (duration) {
						scriptText += `\n	jQuery('[vdid="${currentVdid[j]}"]').css({
			animationDuration: '${duration}ms'
		});`
					}
				}
			},

			'click'(currentVdid, animate, duration) {
				for(let j = 0; j < currentVdid.length; j ++) {

					scriptText += `\n	jQuery('[vdid="${currentVdid[j]}"]').on('click', {animate: '${animate}'} ,animationTrigger);`
					if (duration) {
						scriptText += `\n	jQuery('[vdid="${currentVdid[j]}"]').css({
			animationDuration: '${duration}ms'
		});`
					}
				}
			},

			'scroll'(currentVdid, animate, duration) {
				scrollAnimations.push({
					currentVdid,
					animate,
					duration
				});
			},

			//scroll写进一个函数，方便解绑
			'scrollSpecialHandler' (scrollAnimations) {
				for(let i = 0; i < scrollAnimations.length; i ++) {
					let currentVdid = scrollAnimations[i].currentVdid;
					let animate = scrollAnimations[i].animate;
					let duration = scrollAnimations[i].duration;

					scriptText += `\n	jQuery(window).off('scroll');`;
					scriptText += `\n	jQuery(window).on('scroll', function (e) {`;
					for(let j = 0; j < currentVdid.length; j ++) {

						scriptText += `\n		var elem${j} = jQuery('[vdid="${currentVdid[j]}"]');
		if (elem${j}.offset().top - jQuery(window).scrollTop() <= jQuery(window).innerHeight()) {
			elem${j}.addClass('animated ${animate}');
		}`
						if (duration) {
							scriptText += `\n		elem${j}.css({
			animationDuration: '${duration}ms'
		});`
						}

					}
					scriptText += `\n	});`;
				}
				
			}
		}

		for(let i = 1; i < state.interactions.length; i ++) {
			let currentInteraction = state.interactions[i];
			
			let currentVdid = currentInteraction.vdid

			if (currentVdid.length !== 0) {
				handlers[currentInteraction.condition](currentVdid, currentInteraction.animate, currentInteraction.duration);
				handlers.scrollSpecialHandler(scrollAnimations);
			}
			
				
		}

		scriptText += `\n})()`;

		return scriptText;
	}
}

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
			condition: 'load',
			vdid: []
		},

		interactionModifierForm: {
			visible: false
		},

		interactions: [{
			animate: '',
			name: 'None',
			duration: '',
			condition: 'none',
			vdid: [],
			key: 'none'
		}, {
			animate: 'bounce',
			name: '弹跳',
			duration: '',
			condition: 'click',
			vdid: [],
			key: '456'
		}, {
			animate: 'bounceIn',
			name: '弹跳进入',
			duration: '',
			condition: 'hover',
			vdid: [],
			key: '789'
		}, {
			animate: 'bounceIn',
			name: '弹跳进入',
			duration: '3000',
			condition: 'scroll',
			vdid: [],
			key: '901'
		}],

		scriptText: '',

		needOffEffects: [],

		activeInteraction: 0,

		activeInteractionIndex: 0

	},

	// subscriptions: {

	//     setup({ dispatch, history }) {
	// 	    history.listen(({ pathname }) => {
	// 	    	dispatch({
	// 	    		type: 'setActiveInteraction'
	// 	    	})
	// 	    }
	// 	}
	// },

	effects: {

		*handleInteractionOnSelect({payload: params}, {call, put, select}) {
			var interactions = yield select(state => state.vdanimations.interactions);
			yield put({
				type: 'vdCtrlTree/handleInteractionOnSelect',
				payload: interactions[params.key]
			});

			yield put({
				type: 'setActiveInteraction',
				payload: {
					interactionIndex: params.key,
					vdid: params.vdid
				}
			})
		},

		*removeInteraction({payload: index}, {call, put, select}) {
			let deletedInteraction = yield select(state => state.vdanimations.interactions[index]);
			yield put({
				type: 'vdCtrlTree/handleRemoveInteraction',
				payload: deletedInteraction
			})
			yield put({
				type: 'handleRemoveInteraction',
				payload: index
			})
		}

	},

	reducers: {

		initState(state, { payload: params }){

			state.newInteractionForm = params.UIState.newInteractionForm;
			state.interactionModifierForm = params.UIState.interactionModifierForm;
			state.interactions = params.UIState.interactions;
			state.activeInteraction = params.UIState.activeInteraction;
			state.activeInteractionIndex = params.UIState.activeInteractionIndex;
			state.interactionCreator = params.UIState.interactionCreator;
			state.animations = params.UIState.animations;
			state.scriptText = params.UIState.scriptText;
			
			return {...state};
		},
		applyScriptIntoPage(state) {
			window.VDDesignerFrame.postMessage({
				applyScriptIntoPage: state.scriptText
			}, "*");
			return {...state};
		},

		// handleRemoveInteraction(state, { payload: index }) {
		// 	state.interactions.splice(index, 1);
		// 	return {...state};
		// },

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

		saveInteraction(state, {payload: params}) {
			if(state.newInteractionForm.name == '') {
				message.error('请选择动画效果');
				return {...state};
			}

			state.newInteractionForm.key = randomString(8, 10);
			state.interactions.push(state.newInteractionForm);
			state.newInteractionForm = {
				name: '',
				animate: '',
				duration: '',
				condition: 'load',
				vdid: [params.vdid]
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

		handleDeleteCtrl(state, {payload: params}) {

			let deleteCtrl = params.deleteParentInfo.controller;
			let deleteAnimationKey = deleteCtrl.animationClassList[0].key;
			let interactions = state.interactions;
			
			if (deleteAnimationKey !== 'none') {

				for(let i = 0, len = interactions.length; i < len; i ++) {
					if (interactions[i].key === deleteAnimationKey) {

						let interaction = interactions[i];
						for(let j = 0, len1 = interaction.vdid.length; j < len1; j ++) {
							if (interaction.vdid[j] === deleteCtrl.vdid) {
								interaction.vdid.splice(j, 1);
								break;
							}
						}
						break;
					}
				}

				let script = `\n(function () {`;
				script += vdanimationActions.writeScript(state);

				window.VDDesignerFrame.postMessage({
					applyScriptIntoPage: script
				}, "*");

				state.scriptText = script;
			}

			return {...state};
		},

		handleRemoveInteraction(state, {payload: index}) {
			let script = `\n(function () {`;
			let deleteAnimation = state.interactions.splice(params.index, 1)[0];

			if (deleteAnimation.condition === 'click') {
				for(let i = 0; i < deleteAnimation.vdid.length; i ++) {
					script += `\n	jQuery('[vdid="${deleteAnimation.vdid[i]}"]').off('click', animationTrigger);`
				}
			}if (deleteAnimation.condition === 'hover') {
				for(let i = 0; i < deleteAnimation.vdid.length; i ++) {
					script += `\n	jQuery('[vdid="${deleteAnimation.vdid[i]}"]').off('mouseenter' ,animationTrigger);`
					script += `\n	jQuery('[vdid="${deleteAnimation.vdid[i]}"]').off('mouseleave' ,animationTrigger);`
				}
			}
			
			script += vdanimationActions.writeScript(state);

			window.VDDesignerFrame.postMessage({
				applyScriptIntoPage: script
			}, "*");
			state.scriptText = script;
			return {...state};
		},

		setActiveInteraction(state, { payload: params }) {

			let prevActiveInteraction = state.interactions[state.activeInteractionIndex];
			let prevVdids = prevActiveInteraction.vdid;
			let prevIndex = prevVdids.indexOf(params.vdid);
			
			if (prevActiveInteraction.condition !== 'none') {
				state.needOffEffects.push({
					vdid: params.vdid,
					condition: prevActiveInteraction.condition
				});
			}

			let scriptText = `\n(function () {`;

			for(let i = 0; i < state.needOffEffects.length; i ++) {
				let currentOff = state.needOffEffects[i];
				if (currentOff.condition === 'hover') {
					scriptText += `\n	jQuery('[vdid="${currentOff.vdid}"]').off('mouseenter' ,animationTrigger);`
					scriptText += `\n	jQuery('[vdid="${currentOff.vdid}"]').off('mouseleave' ,animationTrigger);`
				}else if (currentOff.condition === 'click') {
					scriptText += `\n	jQuery('[vdid="${currentOff.vdid}"]').off('click', animationTrigger);`
				}
			}

			if (prevIndex !== -1) {
				prevVdids.splice(prevIndex, 1);
			}
			
			state.activeInteractionIndex = params.interactionIndex;
			state.interactions[state.activeInteractionIndex].vdid.push(params.vdid);
			
			scriptText += vdanimationActions.writeScript(state);
			
			window.VDDesignerFrame.postMessage({
				applyScriptIntoPage: scriptText
			}, "*");
			state.scriptText = scriptText;
			
			state.needOffEffects = [];

			return {...state};
		}

	}

}
