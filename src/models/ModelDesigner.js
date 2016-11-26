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
				height: 300
			},
			{
				name: 'Android Phone',
				width: 245,
				height: 456
			},
			{
				name: 'Android Tablet',
				width: 456,
				height: 367
			}
		],

		defaultDevice: 0,

		publicAttrs: [

		],

		publicEvents: [

		],

		layout: [

			{
				type: 'page',
				key: 'page-123',
				isLeaf: false,
				attr: {
					title: '主页面',
					color: '',
					images: '',

					padding: true,
					scrolling: true,
					classes: '',

					routingURL: '',
					icon: '',
				},

				children: [{
					attr: {
						title: 'form',
						value: 'fuck',
						disabled: false,
						class: 'weui-btn_primary',
						mini: false
					},

					key: 'form-345',
					type: 'button',
					isLeaf: true,

					children: [{
						type: 'button',
						key: 'button-567',
						attr: {
							title: 'button'
						}
					}]
				}],

			}

		],

		controllersList: [
			{
				name: '按钮组',
				type: 'button-bar',
				attr: {}
			},
			{
				name: '页面',
				type: 'page',
				attr: {

					title: {
						type: 'input',
						title: '页面名称',
						isClassName: false,
						isHTML: false
					},

					color: {
						type: 'input',
						title: '颜色',
						isClassName: false,
						isHTML: false
					},
					images: {
						type: 'input',
						title: '背景',
						isClassName: false,
						isHTML: false
					},

					padding: {
						type: 'input',
						title: '内边距',
						isClassName: false,
						isHTML: false
					},
					scrolling: {
						type: 'toggle',
						title: '是否滚动',
						isClassName: false,
						isHTML: false
					},
					classes: {
						type: 'input',
						title: '类名',
						isClassName: false,
						isHTML: false
					},

					routingURL: {
						type: 'input',
						title: '路由',
						isClassName: false,
						isHTML: false
					},

					icon: {
						type: 'select',
						title: '图标',
						value: [''],
						isClassName: false,
						isHTML: false
					}

				},
				backend: true
			},
			{
				name: '按钮',
				type: 'button',
				attr: {
					value: {
						type: 'input',
						title: '名称',
						isClassName: false,
						isHTML: true
					},
					disabled: {
						type: 'toggle',
						title: '禁止',
						value: ['weui-btn_disabled weui-btn_plain-disabled'],
						isClassName: true,
						isHTML: false
					},
					class: {
						type: 'select',
						title: '按钮类型',
						value: ['weui-btn_primary', 'weui-btn_default', 'weui-btn_warn', 'weui-btn_plain-default', 'weui-btn_plain-primary', 'weui-vcode-btn'],
						isClassName: true,
						isHTML: false
					},
					mini: {
						type: 'toggle',
						title: '迷你按钮',
						value: ['weui-btn_mini'],
						isClassName: true,
						isHTML: false
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
				baseClassName: 'weui-cells weui-cells_form',
				tag: 'div',
				children: {
					baseClassName: 'weui-cell',
					tag: 'div',
					type: {
						vcode: {
							type: 'toggle',
							title: '三栏',
							value: ['weui-cell_vcode'],
							isClassName: true,
							isHTML: false
						},

						warning: {
							type: 'toggle',
							title: '报错',
							value: ['weui-cell_warn'],
							isClassName: true,
							isHTML: false
						}
					},
					children: [{
						tag: 'div',
						baseClassName: 'weui-cell__hd',
						children: [{
							tag: 'label',
							baseClassName: 'weui-label',
							attr: {
								value: {
									type: 'input',
									title: '提示信息',
									isClassName: false,
									isHTML: true
								}
							}
						}]
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__bd',
						children: []
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__ft',
						children: []
					}]
				}
			},
			{
				name: '输入框',
				type: 'input',
				attr: {
					value: {
						type: 'input',
						title: '内容',
						isClassName: false,
						isHTML: false
					},
					disabled: {
						type: 'toggle',
						title: '禁止',
						value: [],
						isClassName: true,
						isHTML: false
					},
					type: {
						type: 'select',
						title: '类型',
						isClassName: false,
						isHTML: false,
						value: ['number', 'color', 'range', 'text', 'datetime-local', 'date', 'password', 'email', 'tel']
					},
					placeholder: {
						type: 'input',
						title: '占位符',
						isClassName: false,
						isHTML: false
					},
					pattern: {
						type: 'input',
						title: '正则',
						isClassName: false,
						isHTML: false
					}
				},
				tag: ['div'],
				baseClassName: 'weui-input',
				wrapper: ''
			},
			{
				name: '文本域',
				type: 'textarea',
				attr: {
					counter: {
						type: 'toggle',
						title: '显示计字器',
						isClassName: false,
						isHTML: false,
						value: {
							name: '计字器',
							tag: 'div',
							baseClassName: 'weui-textarea-counter',
							children: [{
								tag: 'span',
								attr: {
									type: 'input',
									title: '从',
									isClassName: false,
									isHTML: true
								}
							}, {
								tag: 'span',
								attr: {
									type: 'input',
									title: '到',
									isClassName: false,
									isHTML: true
								}
							}]
						}
					}
				},
				baseClassName: 'weiui-textarea',
				tag: 'textarea'
			},
			{
				name: '单选框',
				type: 'radio',
				attr: {
					name: {
						type: 'input',
						title: '名称',
						isClassName: false,
						isHTML: false
					}
				},
				tag: 'input',
				type: 'radio',
				baseClassName: 'weui-check'
			},
			{
				name: '开关',
				type: 'toggle',
				attr: {
					checked: {
						type: 'toggle',
						title: '选中',
						isClassName: false,
						isHTML: false
					}
				},
				tag: 'input',
				type: 'checkbox',
				baseClassName: 'weui-switch'
			},
			{
				name: '卡片',
				type: 'card',
				attr: {}
			},
			{
				name: '复选框',
				type: 'checkbox',
				attr: {
					name: {
						type: 'input',
						title: '名称',
						isClassName: false,
						isHTML: false
					},
					checked: {
						type: 'toggle',
						title: '选中',
						isClassName: false,
						isHTML: false
					}
				},
				tag: 'input',
				type: 'checkbox'
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
				name: '标题',
				type: 'heading',
				tag: 'div',
				baseClassName: 'weui-cells__title',
				attr: {
					value: {
						type: 'input',
						title: '标题',
						isClassName: false,
						isHTML: true
					}
				}
			},
			{
				name: '底部说明',
				type: 'heading',
				tag: 'div',
				baseClassName: 'weui-cells__tips',
				attr: {
					value: {
						type: 'input',
						title: '说明',
						isClassName: false,
						isHTML: true
					}
				}
			},
			{
				name: '代码',
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
				attr: {
					linked: {
						type: 'toggle',
						title: '跳转',
						isClassName: true,
						value: ['weui-cell_access'],
						isHTML: false
					}
				},
				tag: 'div',
				baseClassName: 'weui-cells',
				children: [{
					tag: 'div',
					baseClassName: 'weui-cell',
					children: [{
						tag: 'div',
						baseClassName: 'weui-cell__hd',
						children: []
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__bd',
						children: []
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__ft',
						children: []
					}]
				}]
			},
			{
				name: '地图',
				type: 'map',
				attr: {}
			},
			{
				name: '段落',
				type: 'markdown',
				attr: {}
			},
			{
				name: '滑块',
				type: 'range',
				attr: {
					value: {
						type: 'input',
						title: '值',
						isClassName: false,
						isHTML: false,
						isSetWidth: true
					}
				},
				tag: 'div',
				baseClassName: 'weui-slider',
				children: [{
					tag: 'div',
					baseClassName: 'weui-slider__inner',
					children: [{
						tag: 'div',
						baseClassName: 'weui-slider__track',
						children: []
					}, {
						tag: 'div',
						baseClassName: 'weui-slider__handler',
						children: []
					}]
				}]
			},
			{
				name: '搜索框',
				type: 'search',
				attr: {}
			},
			{
				name: '选择框',
				type: 'select',
				attr: {
					name: {
						type: 'input',
						title: '名称',
						isClassName: false,
						isHTML: false
					}
				},
				tag: 'select',
				children: [{
					tag: 'option',
					attr: {
						value: {
							type: 'input',
							title: '值',
							isClassName: false,
							isHTML: false
						},

						html: {
							type: 'input',
							title: '显示值',
							isClassName: false,
							isHTML: true
						}
					}
				}],
				baseClassName: 'weui-select'
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

		handleDeviceSelected(state, {payload: key}) {
			state.defaultDevice = key;
			return {...state};
		}

	}

}