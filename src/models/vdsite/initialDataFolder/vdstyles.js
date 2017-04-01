export default {

	cssStyleList: {
		display: '',
		width: '',
		height: '',
		'max-width': '',
		'min-width': '',
		'max-height': '',
		'min-height': '',
		float: '',
		overflow: '',
		clear: '',
		position: '',
		'font-family': '',
		color: '#000000',
		'font-weight': '',
		'font-style': '',
		'text-indent': '',
		'font-size': '',
		'line-height': '',
		'text-align': '',
		'write-mode': '',
		'text-decoration': '',
		'text-transform': '',
		'letter-spacing': '',
		'z-index': '',
		top: '',
		left: '',
		right: '',
		bottom: '',

		padding: {
			'padding-top': '',
			'padding-bottom': '',
			'padding-right': '',
			'padding-left': ''
		},

		margin: {
			'margin-top': '',
			'margin-bottom': '',
			'margin-left': '',
			'margin-right': '',
			'margin-center': false
		},

		background: {
			'background-width': '',
			'background-color': '',
			'background-size': ['', '', false, false],
			'background-position': [],
			'background-image': '',
			'background-color': '',
			'background-repeat': '',
			'background-attachment': ''
		},
		border: {
			'border-position': 'border',
			'border-width': '',
			'border-style': '',
			'border-color': '',
		},
		'border-radius': {
			'border-radius-position': 'border',
			'border-radius': ''
		},
		'box-shadow': {
			state: {
				activeProp: 0
			},
			childrenProps: []
		},
		'text-shadow': {
			state: {
				activeProp: 0
			},
			childrenProps: []
		},
		transition: {
			state: {
				activeProp: 0
			},
			childrenProps: []
		},

		transform: {
			state: {
				activeProp: 0
			},
			childrenProps: []
		},
		opacity: '',
		cursor: '',

		filter: {
			filters: [{
				cssProp: 'blur',
				name: '高斯模糊'
			}, {
				cssProp: 'brightness',
				name: '亮度'
			}, {
				cssProp: 'contrast',
				name: '对比度'
			}, {
				cssProp: 'grayscale',
				name: '灰度图像'
			}, {
				cssProp: 'hue-rotate',
				name: '旋转'
			}, {
				cssProp: 'invert',
				name: '反转'
			}, {
				cssProp: 'saturate',
				name: '饱和度'
			}, {
				cssProp: 'sepia',
				name: '深褐色'
			}],

			childrenProps: [],

			state: {
				activeFilter: 0
			}
		}
	},

	cssPropertyUnits: {
		width: {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		height: {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'max-width': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'min-height': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'min-width': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'max-height': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'font-size': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'padding-top': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'padding-left': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'padding-right': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'padding-bottom': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'margin-top': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'margin-right': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'margin-left': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'margin-bottom': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'background-width': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'border-width': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'border-top-width': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'border-bottom-width': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'border-left-width': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'border-right-width': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'border-radius': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'border-bottom-right-radius': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'border-top-left-radius': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'border-top-right-radius': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'border-bottom-left-radius': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'h-shadow': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'v-shadow': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'blur': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'spread': {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		'opacity': {
			defaultUnit: '',
			unit: '',
			important: false
		},
		top: {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},
		left: {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},

		right: {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},

		bottom: {
			defaultUnit: 'px',
			unit: 'px',
			important: false
		},

		cursor: {
			important: false
		},

		'border-style': {
			important: false
		},

		'border-color': {
			important: false
		},

		'border-bottom-style': {
			important: false
		},
		'border-top-style': {
			important: false
		},
		'border-left-style': {
			important: false
		},
		'border-right-style': {
			important: false
		},

		'border-right-color': {
			important: false
		},
		'border-top-color': {
			important: false
		},
		'border-bottom-color': {
			important: false
		},
		'border-left-color': {
			important: false
		},

		'background-color': {
			important: false
		},
		'background-color': {
			important: false
		},
		'text-transform': {
			important: false
		},
		'text-decoration': {
			important: false
		},
		'write-mode': {
			important: false
		},
		'text-align': {
			important: false
		},
		'letter-spacing': {
			important: false,
			defaultUnit: 'px',
			unit: 'px'
		},
		'line-height': {
			important: false
		},
		'write-mode': {
			important: false
		},
		'text-indent': {
			important: false
		},
		'font-style': {
			important: false
		},
		'font-weight': {
			important: false
		},
		color: {
			important: false
		},
		'font-family': {
			important: false
		},
		'z-index': {
			important: false
		},
		position: {
			important: false
		},
		overflow: {
			important: false
		},
		clear: {
			important: false
		},
		float: {
			important: false
		},
		display: {
			important: false
		},
		'background-repeat': {
			important: false
		},
		'background-position': {
			important: false
		},
		'background-size': {
			important: false
		},
		'background-image': {
			important: false
		},
		'background-attachment': {
			important: false
		}
	},

	unitList: {},

	cssStyleLayout: {},

	mediaQuery: {
		queryList: []
	}

}