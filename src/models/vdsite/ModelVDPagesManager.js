import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'vdpm',
	state: {
		currentActivePageListItem: 'sub1',

		pageManager: {
			treeSelect: {
				value: ''
			}
		},

		pageList: [{
			key: 'index.html',
			name: '主页面',
			seo: {
				title: '主页面',
				description: '介绍'
			},
			script: {
				head: '',
				body: ''
			}
		}, {
			key: 'folder1',
			name: '文件夹1',
			children: [{
				key: 'folder1/account.html',
				name: '账户',
				seo: {
					title: '账户',
					description: '介绍'
				},
				script: {
					head: '',
					body: ''
				}
			}, {
				key: 'folder1/folder2',
				name: '主页面',
				children: [{
					key: 'folder1/folder2/pw.html',
					name: '忘记密码',
					seo: {
						title: '忘记密码',
						description: '介绍'
					},
					script: {
						head: '',
						body: ''
					}
				}]
			}]
		}]
	},

	reducers: {

		setCurrentActivePageListItem(state, { payload: key }) {
			state.currentActivePageListItem = key;
			return {...state};
		},
	}

}