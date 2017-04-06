import React , {PropTypes} from 'react';
import dva from 'dva';
import { message, Modal } from 'antd';
import request from '../../utils/request';
import fetch from 'dva/fetch';
import initialData from './initialData.js';
import randomString from '../../utils/randomString.js';

const methods = {
	checkName(symbols, name) {

		for (var i = 0; i < symbols.length; i++) {
			if (symbols[i].name == name) {
				return false;
			}
		}
		return true;
	},
	getSymbolIndexByKey(symbols, key) {

		for (var i = 0; i < symbols.length; i++) {
			if (symbols[i].key == key) {
				return i;
			}
		}
		return undefined;
	}
}

export default {
	namespace: 'vdCollections',
	state: {
		collections: [],
		listTypeIsOpend: false,
		collectionsItem: {
			list: []
		},
		collectionsIndex: '-1',
		collectionsItemVisible: false,
		collectionsItemPreviewVisible: false,
		addStyle:"",
		addInputStyle:"",
	},
	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(({ pathname }) => {
                dispatch({
                    type: 'getInitialData'
                })
			});
		}
	},
	reducers: {
		changeNameInputStyle(state, {payload: params}){
			if(params){
				state.addStyle = 'add-collections-style'
				state.addInputStyle = 'add-collections-input-style'
			}else{
				state.addStyle = ''
				state.addInputStyle = ''
			}
			
			return {...state}
		},
		addStyle(state, {payload: params}){
			state.collections[params.index].list[params.listIndex].addStyle = 'add-collections-style'
			state.collections[params.index].list[params.listIndex].addInputStyle = 'add-collections-input-style'
			return {...state}
		},
		removeStyle(state, {payload: params}){
			state.collections[params.index].list[params.listIndex].addStyle = ''
			state.collections[params.index].list[params.listIndex].addInputStyle = ''
			return {...state}
		},
		changeCollectionsItemPreviewVisible(state, {payload: params}) {
			if(params == undefined) {
				state.collectionsItemPreviewVisible = !state.collectionsItemPreviewVisible
			}else {
				state.collectionsItemPreviewVisible = params;
			}		
			return {...state}
		},
		changeCollectionsItemVisible(state, {payload: params}) {
			state.collectionsItemVisible = params;		
			return {...state}
		},

		setCollectionsItem(state, {payload: params}) {
			state.collectionsItem = params.item;
			state.collectionsIndex = params.index;
			return {...state}
		},

		changeListTypeIsOpend(state, {payload: params}) {
			state.listTypeIsOpend = params;
			return {...state}
		},

        getInitialData(state) {
			state.collections = initialData.vdCollections.collections;
            return {...state};
        },

        setNewCollections(state) {
        	let newCollections = {
				name:"NewCollections",
				key: randomString(8, 10),
				list:[]
			}
			state.collections.push(newCollections);
        	return {...state};
        },

        deleteCollections(state, {payload: key}) {
			var index = methods.getSymbolIndexByKey(state.collections, key);
			if (index == undefined) {
				openNotificationWithIcon('error', '删除失败,请重试');
			} else {
				state.collections.splice(index, 1);
			}
			return {...state};
        },

        deleteCollectionsList(state, {payload: params}) {
			var index = methods.getSymbolIndexByKey(state.collections[params.index].list, params.listKey);
			if (index == undefined) {
				openNotificationWithIcon('error', '删除失败,请重试');
			} else {
				state.collections[params.index].list.splice(index, 1);
			}
			return {...state};
        },

        changelistIsOpend(state, {payload: params}) {
        	state.collections[params.index].list[params.listIndex].isOpend = params.isOpend
        	return {...state}
        },

        changeIsRequired(state, {payload: params}) {
        	state.collections[params.index].list[params.listIndex].isRequired = !state.collections[params.index].list[params.listIndex].isRequired
        	return {...state}
        },

        addCollectionsList(state, {payload: params}) {
        	let newOptionCollectionsList = {
        		name: 'newList',
				icon: params.icon,
				isOpend: false,
				key: randomString(8, 10),
				label: '',
				type: params.type,
				helpText: '',
				isRequired: false,
				value:[],
				addStyle:"",
				addInputStyle:"",
        	}

        	let newCollectionsList = {
        		name: 'newList',
				icon: params.icon,
				isOpend: false,
				key: randomString(8, 10),
				label: '',
				type: params.type,
				helpText: '',
				isRequired: false,
				addStyle:"",
				addInputStyle:"",
        	}

        	if(params.type == 'option') {
				state.collections[params.index].list.push(newOptionCollectionsList);
        	}else {
				state.collections[params.index].list.push(newCollectionsList);
        	}
        	
        	return {...state}
        }

	},
	effects: {
	}

}
