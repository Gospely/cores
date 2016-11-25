import dva from 'dva';

export default {
	namespace: 'designer',
	state: {
		deviceList: [
			{
				name: 'iPhone',
				width: 375,
				height: 667
			},
			{
				name: 'iPad',
				width: 200,
				heifht: 300
			},
			{
				name: 'Android Phone',
				width: 245,
				heifht: 456
			},
			{
				name: 'Android Tablet',
				width: 456,
				heifht: 367
			}
		],

		defaultDevice: 0,

		controllersList: [
			{
				name: '按钮组',
				type: 'button-bar',
				attr: {}
			},
			{
				name: '按钮',
				type: 'button',
				attr: {
					value: {
						type: 'input',
						title: '名称',
						isClassName: false
					},
					disabled: {
						type: 'toggle',
						title: '禁止',
						value: ['weui-btn_disabled weui-btn_plain-disabled'],
						isClassName: true
					},
					class: {
						type: 'select',
						title: '按钮类型',
						value: ['weui-btn_primary', 'weui-btn_default', 'weui-btn_warn', 'weui-btn_plain-default', 'weui-btn_plain-primary'],
						isClassName: true
					},
					mini: {
						type: 'toggle',
						title: '迷你按钮',
						value: ['weui-btn_mini'],
						isClassName: true
					}
				},
				tag: ['button', 'button'],
				baseClassName: 'weui-btn',
				wrapper: ''
			},
			{
				name: '表单',
				type: 'form',
				attr: {},
				child: ['input']
			},
			{
				name: '输入框',
				type: 'input',
				attr: {
					value: {
						type: 'input',
						title: '内容',
						isClassName: false
					},
					disabled: {
						type: 'toggle',
						title: '禁止',
						value: [],
						isClassName: true
					}
				},
				tag: ['div'],
				baseClassName: '',
				wrapper: ''
			},
			{
				name: '单选框',
				type: 'radio',
				attr: {}
			},
			{
				name: '开关',
				type: 'toggle',
				attr: {}
			},					
			{
				name: '卡片',
				type: 'card',
				attr: {}
			},
			{
				name: '选择框',
				type: 'checkbox',
				attr: {}
			},
			{
				name: '头部',
				type: 'header',
				attr: {}
			},
			{
				name: '底部',
				type: 'footer',
				attr: {}
			},
			{
				name: '头部',
				type: 'heading',
				attr: {}
			},
			{
				name: '段落',
				type: 'html',
				attr: {}
			},
			{
				name: '图片',
				type: 'image',
				attr: {}
			},
			{
				name: '分割',
				type: 'list-item-divider',
				attr: {}
			},
			{
				name: '列表',
				type: 'list',
				attr: {}
			},
			{
				name: '地图',
				type: 'map',
				attr: {}
			},
			{
				name: 'markdown',
				type: 'markdown',
				attr: {}
			},
			{
				name: '范围选择框',
				type: 'range',
				attr: {}
			},
			{
				name: '搜索框',
				type: 'search',
				attr: {}
			},
			{
				name: '选择框',
				type: 'select',
				attr: {}
			},
			{
				name: '幻灯片',
				type: 'slider',
				attr: {}
			},
			{
				name: '空白分割',
				type: 'spacer',
				attr: {}
			},
			{
				name: '搜索框',
				type: 'search',
				attr: {}
			},
			{
				name: '文本域',
				type: 'textarea',
				attr: {}
			},
			{
				name: '视频',
				type: 'video',
				attr: {}
			},
			{
				name: '列表头像',
				type: 'list-item-avatar',
				attr: {}
			},
			{
				name: '列表相册',
				type: 'list-item-thumbnail',
				attr: {}
			},
			{
				name: '列表图标',
				type: 'list-item-icon',
				attr: {}
			},
			{
				name: '列表容器',
				type: 'list-item-container',
				attr: {}
			},
			{
				name: '容器',
				type: 'container',
				attr: {}
			}
		]
	},

	subscriptions: {

	},

	effects: {

	},

	reducers: {

		handleDeviceSelected(state, { payload: key}) {
			state.defaultDevice = key;
			return {...state};
		}

	}

}