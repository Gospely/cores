import React , {PropTypes} from 'react';
import dva from 'dva';

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
				}]
		},

	},

	reducers: {

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
		}
	}

}