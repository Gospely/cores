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

			triggerList: [{
				name: 'Load',
				src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
			}, {
				name: 'Scroll',
				src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
			}, {
				name: 'Click',
				src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
			}, {
				name: 'Hover',
				src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
			}, {
				name: 'Tabs',
				src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
			}, {
				name: 'Slider',
				src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
			}, {
				name: 'Navbar',
				src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
			}, {
				name: 'Dropdown',
				src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
			}],
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

		interactions: [{
			animate: 'bounce',
			name: '弹跳',
			duration: '',
			condition: 'click'
		}, {
			animate: 'bounceIn',
			name: '弹跳进入',
			duration: '',
			condition: 'hover'
		}]

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

		showModalNewStep(state) {
			state.interactionCreator.modalNewStep.visible = true;
			return {...state};
		},

		hideModalNewStep(state) {
			state.interactionCreator.modalNewStep.visible = false;
			return {...state};
		},

		handleNewInteractionFormChange(state, { payload: params }) {
			state.newInteractionForm[params.attrName] = params.value;

			if(params.attrName == 'name') {
				state.newInteractionForm.animate = params.animate;
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
		}
	}

}