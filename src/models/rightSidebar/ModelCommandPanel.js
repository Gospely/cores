import dva from 'dva';
export default {
	namespace: 'commandPanel',
	state: {
		showPanel: false,
		shortcuts: [{
			desc: '搜索文件',
			key: 'commend + p'
		}],
		currentIndex: 0,
		visible: false
	},

	effects: {

	},

	reducers: {

	}
}