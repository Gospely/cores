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
        }

	},
	effects: {
	}

}
