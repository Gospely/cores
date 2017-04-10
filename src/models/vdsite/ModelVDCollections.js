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
		newCollectionsName:"",
		listTypeIsOpend: false,
		collectionsItem: {
			name:'',
			key: '',
			url: '',
			collectionsItemList: [],
			list: [],
			//leftSidebar.js
			//暂存collections
		},
		collectionsItemListContent: {
			//暂存collectionsItemList
			name: 'newItem',
			status: '',
			created: '',
			modified: '',
			published: '',
			content: []
		},
		collectionsIndex: '-1',
		collectionsItemVisible: false,
		collectionsItemPreviewVisible: false,
		newCollectionsPopoverVisible: false,
		collectionsItemlistVisible: false,
		collectionsItemListContentVisible: false,
		addOptionValue:false,
		itemListPopoverLayout: false,
		addStyle:"",
		addInputStyle:"",
		isFinish:false,
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
		setNewCollectionsList (state) {
			state.collectionsItemListContent.content = state.collectionsItem.list
			return {...state}
		},
		changeItemlistVisible (state, {payload:params}) {
			if(params == undefined) {
				state.collectionsItemlistVisible = !state.collectionsItemlistVisible
			}else {
				state.collectionsItemlistVisible = params
			}
			return {...state}
		},
		changeItemListPopoverLayout (state, {payload:params}) {
			if(params == undefined) {
				state.itemListPopoverLayout = !state.itemListPopoverLayout
			}else {
				state.itemListPopoverLayout = params
			}

			return {...state}
		},
		popoveDeleteCollections(state, {payload:index}){
			state.collections.splice(index, 1);
			return {...state}
		},
		addOptionValue(state, {payload:params}){
			state.collections[params.index].list[params.listIndex].optionValue.push(params.value)
			return {...state}
		},
		changeAddOptionValueBoxVisible(state){
			state.addOptionValue = !state.addOptionValue
			return {...state}
		},
		listItemAttrValueChange(state, {payload:params}) {
			state.collections[params.index].list[params.listIndex][params.attr] = params.value
			return {...state}
		},
		getNewCollectionsName(state, {payload: params}) {
			state.newCollectionsName = params
			return {...state}
		},
		newCollectionsPopoverVisibleChange(state) {
			state.newCollectionsPopoverVisible = !state.newCollectionsPopoverVisible
			return {...state}
		},

		changeState(state, {payload: params}){
			state.collectionsItem[params.attr] = params.value;
			return {...state}
		},
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
			if(params.item != "") {
				state.collectionsItem = params.item;
			}
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

        setNewCollections(state, {payload: params}) {
        	let newCollections = {
				name:state.newCollectionsName,
				key: randomString(8, 10),
				list:[],
				url:"",
				collectionsItemList: [],
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

        	if(params.type == 'option') {
				state.collectionsItem.list.push({
								        		name: 'newList',
												icon: params.icon,
												isOpend: false,
												key: randomString(8, 10),
												label: '',
												type: params.type,
												helpText: '',
												isRequired: false,
												optionValue:[],
												addStyle:"",
												addInputStyle:"",
								        	});
        	}else if(params.type == 'text' || params.type == 'textarea'){
				state.collectionsItem.list.push({
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
												maxText:1000,
												minText:0,
								        	});
        	}else if(params.type == 'date'){
        		state.collectionsItem.list.push({
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
												havingDateComponent:false,
								        	});

        	}else{
				state.collectionsItem.list.push({
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
								        	});
        	}

        	return {...state}
        }

	},
	effects: {
	}

}
