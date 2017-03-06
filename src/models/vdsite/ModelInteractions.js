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
			}]
		}, {
			name: '弹跳进入动画',
			children: [{
				name: 'bounceIn',
				title: '弹跳进入'
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
			condition: 'none'
		}, {
			animate: 'bounce',
			name: '弹跳',
			duration: '',
			condition: 'click'
		}, {
			animate: 'bounceIn',
			name: '弹跳进入',
			duration: '',
			condition: 'hover'
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
					interactionIndex: params.key
				}
			})
		}

	},

	reducers: {

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

		setActiveInteraction(state, { payload: interactionIndex }) {
			state.activeInteractionIndex = typeof interactionIndex === 'object' ? interactionIndex.interactionIndex : interactionIndex;
			return {...state};
		}

	}

}