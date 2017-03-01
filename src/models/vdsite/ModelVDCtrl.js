import React , {PropTypes} from 'react';
import dva from 'dva';
import { Icon, notification } from 'antd';
import randomString from '../../utils/randomString.js';

const openNotificationWithIcon = (type, title, description) => (
  notification[type]({
    message: title,
    description: description,
  })
)

const methods = {
	checkName(symbols, name){

		for (var i = 0; i < symbols.length; i++) {
			if(symbols[i].name == name){
				return false;
			}
		}
		return true;
	},
	getSymbolIndexByKey(symbols, key){

		for (var i = 0; i < symbols.length; i++) {
			if(symbols[i].key == key){
				return i;
			}
		}
		return undefined;
	}
}

export default {
	namespace: 'vdctrl',
	state: {

   		specialAttrList: ['custom-attr', 'link-setting', 'list-setting', 'heading-type', 'image-setting', 'select-setting', 'tabs-setting', 'navbar-setting', 'dropdown-setting', 'slider-setting', 'columns-setting'],
   		commonAttrList: [],
		symbols: [],
		currentSymbolKey: '',
		symbolName: '',
		popoverVisible: false,
		editPopoverVisible: false,
        keyValeUpdateVisible: false,
        keyValeCreateVisible: false,
		publicAttrs: [{
			title: '基础设置',
			key: 'basic',
			children: [{
				name: 'id',
				desc: 'id',
				type: 'input',
				isAttr: true,
				attrName: 'id',
				value: '',
				id: ''
			}, {
				name: 'class',
				desc: '可见性',
				isScreenSetting: true,
				type: 'multipleSelect',
				value: [],
				valueList: [{
					name: 'block (≥1200px)',
					value: 'visible-lg-block'
				}, {
					name: 'block (≥992px)',
					value: 'visible-md-block'
				}, {
					name: 'block (≥768px)',
					value: 'visible-sm-block'
				}, {
					name: 'block (<768px)',
					value: 'visible-xs-block'
				}, {
					name: 'inline (≥1200px)',
					value: 'visible-lg-inline'
				}, {
					name: 'inline (≥992px)',
					value: 'visible-md-inline'
				}, {
					name: 'inline (≥768px)',
					value: 'visible-sm-inline'
				}, {
					name: 'inline (<768px)',
					value: 'visible-xs-inline'
				}, {
					name: 'inline-block (≥1200px)',
					value: 'visible-lg-inline-block'
				}, {
					name: 'inline-block (≥992px)',
					value: 'visible-md-inline-block'
				}, {
					name: 'inline-block (≥768px)',
					value: 'visible-sm-inline-block'
				}, {
					name: 'inline-block (<768px)',
					value: 'visible-xs-inline-block'
				}],
				id: ''
			}]
		}, {
			title: '自定义属性',
			key: 'custom-attr',
			children: []
		}],

		controllers: [{
			name: "布局",
			key: 'layout',
			content: [{
				icon: <svg width="62" height="50" viewBox="0 0 62 50" className="bem-Svg"  style={{'transform': 'translate(0px, 0px)'}}><path opacity=".25" fill="currentColor" d="M59 1H3c-1.1 0-2 .9-2 2v44c0 1.1.9 2 2 2h56c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM14.5 3c.8 0 1.5.7 1.5 1.5S15.3 6 14.5 6 13 5.3 13 4.5 13.7 3 14.5 3zm-5 0c.8 0 1.5.7 1.5 1.5S10.3 6 9.5 6 8 5.3 8 4.5 8.7 3 9.5 3zm-5 0C5.3 3 6 3.7 6 4.5S5.3 6 4.5 6 3 5.3 3 4.5 3.7 3 4.5 3zM59 47H3V8h56v39z"></path><path opacity=".2" fill="currentColor" d="M5 10h52v16H5z"></path><g fill="currentColor"><path d="M5 10h2v4H5zm50 0h2v4h-2zM7 10h2v2H7zm16 0h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zM23 24h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zm6-14h4v2h-4zm0 14h4v2h-4z"></path><path d="M53 10h4v2h-4zm2 12h2v4h-2zM5 22h2v4H5zm0-6h2v4H5zm50 0h2v4h-2zm-2 8h2v2h-2z"></path><path d="M5 24h4v2H5z"></path></g><g opacity=".3" fill="currentColor"><path d="M5 29h2v4H5zm50 0h2v4h-2zM7 29h2v2H7zm16 0h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zM23 43h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zm6-14h4v2h-4zm0 14h4v2h-4z"></path><path d="M53 29h4v2h-4zm2 12h2v4h-2zM5 41h2v4H5zm0-6h2v4H5zm50 0h2v4h-2zm-2 8h2v2h-2z"></path><path d="M5 43h4v2H5z"></path></g><path opacity=".4" d="M57 10v16H5V10h52m1-1H4v18h54V9z"></path></svg>,
				name: '区段',
				key: 'section',
				details: {
					tag: 'section',
					className: ['vd-empty'],
					attrs: [{
						title: '属性设置',
						key: 'section-attr',
                        isAttrSetting: true,
                        isChangeTag: true,
						children: [{
							name: 'tag',
							desc: '标签',
							type: 'select',
							value: ['section'],
							valueList: ['div', 'header', 'footer', 'nav', 'main', 'section', 'article', 'a', 'address', 'figure'],
							id: '',
							isTag: true
						}, {
							name: 'container',
							desc: '是否是容器',
							value: true,
							backend: true,
							isContainer: true
						}]
					}]
				}
			}, {
    			icon: <svg width="62" height="50" viewBox="0 0 62 50" className="bem-Svg" style={{'transform': 'translate(0px, 0px)'}}><path opacity=".2" fill="currentColor" d="M14 10h34v34H14z"></path><g fill="currentColor"><path d="M14 10h2v4h-2zm32 0h2v4h-2zm-30 0h2v2h-2zm10 0h4v2h-4zm-6 0h4v2h-4zm12 0h4v2h-4zm-6 32h4v2h-4zm-6 0h4v2h-4zm12 0h4v2h-4zm6-32h4v2h-4zm0 32h4v2h-4z"></path><path d="M44 10h4v2h-4zm2 30h2v4h-2zm-32 0h2v4h-2zm0-18h2v4h-2zm0-6h2v4h-2zm32 6h2v4h-2zm-32 6h2v4h-2zm32 0h2v4h-2zm-32 6h2v4h-2zm32 0h2v4h-2zm0-18h2v4h-2zm-2 26h2v2h-2z"></path><path d="M14 42h4v2h-4z"></path></g><path opacity=".25" fill="currentColor" d="M59 1H3c-1.1 0-2 .9-2 2v44c0 1.1.9 2 2 2h56c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM14.5 3c.8 0 1.5.7 1.5 1.5S15.3 6 14.5 6 13 5.3 13 4.5 13.7 3 14.5 3zm-5 0c.8 0 1.5.7 1.5 1.5S10.3 6 9.5 6 8 5.3 8 4.5 8.7 3 9.5 3zm-5 0C5.3 3 6 3.7 6 4.5S5.3 6 4.5 6 3 5.3 3 4.5 3.7 3 4.5 3zM59 47H3V8h56v39z"></path><path opacity=".4" d="M48 10v34H14V10h34m1-1H13v36h36V9z"></path></svg>,
				name: '容器',
				key: 'container',
				details: {
					tag: 'div',
					className: ['vd-container', 'vd-empty'],
					attrs: [{
						title: '属性设置',
						key: 'container-attr',
						isChangeTag: true,
                        isAttrSetting: true,
						children: [{
							name: 'tag',
							desc: '标签',
							type: 'select',
							value: ['section'],
                            isTag: true,
							valueList: ['div', 'header', 'footer', 'nav', 'main', 'section', 'article', 'a', 'address', 'figure'],
							id: ''
						}, {
							name: 'container',
							desc: '是否是容器',
							value: true,
							backend: true,
							isContainer: true
						}]
					}]
				}
			}, {
				icon: <svg width="62" height="50" viewBox="0 0 62 50" className="bem-Svg" style={{'transform': 'translate(0px, 0px)'}}><path opacity=".2" fill="currentColor" d="M14 10h16v34H14zm19 0h16v34H33z"></path><g fill="currentColor"><path d="M14 10h2v4h-2zm14 0h2v4h-2zm-12 0h2v2h-2zm4 0h4v2h-4zm0 32h4v2h-4z"></path><path d="M26 10h4v2h-4zm2 30h2v4h-2zm-14 0h2v4h-2zm0-18h2v4h-2zm0-6h2v4h-2zm14 6h2v4h-2zm-14 6h2v4h-2zm14 0h2v4h-2zm-14 6h2v4h-2zm14 0h2v4h-2zm0-18h2v4h-2zm-2 26h2v2h-2z"></path><path d="M14 42h4v2h-4zm19-32h2v4h-2zm14 0h2v4h-2zm-12 0h2v2h-2zm4 0h4v2h-4zm0 32h4v2h-4z"></path><path d="M45 10h4v2h-4zm2 30h2v4h-2zm-14 0h2v4h-2zm0-18h2v4h-2zm0-6h2v4h-2zm14 6h2v4h-2zm-14 6h2v4h-2zm14 0h2v4h-2zm-14 6h2v4h-2zm14 0h2v4h-2zm0-18h2v4h-2zm-2 26h2v2h-2z"></path><path d="M33 42h4v2h-4z"></path></g><path opacity=".25" fill="currentColor" d="M59 1H3c-1.1 0-2 .9-2 2v44c0 1.1.9 2 2 2h56c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM14.5 3c.8 0 1.5.7 1.5 1.5S15.3 6 14.5 6 13 5.3 13 4.5 13.7 3 14.5 3zm-5 0c.8 0 1.5.7 1.5 1.5S10.3 6 9.5 6 8 5.3 8 4.5 8.7 3 9.5 3zm-5 0C5.3 3 6 3.7 6 4.5S5.3 6 4.5 6 3 5.3 3 4.5 3.7 3 4.5 3zM59 47H3V8h56v39z"></path><path opacity=".4" d="M30 10v34H14V10h16m1-1H13v36h18V9zm18 1v34H33V10h16m1-1H32v36h18V9z"></path></svg>,
				name: '栅格',
				key: 'columns',
				details: {
					tag: 'div',
					className: ['row'],
					attrs: [{
						title: '栅格设置',
						key: 'columns-setting',
						children: []
					}],
					children: [{
						tag: 'div',
						className: ['vd-empty','col-md-6'],
						attrs: [{
							title: '栅格设置',
							key: 'columns-setting',
							children: []
						}, {
							title: '属性设置',
							key: 'columns-attr',
							isAttrSetting: true,
							children: [{
								name: 'container',
								desc: '是否是容器',
								value: true,
								backend: true,
								isContainer: true
							}]
						}]
					}, {
						tag: 'div',
						className: ['vd-empty', 'col-md-6'],
						attrs: [{
							title: '栅格设置',
							key: 'columns-setting',
							children: []
						}, {
							title: '属性设置',
							key: 'columns-attr',
							isAttrSetting: true,
							children: [{
								name: 'container',
								desc: '是否是容器',
								value: true,
								backend: true,
								isContainer: true
							}]
						}]
					}]
				},
			}]
		}, {
			name: "基础组件",
			key: 'basic',
			content: [{
				icon: <svg width="36" height="36" viewBox="0 0 36 36" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".2" fill="currentColor" d="M1 1h34v34H1z"></path><g fill="currentColor"><path d="M1 1h2v4H1zm32 0h2v4h-2zM3 1h2v2H3zm10 0h4v2h-4zM7 1h4v2H7zm12 0h4v2h-4zm-6 32h4v2h-4zm-6 0h4v2H7zm12 0h4v2h-4zm6-32h4v2h-4zm0 32h4v2h-4z"></path><path d="M31 1h4v2h-4zm2 30h2v4h-2zM1 31h2v4H1zm0-18h2v4H1zm0-6h2v4H1zm32 6h2v4h-2zM1 19h2v4H1zm32 0h2v4h-2zM1 25h2v4H1zm32 0h2v4h-2zm0-18h2v4h-2zm-2 26h2v2h-2z"></path><path d="M1 33h4v2H1z"></path></g><path opacity=".4" d="M35 1v34H1V1h34m1-1H0v36h36V0z"></path></svg>,
				name: 'div块',
				key: 'div-block',
				details: {
					tag: 'div',
					className: ['vd-empty'],
					attrs: [{
						title: '属性设置',
						key: 'div-block-attr',
                        isChangeTag: true,
                        isSetAttribute: true,
						children: [{
							name: 'tag',
							desc: '标签',
							type: 'select',
							value: ['div'],
							valueList: ['div', 'header', 'footer', 'nav', 'main', 'section', 'article', 'a', 'address', 'figure'],
							id: ''
						}, {
							name: 'container',
							desc: '是否是容器',
							value: true,
							backend: true,
							isContainer: true
						}]
					}]
				}
			}, {
				icon: <svg width="36" height="36" viewBox="0 0 36 36" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".2" fill="currentColor" d="M1 1h34v34H1z"></path><g fill="currentColor"><path d="M1 1h2v4H1zm32 0h2v4h-2zM3 1h2v2H3zm10 0h4v2h-4zM7 1h4v2H7zm12 0h4v2h-4zm-6 32h4v2h-4zm-6 0h4v2H7zm12 0h4v2h-4zm6-32h4v2h-4zm0 32h4v2h-4z"></path><path d="M31 1h4v2h-4zm2 30h2v4h-2zM1 31h2v4H1zm0-18h2v4H1zm0-6h2v4H1zm32 6h2v4h-2zM1 19h2v4H1zm32 0h2v4h-2zM1 25h2v4H1zm32 0h2v4h-2zm0-18h2v4h-2zm-2 26h2v2h-2z"></path><path d="M1 33h4v2H1z"></path></g><path opacity=".4" d="M35 1v34H1V1h34m1-1H0v36h36V0z"></path><path opacity=".5" fill="currentColor" d="M13.6 27c-1.2 0-2.4-.5-3.2-1.3-.9-.9-1.3-2-1.3-3.2 0-1.2.5-2.4 1.3-3.2l3.2-3.2c.3-.3.7-.6 1-.8.7-.4 1.4-.6 2.2-.6 1.5 0 2.8.7 3.7 1.9l-1.3 1.3c-.5-.8-1.4-1.4-2.4-1.4-.2 0-.4 0-.6.1-.5.1-1 .4-1.3.7l-3.2 3.2c-.5.5-.8 1.2-.8 2 0 .7.3 1.4.8 2 .5.5 1.2.8 2 .8.7 0 1.4-.3 2-.8l.9-.9c.7.3 1.4.4 2.2.4L17 25.8c-1.1.7-2.2 1.2-3.4 1.2zm5.1-5.1c-.4 0-.7 0-1.1-.1-.8-.2-1.6-.6-2.2-1.2l-.5-.5 1.3-1.3c.1.2.3.4.4.5.5.5 1.2.8 2 .8.7 0 1.4-.3 2-.8l3.2-3.2c.5-.5.8-1.2.8-2 0-.7-.3-1.4-.8-2-.5-.5-1.2-.8-2-.8-.7 0-1.4.3-2 .8l-.7.9c-.7-.3-1.4-.4-2.2-.4l1.8-1.8c.9-.9 2-1.3 3.2-1.3 1.2 0 2.4.5 3.2 1.3.9.9 1.3 2 1.3 3.2s-.5 2.4-1.3 3.2l-3.2 3.2c-.3.3-.7.6-1 .8-.7.5-1.4.7-2.2.7z"></path></svg>,
				name: '链接块',
				key: 'link-block',
				details: {
					tag: 'a',
					className: ['vd-empty'],
					attrs: [{
						title: '链接设置',
						key: 'link-setting',
						children: [{
							name: 'src',
							desc: '跳转链接',
							type: 'input',
							value: '',
							isAttr: true,
							attrName: 'src',
							id: ''
						}, {
							name: 'target',
							desc: '新窗口打开',
							type: 'toggle',
							value: false,
							isAttr: true,
							attrName: 'target',
							id: ''
						}, {
							name: 'innerHTML',
							desc: '显示文本',
							type: 'input',
							value: 'Brand',
							isHTML: true,
							id: ''
						}]
					}, {
						title: '属性设置',
						key: 'link-block-attr',
						isAttrSetting: true,
						children: [{
							name: 'container',
							desc: '是否是容器',
							value: true,
							backend: true,
							isContainer: true
						}]
					}]
				}
			}, {
				icon: <svg width="59" height="31" viewBox="0 0 59 31" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M56 0H3C1.3 0 0 1.3 0 3v25c0 1.7 1.3 3 3 3h53c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3z"></path><path fill="currentColor" d="M10 16.7H8.8v1.6H10c.6 0 .8-.4.8-.8s-.2-.8-.8-.8zm29.8-2.9c-1.2 0-2.1 1-2.1 2.3 0 1.3.9 2.4 2.1 2.4 1.2 0 2.1-1 2.1-2.4.1-1.4-.9-2.3-2.1-2.3zm-29.3.7c0-.4-.2-.7-.7-.7h-1v1.4h1c.5 0 .7-.4.7-.7zM56 1H3c-1.1 0-2 .9-2 2v25c0 1.1.9 2 2 2h53c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM9.8 20H6.9v-7.9h2.9c1.6 0 2.7.7 2.7 2.1 0 .7-.3 1.3-.9 1.7.9.3 1.2 1.1 1.2 1.8 0 1.7-1.4 2.3-3 2.3zm10.8-2.9c0 1.8-1.3 3-3.3 3-2 0-3.3-1.3-3.3-3v-5h2v5c0 .8.5 1.3 1.4 1.3s1.4-.4 1.4-1.3v-5h1.9v5zm7.6-3.3h-2.4V20h-1.9v-6.2h-2.4v-1.7h6.7v1.7zm7.1 0h-2.4V20H31v-6.2h-2.4v-1.7h6.7v1.7zm4.5 6.3c-2.4 0-4.1-1.8-4.1-4.1s1.7-4 4.1-4c2.4 0 4.1 1.8 4.1 4 .1 2.3-1.7 4.1-4.1 4.1zm12.1-.1H50l-2.2-3.7c-.3-.5-.7-1.3-.7-1.3s.1.8.1 1.3V20h-1.9v-7.9h1.9l2.2 3.7c.3.5.7 1.3.7 1.3s-.1-.8-.1-1.3v-3.7h1.9V20z"></path></svg>,
				name: '按钮',
				key: 'button',
				details: {
					tag: 'a',
					className: ['btn', 'btn-default'],
					attrs: [{
						title: '链接设置',
						key: 'link-setting',
						children: [{
							name: 'src',
							desc: '跳转链接',
							type: 'input',
							value: '',
							isAttr: true,
							attrName: 'src',
							id: ''
						}, {
							name: 'target',
							desc: '新窗口打开',
							type: 'toggle',
							value: false,
							isAttr: true,
							attrName: 'target',
							id: ''
						}, {
							name: 'innerHTML',
							desc: '显示文本',
							type: 'input',
							value: 'Brand',
							isHTML: true,
							id: ''
						}]
					}, {
						title: '属性设置',
						key: 'button-attr',
						isAttrSetting: true,
						children: [{
							name: 'value',
							desc: '按钮值',
							type: 'input',
							value: '按钮',
							isHTML: true,
							id: ''
						}]
					}]
				}
			}, {
				icon: <svg width="48" height="36" viewBox="0 0 48 36" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".2" fill="currentColor" d="M1 1h46v34H1z"></path><g fill="currentColor"><path d="M1 1h2v4H1zm44 0h2v4h-2zM3 1h2v2H3zm10 0h4v2h-4zM7 1h4v2H7zm12 0h4v2h-4zm-6 32h4v2h-4zm-6 0h4v2H7zm12 0h4v2h-4zm6-32h4v2h-4zm0 32h4v2h-4zm6-32h4v2h-4zm0 32h4v2h-4zm6-32h4v2h-4zm0 32h4v2h-4z"></path><path d="M43 1h4v2h-4zm2 30h2v4h-2zM1 31h2v4H1zm0-18h2v4H1zm0-6h2v4H1zm44 6h2v4h-2zM1 19h2v4H1zm44 0h2v4h-2zM1 25h2v4H1zm44 0h2v4h-2zm0-18h2v4h-2zm-2 26h2v2h-2z"></path><path d="M1 33h4v2H1z"></path></g><path opacity=".5" fill="currentColor" d="M18 14v-4h20v4H18m-2-6v8h24V8M18 26v-4h20v4H18m-2-6v8h24v-8"></path><circle fill="currentColor" cx="10" cy="12" r="2" opacity=".5"></circle><circle fill="currentColor" cx="10" cy="24" r="2" opacity=".5"></circle><path opacity=".4" d="M47 1v34H1V1h46m1-1H0v36h48V0z"></path></svg>,
				name: '列表',
				key: 'list',
				details: {
					tag: 'ul',
					className: ['list-group'],
					attrs: [{
						title: '属性设置',
						key: 'list-attr',
                        isAttrSetting: true,
						children: [{
    							name: 'tag',
    							desc: '标签',
    							value: 'ul',
    							isTag: true,
    						}, {
                                name: 'list-style',
                                desc: '有无序号',
                                value: 'circle inside',
                                isStyle: true
                            }, {
								name: 'container',
								desc: '是否是容器',
								value: true,
								backend: true,
								isContainer: true
							}, {
								name: 'specialChild',
								desc: '指定的子元素',
								value: {
									tag: ['LI'],
									className: 'list-group-item'
								},
								backend: true,
								isSpecialChild: true
							}]
						}, {
							title: '列表设置',
							key: 'list-setting',
	                        isChangeTag: true,
						}],
					children: [{
						tag: 'li',
						className: ['list-group-item', 'vd-empty'],
						attrs: [{
							isAttrSetting: true,
							title: '属性设置',
							key: 'list-item-attr',
							children: [{
								name: 'specialParent',
								desc: '必需放入list容器内',
								value: {
									tag: ['UL', 'OL'],
									className: 'list-group'
								},
								isSpecialParent: true,
								backend: true
							}, {
								name: 'container',
								desc: '是否是容器',
								value: true,
								backend: true,
								isContainer: true
							}]
						}]
					}, {
						tag: 'li',
						className: ['list-group-item', 'vd-empty'],
						attrs: [{
							title: '属性设置',
							key: 'list-item-attr',
							isAttrSetting: true,
							children: [{
								name: 'specialParent',
								desc: '必需放入list容器内',
								value: {
									tag: ['UL', 'OL'],
									className: 'list-group'
								},
								isSpecialParent: true,
								backend: true
							}, {
								name: 'container',
								desc: '是否是容器',
								value: true,
								backend: true,
								isContainer: true
							}]
						}]
					}, {
						tag: 'li',
						className: ['list-group-item', 'vd-empty'],
						attrs: [{
							title: '属性设置',
							key: 'list-item-attr',
							isAttrSetting: true,
							children: [{
								name: 'specialParent',
								desc: '必需放入list容器内',
								value: {
									tag: ['UL', 'OL'],
									className: 'list-group'
								},
								isSpecialParent: true,
								backend: true
							}, {
								name: 'container',
								desc: '是否是容器',
								value: true,
								backend: true,
								isContainer: true
							}]
						}]
					}]
				}
			}, {
				icon: <svg width="48" height="36" viewBox="0 0 48 36" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><g opacity=".3" fill="currentColor"><path d="M1 1h2v4H1zm44 0h2v4h-2zM3 1h2v2H3zm10 0h4v2h-4zM7 1h4v2H7zm12 0h4v2h-4zm-6 32h4v2h-4zm-6 0h4v2H7zm12 0h4v2h-4zm6-32h4v2h-4zm0 32h4v2h-4zm6-32h4v2h-4zm0 32h4v2h-4zm6-32h4v2h-4zm0 32h4v2h-4z"></path><path d="M43 1h4v2h-4zm2 30h2v4h-2zM1 31h2v4H1zm0-18h2v4H1zm0-6h2v4H1zm44 6h2v4h-2zM1 19h2v4H1zm44 0h2v4h-2zM1 25h2v4H1zm44 0h2v4h-2zm0-18h2v4h-2zm-2 26h2v2h-2z"></path><path d="M1 33h4v2H1z"></path></g><circle cx="9" cy="12" r="3" opacity=".4"></circle><circle fill="currentColor" cx="9" cy="12" r="2"></circle><circle cx="9" cy="24" r="3" opacity=".4"></circle><circle fill="currentColor" cx="9" cy="24" r="2"></circle><path fill="currentColor" d="M38 10v4H18v-4h20m2-2H16v8h24V8z"></path><path opacity=".2" fill="currentColor" d="M18 10h20v4H18z"></path><path opacity=".4" d="M40 8v8H16V8h24m1-1H15v10h26V7z"></path><path fill="currentColor" d="M38 22v4H18v-4h20m2-2H16v8h24v-8z"></path><path opacity=".2" fill="currentColor" d="M18 22h20v4H18z"></path><path opacity=".4" d="M40 20v8H16v-8h24m1-1H15v10h26V19z"></path></svg>,
				name: '列表项',
				key: 'list-item',
				details: {
					tag: 'li',
					className: ['list-group-item', 'vd-empty'],
					attrs: [{
						title: '属性设置',
						key: 'list-item-attr',
						isAttrSetting: true,
						children: [{
							name: 'specialParent',
							desc: '必需放入list容器内',
							value: {
								tag: ['UL', 'OL'],
								className: 'list-group'
							},
							isSpecialParent: true,
							backend: true
						}, {
							name: 'container',
							desc: '是否是容器',
							value: true,
							backend: true,
							isContainer: true
						}]
					}]

				}
			}]
		}, {
			name: "段落",
			key: 'typo',
			content: [{
				icon: <svg width="60" height="32" viewBox="0 0 60 32" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M6.9 5.5H4V1.2H.4V13H4V9h2.9v4h3.7V1.2H6.9v4.3zm26.6-1.8c-.4-.2-.9-.2-1.4-.2-1.3 0-2.4.4-3.3 1.3-.5.5-.9 1.1-1.1 1.8-.1-1-.5-1.7-1.2-2.2-.7-.6-1.7-.9-2.8-.9-1.4 0-2.6.4-3.7 1.3l-.7.6.6.8.7 1-.2.1c-.2.1-.3.2-.4.3-.1-1.2-.5-2.2-1.4-3-.9-.8-2-1.2-3.2-1.2-1.3 0-2.4.4-3.3 1.3-1 .9-1.4 2.1-1.4 3.5 0 1.5.5 2.6 1.4 3.5.9.9 2 1.3 3.4 1.3 1.6 0 2.9-.5 3.9-1.6l.3-.3V11c.2.4.4.8.8 1 .7.6 1.6.9 2.6.9.5 0 1-.1 1.5-.2v.3H28v-2.9c-.1-.2-.1-.4-.1-.5.2.9.6 1.6 1.2 2.2.9.9 2 1.4 3.2 1.4.6 0 1.1-.1 1.5-.3v.1H37V.6h-3.6v3.1zm-14.4 6.4L19 10h.1v-.3c0 .2 0 .4.1.6 0 0-.1-.1-.1-.2zm4.2-.3c-.3 0-.5-.1-.6-.1.1 0 .3-.1.7-.1h.6c-.3.1-.5.2-.7.2zm9.8-.4c-.2.3-.5.4-.8.4-.4 0-.6-.1-.9-.4-.3-.3-.4-.6-.4-1 0-.5.1-.8.4-1.1.3-.3.5-.4.9-.4.3 0 .6.1.8.4.3.3.4.6.4 1.1 0 .4-.1.7-.4 1zM40.5 1c-.4-.4-.9-.6-1.4-.6-.5 0-1 .2-1.4.6-.4.4-.6.9-.6 1.4 0 .4.1.8.4 1.2h-.2V13h3.6V3.6h-.2c.3-.3.4-.7.4-1.2 0-.6-.2-1.1-.6-1.4zm15 2.6v.1c-.4-.2-.9-.2-1.4-.2-1.3 0-2.3.5-3.2 1.4-.5.5-.8 1.1-1 1.8-.1-.8-.5-1.5-1-2.1-.7-.7-1.6-1.1-2.7-1.1-.5 0-1 .1-1.5.3v-.2h-3.6V13h3.6V8c0-.6.2-.8.3-.8.2-.2.5-.3.7-.3.4 0 .7 0 .7 1.1v5H50V9.8c-.1-.2-.1-.3-.1-.5.2.8.5 1.5 1.1 2.1.1.2.3.3.5.4l-.3.5-.7 1.2-.5.8.7.6c1.1.8 2.3 1.3 3.7 1.3 1.4 0 2.5-.4 3.4-1.3.9-.9 1.4-2.1 1.4-3.7V3.6h-3.7zm-.3 5.3c-.2.2-.5.3-.8.3-.4 0-.6-.2-.8-.3-.2-.3-.3-.6-.3-.9 0-.4.1-.7.3-1 .2-.2.4-.3.7-.3.4 0 .6.1.8.3.2.3.3.6.3 1 .1.4 0 .7-.2.9z"></path><g fill="currentColor"><path d="M1.4 12V2.2H3v4.2h4.9V2.2h1.7V12H7.9V8H3v4H1.4z"></path><path d="M1.4 12V2.2H3v4.2h4.9V2.2h1.7V12H7.9V8H3v4H1.4zm17.5-3h-5.8c0 .5.3 1 .7 1.3.5.3 1 .5 1.6.5.9 0 1.6-.3 2.1-.9l.9 1c-.8.8-1.8 1.2-3.1 1.2-1 0-1.9-.3-2.7-1s-1.1-1.6-1.1-2.8c0-1.2.4-2.1 1.1-2.8.7-.7 1.6-1 2.6-1s1.9.3 2.6.9 1.1 1.5 1.1 2.5V9zm-5.8-1.3h4.3c0-.6-.2-1.1-.6-1.4-.4-.3-.9-.5-1.4-.5s-1.2.2-1.6.5c-.5.4-.7.8-.7 1.4z"></path><path d="M18.9 9h-5.8c0 .5.3 1 .7 1.3.5.3 1 .5 1.6.5.9 0 1.6-.3 2.1-.9l.9 1c-.8.8-1.8 1.2-3.1 1.2-1 0-1.9-.3-2.7-1s-1.1-1.6-1.1-2.8c0-1.2.4-2.1 1.1-2.8.7-.7 1.6-1 2.6-1s1.9.3 2.6.9 1.1 1.5 1.1 2.5V9zm-5.8-1.3h4.3c0-.6-.2-1.1-.6-1.4-.4-.3-.9-.5-1.4-.5s-1.2.2-1.6.5c-.5.4-.7.8-.7 1.4zM26.7 12h-1.4v-1c-.6.7-1.4 1.1-2.5 1.1-.8 0-1.4-.2-1.9-.7s-.8-1-.8-1.8.3-1.3.8-1.6c.5-.4 1.3-.5 2.2-.5h2v-.3c0-1-.6-1.5-1.7-1.5-.7 0-1.4.3-2.2.8l-.7-1c.9-.7 1.9-1.1 3.1-1.1.9 0 1.6.2 2.1.7s.8 1.1.8 2.1V12zm-1.6-2.8v-.6h-1.8c-1.1 0-1.7.4-1.7 1.1 0 .4.1.6.4.8.3.2.7.3 1.2.3s.9-.1 1.3-.4c.4-.3.6-.7.6-1.2z"></path><path d="M26.7 12h-1.4v-1c-.6.7-1.4 1.1-2.5 1.1-.8 0-1.4-.2-1.9-.7s-.8-1-.8-1.8.3-1.3.8-1.6c.5-.4 1.3-.5 2.2-.5h2v-.3c0-1-.6-1.5-1.7-1.5-.7 0-1.4.3-2.2.8l-.7-1c.9-.7 1.9-1.1 3.1-1.1.9 0 1.6.2 2.1.7s.8 1.1.8 2.1V12zm-1.6-2.8v-.6h-1.8c-1.1 0-1.7.4-1.7 1.1 0 .4.1.6.4.8.3.2.7.3 1.2.3s.9-.1 1.3-.4c.4-.3.6-.7.6-1.2zm4.4 1.8c-.7-.7-1-1.6-1-2.8s.4-2.1 1.1-2.8c.7-.7 1.6-1 2.6-1s1.8.4 2.4 1.3V1.6H36V12h-1.6v-1.1c-.6.8-1.4 1.2-2.5 1.2-.9 0-1.7-.3-2.4-1.1zm.5-2.7c0 .7.2 1.3.7 1.7.5.4 1 .7 1.6.7.6 0 1.1-.2 1.6-.7.4-.5.6-1 .6-1.7s-.2-1.3-.6-1.8c-.4-.5-1-.7-1.6-.7s-1.2.2-1.7.7c-.4.5-.6 1.1-.6 1.8z"></path><path d="M29.5 11c-.7-.7-1-1.6-1-2.8s.4-2.1 1.1-2.8c.7-.7 1.6-1 2.6-1s1.8.4 2.4 1.3V1.6H36V12h-1.6v-1.1c-.6.8-1.4 1.2-2.5 1.2-.9 0-1.7-.3-2.4-1.1zm.5-2.7c0 .7.2 1.3.7 1.7.5.4 1 .7 1.6.7.6 0 1.1-.2 1.6-.7.4-.5.6-1 .6-1.7s-.2-1.3-.6-1.8c-.4-.5-1-.7-1.6-.7s-1.2.2-1.7.7c-.4.5-.6 1.1-.6 1.8zm8.4-5.2c-.2-.2-.3-.4-.3-.7s.1-.5.3-.7c.2-.2.4-.3.7-.3s.5.1.7.3.3.4.3.7-.1.5-.3.7c-.2.2-.4.3-.7.3s-.5-.1-.7-.3zm1.5 8.9h-1.6V4.6h1.6V12z"></path><path d="M38.4 3.1c-.2-.2-.3-.4-.3-.7s.1-.5.3-.7c.2-.2.4-.3.7-.3s.5.1.7.3.3.4.3.7-.1.5-.3.7c-.2.2-.4.3-.7.3s-.5-.1-.7-.3zm1.5 8.9h-1.6V4.6h1.6V12zm3.8-4v4h-1.6V4.6h1.6V6c.3-.5.6-.8 1-1.1.4-.3.9-.4 1.4-.4.8 0 1.5.3 2 .8.6.4.9 1.2.9 2.1V12h-1.6V7.9c0-1.4-.6-2.1-1.7-2.1-.5 0-1 .2-1.4.5-.4.5-.6 1-.6 1.7z"></path><path d="M43.7 8v4h-1.6V4.6h1.6V6c.3-.5.6-.8 1-1.1.4-.3.9-.4 1.4-.4.8 0 1.5.3 2 .8.6.4.9 1.2.9 2.1V12h-1.6V7.9c0-1.4-.6-2.1-1.7-2.1-.5 0-1 .2-1.4.5-.4.5-.6 1-.6 1.7zm14.4-3.4V11c0 1.3-.4 2.3-1.1 3s-1.6 1-2.8 1-2.1-.3-3-1l.7-1.2c.7.6 1.5.8 2.2.8.7 0 1.3-.2 1.8-.6s.7-1 .7-1.8v-1c-.2.4-.6.8-1 1.1-.4.3-.9.4-1.5.4-1 0-1.8-.3-2.4-1-.6-.7-1-1.5-1-2.6 0-1 .3-1.9 1-2.6.6-.7 1.4-1 2.4-1s1.8.4 2.4 1.2V4.6h1.6zM52.2 8c0 .6.2 1.1.6 1.6s.9.7 1.5.7 1.2-.2 1.6-.6c.4-.4.6-1 .6-1.6 0-.6-.2-1.2-.6-1.6s-.9-.8-1.6-.8-1.1.2-1.5.7c-.4.4-.6 1-.6 1.6z"></path><path d="M58.1 4.6V11c0 1.3-.4 2.3-1.1 3s-1.6 1-2.8 1-2.1-.3-3-1l.7-1.2c.7.6 1.5.8 2.2.8.7 0 1.3-.2 1.8-.6s.7-1 .7-1.8v-1c-.2.4-.6.8-1 1.1-.4.3-.9.4-1.5.4-1 0-1.8-.3-2.4-1-.6-.7-1-1.5-1-2.6 0-1 .3-1.9 1-2.6.6-.7 1.4-1 2.4-1s1.8.4 2.4 1.2V4.6h1.6zM52.2 8c0 .6.2 1.1.6 1.6s.9.7 1.5.7 1.2-.2 1.6-.6c.4-.4.6-1 .6-1.6 0-.6-.2-1.2-.6-1.6s-.9-.8-1.6-.8-1.1.2-1.5.7c-.4.4-.6 1-.6 1.6z"></path></g><path fill="currentColor" d="M1 17v2h57v-2H1zm55 4H1v2h55v-2zM1 27h56v-2H1v2zm0 4h27v-2H1v2z" opacity=".25"></path></svg>,
				name: '头部',
				key: 'heading',
				details: {
					tag: 'h1',
					className: [],
					attrs: [{
						title: '属性设置',
						key: 'h1-attr',
						isAttrSetting: true,
                        isChangeTag: true,
						children: [{
							name: 'innerHTML',
							desc: '文本内容',
							type: 'input',
							value: '标题',
							isHTML: true,
							id: ''
						}, {
							name: 'tag',
							desc: '标签',
							type: 'select',
							value: 'h1',
							isTag: true,
							valueList: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
							id: ''
						}]
					}]
				}
			}, {
				icon: <svg width="59" height="16" viewBox="0 0 59 16" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M0 0v16h29v-4h29V8h-1V4h2V0H0zm1 7h55H1zm57-4H1h57z"></path><path fill="currentColor" d="M1 1v2h57V1H1zm55 4H1v2h55V5zM1 11h56V9H1v2zm0 4h27v-2H1v2z"></path></svg>,
				name: '段落',
				key: 'paragraph',
				details: {
					tag: 'p',
					className: ['text-muted'],
					attrs: [{
						title: '属性设置',
						key: 'paragraph-attr',
						isAttrSetting: true,
						children: [{
							name: 'innerHTML',
							desc: '文本内容',
							type: 'input',
							props: {
								type: 'textarea'
							},
							value: '这是一个段落',
							isHTML: true,
							id: ''
						}]
					}]
				}
			}, {
				icon: <svg width="31" height="19" viewBox="0 0 31 19" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M11.3 1c-.4-.4-.9-.6-1.4-.6-.5 0-1 .2-1.4.6-.4.3-.6.8-.6 1.4 0 .4.1.8.4 1.2h-.2v5.9H4V1.2H.4V13h11.3V3.6h-.2c.3-.3.4-.7.4-1.2-.1-.6-.3-1.1-.6-1.4zm-3.8 9.4H3V2.2H1.4V12 2.2H3v8.2h4.5zm2.9-7.3c-.2.1-.4.2-.6.2.3.1.5 0 .6-.2zM9.2 1.7c.1-.1.2-.1.2-.2-.1 0-.2.1-.2.2zm0 1.4c.2.2.3.2.5.3-.2-.1-.4-.2-.5-.3-.1-.1-.2-.2-.2-.3 0 .1.1.2.2.3zm1.4 1.5H9.1V12 4.6h1.5zm.1-1.7c.1-.2.2-.3.2-.5s-.1-.4-.2-.6c.1.2.2.3.2.5-.1.3-.1.4-.2.6zm6.2.5c-.5 0-1 .1-1.5.3v-.1h-3.6V13h3.6V8c0-.6.2-.8.3-.8.2-.2.5-.3.7-.3.4 0 .7 0 .7 1.1v5h3.6V7.4c0-1.2-.4-2.2-1.1-2.9-.6-.7-1.6-1.1-2.7-1.1zm-2.4 1.2h-1.6V12 4.6h1.6zm0 1.3c.1-.2.2-.4.4-.5-.2.1-.3.3-.4.5zm2 0c-.4 0-.7.1-1 .3.2-.3.6-.3 1-.3s.8.1 1.1.3c-.3-.2-.7-.3-1.1-.3zm2.5-.7c.2.2.3.3.4.5-.1-.2-.3-.3-.4-.5zm8 2.4l2.3-2.4 1.6-1.7h-4.8l-.3.3-1.3 1.4V.6h-3.6V13h3.6v-2.7l1.5 2.2.3.4h4.3l-1.1-1.6L27 7.6zm-3.5-6v6.1-6.1zm0 8.3V12 9.9zm1.1-1.2l.9 1.4-.9-1.4zm.2-2.3l1.7-1.8h2-2l-1.7 1.8z"></path><g fill="currentColor"><path d="M1.4 12V2.2H3v8.2h4.5V12H1.4z"></path><path d="M1.4 12V2.2H3v8.2h4.5V12H1.4zm7.8-8.9c-.2-.2-.3-.5-.3-.7s.1-.5.3-.7c.2-.2.4-.3.7-.3s.5.1.7.3.3.4.3.7-.1.5-.3.7c-.2.2-.4.3-.7.3s-.5-.1-.7-.3zm1.4 8.9H9.1V4.6h1.6V12z"></path><path d="M9.2 3.1c-.2-.2-.3-.5-.3-.7s.1-.5.3-.7c.2-.2.4-.3.7-.3s.5.1.7.3.3.4.3.7-.1.5-.3.7c-.2.2-.4.3-.7.3s-.5-.1-.7-.3zm1.4 8.9H9.1V4.6h1.6V12zm3.9-4v4h-1.6V4.6h1.6V6c.3-.5.6-.8 1-1.1.4-.3.9-.4 1.4-.4.8 0 1.5.3 2 .8s.8 1.3.8 2.2V12h-1.6V7.9c0-1.4-.6-2.1-1.7-2.1-.5 0-1 .2-1.4.5-.3.5-.5 1-.5 1.7z"></path><path d="M14.5 8v4h-1.6V4.6h1.6V6c.3-.5.6-.8 1-1.1.4-.3.9-.4 1.4-.4.8 0 1.5.3 2 .8s.8 1.3.8 2.2V12h-1.6V7.9c0-1.4-.6-2.1-1.7-2.1-.5 0-1 .2-1.4.5-.3.5-.5 1-.5 1.7zm9 4h-1.6V1.6h1.6v6.1l3-3.2h2l-2.8 3 3 4.5h-1.9l-2.2-3.3-1.1 1.1V12z"></path><path d="M23.5 12h-1.6V1.6h1.6v6.1l3-3.2h2l-2.8 3 3 4.5h-1.9l-2.2-3.3-1.1 1.1V12z"></path></g><g opacity=".4"><path d="M1 18v-2h29v2H1m30-3H0v4h31v-4"></path><path d="M1 16h29v2H1z"></path></g><path fill="currentColor" d="M1 16h29v2H1z"></path></svg>,
				name: '文本链接',
				key: 'text-link',
				details: {
					tag: 'a',
					className: [],
					attrs: [{
						title: '链接设置',
						key: 'link-setting',
						children: [{
							name: 'href',
							desc: '跳转链接',
							type: 'input',
							value: '',
							isAttr: true,
							attrName: 'src',
							id: ''
						}, {
							name: 'target',
							desc: '新窗口打开',
							type: 'toggle',
							value: false,
							isAttr: true,
							isTarget: true,
							attrName: 'target',
							id: ''
						}, {
							name: 'innerHTML',
							desc: '显示文本',
							type: 'toggle',
							value: '这是一个链接',
							isHTML: true,
							id: ''
						}]
					}, {
						title: '属性设置',
						key: 'text-link-attr',
						isAttrSetting: true,
						children: [{
							name: 'innerHTML',
							desc: '文本内容',
							type: 'input',
							value: '这是一个链接',
							isHTML: true,
							id: ''
						}]
					}]
				}
			}, {
				icon: <svg width="33" height="13" viewBox="0 0 33 13" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M10 .2H.4v3.5h3V12h3.7V3.7h3V.2zm22.4 9.7l-.6-1.1-.7-1.2-.9 1-.2.2v-3h2V2.6h-2V.2h-3.6v2.3H23l-.3.5-.8 1.2-.8-1.2-.3-.5h-4.4l.8 1.2-.2-.2c-.9-.8-2-1.2-3.2-1.2-1.3 0-2.4.4-3.3 1.3-1 .9-1.4 2.1-1.4 3.5 0 1.5.5 2.6 1.4 3.5.9.9 2.1 1.3 3.4 1.3 1.1 0 2.1-.3 2.9-.8l-.5.9h4.3l.3-.4.9-1.3 1 1.3.3.4h4.4l-1.1-1.6L24 7.2l1.3-1.8v.5h.9v2.7c0 1.1.3 1.9 1 2.6.7.6 1.5 1 2.4 1 .9 0 1.8-.3 2.5-1l.6-.5-.3-.8zM18 9.5l-.3-.3-.2-.2h.9l-.4.5zm.5-.7V6.9c0-.7-.1-1.3-.3-1.8l1.5 2.2-1.2 1.5zm6.8-5.2l-2.5 3.6 2.5-3.6z"></path><path d="M6.1 2.7V11H4.4V2.7h-3V1.2H9v1.5H6.1zM17.5 8h-5.8c0 .5.3 1 .7 1.3.5.3 1 .5 1.6.5.9 0 1.6-.3 2.1-.9l.9 1c-.8.8-1.8 1.2-3.1 1.2-1 0-1.9-.3-2.7-1s-1.1-1.6-1.1-2.8c0-1.2.4-2.1 1.1-2.8.7-.7 1.6-1 2.6-1s1.9.3 2.6.9 1.1 1.5 1.1 2.5V8zm-5.8-1.3H16c0-.6-.2-1.1-.6-1.4-.4-.3-.9-.5-1.5-.5s-1.1.2-1.5.5c-.5.4-.7.8-.7 1.4zm8.6-3.1L21.9 6l1.7-2.5h1.9l-2.6 3.6 2.7 3.8h-1.9l-1.8-2.5-1.8 2.6h-1.8l2.6-3.8-2.5-3.7h1.9zm8.5 1.2v3.8c0 .4.1.6.3.8.2.2.4.3.8.3s.7-.2 1-.5l.6 1.1c-.6.5-1.2.7-1.8.7-.7 0-1.2-.2-1.7-.7-.5-.5-.7-1.1-.7-1.9V4.8h-.9V3.6h.9V1.2h1.6v2.3h2v1.3h-2.1z" fill="currentColor"></path></svg>,
				name: '文本块',
				key: 'text-block',
				details: {
					tag: 'div',
					className: [],
					attrs: [{
						title: '属性设置',
						key: 'text-block-attr',
                        isChangeTag: true,
						children: [{
							name: 'tag',
							desc: '标签',
							type: 'select',
							value: 'h1',
							isTag: true,
							valueList: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
							id: ''
						}]
					}],
					children: [{
						tag: 'p',
						className: ['text-muted'],
						attrs: [{
							title: '属性设置',
							key: 'p-attr',
							isAttrSetting: true,
							children: [{
								name: 'innerHTML',
								desc: '文本内容',
								type: 'input',
								props: {
									type: 'textarea'
								},
								value: '这是一个文本块',
								isHTML: true,
								id: ''
							}]
						}]
					}]
				}
			}, {
				icon: <svg width="56" height="29" viewBox="0 0 56 29" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M56 17v-4h-2V9H22v8H0v12h36v-4h19v-4h-1v-4h2zm-1-3v2-2zm-32 0v2-2zm-4.1 2l.8.2.3-.7.8-1.7.5-1-1-.4c-1.1-.4-2-1.3-2.4-2.3H21V0H11v6.5c0 4.9 3 8.5 7.9 9.5zm-2.2-7H20h-3.3zm-8.8 7l.8.2.3-.8.8-1.7.5-1-1-.4c-1.1-.4-2-1.3-2.4-2.3H10V0H0v6.5C0 11.4 3 15 7.9 16zm1-2.7l-.5 1 .5-1C7.7 12.8 6.7 12 6.2 11c.5 1 1.5 1.8 2.7 2.3zM5.7 9H9V1v8H5.7z"></path><path fill="currentColor" d="M23 14v2h32v-2H23zm30 4H1v2h52v-2zm0-8H23v2h30v-2zM1 24h53v-2H1v2zm0 4h34v-2H1v2zM1 6.5c0 4.6 2.9 7.7 7.1 8.5l.8-1.7c-2-.8-3.2-2.5-3.2-4.3H9V1H1v5.5zM20 1h-8v5.5c0 4.6 2.9 7.7 7.1 8.5l.8-1.7c-1.9-.7-3.2-2.5-3.2-4.3H20V1z"></path></svg>,
				name: '引用',
				key: 'block-quote',
				details: {
					tag: 'blockquote',
					className: ['highlight'],
					attrs: [{
						title: '属性设置',
						key: 'block-quote-attr',
						isAttrSetting: true,
						children: [{
							name: 'innerHTML',
							desc: '文本内容',
							type: 'input',
							props: {
								type: 'textarea'
							},
							value: '这是一个引用块',
							isHTML: true,
							id: ''
						}]
					}]
				}
			}, {
				icon: <svg width="55" height="33" viewBox="0 0 55 33" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M45 1H25v6h20V1zm-1 1H26v4h18-18V2h18zM20 19c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3H3C1.3 0 0 1.3 0 3v13c0 1.7 1.3 3 3 3h17zm2-16c0-.5-.2-.9-.5-1.3.3.4.5.8.5 1.3zm-7.5 4.7l-4.1 4.5 4.1-4.5zm-4 5.9l3.9-4.3L18 14h-7.9l.4-.4zm-3.2-1.9L9 13.6l.4.4H5.2l2.1-2.3zm-1.2-.2l1.1-1.3-1.1 1.3zm2.4.1l1.2 1.3-1.2-1.3zM9 6c0-.7-.4-1.3-.9-1.7.5.4.9 1 .9 1.7zM7 5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm-1-.7c-.6.3-1 1-1 1.7 0 1.1.9 2 2 2 .7 0 1.2-.3 1.6-.8-.4.5-.9.8-1.6.8-1.1 0-2-.9-2-2 0-.7.4-1.4 1-1.7zM3 15h17l-4.5-6 4.5 6H3zm-2 1V3c0-.5.2-.9.5-1.3-.3.4-.5.8-.5 1.3v13c0 .6.2 1.1.6 1.4-.4-.4-.6-.9-.6-1.4zm2 2h17c.4 0 .8-.1 1.1-.3-.3.2-.7.3-1.1.3H3zm22-9v12H1v12h34v-4h17v-4h2v-4h-2v-4h2v-4h1V9H25zm1 9v2h25-25v-2zM2 26v2-2zm32 6H2v-2 2h32zm19-10H2v2h51H2v-2h51zm0-8H26v2-2h27zm1-2H26v-2h28v2zm0-2H26v2h28v-2z"></path><path fill="currentColor" d="M26 10v2h28v-2H26zm0 6h27v-2H26v2zM44 2H26v4h18V2zm7 16H26v2h25v-2zM2 28h49v-2H2v2zm0-4h51v-2H2v2zm0 8h32v-2H2v2zm18-14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h17zM7 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm.3 6.3L9.8 13l4.7-5.2L20 15H3l4.3-4.7z"></path></svg>,
				name: '富文本',
				key: 'rich-text',
				details: {
					tag: 'div',
					className: [],
					attrs: [],
					children: [{
						tag: 'h1',
						className: [],
						attrs: [{
							title: '属性设置',
							key: 'h1-attr',
							isAttrSetting: true,
                            isChangeTag: true,
							children: [{
								name: 'innerHTML',
								desc: '文本内容',
								type: 'input',
								value: '标题',
								isHTML: true,
								id: ''
							}, {
								name: 'tag',
								desc: '标签',
								type: 'select',
								value: 'h1',
								isTag: true,
								valueList: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
								id: ''
							}]
						}]
					}, {
						tag: 'p',
						className: ['text-muted'],
						attrs: [{
							title: '属性设置',
							key: 'p-attr',
							isAttrSetting: true,
							children: [{
								name: 'innerHTML',
								desc: '文本内容',
								type: 'input',
								props: {
									type: 'textarea'
								},
								value: '这是一个文本块',
								isHTML: true,
								id: ''
							}]
						}]
					}, {
						tag: 'p',
						className: ['text-muted'],
						attrs: [{
							title: '属性设置',
							key: 'p-attr',
							isAttrSetting: true,
							children: [{
								name: 'innerHTML',
								desc: '文本内容',
								type: 'input',
								props: {
									type: 'textarea'
								},
								value: '这是另一个文本块',
								isHTML: true,
								id: ''
							}]
						}]
					}]
				}
			}]
		}, {
			name: "媒体",
			key: 'media',
			content: [{
				icon: <svg width="50" height="37" viewBox="0 0 50 37" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M47 0H3C1.3 0 0 1.3 0 3v31c0 1.7 1.3 3 3 3h44c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3zm0 36H3c-.8 0-1.4-.5-1.8-1.1.4.6 1 1.1 1.8 1.1h44zM16 12.5c0 1.4-1.1 2.5-2.5 2.5S11 13.9 11 12.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5zm-3.9 3.2s-.1 0-.1-.1l.1.1zm11.2 8.4l.7-.8 6.9-7.9 9 13.7H12.4l7.5-8.5 2.7 2.7.7.8zM41.8 30l-8.4-12.7L41.8 30zm-18.5-7.4l3.5-4-3.5 4zm-3.4-3.5l-4.4 5 4.4-5 1 1-1-1zM13.5 9c-1.9 0-3.5 1.6-3.5 3.5 0 1.2.6 2.3 1.5 2.9-.9-.6-1.5-1.7-1.5-2.9 0-1.9 1.6-3.5 3.5-3.5.5 0 .9.1 1.4.3-.5-.2-.9-.3-1.4-.3zM49 3v-.4c-.2-.9-1-1.6-2-1.6H3h44c1 0 1.8.7 2 1.6V3z"></path><path fill="currentColor" d="M47 1H3c-1.1 0-2 .9-2 2v31c0 1.1.9 2 2 2h44c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM13.5 9c1.9 0 3.5 1.6 3.5 3.5S15.4 16 13.5 16 10 14.4 10 12.5 11.6 9 13.5 9zm-3.3 21l9.6-10.9 3.4 3.5 7.7-8.9L41.8 30H10.2z"></path></svg>,
				name: '图片',
				key: 'image',
				details: {
					tag: 'img',
					className: ['img-rounded'],
					attrs: [{
						title: '图片设置',
						key: 'image-setting',
						children: [{
							name: 'src',
							desc: '图片地址',
							type: 'input',
							value: '',
							isAttr: true,
							attrName: 'src',
							id: '',
							fileInfo: [{
								uid: -1,
								name: 'image-placeholder.svg',
								states: 'done',
								url: 'https://d3e54v103j8qbb.cloudfront.net/img/image-placeholder.svg',
								thumbUrl: 'https://d3e54v103j8qbb.cloudfront.net/img/image-placeholder.svg'
							}]
						}, {
							name: 'alt',
							desc: '替换文本',
							type: 'input',
							value: '',
							isAttr: true,
							attrName: 'alt'
						}, {
							name: 'width',
							desc: '宽度',
							type: 'input',
							value: 150,
							isAttr: true,
							attrName: 'width'
						}, {
							name: 'height',
							desc: '高度',
							type: 'input',
							value: 150,
							isAttr: true,
							attrName: 'height'
						}, {
							name: 'image_placeholder',
							desc: '占位图片',
							type: 'input',
							value: '',
							isImagePlaceholder: true
						}]
					}]
				}
			}, {
				icon: <svg width="50" height="37" viewBox="0 0 50 37" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M47 0H3C1.3 0 0 1.3 0 3v31c0 1.7 1.3 3 3 3h44c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3zm-9 13.7v9.6l-6-3.4v-2.8l6-3.4zM39 25l-3.6-2 3.6 2zM13 14c0-.6.4-1 1-1h13c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1H14c-.6 0-1-.4-1-1v-9zm1 11h13c.9 0 1.7-.6 1.9-1.5-.2.8-1 1.5-1.9 1.5H14c-.6 0-1.1-.2-1.4-.6.3.4.9.6 1.4.6zm14.7-12.1c-.1-.1-.2-.2-.2-.3 0 .1.1.2.2.3.2.3.3.7.3 1.1 0-.4-.1-.8-.3-1.1zM1 3c0-.2 0-.3.1-.5-.1.2-.1.3-.1.5zm.1 31.5c-.1-.1-.1-.3-.1-.5 0 .2 0 .4.1.5z"></path><path fill="currentColor" d="M47 1H3c-1.1 0-2 .9-2 2v31c0 1.1.9 2 2 2h44c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM29 23c0 1.1-.9 2-2 2H14c-1.1 0-2-.9-2-2v-9c0-1.1.9-2 2-2h13c1.1 0 2 .9 2 2v9zm10 2l-8-4.5v-4l8-4.5v13z"></path></svg>,
				name: '视频',
				key: 'video',
				details: {
					tag: 'video',
					className: [],
					attrs: [{
						title: '属性设置',
						key: 'video-attr',
						isAttrSetting: true,
						children: [{
							name: 'src',
							desc: '链接',
							type: 'input',
							value: '',
							id: '',
                            isAttr: true,
                            attrName: 'src'
						}, {
							name: 'width',
							desc: '宽度',
							type: 'input',
							value: 400,
							isAttr: true,
							attrName: 'width'
						}, {
							name: 'height',
							desc: '高度',
							type: 'input',
							value: 200,
							isAttr: true,
							attrName: 'height',
						},{
                            name: 'controls',
                            desc: '显示控件',
                            value: true,
                            type: 'toggle',
                            attrName: 'controls',
                            isToggleAttr: true
                        },{
                            name: 'loop',
                            desc: '循环播放',
                            value: true,
                            type: 'toggle',
                            attrName: 'loop',
                            isToggleAttr: true
                        },{
                            name: 'autoplay',
                            desc: '自动播放',
                            value: true,
                            type: 'toggle',
                            attrName: 'autoplay',
                            isToggleAttr: true
                        },{
                            name: 'poster',
                            desc: '播放前的显示图片',
                            type: 'input',
                            value: 'https://d3e54v103j8qbb.cloudfront.net/static/video-placeholder.v1.svg',
                            attrName: 'poster',
                            isAttr: true,
                        }
                    ]
					}]
				}
			}]
		}, {
			name: "表单",
			key: 'forms',
			content: [{
				icon: <svg width="41" height="39" viewBox="0 0 41 39" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M38 3v7H3V3h35m2-2H1v11h39V1z"></path><path opacity=".2" fill="currentColor" d="M3 3h35v7H3z"></path><path opacity=".4" d="M40 1v11H1V1h39m1-1H0v13h41V0z"></path><path fill="currentColor" d="M38 18v7H3v-7h35m2-2H1v11h39V16z"></path><path opacity=".2" fill="currentColor" d="M3 18h35v7H3z"></path><path opacity=".4" d="M40 16v11H1V16h39m1-1H0v13h41V15zM19 30H3c-1.7 0-3 1.3-3 3v3c0 1.7 1.3 3 3 3h16c1.7 0 3-1.3 3-3v-3c0-1.7-1.3-3-3-3z"></path><path fill="currentColor" d="M19 31H3c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2z"></path></svg>,
				name: '表单块',
				key: 'form-block',
				details: {
					tag: 'form',
					className: [],
					attrs: [{
						title: '表单设置',
						key: 'form-setting',
						children: [{
							name: 'state',
							desc: '链接',
							type: 'radio',
							value: 'normal',
							children: [{
								name: '正常',
								value: 'normal'
							}, {
								name: '成功',
								value: 'success'
							}, {
								name: '报错',
								value: 'error'
							}],
							id: ''
						}, {
							name: 'form-name',
							desc: '表单名称',
							type: 'input',
							value: '',
							props: {
								placeholder: 'e.g http://baidu.com'
							},
							id: ''
						}, {
							name: 'redirect-url',
							desc: '请求地址',
							type: 'input',
							value: '',
							props: {
								placeholder: 'e.g http://baidu.com'
							},
							id: ''
						}, {
							name: 'action',
							desc: '动作',
							type: 'input',
							value: '',
							props: {
								placeholder: 'e.g http://baidu.com'
							},
							id: ''
						}, {
							name: 'action',
							desc: '动作',
							type: 'select',
							value: 'get',
							children: ['get', 'post'],
							id: ''
						}],
						children: [{
							tag: 'label',
							className: [],
							attrs: []
						}]
					}],

					children: [{
    					tag: 'div',
    					className: ['form-group'],
    					attrs: [{
                            title: '属性设置',
                            key: 'label-attr',
                            isAttrSetting: true,
                            children: []
                        }],
                        children: [{
	    					tag: 'label',
	    					className: [],
	    					attrs: [{
	                            title: '属性设置',
	                            key: 'label-attr',
	                            isAttrSetting: true,
	                            children: [{
	                                name: 'innerHTML',
	                                desc: '名称',
	                                type: 'input',
	                                value: '姓名',
	                                id: '',
	                                isHTML: true,
	                            }]
	                        }]
	    				}, {
							tag: 'input',
							className: ['form-control'],
							attrs: [{
								title: '属性设置',
								key: 'input-attr',
								isAttrSetting: true,
								children: [{
									name: 'name',
									desc: '名称',
									type: 'input',
									value: '',
	                                isAttr: true,
	                                attrName: 'value',
									props: {
										placeholder: '输入名称'
									},
									id: ''
								}, {
									name: 'placeholder',
									desc: '占位字符',
									type: 'input',
									value: '输入姓名',
	                                isAttr: true,
	                                attrName: 'placeholder',
									props: {
										placeholder: '输入占位字符'
									},
									id: ''
								}, {
									name: 'input-type',
									desc: '类型',
									type: 'select',
									value: 'input',
	                                isAttr: true,
	                                attrName: 'type',
									valueList: ['input', 'email', 'password', 'number', 'tel'],
									id: ''
								}, {
									name: 'autofocus',
									desc: '自动聚焦',
									type: 'toggle',
	                                isToggleAttr: true,
									value: true,
									id: '',
	                                attrName: 'autofocus'
								}, {
									name: 'required',
									desc: '是否必填',
									type: 'toggle',
	                                isToggleAttr: true,
									value: false,
									id: '',
	                                attrName: 'required'
								}
	                        ]
							}]
						}]
    				}, {
    					tag: 'div',
    					className: ['form-group'],
    					attrs: [{
                            title: '属性设置',
                            key: 'label-attr',
                            isAttrSetting: true,
                            children: []
                        }],
                        children: [{
	    					tag: 'label',
	    					className: [],
	    					attrs: [{
	                            title: '属性设置',
	                            key: 'label-attr',
	                            isAttrSetting: true,
	                            children: [{
	                                name: 'innerHTML',
	                                desc: '名称',
	                                type: 'input',
	                                value: '邮箱',
	                                id: '',
	                                isHTML: true,
	                            }]
	                        }]
	    				}, {
							tag: 'input',
							className: ['form-control'],
							attrs: [{
								title: '属性设置',
								key: 'input-attr',
								isAttrSetting: true,
								children: [{
									name: 'name',
									desc: '名称',
									type: 'input',
									value: '',
	                                isAttr: true,
	                                attrName: 'value',
									props: {
										placeholder: '输入名称'
									},
									id: ''
								}, {
									name: 'placeholder',
									desc: '占位字符',
									type: 'input',
									value: '输入邮箱',
	                                isAttr: true,
	                                attrName: 'placeholder',
									props: {
										placeholder: '输入占位字符'
									},
									id: ''
								}, {
									name: 'input-type',
									desc: '类型',
									type: 'select',
									value: 'input',
	                                isAttr: true,
	                                attrName: 'type',
									valueList: ['input', 'email', 'password', 'number', 'tel'],
									id: ''
								}, {
									name: 'autofocus',
									desc: '自动聚焦',
									type: 'toggle',
	                                isToggleAttr: true,
									value: true,
									id: '',
	                                attrName: 'autofocus'
								}, {
									name: 'required',
									desc: '是否必填',
									type: 'toggle',
	                                isToggleAttr: true,
									value: false,
									id: '',
	                                attrName: 'required'
								}
	                        ]
							}]
						}]
    				}, {
    					tag: 'input',
    					className: ['btn', 'btn-default'],
    					attrs: [{
    						title: '属性设置',
    						key: 'textarea-attr',
    						isAttrSetting: true,
    						children: [{
    							name: 'button-text',
    							desc: '文本名称',
    							type: 'input',
    							value: '提交',
    							props: {
    								placeholder: '输入名称'
    							},
    							id: '',
                                isAttr: true,
                                attrName: 'value'
    						},{
    							name: 'type',
    							desc: '类型',
    							value: 'submit',
    							props: {
    								placeholder: '输入名称'
    							},
    							id: '',
                                isAttr: true,
                                attrName: 'type'
    						}]
    					}]
    				}]
				}
			}, {
				icon: <svg width="38" height="14" viewBox="0 0 38 14" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M12.1 3.4c-1.4 0-2.6.4-3.7 1.3l-.7.6.6.8.7 1-.2.1c-.8.5-1.2 1.3-1.3 2.2H4V1.2H.4V13h8.1v-.9c-.1-.1-.1-.2-.2-.2l.3.3c.7.6 1.6.9 2.6.9.5 0 1-.1 1.5-.2v.1h3.4V7.2c0-1.3-.4-2.2-1.2-2.9-.8-.6-1.7-.9-2.8-.9zm-.4 6.4c-.3 0-.5-.1-.6-.1.1 0 .3-.1.7-.1h.6c-.3.1-.5.2-.7.2zM34.3.6v5.6c-.2-.6-.6-1.2-1.1-1.6-.9-.8-2-1.2-3.2-1.2-1.3 0-2.4.4-3.3 1.3-.5.4-.9 1-1.1 1.6-.2-.6-.6-1.1-1-1.6-.9-.9-2-1.3-3.3-1.3-.5 0-1 .1-1.4.3V.6h-3.6V13h3.6v-.2c.5.2 1 .3 1.5.3 1.2 0 2.3-.5 3.2-1.4.4-.4.8-1 1-1.5-.1-.2-.1-.4-.2-.6.2.9.6 1.6 1.2 2.2.9.9 2.1 1.3 3.4 1.3 1.6 0 2.9-.5 3.9-1.6l.5-.5v2H38V.6h-3.7zM21.9 9.3c-.3.3-.6.4-.9.4-.3 0-.6-.1-.8-.4-.3-.3-.4-.6-.4-1.1 0-.5.1-.8.4-1.1.2-.3.5-.4.8-.4.4 0 .6.1.9.4.3.3.4.6.4 1.1 0 .5-.1.9-.4 1.1zm12.4 1.4l-.5-.5-.2-.2h.7v.7z"></path><path d="M1.4 12V2.2H3v8.2h4.5V12H1.4zm13.7 0h-1.4v-1c-.6.7-1.4 1.1-2.5 1.1-.8 0-1.4-.2-1.9-.7s-.8-1-.8-1.8.3-1.3.8-1.6c.5-.4 1.3-.5 2.2-.5h2v-.3c0-1-.6-1.5-1.7-1.5-.7 0-1.4.3-2.2.8l-.6-1c.9-.7 1.9-1.1 3.1-1.1.9 0 1.6.2 2.1.7s.8 1.1.8 2.1V12zm-1.6-2.8v-.6h-1.8c-1.1 0-1.7.4-1.7 1.1 0 .4.1.6.4.8.3.2.7.3 1.2.3s.9-.1 1.3-.4c.4-.3.6-.7.6-1.2zm7.8-4.8c1 0 1.9.3 2.6 1 .7.7 1.1 1.6 1.1 2.8 0 1.1-.4 2.1-1.1 2.8-.7.7-1.5 1.1-2.5 1.1-.9 0-1.8-.4-2.5-1.2V12h-1.6V1.6h1.6v4.2c.6-.9 1.4-1.4 2.4-1.4zm-2.5 3.9c0 .7.2 1.3.6 1.7.4.5 1 .7 1.6.7s1.2-.2 1.6-.7.7-1 .7-1.7-.2-1.3-.6-1.8c-.4-.5-1-.7-1.6-.7-.6 0-1.2.2-1.6.7-.5.5-.7 1.1-.7 1.8zm14.8.7h-5.8c0 .5.3 1 .7 1.3.5.3 1 .5 1.6.5.9 0 1.6-.3 2.1-.9l.9 1c-.8.8-1.8 1.2-3.1 1.2-1 0-1.9-.3-2.7-1s-1.1-1.6-1.1-2.8c0-1.2.4-2.1 1.1-2.8.7-.7 1.6-1 2.6-1s1.9.3 2.6.9 1.1 1.5 1.1 2.5V9zm-5.8-1.3H32c0-.6-.2-1.1-.6-1.4-.3-.3-.8-.5-1.4-.5s-1.1.2-1.5.5c-.5.4-.7.8-.7 1.4zm9.1 4.3h-1.6V1.6h1.6V12z" fill="currentColor"></path></svg>,
				name: '标签',
				key: 'label',
				details: {
					tag: 'label',
					className: [],
					attrs: [{
                        title: '属性设置',
                        key: 'label-attr',
                        isAttrSetting: true,
                        children: [{
                            name: 'innerHTML',
                            desc: '名称',
                            type: 'input',
                            value: '标签',
                            id: '',
                            isHTML: true,
                        }]
                    }
                    ]
				}
			}, {
				icon: <svg width="48" height="21" viewBox="0 0 48 21" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M45 3v15H3V3h42m2-2H1v19h46V1z"></path><path opacity=".2" fill="currentColor" d="M3 3h42v15H3z"></path><path opacity=".4" d="M47 1v19H1V1h46m1-1H0v21h48V0z"></path><path opacity=".5" fill="currentColor" d="M7 6h2v9H7z"></path></svg>,
				name: '输入框',
				key: 'input',
				details: {
					tag: 'input',
					className: ['form-control'],
					attrs: [{
						title: '属性设置',
						key: 'input-attr',
						isAttrSetting: true,
						children: [{
							name: 'name',
							desc: '名称',
							type: 'input',
							value: '',
							props: {
								placeholder: '输入名称'
							},
							id: '',
                            isAttr: true,
                            attrName: 'namw'
						}, {
							name: 'placeholder',
							desc: '占位字符',
							type: 'input',
							value: '占位字符',
							props: {
								placeholder: '输入占位字符'
							},
							id: '',
                            isAttr: true,
                            attrName: 'placeholder'
						}, {
							name: 'input-type',
							desc: '类型',
							type: 'select',
							value: 'input',
							valueList: ['input', 'email', 'password', 'number', 'tel'],
							id: '',
                            isAttr: true,
                            attrName: 'type'
						},{
							name: 'readonly',
							desc: '只读',
							type: 'toggle',
							value: false,
							id: '',
                            isToggleAttr: true,
                            attrName: 'readonly'
						},{
                            name: 'autofocus',
                            desc: '自动聚焦',
                            type: 'toggle',
                            isToggleAttr: true,
                            value: true,
                            id: '',
                            attrName: 'autofocus'
						},{
                            name: 'required',
                            desc: '是否必填',
                            type: 'toggle',
                            isToggleAttr: true,
                            value: false,
                            id: '',
                            attrName: 'required'
                        }]
					}]
				}
			}, {
				icon: <svg width="50" height="32" viewBox="0 0 50 32" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M47 3v26H3V3h44m2-2H1v30h48V1z"></path><path opacity=".2" fill="currentColor" d="M3 3h44v26H3z"></path><path opacity=".4" d="M49 1v30H1V1h48m1-1H0v32h50V0z"></path><path opacity=".5" fill="currentColor" d="M7 6h2v9H7zm29.3 20h1.4l6.3-6.3v-1.4L36.3 26zm4.4 0l3.3-3.3v-1.4L39.3 26h1.4zm3 0l.3-.3v-1.4L42.3 26h1.4z"></path></svg>,
				name: '文本域',
				key: 'textarea',
                setAttribute: true,
				details: {
					tag: 'textarea',
					className: ['form-control'],
					attrs: [{
						title: '属性设置',
						key: 'textarea-attr',
						isAttrSetting: true,
						children: [{
							name: 'name',
							desc: '名称',
							type: 'input',
							value: '',
							props: {
								placeholder: '输入名称'
							},
							id: '',
                            isAttr: true,
                            attrName: 'value'
						}, {
							name: 'placeholder',
							desc: '占位字符',
							type: 'input',
							value: '请输入文本',
							props: {
								placeholder: '输入占位字符'
							},
							id: '',
                            isAttr: true,
                            attrName: 'placeholder'
						},{
							name: 'readonly',
							desc: '只读',
							type: 'toggle',
							value: false,
							id: '',
                            isToggleAttr: true,
                            attrName: 'readonly'
						},{
                            name: 'required',
                            desc: '是否必填',
                            type: 'toggle',
                            isToggleAttr: true,
                            value: false,
                            id: '',
                            attrName: 'required'
                        },{
                            name: 'autofocus',
                            desc: '自动聚焦',
                            type: 'toggle',
                            isToggleAttr: true,
                            value: true,
                            id: '',
                            attrName: 'autofocus'
						} ,{
                            name: 'cols',
                            desc: '列',
                            type: 'input',
                            isAttr: true,
                            value: '80',
                            id: '',
                            attrName: 'cols'
						},{
                            name: 'rows',
                            desc: '行',
                            type: 'input',
                            isAttr: true,
                            value: '5',
                            id: '',
                            attrName: 'rows'
						}]
					}]
				}
			}, {
				icon: <svg width="28" height="24" viewBox="0 0 28 24" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".2" fill="currentColor" d="M3 1h22v22H3z"></path><path opacity=".4" d="M25 1v22H3V1h22m1-1H2v24h24V0z"></path><path fill="currentColor" d="M3 1v22h22V7.3c-.7.7-1.3 1.4-2 2.2V21H5V3h18c.6-.5 1.3-.9 2-1.4V1H3zm20 5.3c.6-.5 1.3-.9 2-1.4V4c-.7.7-1.3 1.5-2 2.3z"></path><path fill="currentColor" d="M7.4 10.7l1.7-1.6c2 1 3.3 1.7 5.5 3.3 4.2-4.8 7-7.2 12.2-10.5l.6 1.3c-4.3 3.7-7.4 7.9-11.9 16-2.8-3.2-4.7-5.3-8.1-8.5z"></path></svg>,
				name: '多选框',
				key: 'checkbox',
				details: {
					tag: 'div',
					className: ['checkbox'],
					attrs: [],
                    children:[{
    					tag: 'label',
    					className: [],
    					attrs: [{
                            title: '属性设置',
                            key: 'label-attr',
                            isAttrSetting: true,
                            children: [{
                                name: 'innerHTML',
                                desc: '名称',
                                type: 'input',
                                value: '多选框',
                                id: '',
                                isHTML: true,
                            }]
                        }],
                        children: [{
        					tag: 'input',
        					className: [],
        					isBeforeHTMLValue: true,
        					attrs: [{
        						title: '属性设置',
        						key: 'checkbox-attr',
        						isAttrSetting: true,
        						children: [{
        							name: 'checked',
        							desc: '默认选中',
        							type: 'toggle',
        							value: true,
        							props: {
        								placeholder: '输入名称'
        							},
        							id: '',
                                    isToggleAttr: true,
                                    attrName: 'checked'
        						},{
        							name: 'type',
        							desc: '类型',
        							value: 'checkbox',
        							props: {
        								placeholder: '输入名称'
        							},
        							id: '',
                                    isAttr: true,
                                    attrName: 'type'
        						}]
        					}]
                        }]
    				}]
            	}
			}, {
				icon: <svg width="26" height="26" viewBox="0 0 26 26" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><circle opacity=".2" fill="currentColor" cx="13" cy="13" r="10.6"></circle><path d="M13 0c7.2 0 13 5.8 13 13s-5.8 13-13 13S0 20.2 0 13 5.8 0 13 0m0 1C6.4 1 1 6.4 1 13s5.4 12 12 12 12-5.4 12-12S19.6 1 13 1z" opacity=".4"></path><path fill="currentColor" d="M13 3.5c5.2 0 9.5 4.3 9.5 9.5s-4.3 9.5-9.5 9.5-9.5-4.3-9.5-9.5S7.8 3.5 13 3.5M13 1C6.4 1 1 6.4 1 13s5.4 12 12 12 12-5.4 12-12S19.6 1 13 1z"></path><circle fill="currentColor" cx="13" cy="13" r="5"></circle></svg>,
				name: '单选框',
				key: 'radio-button',
				details: {
					tag: 'div',
					attrs: [],
					className: ['radio'],
                    children: [{
    					tag: 'label',
    					className: [],
    					attrs: [{
                            title: '属性设置',
                            key: 'label-attr',
                            isAttrSetting: true,
                            children: [{
                                name: 'innerHTML',
                                desc: '名称',
                                type: 'input',
                                value: '单选框',
                                id: '',
                                isHTML: true,
                            }]
                        }],
                        children: [{
        					tag: 'input',
        					className: [],
        					isBeforeHTMLValue: true,
        					attrs: [{
                                title: '属性设置',
                                key: 'radio-attr',
                                isAttrSetting: true,
                                children: [{
                                    name: 'radio-value',
                                    desc: '默认值',
                                    type: 'input',
                                    value: '默认值',
                                    props: {
                                        placeholder: '输入名称'
                                    },
                                    id: '',
                                    isAttr: true,
                                    attrName: 'value'
                                },{
                                    name: 'type',
                                    desc: '类型',
                                    value: 'radio',
                                    props: {
                                        placeholder: '输入名称'
                                    },
                                    id: '',
                                    isAttr: true,
                                    attrName: 'type'
                                }]
                            }]
                        }]
    				}]
				}
			}, {
				icon: <svg width="60" height="23" viewBox="0 0 60 23" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M57 0H3C1.3 0 0 1.3 0 3v17c0 1.7 1.3 3 3 3h54c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3zM32 13H8v-2h24v2z"></path><path fill="currentColor" d="M57 1H3c-1.1 0-2 .9-2 2v17c0 1.1.9 2 2 2h54c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM32 13H8v-2h24v2zm17 1l-4-4h8l-4 4z"></path><path opacity=".75" fill="currentColor" d="M8 11h24v2H8z"></path></svg>,
				name: '选择框',
				key: 'select',
				details: {
					tag: 'select',
					className: ['vd-select', 'form-control'],
					attrs: [{
						title: '选择框设置',
						key: 'select-setting',
						children: [{
                            name: 'name',
							desc: '名称',
							type: 'input',
							value: '',
							props: {
								placeholder: '输入名称'
							},
							id: '',
                            isAttr: true,
                            attrName: 'name'
                        },{
                            name: 'multiple',
                            desc: '允许多选',
                            type: 'toggle',
                            value: false,
                            isToggleAttr: true,
                            attrName: 'multiple',
                            id: '',
                        }]
					}],
                    children: [{
                        tag: 'option',
    					className: [],
    					attrs: [{
    						title: '选项设置',
    						key: 'options-setting',
                            isAttrSetting: true,
    						children: [{
                                name: 'option',
                                desc: '选项',
                                type: 'toggle',
                                value: '1',
                                isAttr: true,
                                isHTML: true,
                                html: '选项一',
                                attrName: 'value',
                                id: '',
                            }]
    					}],
                    },{
                        tag: 'option',
    					className: [],
    					attrs: [{
    						title: '选项设置',
    						key: 'options-setting',
                            isAttrSetting: true,
    						children: [{
                                name: 'option',
                                desc: '选项',
                                type: 'toggle',
                                value: '2',
                                isAttr: true,
                                isHTML: true,
                                html: '选项二',
                                attrName: 'value',
                                id: '',
                            }]
    					}],
                    }]
				}
			}, {
				icon: <svg width="59" height="31" viewBox="0 0 59 31" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M56 0H3C1.3 0 0 1.3 0 3v25c0 1.7 1.3 3 3 3h53c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3z"></path><path fill="currentColor" d="M27 15.3c.2-.1.3-.3.3-.7s-.1-.6-.3-.7c-.2-.1-.6-.2-1.1-.2h-.8v1.7h.8c.5 0 .9 0 1.1-.1zM56 1H3c-1.1 0-2 .9-2 2v25c0 1.1.9 2 2 2h53c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM12.9 19.4c-.5.4-1.2.6-2 .6-1.2 0-2.3-.5-3.3-1.4l1-1.3c.8.7 1.6 1.1 2.3 1.1.3 0 .6-.1.7-.2.2-.1.3-.3.3-.5s-.1-.4-.3-.5c-.2-.1-.6-.3-1.1-.4-.9-.2-1.5-.5-2-.8s-.6-.9-.6-1.6c0-.7.3-1.3.8-1.7.5-.4 1.2-.6 2-.6.5 0 1 .1 1.5.3.5.2 1 .4 1.3.7l-.9 1.3c-.7-.5-1.4-.8-2.1-.8-.3 0-.5.1-.7.2s-.2.3-.2.5.1.4.3.5c.2.1.7.3 1.4.5s1.3.4 1.7.8c.4.4.6.9.6 1.6.1.8-.2 1.3-.7 1.7zm8.7-2.8c0 1.1-.3 2-.9 2.6s-1.4.9-2.4.9-1.8-.3-2.4-.9c-.6-.6-.9-1.5-.9-2.6v-4.3h1.7v4.2c0 .6.1 1.1.4 1.5.3.4.7.5 1.2.5s.9-.2 1.1-.5.4-.8.4-1.5v-4.2h1.7v4.3zm7.4 2.7c-.4.5-1.2.7-2.2.7h-3.4v-7.7h3c.5 0 1 .1 1.3.2.4.1.7.3.9.5.3.4.5.8.5 1.3 0 .6-.2 1-.6 1.3-.1.1-.2.2-.3.2-.1 0-.1.1-.3.1.5.1.9.3 1.1.6s.4.7.4 1.2c.1.7 0 1.2-.4 1.6zm10.6.7h-1.7v-4.8l-2.1 4.2h-1l-2.1-4.2V20H31v-7.7h2.3l2 4.2 2-4.2h2.3V20zm3.6 0h-1.7v-7.7h1.7V20zm7.3-6.2h-2.2V20h-1.7v-6.2h-2.2v-1.5h6.1v1.5zm-23.1 3.1c-.3-.1-.7-.2-1.2-.2h-1v1.8h1.2c.5 0 .9-.1 1.1-.2s.4-.4.4-.7-.3-.5-.5-.7z"></path></svg>,
				name: '提交按钮',
				key: 'form-button',
				details: {
					tag: 'input',
					className: ['btn', 'btn-default'],
					attrs: [{
						title: '属性设置',
						key: 'textarea-attr',
						isAttrSetting: true,
						children: [{
							name: 'button-text',
							desc: '文本名称',
							type: 'input',
							value: '提交',
							props: {
								placeholder: '输入名称'
							},
							id: '',
                            isAttr: true,
                            attrName: 'value'
						},{
							name: 'type',
							desc: '类型',
							value: 'submit',
							props: {
								placeholder: '输入名称'
							},
							id: '',
                            isAttr: true,
                            attrName: 'type'
						}]
					}]
				}
			}]
		}, {
			name: "组件",
			key: 'components',
			content: [{
				icon: <svg width="53" height="39" viewBox="0 0 53 39" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M3 10h47v26H3z" opacity=".2"></path><path fill="currentColor" d="M50 10v26H3V10h47m2-2H1v30h51V8z"></path><path d="M10 22h32v2H10zm0-4h32v2H10zm0 8h15v2H10z" fill="currentColor"></path><path opacity=".4" d="M45 7V1.8c0-1-.8-1.8-1.8-1.8H31.8c-1 0-1.8.8-1.8 1.8 0-1-.8-1.8-1.8-1.8H16.8c-1 0-1.8.8-1.8 1.8 0-1-.8-1.8-1.8-1.8H1.8C.8 0 0 .8 0 1.8V39h53V7h-8zM31 1.8c0-.4.4-.8.8-.8h11.4c.4 0 .8.4.8.8V6H31V1.8zm-15 0c0-.4.4-.8.8-.8h11.4c.4 0 .8.4.8.8V6H16V1.8zm-15 0c0-.4.4-.8.8-.8h11.4c.4 0 .8.4.8.8V7H1V1.8zM52 38H1V8h51v30z"></path><path fill="currentColor" d="M13.2 1H1.8c-.4 0-.8.4-.8.8V8h13V1.8c0-.4-.4-.8-.8-.8zm15 0H16.8c-.4 0-.8.4-.8.8V6h13V1.8c0-.4-.4-.8-.8-.8zm15 0H31.8c-.4 0-.8.4-.8.8V6h13V1.8c0-.4-.4-.8-.8-.8z"></path></svg>,
				name: '标签页',
				key: 'tabs',
				details: {
					tag: 'div',
					className: [],
					attrs: [{
						title: '标签页设置',
						key: 'tabs-setting',
						children: []
					}],
					children: [{
						tag: 'div',
                        unActive: true,
						className: ['nav', 'nav-tabs'],
						attrs: [{
						    title: '标签页设置',
							key: 'tabs-setting',
							children: []
						}],
						children: [{
                            tag: 'a',
                            unActive: true,
                            className: ['tab-pane', 'vd-tab-link', 'vd-inline-block'],
                            attrs: [{
                                title: '标签页设置',
                                key: 'tabs-setting',
                                children: [{
                                    name: 'src',
                                    desc: '跳转链接',
                                    type: 'input',
                                    value: '',
                                    isAttr: true,
                                    attrName: 'src',
                                    id: ''
                                }, {
                                    name: 'target',
                                    desc: '新窗口打开',
                                    type: 'toggle',
                                    value: false,
                                    isAttr: true,
                                    attrName: 'target',
                                    id: ''
                                }]
                            }],
                            children: [{
                                tag: 'div',
                                unActive: true,
                                className: [],
                                attrs: [{
                                title: '标签页设置',
                                    key: 'tabs-setting',
                                    children: [{
                                        name: 'innerHTML',
                                        desc: '显示文本',
                                        type: 'input',
                                        value: 'Tab 1',
                                        isHTML: true,
                                        id: ''
                                    }]
                                }],
                            }]
                        },{
                            tag: 'a',
                            unActive: true,
                            className: ['tab-pane', 'vd-tab-link', 'vd-inline-block'],
                            attrs: [{
                                title: '标签页设置',
                                key: 'tabs-setting',
                                children: [{
                                    name: 'src',
                                    desc: '跳转链接',
                                    type: 'input',
                                    value: '',
                                    isAttr: true,
                                    attrName: 'src',
                                    id: ''
                                }, {
                                    name: 'target',
                                    desc: '新窗口打开',
                                    type: 'toggle',
                                    value: false,
                                    isAttr: true,
                                    attrName: 'target',
                                    id: ''
                                }]
                            }],
                            children: [{
                                tag: 'div',
                                unActive: true,
                                className: [],
                                attrs: [{
                                title: '标签页设置',
                                    key: 'tabs-setting',
                                    children: [{
                                        name: 'innerHTML',
                                        desc: '显示文本',
                                        type: 'input',
                                        value: 'Tab 2',
                                        isHTML: true,
                                        id: ''
                                    }]
                                }],
                            }]
                        },{
                            tag: 'a',
                            unActive: true,
                            className: ['tab-pane', 'vd-tab-link', 'vd-inline-block'],
                            attrs: [{
                                title: '标签页设置',
                                key: 'tabs-setting',
                                children: [{
                                    name: 'src',
                                    desc: '跳转链接',
                                    type: 'input',
                                    value: '',
                                    isAttr: true,
                                    attrName: 'src',
                                    id: ''
                                }, {
                                    name: 'target',
                                    desc: '新窗口打开',
                                    type: 'toggle',
                                    value: false,
                                    isAttr: true,
                                    attrName: 'target',
                                    id: ''
                                }]
                            }],
                            children: [{
                                tag: 'div',
                                unActive: true,
                                className: [],
                                attrs: [{
                                title: '标签页设置',
                                    key: 'tabs-setting',
                                    children: [{
                                        name: 'innerHTML',
                                        desc: '显示文本',
                                        type: 'input',
                                        value: 'Tab 3',
                                        isHTML: true,
                                        id: ''
                                    }]
                                }],
                            }]
                        }]
					}, {
						tag: 'div',
                        unActive: true,
						className: ['tab-content', 'vd-tab-content', 'vd-empty'],
						attrs: [{
							title: '标签页设置',
							key: 'tabs-setting',
							children: []
						}],
						children: [{
							tag: 'div',
                            unActive: true,
							className: ['tab-pane'],
							children: [],
							attrs: [{
								title: '标签页设置',
								key: 'tabs-setting',
								children: []
							}]
						},{
							tag: 'div',
                            unActive: true,
							className: ['tab-pane', 'active'],
							children: [],
							attrs: [{
								title: '标签页设置',
								key: 'tabs-setting',
								children: []
							}]
						},{
							tag: 'div',
							className: ['tab-pane'],
							children: [],
							attrs: [{
								title: '标签页设置',
								key: 'tabs-setting',
								children: []
							}]
						}]
					}]
				}
			}, {
				icon: <svg width="64" height="22" viewBox="0 0 64 22" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M61 0H3C1.3 0 0 1.3 0 3v16c0 1.7 1.3 3 3 3h58c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3zM15 11v4h-1v-.2c0-1.5-1.1-2.8-2.5-2.8S9 13.3 9 14.8v.2H8v-4h-.4l3.9-3.6 3.9 3.6H15zm-5 3.8v-.4.4zm1.5-1.8h.3-.3c-.4 0-.7.2-.9.4.2-.2.5-.4.9-.4zM63 3c0-1.1-.9-2-2-2H3h58c1.1 0 2 .9 2 2z"></path><path fill="currentColor" d="M61 1H3c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h58c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM16 12v4h-3v-1.2c0-1-.7-1.8-1.5-1.8s-1.5.8-1.5 1.8V16H7v-4H5l6.5-6 6.5 6h-2zm42 4H48v-2h10v2zm0-4H48v-2h10v2zm0-4H48V6h10v2z"></path></svg>,
				name: '导航菜单',
				key: 'navbar',
				details: {
					tag: 'nav',
					className: ['navbar', 'navbar-default'],
					attrs: [{
						title: '导航菜单设置',
						key: 'navbar-setting',
						children: []
					}],
					children: [{
						tag: 'div',
						className: ['container-fluid'],
                        unActive: true,
						attrs: [{
							title: '导航菜单设置',
							key: 'navbar-setting',
							children: []
						}],
						children: [{
							tag: 'div',
                            unActive: true,
							className: ['navbar-header'],
							attrs: [{
								title: '导航菜单设置',
								key: 'navbar-setting',
								children: []
							}],
							children: [{
								tag: 'button',
								className: ['navbar-toggle', 'collapsed'],
								attrs: [{
									title: '导航菜单设置',
									key: 'navbar-setting',
									children: [{}]
								}],
								children: [{
									tag: 'span',
									className: ['sr-only'],
									attrs: [{
										title: '导航菜单设置',
										key: 'navbar-setting',
										children: []
									}]
								}, {
									tag: 'span',
									className: ['icon-bar'],
									attrs: [{
										title: '导航菜单设置',
										key: 'navbar-setting',
										children: []
									}]
								}, {
									tag: 'span',
									className: ['icon-bar'],
									attrs: [{
										title: '导航菜单设置',
										key: 'navbar-setting',
										children: []
									}]
								}, {
									tag: 'span',
									className: ['icon-bar'],
									attrs: [{
										title: '导航菜单设置',
										key: 'navbar-setting',
										children: []
									}]
								}]
							}, {
								tag: 'a',
								className: ['navbar-brand'],
								attrs: [{
									title: '导航菜单链接设置',
									key: 'link-setting',
                                    deleteAble: true,
									children: [{
                                        name: 'src',
                                        desc: '跳转链接',
                                        type: 'input',
                                        value: '',
                                        isAttr: true,
                                        attrName: 'href',
                                        id: ''
                                    }, {
                                        name: 'target',
                                        desc: '新窗口打开',
                                        type: 'toggle',
                                        value: false,
                                        isAttr: true,
                                        attrName: 'target',
                                        id: ''
                                    },{
            							name: 'innerHTML',
            							desc: '显示文本',
            							type: 'input',
            							value: 'Brand',
            							isHTML: true,
            							id: ''
            						}]
								}]
							}]
						}, {
							tag: 'div',
                            unActive: true,
							className: ['collapse', 'navbar-collapse'],
							attrs: [{
								title: '导航菜单设置',
								key: 'navbar-setting',
								children: []
							}],
							children: [{
								tag: 'ul',
								className: ['nav', 'navbar-nav', 'navbar-right'],
								attrs: [{
									title: '导航菜单设置',
									key: 'navbar-setting',
									children: []
								}],
								children: [{
									tag: 'li',
									className: [],
									attrs: [{
										title: '导航菜单设置',
										key: 'navbar-setting',
										children: []
									}],
									children: [{
										tag: 'a',
										className: [],
										attrs: [{
                                            title: '导航菜单链接设置',
                                            key: 'link-setting',
                                            deleteAble: true,
                                            changeDropDown: true,
                                            children: [{
                                                name: 'src',
                                                desc: '跳转链接',
                                                type: 'input',
                                                value: '',
                                                isAttr: true,
                                                attrName: 'href',
                                                id: ''
                                            }, {
                                                name: 'target',
                                                desc: '新窗口打开',
                                                type: 'toggle',
                                                value: false,
                                                isAttr: true,
                                                attrName: 'target',
                                                id: ''
                                            },{
                                                name: 'innerHTML',
                                                desc: '显示文本',
                                                value: '菜单',
                                                isHTML: true,
                                                id: ''
                                            }]
                                        }]
									}]
								}, {
									tag: 'li',
									className: [],
									attrs: [{
										title: '导航菜单设置',
										key: 'navbar-setting',
										children: []
									}],
									children: [{
										tag: 'a',
										className: [],
										attrs: [{
											title: '导航菜单链接设置',
											key: 'link-setting',
                                            changeDropDown: true,
                                            deleteAble: true,
											children: [{
                                                name: 'src',
                                                desc: '跳转链接',
                                                type: 'input',
                                                value: '',
                                                isAttr: true,
                                                attrName: 'href',
                                                id: ''
                                            }, {
                                                name: 'target',
                                                desc: '新窗口打开',
                                                type: 'toggle',
                                                value: false,
                                                isAttr: true,
                                                attrName: 'target',
                                                id: ''
                                            },{
                    							name: 'innerHTML',
                    							desc: '显示文本',
                    							value: '菜单',
                    							isHTML: true,
                    							id: ''
                    						}]
										}]
									}]
								}, {
									tag: 'li',
									className: ['dropdown open'],
									attrs: [{
										title: '导航菜单设置',
										key: 'navbar-dropdown-setting',
										children: []
									}],
									children: [{
										tag: 'a',
										className: ['dropdown-toggle'],
										attrs: [{
											title: '导航菜单设置',
                                            isAttrSetting: true,
											key: 'navbar-dropdown-setting',
											children: [{
                    							name: 'innerHTML',
                    							desc: '显示文本',
                    							value: '下拉菜单',
                                                type: 'input',
                    							isHTML: true,
                    							id: ''
                    						},{
                    							name: 'data-toggle',
                    							desc: '显示文本',
                    							value: 'dropdown',
                    							isAttr: true,
                    							id: '',
                                                attrName: 'data-toggle'
                    						},{
                    							name: 'role',
                    							desc: '显示文本',
                    							value: 'button',
                    							isAttr: true,
                    							id: '',
                                                attrName: 'role'
                    						},{
                    							name: 'aria-haspopup',
                    							desc: '显示文本',
                    							value: true,
                    							isAttr: true,
                    							id: '',
                                                attrName: 'aria-haspopup'
                    						},{
                    							name: 'aria-expanded',
                    							desc: '是否展开',
                    							value: true,
                    							isAttr: true,
                                                type: 'toggle',
                                                isToggleAttr: true,
                                                isSetVal: true,
                    							id: '',
                                                attrName: 'aria-expanded'
                    						},{
                    							name: 'switchType',
                    							desc: '删除',
                                                type: 'switchType',
                    							id: '',
                    						},{
                    							name: 'addBtn',
                    							desc: '加一个',
                    							level: 4,
                                                levelsInfo: [{level: 1, index: 1}],
                                                type: 'buttonAdd',
                    							id: '',
                    						},{
                    							name: 'buttonDelete',
                    							desc: '删除',
                                                type: 'buttonDelete',
                    							id: '',
                    						}]
										}],
                                        children: [{
                                            tag: 'span',
                                            className: ['caret'],
                                            attrs: [{
                                                title: '导航菜单设置',
                                                key: 'navbar-setting',
                                                children: []
                                            }]
                                        }]
									},{
        								tag: 'ul',
        								className: ['dropdown-menu'],
        								attrs: [{
        									title: '导航菜单设置',
        									key: 'navbar-setting',
        									children: []
        								}],
        								children: [{
        									tag: 'li',
        									className: [],
        									attrs: [{
        										title: '导航菜单设置',
        										key: 'navbar-setting',
        										children: []
        									}],
        									children: [{
        										tag: 'a',
        										className: [],
        										attrs: [{
        											title: '导航菜单链接设置',
        											key: 'link-setting',
                                                    deleteAble: true,
        											children: [{
                                                        name: 'src',
                                                        desc: '跳转链接',
                                                        type: 'input',
                                                        value: '',
                                                        isAttr: true,
                                                        attrName: 'href',
                                                        id: ''
                                                    }, {
                                                        name: 'target',
                                                        desc: '新窗口打开',
                                                        type: 'toggle',
                                                        value: false,
                                                        isAttr: true,
                                                        attrName: 'target',
                                                        id: ''
                                                    },{
                            							name: 'innerHTML',
                            							desc: '显示文本',
                            							value: '菜单',
                            							isHTML: true,
                            							id: ''
                            						}]
        										}]
        									}]
        								}, {
        									tag: 'li',
        									className: [],
        									attrs: [{
        										title: '导航菜单设置',
        										key: 'navbar-setting',
        										children: []
        									}],
        									children: [{
        										tag: 'a',
        										className: [],
        										attrs: [{
        											title: '导航菜单链接设置',
        											key: 'link-setting',
                                                    deleteAble: true,
        											children: [{
                                                        name: 'src',
                                                        desc: '跳转链接',
                                                        type: 'input',
                                                        value: '',
                                                        isAttr: true,
                                                        attrName: 'href',
                                                        id: ''
                                                    }, {
                                                        name: 'target',
                                                        desc: '新窗口打开',
                                                        type: 'toggle',
                                                        value: false,
                                                        isAttr: true,
                                                        attrName: 'target',
                                                        id: ''
                                                    },{
                            							name: 'innerHTML',
                            							desc: '显示文本',
                            							value: '菜单',
                            							isHTML: true,
                            							id: ''
                            						}]
        										}]
        									}]
        								}, {
        									tag: 'li',
        									className: [],
        									attrs: [{
        										title: '导航菜单设置',
        										key: 'navbar-setting',
        										children: []
        									}],
        									children: [{
        										tag: 'a',
        										className: [],
        										attrs: [{
        											title: '导航菜单链接设置',
        											key: 'link-setting',
                                                    deleteAble: true,
        											children: [{
                                                        name: 'src',
                                                        desc: '跳转链接',
                                                        type: 'input',
                                                        value: '',
                                                        isAttr: true,
                                                        attrName: 'href',
                                                        id: ''
                                                    }, {
                                                        name: 'target',
                                                        desc: '新窗口打开',
                                                        type: 'toggle',
                                                        value: false,
                                                        isAttr: true,
                                                        attrName: 'target',
                                                        id: ''
                                                    },{
                            							name: 'innerHTML',
                            							desc: '显示文本',
                            							value: '菜单',
                            							isHTML: true,
                            							id: ''
                            						}]
        										}]
        									}]
        								}]
        							}]
								}]
							}]
						}]
					}]
				}
			}, {
				icon: <svg width="59" height="30" viewBox="0 0 59 30" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M56 0H3C1.3 0 0 1.3 0 3v24c0 1.7 1.3 3 3 3h53c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3z"></path><path fill="currentColor" d="M33.4 13.9c-.4 0-.8.2-1.1.5-.3.3-.4.8-.4 1.3s.1 1 .4 1.3c.3.3.6.5 1.1.5s.8-.2 1.1-.5c.3-.3.5-.8.5-1.3s-.2-1-.5-1.3c-.4-.3-.7-.5-1.1-.5zM56 1H3c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h53c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM14.5 17.9c-.8.8-2 1.1-3.6 1.1H8v-8.4h3c1.5 0 2.6.4 3.4 1.1.8.7 1.2 1.8 1.2 3.1s-.4 2.3-1.1 3.1zm6.1-3.8c-.5 0-.9.2-1.2.6s-.4.9-.4 1.5V19h-1.8v-6.5H19v.9c.2-.3.5-.5.9-.7.3-.2.7-.3 1.1-.3v1.7h-.4zm7 4c-.6.6-1.5 1-2.4 1-1 0-1.8-.3-2.4-1-.6-.6-1-1.4-1-2.4 0-.9.3-1.7 1-2.4.6-.6 1.5-1 2.4-1 1 0 1.8.3 2.4 1 .6.6 1 1.4 1 2.4s-.3 1.8-1 2.4zm8.2 0c-.6.6-1.3 1-2.1 1s-1.4-.3-1.9-.9v3.2H30v-8.8h1.8v.7c.6-.6 1.2-.8 2-.8s1.4.3 2 .9.9 1.4.9 2.4-.3 1.7-.9 2.3zm11.7.9l-4.2-4.3 1.4-1.3 2.8 2.9 2.8-2.9 1.4 1.3-4.2 4.3zm-36.6-6.8h-1v5.1h1.2c.9 0 1.5-.2 2-.6.5-.4.7-1.1.7-1.9 0-.8-.2-1.5-.7-1.9-.5-.4-1.2-.7-2.2-.7zM25.2 14c-.5 0-.9.2-1.2.5s-.5.8-.5 1.3.2 1 .5 1.3c.3.3.7.5 1.2.5s.9-.2 1.2-.5c.3-.3.5-.8.5-1.3s-.2-1-.5-1.3-.7-.5-1.2-.5z"></path></svg>,
				name: '下拉菜单',
				key: 'dropdown',
				details: {
                    tag: 'div',
                    className: ['dropdown open'],
                    attrs: [{
                        title: '下拉菜单设置',
                        key: 'dropdown-setting',
                        children: []
                    }],
                    children: [{
                        tag: 'button',
                        className: ['btn btn-default', 'dropdown-toggle'],
                        attrs: [{
                            title: '下拉菜单设置',
                            key: 'btn-dropdown',
                            isAttrSetting: true,
                            children: [{
                                name: 'innerHTML',
                                desc: '显示文本',
                                value: '菜单',
                                type: 'input',
                                isHTML: true,
                                id: ''
                            },{
                                name: 'data-toggle',
                                desc: '显示文本',
                                value: 'dropdown',
                                isAttr: true,
                                id: '',
                                attrName: 'data-toggle'
                            },{
                                name: 'role',
                                desc: '显示文本',
                                value: 'button',
                                isAttr: true,
                                id: '',
                                attrName: 'role'
                            },{
                                name: 'aria-haspopup',
                                desc: '显示文本',
                                value: true,
                                isAttr: true,
                                id: '',
                                attrName: 'aria-haspopup'
                            },{
                                name: 'aria-expanded',
                                desc: '是否展开',
                                value: true,
                                isAttr: true,
                                type: 'toggle',
                                isToggleAttr: true,
                                isSetVal: true,
                                id: '',
                                attrName: 'aria-expanded'
                            }]
                        }],
                        children: [{
                            tag: 'span',
                            className: ['caret'],
                            attrs: [{
                                title: '下拉菜单设置',
                                key: 'dropdown-setting',
                                children: []
                            }]
                        }]
                    },{
                        tag: 'ul',
                        className: ['dropdown-menu'],
                        attrs: [{
                            title: '下拉菜单设置',
                            key: 'dropdown-setting',
                            children: []
                        }],
                        children: [{
                            tag: 'li',
                            className: [],
                            attrs: [{
                                title: '下拉菜单设置',
                                key: 'dropdown-setting',
                                children: []
                            }],
                            children: [{
                                tag: 'a',
                                className: [],
                                attrs: [{
                                    title: '下拉菜单链接设置',
                                    key: 'link-setting',
                                    deleteAble: true,
                                    children: [{
                                        name: 'src',
                                        desc: '跳转链接',
                                        type: 'input',
                                        value: '',
                                        isAttr: true,
                                        attrName: 'href',
                                        id: ''
                                    }, {
                                        name: 'target',
                                        desc: '新窗口打开',
                                        type: 'toggle',
                                        value: false,
                                        isAttr: true,
                                        attrName: 'target',
                                        id: ''
                                    },{
                                        name: 'innerHTML',
                                        desc: '显示文本',
                                        value: '菜单',
                                        isHTML: true,
                                        id: ''
                                    }]
                                }]
                            }]
                        }, {
                            tag: 'li',
                            className: [],
                            attrs: [{
                                title: '下拉菜单设置',
                                key: 'dropdown-setting',
                                deleteAble: true,
                                children: []
                            }],
                            children: [{
                                tag: 'a',
                                className: [],
                                attrs: [{
                                    title: '下拉菜单链接设置',
                                    key: 'link-setting',
                                    deleteAble: true,
                                    children: [{
                                        name: 'src',
                                        desc: '跳转链接',
                                        type: 'input',
                                        value: '',
                                        isAttr: true,
                                        attrName: 'href',
                                        id: ''
                                    }, {
                                        name: 'target',
                                        desc: '新窗口打开',
                                        type: 'toggle',
                                        value: false,
                                        isAttr: true,
                                        attrName: 'target',
                                        id: ''
                                    },{
                                        name: 'innerHTML',
                                        desc: '显示文本',
                                        value: '菜单',
                                        isHTML: true,
                                        id: ''
                                    }]
                                }]
                            }]
                        }, {
                            tag: 'li',
                            className: [],
                            attrs: [{
                                title: '下拉菜单设置',
                                key: 'dropdown-setting',
                                children: []
                            }],
                            children: [{
                                tag: 'a',
                                className: [],
                                attrs: [{
                                    title: '下拉菜单链接设置',
                                    key: 'link-setting',
                                    deleteAble: true,
                                    children: [{
                                        name: 'src',
                                        desc: '跳转链接',
                                        type: 'input',
                                        value: '',
                                        isAttr: true,
                                        attrName: 'href',
                                        id: ''
                                    }, {
                                        name: 'target',
                                        desc: '新窗口打开',
                                        type: 'toggle',
                                        value: false,
                                        isAttr: true,
                                        attrName: 'target',
                                        id: ''
                                    },{
                                        name: 'innerHTML',
                                        desc: '显示文本',
                                        value: '菜单',
                                        isHTML: true,
                                        id: ''
                                    },]
                                }]
                            }]
                        }]
                    }]
                }
			}, {
				icon: <svg width="50" height="37" viewBox="0 0 50 37" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".4" d="M47 0H3C1.3 0 0 1.3 0 3v31c0 1.7 1.3 3 3 3h44c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3z"></path><path fill="currentColor" d="M47 1H3c-1.1 0-2 .9-2 2v31c0 1.1.9 2 2 2h44c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM8.8 23.1l-4.7-4.7 4.7-4.7 1.4 1.4L7 18.5l3.2 3.2-1.4 1.4zM19 33c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10.2-9.9l-1.4-1.4 3.2-3.2-3.2-3.2 1.4-1.4 4.7 4.7-4.7 4.5z"></path></svg>,
				name: '幻灯片',
				key: 'slider',
				details: {
					tag: 'div',
					className: ['carousel', 'slide'],
					attrs: [{
						title: '幻灯片设置',
						key: 'slider-setting',
						children: [{
                            name: 'data-ride',
                            id: '',
                            isAttr: true,
                            value: 'carousel',
                            attrName: 'data-ride'
                        },{
                            name: 'id',
                            id: '',
                            isAttr: true,
                            value: 'carousel-example-generic',
                            attrName: 'id'
                        }]
					}],
					children: [{
						tag: 'ol',
						className: ['carousel-indicators'],
						attrs: [{
							title: '幻灯片设置',
							key: 'slider-setting',
                            unActive: true,
							children: []
						}],
						children: [{
							tag: 'li',
							className: [''],
							attrs: [{
								title: '幻灯片设置',
								key: 'slider-setting',
								children: [{
    								name: 'data-target',
    								attrName: 'data-target',
                                    isAttr: true,
    								value: '#carousel-example-generic',
                                    id: ''
    							}, {
    								name: 'data-slide-to',
    								attrName: 'data-slide-to',
                                    isAttr: true,
    								value: '0',
                                    id: ''
    							}]
							}, ]
						}, {
							tag: 'li',
							className: ['active'],
							attrs: [{
								title: '幻灯片设置',
								key: 'slider-setting',
								children: [{
    								name: 'data-target',
    								attrName: 'data-target',
                                    isAttr: true,
    								value: '#carousel-example-generic',
                                    id: ''
    							}, {
    								name: 'data-slide-to',
    								attrName: 'data-slide-to',
                                    isAttr: true,
    								value: '1',
                                    id: ''
    							}]
							}]
						}]
					}, {
						tag: 'div',
						className: ['carousel-inner'],
						attrs: [{
							title: '幻灯片设置',
							key: 'slider-setting',
							children: [{
                                name: 'role',
                                attrName: 'role',
                                isAttr: true,
                                value: 'listbox',
                                id: ''
                            }]
						}],
						children: [{
							tag: 'div',
							className: ['item'],
							attrs: [{
								title: '幻灯片设置',
								key: 'slider-setting',
								children: []
							}],
                            children: [{
            					tag: 'img',
            					className: [''],
            					attrs: [{
            						title: '图片设置',
            						key: 'slider-setting',
            						children: [{
            							name: 'src',
            							desc: '图片地址',
            							type: 'input',
            							value: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iOTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDkwMCA1MDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzkwMHg1MDAvYXV0by8jNjY2OiM0NDQvdGV4dDpTZWNvbmQgc2xpZGUKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE2ZTk2ZWRhOSB0ZXh0IHsgZmlsbDojNDQ0O2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjQ1cHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTZlOTZlZGE5Ij48cmVjdCB3aWR0aD0iOTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzY2NiIvPjxnPjx0ZXh0IHg9IjI2NC45NTMxMjUiIHk9IjI3MC4xNzk2ODc1Ij5TZWNvbmQgc2xpZGU8L3RleHQ+PC9nPjwvZz48L3N2Zz4=',
            							isAttr: true,
            							attrName: 'src',
            							id: '',
            						}, {
            							name: 'alt',
            							desc: '替换文本',
            							type: 'input',
            							value: '',
            							isAttr: true,
            							attrName: 'alt'
            						}, {
            							name: 'width',
            							desc: '宽度',
            							type: 'input',
                                        value: "100%",
            							isAttr: true,
            							attrName: 'width'
            						}, {
            							name: 'height',
            							desc: '高度',
            							type: 'input',
                                        value: "100%",
            							isAttr: true,
            							attrName: 'height'
            						},{
            							name: 'image_placeholder',
            							desc: '占位图片',
            							type: 'input',
            							value: '',
            							isImagePlaceholder: true
            						}]
            					}]
            				},{
                                tag: 'div',
    							className: ['carousel-caption'],
    							attrs: [{
    								title: '幻灯片设置',
    								key: 'slider-label-setting',
                                    isAttrSetting: true,
    								children: [{
                                        name: 'innerHTML',
                                        desc: '替换文本',
                                        type: 'input',
                                        value: 'Slider 1',
                                        isHTML: true,
                                        id: ''
                                    }]
    							}],
                            }]
						}, {
							tag: 'div',
							className: ['item', 'active'],
							attrs: [{
								title: '幻灯片设置',
								key: 'slider-setting',
								children: []
							}],
                            children: [{
            					tag: 'img',
            					className: [''],
            					attrs: [{
            						title: '图片设置',
            						key: 'slider-setting',
            						children: [{
            							name: 'src',
            							desc: '图片地址',
            							type: 'input',
                                        value: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iOTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDkwMCA1MDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzkwMHg1MDAvYXV0by8jNzc3OiM1NTUvdGV4dDpGaXJzdCBzbGlkZQpDcmVhdGVkIHdpdGggSG9sZGVyLmpzIDIuNi4wLgpMZWFybiBtb3JlIGF0IGh0dHA6Ly9ob2xkZXJqcy5jb20KKGMpIDIwMTItMjAxNSBJdmFuIE1hbG9waW5za3kgLSBodHRwOi8vaW1za3kuY28KLS0+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48IVtDREFUQVsjaG9sZGVyXzE1YTZlOTZkNTlhIHRleHQgeyBmaWxsOiM1NTU7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6NDVwdCB9IF1dPjwvc3R5bGU+PC9kZWZzPjxnIGlkPSJob2xkZXJfMTVhNmU5NmQ1OWEiPjxyZWN0IHdpZHRoPSI5MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjNzc3Ii8+PGc+PHRleHQgeD0iMzA4LjI5Njg3NSIgeT0iMjcwLjE3OTY4NzUiPkZpcnN0IHNsaWRlPC90ZXh0PjwvZz48L2c+PC9zdmc+',
            							isAttr: true,
            							attrName: 'src',
            							id: '',
            						},{
            							name: 'alt',
            							desc: '替换文本',
            							type: 'input',
            							value: '',
            							isAttr: true,
            							attrName: 'alt'
            						}, {
            							name: 'width',
            							desc: '宽度',
            							type: 'input',
            							value: "100%",
            							isAttr: true,
            							attrName: 'width'
            						}, {
            							name: 'height',
            							desc: '高度',
            							type: 'input',
            							value: '100%',
            							isAttr: true,
            							attrName: 'height'
            						}, {
            							name: 'alt',
            							desc: '替换文本',
            							type: 'input',
            							value: '',
            							isAttr: true,
            							attrName: 'alt'
            						}, {
            							name: 'image_placeholder',
            							desc: '占位图片',
            							type: 'input',
            							value: '',
            							isImagePlaceholder: true
            						}]
            					}]
            				},{
                                tag: 'div',
    							className: ['carousel-caption'],
    							attrs: [{
    								title: '幻灯片设置',
                                    key: 'slider-label-setting',
                                    isAttrSetting: true,
    								children: [{
                                        name: 'innerHTML',
                                        desc: '替换文本',
                                        type: 'input',
                                        value: 'Slider 2',
                                        isHTML: true,
                                        id: ''
                                    }]
    							}],
                            }]
						}]
					}, {
						tag: 'a',
						className: ['left', 'carousel-control'],
						attrs: [{
							title: '幻灯片设置',
							key: 'slider-setting',
							children: [{
                                name: 'href',
                                isAttr: true,
                                attrName: 'href',
                                value: '#carousel-example-generic',
                                id: ''
                            },{
                                name: 'role',
                                isAttr: true,
                                attrName: 'role',
                                value: 'button',
                                id: ''
                            },{
                                name: 'data-slide',
                                isAttr: true,
                                attrName: 'data-slide',
                                value: 'prev',
                                id: ''
                            }]
						}],
						children: [{
							tag: 'span',
							className: ['glyphicon', 'glyphicon-chevron-right'],
							attrs: [{
								title: '幻灯片设置',
								key: 'slider-setting',
								children: [{
                                    name: 'aria-hidden',
                                    value: true,
                                    attrName: 'aria-hidden',
                                    isAttr: true,
                                    id: ''
                                }]
							}]
						}, {
							tag: 'span',
							className: ['sr-only'],
							attrs: [{
								title: '幻灯片设置',
								key: 'slider-setting',
								children: [{
                                    name: 'innerHTML',
                                    value: '上一张',
                                    attrName: 'aria-hidden',
                                    isHTML: true,
                                    id: ''
                                }]
							}]
						}]
					}, {
						tag: 'a',
						className: ['left', 'carousel-control'],
						attrs: [{
							title: '幻灯片设置',
							key: 'slider-setting',
							children: [{
                                name: 'href',
                                isAttr: true,
                                attrName: 'href',
                                value: '#carousel-example-generic',
                                id: ''
                            },{
                                name: 'role',
                                isAttr: true,
                                attrName: 'role',
                                value: 'button',
                                id: ''
                            },{
                                name: 'data-slide',
                                isAttr: true,
                                attrName: 'data-slide',
                                value: 'prev',
                                id: ''
                            }]
						}],
						children: [{
							tag: 'span',
							className: ['glyphicon', 'glyphicon-chevron-left'],
							attrs: [{
								title: '幻灯片设置',
								key: 'slider-setting',
								children: [{
                                    name: 'aria-hidden',
                                    value: true,
                                    attrName: 'aria-hidden',
                                    isAttr: true,
                                    id: ''
                                }]
							}]
						}, {
							tag: 'span',
							className: ['sr-only'],
							attrs: [{
								title: '幻灯片设置',
								key: 'slider-setting',
								children: [{
                                    name: 'innerHTML',
                                    value: '下一张',
                                    attrName: 'aria-hidden',
                                    isHTML: true,
                                    id: ''
                                }]
							}]
						}]
					}]
				}
			}]
		}]
	},

	subscriptions: {

		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
	      		dispatch({
	      			type: 'appendPublicAttrsToCtrlList'
	      		})
	      	});
		}

	},

	reducers: {

		appendPublicAttrsToCtrlList(state) {

			const push = (controllersList) => {
				controllersList.map((item, index) => {
					const controllers = item.content;

					const rec = (controllers) => {
						controllers.map((ctrl, j) => {
							ctrl = ctrl.details || ctrl;
							if(ctrl.children) {
								rec(ctrl.children);
							}
							for (var i = 0; i < state.publicAttrs.length; i++) {
								const attrs = state.publicAttrs[i];
								ctrl.attrs.push(attrs);
							};
						});
					}

					rec(controllers);

				});
			}

			push(state.controllers);

			return {...state};
		},

		handleCurrentSymbolKey(state, { payload: key}) {
			state.currentSymbolKey = key;
			return { ...state};
		},
		handleSymbolNameChange(state, { payload: value}) {
			state.symbolName = value;
			return { ...state};
		},
		handleAddSymbol(state, { payload: activeCtrl}) {

			if(!methods.checkName(state.symbols, state.symbolName)){
				 openNotificationWithIcon('info', '控件名已被占用');
			}else{
				var addController = {
					name: localStorage.symbolName,
					key: randomString(8, 10),
					controllers: [activeCtrl]
				}
				state.popoverVisible = false;
				state.symbolName = '';
				state.symbols.push(addController);
			}
			return { ...state};
		},
		handlePopoverVisbile(state, { payload: value}) {

			state.popoverVisible = value;
			return { ...state};
		},
		handleEditPopoverVisbile(state, { payload: value}) {

			state.editPopoverVisible = value;
			return { ...state};
		},
        handleUpdateVisible(state, { payload: value}){

            state.keyValeUpdateVisible = value;
			return { ...state};
        },
        handleCreateVisible(state, { payload: value}){

            state.keyValeCreateVisible = value;
			return { ...state};
        },
		editSymbol(state){

			if(!methods.checkName(state.symbols, state.symbolName)){
				 openNotificationWithIcon('info', '控件名已被占用');
			}else{
				var index = methods.getSymbolIndexByKey(state.symbols, state.currentSymbolKey);

				if(index == undefined){
					openNotificationWithIcon('error', '修改错误,请重试');
				}else {
					state.symbols[index].name = state.symbolName;
				}
			}
			state.symbolName = '';
			state.currentSymbolKey = '';
			state.editPopoverVisible = false;
			return { ...state};
		},
		deleteSymbol(state, { payload: key}){

			var index = methods.getSymbolIndexByKey(state.symbols, key);
			if(index == undefined){
				openNotificationWithIcon('error', '删除失败,请重试');
			}else {
				state.symbols.splice(index,1);
			}
			return {...state};
		}
	},

	effects: {

		*addSymbol(payload, {call, put, select}){
			var activeCtrl = yield select(state=> state.vdCtrlTree.activeCtrl);
			yield put({
				type:"handleAddSymbol",
				payload: {
					activeCtrl
				}
			});
		}

	}

}
