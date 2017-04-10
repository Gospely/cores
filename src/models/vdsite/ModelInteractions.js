import React , {PropTypes} from 'react';
import dva from 'dva';
import randomString from '../../utils/randomString.js';

import { message } from 'antd';

import initialData from './initialData.js';

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

			'load'(currentVdid, animate, duration) {
				for(let j = 0; j < currentVdid.length; j ++) {
					scriptText += `\n	jQuery('[vdid="${currentVdid[j]}"]').animateCss('${animate}')`;
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
				scriptText += `\n	jQuery(window).off('scroll');`;
				scriptText += `\n	jQuery(window).on('scroll', function (e) {`;
				for(let i = 0; i < scrollAnimations.length; i ++) {
					let currentVdid = scrollAnimations[i].currentVdid;
					let animate = scrollAnimations[i].animate;
					let duration = scrollAnimations[i].duration;

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

			}

		}

		if(scrollAnimations.length) {
			handlers.scrollSpecialHandler(scrollAnimations);
		}

		scriptText += `\n})()`;

		return scriptText;
	},

	deepCopyObj(obj, result) {
		result = result || {};
		for (let key in obj) {
			if (typeof obj[key] === 'object') {
				result[key] = (obj[key].constructor === Array) ? [] : {};
				vdanimationActions.deepCopyObj(obj[key], result[key]);
			} else {
				result[key] = obj[key];
			}
		}
		return result;
	},
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

		animations: [],

		newInteractionForm: {
			name: '弹跳',
			animate: 'bounce',
			duration: '1000',
			condition: 'click',
			vdid: []
		},

		interactionModifierForm: {
			visible: false
		},

		interactions: [],

		scriptText: '',

		activeInteraction: 0,

		activeInteractionIndex: 0,

		editOldInteractionForm: {},
		editingScriptText: ``,
		editingInteractionIndex: 0

	},

	effects: {

		*handleInteractionOnSelect({payload: params}, {call, put, select}) {
			let interactions = yield select(state => state.vdanimations.interactions);
			let ctrl = vdanimationActions.deepCopyObj(params.ctrl);
			yield put({
				type: 'vdCtrlTree/handleInteractionOnSelect',
				payload: interactions[params.key]
			});

			yield put({
				type: 'setActiveInteraction',
				payload: {
					interactionIndex: params.key,
					ctrl: ctrl
				}
			})
		},

		*removeInteraction({payload: index}, {call, put, select}) {
			let deletedInteraction = yield select(state => state.vdanimations.interactions[index]);
			let deletedInteractionCopied = vdanimationActions.deepCopyObj(deletedInteraction);
			yield put({
				type: 'vdCtrlTree/handleRemoveInteraction',
				payload: deletedInteractionCopied
			})
			yield put({
				type: 'handleRemoveInteraction',
				payload: index
			})
		}

	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
				if(!localStorage.canSetup || localStorage.canSetup == 'true'){
					dispatch({
	                    type: 'getInitialData'
	                })
				}
	      	});
		}
	},

	reducers: {

		getInitialData(state) {
			state.interactions = initialData.vdanimations.interactions;
			state.animations = initialData.vdanimations.animations;
			return {...state};
		},

		initState(state, { payload: params }){

			state.newInteractionForm = params.UIState.newInteractionForm;
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

			let editOldInteractionForm = state.editOldInteractionForm;
			if (params.edit) {

				// if (params.attrName === 'condition') {
				if (editOldInteractionForm.condition === 'click') {
					for(let i = 0; i < editOldInteractionForm.vdid.length; i ++) {
						state.editingScriptText += `\n	jQuery('[vdid="${editOldInteractionForm.vdid[i]}"]').off('click', animationTrigger);`
					}
				}if (editOldInteractionForm.condition === 'hover') {
					for(let i = 0; i < editOldInteractionForm.vdid.length; i ++) {
						state.editingScriptText += `\n	jQuery('[vdid="${editOldInteractionForm.vdid[i]}"]').off('mouseenter' ,animationTrigger);`
						state.editingScriptText += `\n	jQuery('[vdid="${editOldInteractionForm.vdid[i]}"]').off('mouseleave' ,animationTrigger);`
					}
				}
				// }

				state.editOldInteractionForm[params.attrName] = params.value;
				if(params.attrName == 'name') {
					state.editOldInteractionForm.animate = params.animate;
				}

			}else {
				state.newInteractionForm[params.attrName] = params.value;
				if(params.attrName == 'name') {
					state.newInteractionForm.animate = params.animate;
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
			let oldNewInteractionForm = state.newInteractionForm;
			state.newInteractionForm = {
				name: oldNewInteractionForm.name,
				animate: oldNewInteractionForm.animation,
				duration: oldNewInteractionForm.duration,
				condition: oldNewInteractionForm.condition,
				vdid: []
			}
			return {...state};
		},

		showInteractionEditor(state, {payload: interactionIndex}) {
			state.interactionModifierForm.visible = true;
			state.editOldInteractionForm = vdanimationActions.deepCopyObj(state.interactions[interactionIndex]);
			state.editingInteractionIndex = interactionIndex;
			return {...state};
		},

		hideInteractionEditor(state, {payload: isSave}) {
			state.interactionModifierForm.visible = false;
			if (isSave) {
				state.interactions[state.editingInteractionIndex] = state.editOldInteractionForm;

				let script = `\n(function () {`;
				script += state.editingScriptText;
				script += vdanimationActions.writeScript(state);
				state.editingScriptText = ``;
				window.VDDesignerFrame.postMessage({
					applyScriptIntoPage: script
				}, "*");

				state.scriptText = script;

			}
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
			let deleteAnimation = state.interactions.splice(index, 1)[0];

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

		handlePastCtrl(state, { payload: params }) {

			let loopData = (ctrl) => {
				let interaction = ctrl.animationClassList[0];
				let interactionKey = interaction.key;
				for(let i = 0, len = state.interactions.length; i < len; i ++) {
					let currentInteraction = state.interactions[i];
					if (currentInteraction.key === interactionKey) {
						currentInteraction.vdid.push(ctrl.vdid);
						break;
					}
				}
				if (ctrl.children) {
					for(let i = 0, len = ctrl.children.length; i < len; i ++) {
						loopData(ctrl.children[i]);
					}
				}
			}

			loopData(params);

			let script = `\n(function () {`;
			script += vdanimationActions.writeScript(state);

			window.VDDesignerFrame.postMessage({
				applyScriptIntoPage: script
			}, "*");

			state.scriptText = script;

			return {...state};
		},

		setActiveInteraction(state, { payload: params }) {

			let ctrlVdid = params.ctrl.vdid;
			let prevActiveInteraction;
			let prevInteractionKey = params.ctrl.animationClassList[0].key;

			for(let i = 0; i < state.interactions.length; i ++) {
				let currentInteraction = state.interactions[i];
				if (currentInteraction.key === prevInteractionKey) {
					prevActiveInteraction = currentInteraction;
					break;
				}
			}

			let prevVdids = prevActiveInteraction.vdid;
			let prevIndex = prevVdids.indexOf(ctrlVdid);
			let prevCondition = prevActiveInteraction.condition;
			let scriptText = `\n(function () {`;

			if (prevIndex !== -1) {

				if (prevCondition !== 'none') {
					if (prevCondition === 'hover') {
						scriptText += `\n	jQuery('[vdid="${ctrlVdid}"]').off('mouseenter' ,animationTrigger);`
						scriptText += `\n	jQuery('[vdid="${ctrlVdid}"]').off('mouseleave' ,animationTrigger);`
					}else if (prevCondition === 'click') {
						scriptText += `\n	jQuery('[vdid="${ctrlVdid}"]').off('click', animationTrigger);`
					}
				}

				prevVdids.splice(prevIndex, 1);
			}

			state.activeInteractionIndex = params.interactionIndex;
			state.interactions[state.activeInteractionIndex].vdid.push(ctrlVdid);

			scriptText += vdanimationActions.writeScript(state);

			window.VDDesignerFrame.postMessage({
				applyScriptIntoPage: scriptText
			}, "*");

			state.scriptText = scriptText;

			return {...state};
		}

	}

}
