import React , {PropTypes} from 'react';
import dva from 'dva';
import { message, Modal } from 'antd';
import request from '../../utils/request';
import fetch from 'dva/fetch';
import initialData from './initialData.js';

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
        	state.collections.name = "NewCollections";
        	return {...state};
        }

	},
	effects: {
	}

}
