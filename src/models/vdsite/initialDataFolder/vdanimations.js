export default {

	interactions: [{
		animate: '',
		name: 'None',
		duration: '',
		condition: 'none',
		vdid: [],
		key: 'none'
	}, {
		animate: 'bounce',
		name: '弹跳',
		duration: '1000',
		condition: 'click',
		vdid: [],
		key: '456'
	}, {
		animate: 'bounceIn',
		name: '弹跳进入',
		duration: '1000',
		condition: 'hover',
		vdid: [],
		key: '789'
	}, {
		animate: 'bounceIn',
		name: '弹跳进入',
		duration: '3000',
		condition: 'scroll',
		vdid: [],
		key: '901'
	}],

	animations: [{
		name: '提醒动画',
		children: [{
			name: 'bounce',
			title: '弹跳'
		},{
			name: 'flash',
			title: '闪烁'
		},{
			name: 'pulse',
			title: '脉动'
		},{
			name: 'rubberBand',
			title: '拉弹'
		},{
			name: 'shake',
			title: '颤抖'
		},{
			name: 'swing',
			title: '摇摆'
		},{
			name: 'tada',
			title: '内拉'
		},{
			name: 'wobble',
			title: '晃动'
		}]
	}, {
		name: '弹跳进入动画',
		children: [{
			name: 'bounceIn',
			title: '弹跳进入'
		},{
			name: 'bounceInDown',
			title: '向下弹跳进入'
		},{
			name: 'bounceInLeft',
			title: '从右弹跳进入'
		},{
			name: 'bounceInRight',
			title: '从左弹跳进入'
		},{
			name: 'bounceInUp',
			title: '向上弹跳进入'
		}]
	}, {
		name: '弹跳退出动画',
		children: [{
			name: 'bounceOut',
			title: '弹跳退出'
		},{
			name: 'bounceOutDown',
			title: '向下弹跳退出'
		},{
			name: 'bounceOutLeft',
			title: '从左弹跳退出'
		},{
			name: 'bounceOutRight',
			title: '从右弹跳退出'
		},{
			name: 'bounceOutUp',
			title: '向上弹跳退出'
		}]
	},{
		name: '淡入动画',
		children: [{
			name: 'fadeIn',
			title: '淡入'
		},{
			name: 'fadeInDown',
			title: '向下淡入'
		},{
			name: 'fadeInDownBig',
			title: '间隔向下快速淡入'
		},{
			name: 'fadeInLeft',
			title: '从左淡入'
		},{
			name: 'fadeInLeftBig',
			title: '间隔从左快速淡入'
		},{
			name: 'fadeInRight',
			title: '从右淡入'
		},{
			name: 'fadeInRightBig',
			title: '间隔从右快速淡入'
		},{
			name: 'fadeInUp',
			title: '向上淡入'
		},{
			name: 'fadeInUpBig',
			title: '间隔向上快速淡入'
		}]
	},{
		name: '淡出动画',
		children: [{
			name: 'fadeOut',
			title: '淡出'
		},{
			name: 'fadeOutDown',
			title: '向下淡出'
		},{
			name: 'fadeOutDownBig',
			title: '间隔向下快速淡出'
		},{
			name: 'fadeOutLeft',
			title: '从左淡出'
		},{
			name: 'fadeOutLeftBig',
			title: '间隔从左快速淡出'
		},{
			name: 'fadeOutRight',
			title: '从右淡出'
		},{
			name: 'fadeOutRightBig',
			title: '间隔从右快速淡出'
		},{
			name: 'fadeOutUp',
			title: '向上淡出'
		},{
			name: 'fadeOutUpBig',
			title: '间隔向上快速淡出'
		}]
	},{
		name: '立体翻转进入/退出',
		children: [{
			name: 'flip',
			title: '立体翻转'
		},{
			name: 'flipInX',
			title: 'X轴立体翻转进入'
		},{
			name: 'flipInY',
			title: 'Y轴立体翻转进入'
		},{
			name: 'flipOutX',
			title: 'X轴立体翻转退出'
		},{
			name: 'flipOutY',
			title: 'Y轴立体翻转退出'
		}]
	},{
		name: '快速进入/退出',
		children: [{
			name: 'lightSpeedIn',
			title: '快速进入'
		},{
			name: 'lightSpeedOut',
			title: '快速退出'
		}]
	},{
		name: '平面翻转进入',
		children: [{
			name: 'rotateIn',
			title: '平面翻转进入'
		},{
			name: 'rotateInDownLeft',
			title: '左侧向下翻转进入'
		},{
			name: 'rotateInDownRight',
			title: '右侧向下翻转进入'
		},{
			name: 'rotateInUpLeft',
			title: '左侧向上翻转进入'
		},{
			name: 'rotateInUpRight',
			title: '右侧向上翻转进入'
		}]
	},{
		name: '平面翻转退出',
		children: [{
			name: 'rotateOut',
			title: '平面翻转退出'
		},{
			name: 'rotateOutDownLeft',
			title: '左侧向下翻转退出'
		},{
			name: 'rotateOutDownRight',
			title: '右侧向下翻转退出'
		},{
			name: 'rotateOutUpLeft',
			title: '左侧向上翻转退出'
		},{
			name: 'rotateOutUpRight',
			title: '右侧向上翻转退出'
		}]
	},{
		name: 'Specials',
		children: [{
			name: 'hinge',
			title: '掉落'
		},{
			name: 'rollIn',
			title: '翻转型进入'
		},{
			name: 'rollOut',
			title: '翻转型退出'
		}]
	},{
		name: '突增进入',
		children: [{
			name: 'zoomIn',
			title: '突增进入'
		},{
			name: 'zoomInDown',
			title: '从下突增进入'
		},{
			name: 'zoomInLeft',
			title: '从左突增进入'
		},{
			name: 'zoomInRight',
			title: '从右突增进入'
		},{
			name: 'zoomInUp',
			title: '从上突增进入'
		}]
	},{
		name: '突减退出',
		children: [{
			name: 'zoomOut',
			title: '突减退出'
		},{
			name: 'zoomOutDown',
			title: '突减从下退出'
		},{
			name: 'zoomOutLeft',
			title: '突减从左退出'
		},{
			name: 'zoomOutRight',
			title: '突减从右退出'
		},{
			name: 'zoomOutUp',
			title: '突减从上退出'
		}]
	}]

}