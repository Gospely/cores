import React, {PropTypes} from 'react';
import dva from 'dva';
import randomString from '../../utils/randomString.js';
import {message} from 'antd';

import initialData from './initialData.js';

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
const VDTreeActions = {
	deepCopyObj(obj, result) {
		result = result || {};
		for (let key in obj) {
			if (typeof obj[key] === 'object') {
				result[key] = (obj[key].constructor === Array) ? [] : {};
				VDTreeActions.deepCopyObj(obj[key], result[key]);
			} else {
				result[key] = obj[key];
			}
		}
		return result;
	},

	getActiveCtrl(state) {
		return state.activeCtrl;
	},

	getCtrlByKey(state, key, activePage) {
		let obj = {
				index: 0,
				level: 1,
				controller: undefined
			},

			controllers = state.layout[activePage.key];

		const loopControllers = function(controllers, level) {
			level = level || 1;
			for (let i = 0; i < controllers.length; i++) {
				let currentControl = controllers[i];
				if (currentControl.children) {
					loopControllers(currentControl.children, level++);
				}
				if (currentControl.vdid === key) {
					obj.index = i;
					obj.level = level;
					obj.controller = currentControl;
					break;
				}
			}
			return obj;
		}

		return loopControllers(controllers, 1);
	},

	loopAllApp(state, callback) {
		for(let page in state.layout) {

			let loop = (data) => {
				for(let i = 0, len = data.length; i < len; i ++ ) {

					if (data[i].children) {
						loop(data[i].children);
					}

					if(!callback(data[i])) {
						break;
					}
				}
			}

			loop(state.layout[page])
		}

	},

	getParentCtrlByKey(state, key, activePage) {

		let obj = {
				index: 0,
				level: 1,
				controller: '',
				parentCtrl: '',
				parentIndex: ''
			},

			controllers = state.layout[activePage.key];

		const loopControllers = function(controllers, level, parent, parentIndex) {
			level = level || 1;
			for (let i = 0; i < controllers.length; i++) {
				let currentControl = controllers[i];
				if (currentControl.children) {
					loopControllers(currentControl.children, level++, currentControl, i);
				}
				if (currentControl.vdid == key) {
					obj.index = i;
					obj.level = level;
					obj.controller = currentControl;
					obj.parentCtrl = parent;
					obj.parentIndex = parentIndex;
					break;
				}
			}
			return obj;
		}

		return loopControllers(controllers, 1, state.layout, 0);
	},
	getActiveControllerIndexAndLvlByKey(state, key, activePage) {
		let obj = {
			index: '',
			level: 1,
			controller: ''
		};
		let controllers = state.layout[activePage.key];
		const loopControllers = function(controllers, level) {
			level = level || 1;
			for (let i = 0; i < controllers.length; i++) {
				let currentControl = controllers[i];
				if (currentControl.children) {
					loopControllers(currentControl.children, level++);
				}
				if (currentControl.vdid == key) {
					obj.index = i;
					obj.level = level;
					obj.controller = currentControl;
					break;
				}
			}
			return obj;
		}
		return loopControllers(controllers, 1);

	},
	setActiveCtrl(state, controllerIndex, controllerKey, level) {},
}

export default {
	namespace: 'vdCtrlTree',
	state: {
		autoExpandParent: true,
		defaultExpandedKeys: ["body-main"],
		defaultSelectedKeys: [""],
		expandedKeys: ["body-main"],
		symbols: [],
		showLabel: '打开菜单',
		icons: [{
				name:"Web应用程序图标",
				list:[
					{
					icon: "fa fa-address-book"
					},
					{
					icon: "fa fa-address-book-o"
					},
					{
					icon: "fa fa-address-card"
					},
					{
					icon: "fa fa-address-card-o"
					},
					{
					icon: "fa fa-adjust"
					},
					{
					icon: "fa fa-american-sign-language-interpreting"
					},
					{
					icon: "fa fa-anchor"
					},
					{
					icon: "fa fa-archive"
					},
					{
					icon: "fa fa-area-chart"
					},
					{
					icon: "fa fa-arrows"
					},
					{
					icon: "fa fa-arrows-h"
					},
					{
					icon: "fa fa-arrows-v"
					},
					{
					icon: "fa fa-asl-interpreting"
					},
					{
					icon: "fa fa-assistive-listening-systems"
					},
					{
					icon: "fa fa-asterisk"
					},
					{
					icon: "fa fa-at"
					},
					{
					icon: "fa fa-audio-description"
					},
					{
					icon: "fa fa-automobile"
					},
					{
					icon: "fa fa-balance-scale"
					},
					{
					icon: "fa fa-ban"
					},
					{
					icon: "fa fa-bank"
					},
					{
					icon: "fa fa-bar-chart"
					},
					{
					icon: "fa fa-bar-chart-o"
					},
					{
					icon: "fa fa-barcode"
					},
					{
					icon: "fa fa-bars"
					},
					{
					icon: "fa fa-bath"
					},
					{
					icon: "fa fa-bathtub"
					},
					{
					icon: "fa fa-battery"
					},
					{
					icon: "fa fa-battery-0"
					},
					{
					icon: "fa fa-battery-1"
					},
					{
					icon: "fa fa-battery-2"
					},
					{
					icon: "fa fa-battery-3"
					},
					{
					icon: "fa fa-battery-4"
					},
					{
					icon: "fa fa-battery-empty"
					},
					{
					icon: "fa fa-battery-full"
					},
					{
					icon: "fa fa-battery-half"
					},
					{
					icon: "fa fa-battery-quarter"
					},
					{
					icon: "fa fa-battery-three-quarters"
					},
					{
					icon: "fa fa-bed"
					},
					{
					icon: "fa fa-beer"
					},
					{
					icon: "fa fa-bell"
					},
					{
					icon: "fa fa-bell-o"
					},
					{
					icon: "fa fa-bell-slash"
					},
					{
					icon: "fa fa-bell-slash-o"
					},
					{
					icon: "fa fa-bicycle"
					},
					{
					icon: "fa fa-binoculars"
					},
					{
					icon: "fa fa-birthday-cake"
					},
					{
					icon: "fa fa-blind"
					},
					{
					icon: "fa fa-bluetooth"
					},
					{
					icon: "fa fa-bluetooth-b"
					},
					{
					icon: "fa fa-bolt"
					},
					{
					icon: "fa fa-bomb"
					},
					{
					icon: "fa fa-book"
					},
					{
					icon: "fa fa-bookmark"
					},
					{
					icon: "fa fa-bookmark-o"
					},
					{
					icon: "fa fa-braille"
					},
					{
					icon: "fa fa-briefcase"
					},
					{
					icon: "fa fa-bug"
					},
					{
					icon: "fa fa-building"
					},
					{
					icon: "fa fa-building-o"
					},
					{
					icon: "fa fa-bullhorn"
					},
					{
					icon: "fa fa-bullseye"
					},
					{
					icon: "fa fa-bus"
					},
					{
					icon: "fa fa-cab"
					},
					{
					icon: "fa fa-calculator"
					},
					{
					icon: "fa fa-calendar"
					},
					{
					icon: "fa fa-calendar-check-o"
					},
					{
					icon: "fa fa-calendar-minus-o"
					},
					{
					icon: "fa fa-calendar-o"
					},
					{
					icon: "fa fa-calendar-plus-o"
					},
					{
					icon: "fa fa-calendar-times-o"
					},
					{
					icon: "fa fa-camera"
					},
					{
					icon: "fa fa-camera-retro"
					},
					{
					icon: "fa fa-car"
					},
					{
					icon: "fa fa-caret-square-o-down"
					},
					{
					icon: "fa fa-caret-square-o-left"
					},
					{
					icon: "fa fa-caret-square-o-right"
					},
					{
					icon: "fa fa-caret-square-o-up"
					},
					{
					icon: "fa fa-cart-arrow-down"
					},
					{
					icon: "fa fa-cart-plus"
					},
					{
					icon: "fa fa-cc"
					},
					{
					icon: "fa fa-certificate"
					},
					{
					icon: "fa fa-check"
					},
					{
					icon: "fa fa-check-circle"
					},
					{
					icon: "fa fa-check-circle-o"
					},
					{
					icon: "fa fa-check-square"
					},
					{
					icon: "fa fa-check-square-o"
					},
					{
					icon: "fa fa-child"
					},
					{
					icon: "fa fa-circle"
					},
					{
					icon: "fa fa-circle-o"
					},
					{
					icon: "fa fa-circle-o-notch"
					},
					{
					icon: "fa fa-circle-thin"
					},
					{
					icon: "fa fa-clock-o"
					},
					{
					icon: "fa fa-clone"
					},
					{
					icon: "fa fa-close"
					},
					{
					icon: "fa fa-cloud"
					},
					{
					icon: "fa fa-cloud-download"
					},
					{
					icon: "fa fa-cloud-upload"
					},
					{
					icon: "fa fa-code"
					},
					{
					icon: "fa fa-code-fork"
					},
					{
					icon: "fa fa-coffee"
					},
					{
					icon: "fa fa-cog"
					},
					{
					icon: "fa fa-cogs"
					},
					{
					icon: "fa fa-comment"
					},
					{
					icon: "fa fa-comment-o"
					},
					{
					icon: "fa fa-commenting"
					},
					{
					icon: "fa fa-commenting-o"
					},
					{
					icon: "fa fa-comments"
					},
					{
					icon: "fa fa-comments-o"
					},
					{
					icon: "fa fa-compass"
					},
					{
					icon: "fa fa-copyright"
					},
					{
					icon: "fa fa-creative-commons"
					},
					{
					icon: "fa fa-credit-card"
					},
					{
					icon: "fa fa-credit-card-alt"
					},
					{
					icon: "fa fa-crop"
					},
					{
					icon: "fa fa-crosshairs"
					},
					{
					icon: "fa fa-cube"
					},
					{
					icon: "fa fa-cubes"
					},
					{
					icon: "fa fa-cutlery"
					},
					{
					icon: "fa fa-dashboard"
					},
					{
					icon: "fa fa-database"
					},
					{
					icon: "fa fa-deaf"
					},
					{
					icon: "fa fa-deafness"
					},
					{
					icon: "fa fa-desktop"
					},
					{
					icon: "fa fa-diamond"
					},
					{
					icon: "fa fa-dot-circle-o"
					},
					{
					icon: "fa fa-download"
					},
					{
					icon: "fa fa-drivers-license"
					},
					{
					icon: "fa fa-drivers-license-o"
					},
					{
					icon: "fa fa-edit"
					},
					{
					icon: "fa fa-ellipsis-h"
					},
					{
					icon: "fa fa-ellipsis-v"
					},
					{
					icon: "fa fa-envelope"
					},
					{
					icon: "fa fa-envelope-o"
					},
					{
					icon: "fa fa-envelope-open"
					},
					{
					icon: "fa fa-envelope-open-o"
					},
					{
					icon: "fa fa-envelope-square"
					},
					{
					icon: "fa fa-eraser"
					},
					{
					icon: "fa fa-exchange"
					},
					{
					icon: "fa fa-exclamation"
					},
					{
					icon: "fa fa-exclamation-circle"
					},
					{
					icon: "fa fa-exclamation-triangle"
					},
					{
					icon: "fa fa-external-link"
					},
					{
					icon: "fa fa-external-link-square"
					},
					{
					icon: "fa fa-eye"
					},
					{
					icon: "fa fa-eye-slash"
					},
					{
					icon: "fa fa-eyedropper"
					},
					{
					icon: "fa fa-fax"
					},
					{
					icon: "fa fa-feed"
					},
					{
					icon: "fa fa-female"
					},
					{
					icon: "fa fa-fighter-jet"
					},
					{
					icon: "fa fa-file-archive-o"
					},
					{
					icon: "fa fa-file-audio-o"
					},
					{
					icon: "fa fa-file-code-o"
					},
					{
					icon: "fa fa-file-excel-o"
					},
					{
					icon: "fa fa-file-image-o"
					},
					{
					icon: "fa fa-file-movie-o"
					},
					{
					icon: "fa fa-file-pdf-o"
					},
					{
					icon: "fa fa-file-photo-o"
					},
					{
					icon: "fa fa-file-picture-o"
					},
					{
					icon: "fa fa-file-powerpoint-o"
					},
					{
					icon: "fa fa-file-sound-o"
					},
					{
					icon: "fa fa-file-video-o"
					},
					{
					icon: "fa fa-file-word-o"
					},
					{
					icon: "fa fa-file-zip-o"
					},
					{
					icon: "fa fa-film"
					},
					{
					icon: "fa fa-filter"
					},
					{
					icon: "fa fa-fire"
					},
					{
					icon: "fa fa-fire-extinguisher"
					},
					{
					icon: "fa fa-flag"
					},
					{
					icon: "fa fa-flag-checkered"
					},
					{
					icon: "fa fa-flag-o"
					},
					{
					icon: "fa fa-flash"
					},
					{
					icon: "fa fa-flask"
					},
					{
					icon: "fa fa-folder"
					},
					{
					icon: "fa fa-folder-o"
					},
					{
					icon: "fa fa-folder-open"
					},
					{
					icon: "fa fa-folder-open-o"
					},
					{
					icon: "fa fa-frown-o"
					},
					{
					icon: "fa fa-futbol-o"
					},
					{
					icon: "fa fa-gamepad"
					},
					{
					icon: "fa fa-gavel"
					},
					{
					icon: "fa fa-gear"
					},
					{
					icon: "fa fa-gears"
					},
					{
					icon: "fa fa-gift"
					},
					{
					icon: "fa fa-glass"
					},
					{
					icon: "fa fa-globe"
					},
					{
					icon: "fa fa-graduation-cap"
					},
					{
					icon: "fa fa-group"
					},
					{
					icon: "fa fa-hand-grab-o"
					},
					{
					icon: "fa fa-hand-lizard-o"
					},
					{
					icon: "fa fa-hand-paper-o"
					},
					{
					icon: "fa fa-hand-peace-o"
					},
					{
					icon: "fa fa-hand-pointer-o"
					},
					{
					icon: "fa fa-hand-rock-o"
					},
					{
					icon: "fa fa-hand-scissors-o"
					},
					{
					icon: "fa fa-hand-spock-o"
					},
					{
					icon: "fa fa-hand-stop-o"
					},
					{
					icon: "fa fa-handshake-o"
					},
					{
					icon: "fa fa-hard-of-hearing"
					},
					{
					icon: "fa fa-hashtag"
					},
					{
					icon: "fa fa-hdd-o"
					},
					{
					icon: "fa fa-headphones"
					},
					{
					icon: "fa fa-heart"
					},
					{
					icon: "fa fa-heart-o"
					},
					{
					icon: "fa fa-heartbeat"
					},
					{
					icon: "fa fa-history"
					},
					{
					icon: "fa fa-home"
					},
					{
					icon: "fa fa-hotel"
					},
					{
					icon: "fa fa-hourglass"
					},
					{
					icon: "fa fa-hourglass-1"
					},
					{
					icon: "fa fa-hourglass-2"
					},
					{
					icon: "fa fa-hourglass-3"
					},
					{
					icon: "fa fa-hourglass-end"
					},
					{
					icon: "fa fa-hourglass-half"
					},
					{
					icon: "fa fa-hourglass-o"
					},
					{
					icon: "fa fa-hourglass-start"
					},
					{
					icon: "fa fa-i-cursor"
					},
					{
					icon: "fa fa-id-badge"
					},
					{
					icon: "fa fa-id-card"
					},
					{
					icon: "fa fa-id-card-o"
					},
					{
					icon: "fa fa-image"
					},
					{
					icon: "fa fa-inbox"
					},
					{
					icon: "fa fa-industry"
					},
					{
					icon: "fa fa-info"
					},
					{
					icon: "fa fa-info-circle"
					},
					{
					icon: "fa fa-institution"
					},
					{
					icon: "fa fa-key"
					},
					{
					icon: "fa fa-keyboard-o"
					},
					{
					icon: "fa fa-language"
					},
					{
					icon: "fa fa-laptop"
					},
					{
					icon: "fa fa-leaf"
					},
					{
					icon: "fa fa-legal"
					},
					{
					icon: "fa fa-lemon-o"
					},
					{
					icon: "fa fa-level-down"
					},
					{
					icon: "fa fa-level-up"
					},
					{
					icon: "fa fa-life-bouy"
					},
					{
					icon: "fa fa-life-buoy"
					},
					{
					icon: "fa fa-life-ring"
					},
					{
					icon: "fa fa-life-saver"
					},
					{
					icon: "fa fa-lightbulb-o"
					},
					{
					icon: "fa fa-line-chart"
					},
					{
					icon: "fa fa-location-arrow"
					},
					{
					icon: "fa fa-lock"
					},
					{
					icon: "fa fa-low-vision"
					},
					{
					icon: "fa fa-magic"
					},
					{
					icon: "fa fa-magnet"
					},
					{
					icon: "fa fa-mail-forward"
					},
					{
					icon: "fa fa-mail-reply"
					},
					{
					icon: "fa fa-mail-reply-all"
					},
					{
					icon: "fa fa-male"
					},
					{
					icon: "fa fa-map"
					},
					{
					icon: "fa fa-map-marker"
					},
					{
					icon: "fa fa-map-o"
					},
					{
					icon: "fa fa-map-pin"
					},
					{
					icon: "fa fa-map-signs"
					},
					{
					icon: "fa fa-meh-o"
					},
					{
					icon: "fa fa-microchip"
					},
					{
					icon: "fa fa-microphone"
					},
					{
					icon: "fa fa-microphone-slash"
					},
					{
					icon: "fa fa-minus"
					},
					{
					icon: "fa fa-minus-circle"
					},
					{
					icon: "fa fa-minus-square"
					},
					{
					icon: "fa fa-minus-square-o"
					},
					{
					icon: "fa fa-mobile"
					},
					{
					icon: "fa fa-mobile-phone"
					},
					{
					icon: "fa fa-money"
					},
					{
					icon: "fa fa-moon-o"
					},
					{
					icon: "fa fa-mortar-board"
					},
					{
					icon: "fa fa-motorcycle"
					},
					{
					icon: "fa fa-mouse-pointer"
					},
					{
					icon: "fa fa-music"
					},
					{
					icon: "fa fa-navicon"
					},
					{
					icon: "fa fa-newspaper-o"
					},
					{
					icon: "fa fa-object-group"
					},
					{
					icon: "fa fa-object-ungroup"
					},
					{
					icon: "fa fa-paint-brush"
					},
					{
					icon: "fa fa-paper-plane"
					},
					{
					icon: "fa fa-paper-plane-o"
					},
					{
					icon: "fa fa-paw"
					},
					{
					icon: "fa fa-pencil"
					},
					{
					icon: "fa fa-pencil-square"
					},
					{
					icon: "fa fa-pencil-square-o"
					},
					{
					icon: "fa fa-percent"
					},
					{
					icon: "fa fa-phone"
					},
					{
					icon: "fa fa-phone-square"
					},
					{
					icon: "fa fa-photo"
					},
					{
					icon: "fa fa-picture-o"
					},
					{
					icon: "fa fa-pie-chart"
					},
					{
					icon: "fa fa-plane"
					},
					{
					icon: "fa fa-plug"
					},
					{
					icon: "fa fa-plus"
					},
					{
					icon: "fa fa-plus-circle"
					},
					{
					icon: "fa fa-plus-square"
					},
					{
					icon: "fa fa-plus-square-o"
					},
					{
					icon: "fa fa-podcast"
					},
					{
					icon: "fa fa-power-off"
					},
					{
					icon: "fa fa-print"
					},
					{
					icon: "fa fa-puzzle-piece"
					},
					{
					icon: "fa fa-qrcode"
					},
					{
					icon: "fa fa-question"
					},
					{
					icon: "fa fa-question-circle"
					},
					{
					icon: "fa fa-question-circle-o"
					},
					{
					icon: "fa fa-quote-left"
					},
					{
					icon: "fa fa-quote-right"
					},
					{
					icon: "fa fa-random"
					},
					{
					icon: "fa fa-recycle"
					},
					{
					icon: "fa fa-refresh"
					},
					{
					icon: "fa fa-registered"
					},
					{
					icon: "fa fa-remove"
					},
					{
					icon: "fa fa-reorder"
					},
					{
					icon: "fa fa-reply"
					},
					{
					icon: "fa fa-reply-all"
					},
					{
					icon: "fa fa-retweet"
					},
					{
					icon: "fa fa-road"
					},
					{
					icon: "fa fa-rocket"
					},
					{
					icon: "fa fa-rss"
					},
					{
					icon: "fa fa-rss-square"
					},
					{
					icon: "fa fa-s15"
					},
					{
					icon: "fa fa-search"
					},
					{
					icon: "fa fa-search-minus"
					},
					{
					icon: "fa fa-search-plus"
					},
					{
					icon: "fa fa-send"
					},
					{
					icon: "fa fa-send-o"
					},
					{
					icon: "fa fa-server"
					},
					{
					icon: "fa fa-share"
					},
					{
					icon: "fa fa-share-alt"
					},
					{
					icon: "fa fa-share-alt-square"
					},
					{
					icon: "fa fa-share-square"
					},
					{
					icon: "fa fa-share-square-o"
					},
					{
					icon: "fa fa-shield"
					},
					{
					icon: "fa fa-ship"
					},
					{
					icon: "fa fa-shopping-bag"
					},
					{
					icon: "fa fa-shopping-basket"
					},
					{
					icon: "fa fa-shopping-cart"
					},
					{
					icon: "fa fa-shower"
					},
					{
					icon: "fa fa-sign-in"
					},
					{
					icon: "fa fa-sign-language"
					},
					{
					icon: "fa fa-sign-out"
					},
					{
					icon: "fa fa-signal"
					},
					{
					icon: "fa fa-signing"
					},
					{
					icon: "fa fa-sitemap"
					},
					{
					icon: "fa fa-sliders"
					},
					{
					icon: "fa fa-smile-o"
					},
					{
					icon: "fa fa-snowflake-o"
					},
					{
					icon: "fa fa-soccer-ball-o"
					},
					{
					icon: "fa fa-sort"
					},
					{
					icon: "fa fa-sort-alpha-asc"
					},
					{
					icon: "fa fa-sort-alpha-desc"
					},
					{
					icon: "fa fa-sort-amount-asc"
					},
					{
					icon: "fa fa-sort-amount-desc"
					},
					{
					icon: "fa fa-sort-asc"
					},
					{
					icon: "fa fa-sort-desc"
					},
					{
					icon: "fa fa-sort-down"
					},
					{
					icon: "fa fa-sort-numeric-asc"
					},
					{
					icon: "fa fa-sort-numeric-desc"
					},
					{
					icon: "fa fa-sort-up"
					},
					{
					icon: "fa fa-space-shuttle"
					},
					{
					icon: "fa fa-spinner"
					},
					{
					icon: "fa fa-spoon"
					},
					{
					icon: "fa fa-square"
					},
					{
					icon: "fa fa-square-o"
					},
					{
					icon: "fa fa-star"
					},
					{
					icon: "fa fa-star-half"
					},
					{
					icon: "fa fa-star-half-empty"
					},
					{
					icon: "fa fa-star-half-full"
					},
					{
					icon: "fa fa-star-half-o"
					},
					{
					icon: "fa fa-star-o"
					},
					{
					icon: "fa fa-sticky-note"
					},
					{
					icon: "fa fa-sticky-note-o"
					},
					{
					icon: "fa fa-street-view"
					},
					{
					icon: "fa fa-suitcase"
					},
					{
					icon: "fa fa-sun-o"
					},
					{
					icon: "fa fa-support"
					},
					{
					icon: "fa fa-tablet"
					},
					{
					icon: "fa fa-tachometer"
					},
					{
					icon: "fa fa-tag"
					},
					{
					icon: "fa fa-tags"
					},
					{
					icon: "fa fa-tasks"
					},
					{
					icon: "fa fa-taxi"
					},
					{
					icon: "fa fa-television"
					},
					{
					icon: "fa fa-terminal"
					},
					{
					icon: "fa fa-thermometer"
					},
					{
					icon: "fa fa-thermometer-0"
					},
					{
					icon: "fa fa-thermometer-1"
					},
					{
					icon: "fa fa-thermometer-2"
					},
					{
					icon: "fa fa-thermometer-3"
					},
					{
					icon: "fa fa-thermometer-4"
					},
					{
					icon: "fa fa-thermometer-empty"
					},
					{
					icon: "fa fa-thermometer-full"
					},
					{
					icon: "fa fa-thermometer-half"
					},
					{
					icon: "fa fa-thermometer-quarter"
					},
					{
					icon: "fa fa-thermometer-three-quarters"
					},
					{
					icon: "fa fa-thumb-tack"
					},
					{
					icon: "fa fa-thumbs-down"
					},
					{
					icon: "fa fa-thumbs-o-down"
					},
					{
					icon: "fa fa-thumbs-o-up"
					},
					{
					icon: "fa fa-thumbs-up"
					},
					{
					icon: "fa fa-ticket"
					},
					{
					icon: "fa fa-times"
					},
					{
					icon: "fa fa-times-circle"
					},
					{
					icon: "fa fa-times-circle-o"
					},
					{
					icon: "fa fa-times-rectangle"
					},
					{
					icon: "fa fa-times-rectangle-o"
					},
					{
					icon: "fa fa-tint"
					},
					{
					icon: "fa fa-toggle-down"
					},
					{
					icon: "fa fa-toggle-left"
					},
					{
					icon: "fa fa-toggle-off"
					},
					{
					icon: "fa fa-toggle-on"
					},
					{
					icon: "fa fa-toggle-right"
					},
					{
					icon: "fa fa-toggle-up"
					},
					{
					icon: "fa fa-trademark"
					},
					{
					icon: "fa fa-trash"
					},
					{
					icon: "fa fa-trash-o"
					},
					{
					icon: "fa fa-tree"
					},
					{
					icon: "fa fa-trophy"
					},
					{
					icon: "fa fa-truck"
					},
					{
					icon: "fa fa-tty"
					},
					{
					icon: "fa fa-tv"
					},
					{
					icon: "fa fa-umbrella"
					},
					{
					icon: "fa fa-universal-access"
					},
					{
					icon: "fa fa-university"
					},
					{
					icon: "fa fa-unlock"
					},
					{
					icon: "fa fa-unlock-alt"
					},
					{
					icon: "fa fa-unsorted"
					},
					{
					icon: "fa fa-upload"
					},
					{
					icon: "fa fa-user"
					},
					{
					icon: "fa fa-user-circle"
					},
					{
					icon: "fa fa-user-circle-o"
					},
					{
					icon: "fa fa-user-o"
					},
					{
					icon: "fa fa-user-plus"
					},
					{
					icon: "fa fa-user-secret"
					},
					{
					icon: "fa fa-user-times"
					},
					{
					icon: "fa fa-users"
					},
					{
					icon: "fa fa-vcard"
					},
					{
					icon: "fa fa-vcard-o"
					},
					{
					icon: "fa fa-video-camera"
					},
					{
					icon: "fa fa-volume-control-phone"
					},
					{
					icon: "fa fa-volume-down"
					},
					{
					icon: "fa fa-volume-off"
					},
					{
					icon: "fa fa-volume-up"
					},
					{
					icon: "fa fa-warning"
					},
					{
					icon: "fa fa-wheelchair"
					},
					{
					icon: "fa fa-wheelchair-alt"
					},
					{
					icon: "fa fa-wifi"
					},
					{
					icon: "fa fa-window-close"
					},
					{
					icon: "fa fa-window-close-o"
					},
					{
					icon: "fa fa-window-maximize"
					},
					{
					icon: "fa fa-window-minimize"
					},
					{
					icon: "fa fa-window-restore"
					},
					{
					icon: "fa fa-wrench"
					}
				],
				},{
					name:"功能性图标",
					list:[
					{
	                    icon: "fa fa-american-sign-language-interpreting"
	                },
	                {
	                    icon: "fa fa-asl-interpreting"
	                },
	                {
	                    icon: "fa fa-assistive-listening-systems"
	                },
	                {
	                    icon: "fa fa-audio-description"
	                },
	                {
	                    icon: "fa fa-blind"
	                },
	                {
	                    icon: "fa fa-braille"
	                },
	                {
	                    icon: "fa fa-cc"
	                },
	                {
	                    icon: "fa fa-deaf"
	                },
	                {
	                    icon: "fa fa-deafness"
	                },
	                {
	                    icon: "fa fa-hard-of-hearing"
	                },
	                {
	                    icon: "fa fa-low-vision"
	                },
	                {
	                    icon: "fa fa-question-circle-o"
	                },
	                {
	                    icon: "fa fa-sign-language"
	                },
	                {
	                    icon: "fa fa-signing"
	                },
	                {
	                    icon: "fa fa-tty"
	                },
	                {
	                    icon: "fa fa-universal-access"
	                },
	                {
	                    icon: "fa fa-volume-control-phone"
	                },
	                {
	                    icon: "fa fa-wheelchair"
	                },
	                {
	                    icon: "fa fa-wheelchair-alt"
	                }]
	            },{
	            	name:"手型图标",
					list:[{
					    icon: "fa fa-hand-grab-o"
					},
					{
					    icon: "fa fa-hand-lizard-o"
					},
					{
					    icon: "fa fa-hand-o-down"
					},
					{
					    icon: "fa fa-hand-o-left"
					},
					{
					    icon: "fa fa-hand-o-right"
					},
					{
					    icon: "fa fa-hand-o-up"
					},
					{
					    icon: "fa fa-hand-paper-o"
					},
					{
					    icon: "fa fa-hand-peace-o"
					},
					{
					    icon: "fa fa-hand-pointer-o"
					},
					{
					    icon: "fa fa-hand-rock-o"
					},
					{
					    icon: "fa fa-hand-scissors-o"
					},
					{
					    icon: "fa fa-hand-spock-o"
					},
					{
					    icon: "fa fa-hand-stop-o"
					},
					{
					    icon: "fa fa-thumbs-down"
					},
					{
					    icon: "fa fa-thumbs-o-down"
					},
					{
					    icon: "fa fa-thumbs-o-up"
					},
					{
					    icon: "fa fa-thumbs-up"
					}]
				},{
					name:"交通工具类图标",
					list:[{
					icon: "fa fa-ambulance"
					},
					{
					icon: "fa fa-automobile"
					},
					{
					icon: "fa fa-bicycle"
					},
					{
					icon: "fa fa-bus"
					},
					{
					icon: "fa fa-cab"
					},
					{
					icon: "fa fa-car"
					},
					{
					icon: "fa fa-fighter-jet"
					},
					{
					icon: "fa fa-motorcycle"
					},
					{
					icon: "fa fa-plane"
					},
					{
					icon: "fa fa-rocket"
					},
					{
					icon: "fa fa-ship"
					},
					{
					icon: "fa fa-space-shuttle"
					},
					{
					icon: "fa fa-subway"
					},
					{
					icon: "fa fa-taxi"
					},
					{
					icon: "fa fa-train"
					},
					{
					icon: "fa fa-truck"
					},
					{
					icon: "fa fa-wheelchair"
					},
					{
					icon: "fa fa-wheelchair-alt"
					}],
				},{
					name:"性别图标",
					list:[{
					    icon: "fa fa-genderless"
					},
					{
					    icon: "fa fa-intersex"
					},
					{
					    icon: "fa fa-mars"
					},
					{
					    icon: "fa fa-mars-double"
					},
					{
					    icon: "fa fa-mars-stroke"
					},
					{
					    icon: "fa fa-mars-stroke-h"
					},
					{
					    icon: "fa fa-mars-stroke-v"
					},
					{
					    icon: "fa fa-mercury"
					},
					{
					    icon: "fa fa-neuter"
					},
					{
					    icon: "fa fa-transgender"
					},
					{
					    icon: "fa fa-transgender-alt"
					},
					{
					    icon: "fa fa-venus"
					},
					{
					    icon: "fa fa-venus-double"
					},
					{
					    icon: "fa fa-venus-mars"
					}],
				},{
					name:"文件类别图标",
					list:[{
					    icon: "fa fa-file"
					},
					{
					    icon: "fa fa-file-archive-o"
					},
					{
					    icon: "fa fa-file-audio-o"
					},
					{
					    icon: "fa fa-file-code-o"
					},
					{
					    icon: "fa fa-file-excel-o"
					},
					{
					    icon: "fa fa-file-image-o"
					},
					{
					    icon: "fa fa-file-movie-o"
					},
					{
					    icon: "fa fa-file-o"
					},
					{
					    icon: "fa fa-file-pdf-o"
					},
					{
					    icon: "fa fa-file-photo-o"
					},
					{
					    icon: "fa fa-file-picture-o"
					},
					{
					    icon: "fa fa-file-powerpoint-o"
					},
					{
					    icon: "fa fa-file-sound-o"
					},
					{
					    icon: "fa fa-file-text"
					},
					{
					    icon: "fa fa-file-text-o"
					},
					{
					    icon: "fa fa-file-video-o"
					},
					{
					    icon: "fa fa-file-word-o"
					},
					{
					    icon: "fa fa-file-zip-o"
					}],
				},{
					name:"加载类型图标",
					list:[{
					    icon: "fa fa-circle-o-notch"
					},
					{
					    icon: "fa fa-cog"
					},
					{
					    icon: "fa fa-gear"
					},
					{
					    icon: "fa fa-refresh"
					},
					{
					    icon: "fa fa-spinner"
					}],
				},{
					name:"表单控件图标",
					list:[{
					    icon: "fa fa-check-square"
					},
					{
					    icon: "fa fa-check-square-o"
					},
					{
					    icon: "fa fa-circle"
					},
					{
					    icon: "fa fa-circle-o"
					},
					{
					    icon: "fa fa-dot-circle-o"
					},
					{
					    icon: "fa fa-minus-square"
					},
					{
					    icon: "fa fa-minus-square-o"
					},
					{
					    icon: "fa fa-plus-square"
					},
					{
					    icon: "fa fa-plus-square-o"
					},
					{
					    icon: "fa fa-square"
					},
					{
					    icon: "fa fa-square-o"
					}],
				},{
					name:"支付类型图标",
					list:[{
					    icon: "fa fa-cc-amex"
					},
					{
					    icon: "fa fa-cc-diners-club"
					},
					{
					    icon: "fa fa-cc-discover"
					},
					{
					    icon: "fa fa-cc-jcb"
					},
					{
					    icon: "fa fa-cc-mastercard"
					},
					{
					    icon: "fa fa-cc-paypal"
					},
					{
					    icon: "fa fa-cc-stripe"
					},
					{
					    icon: "fa fa-cc-visa"
					},
					{
					    icon: "fa fa-credit-card"
					},
					{
					    icon: "fa fa-credit-card-alt"
					},
					{
					    icon: "fa fa-google-wallet"
					},
					{
					    icon: "fa fa-paypal"
					}],
				},{
					name:"数据分析类图标",
					list:[{
					    icon: "fa fa-area-chart"
					},
					{
					    icon: "fa fa-bar-chart"
					},
					{
					    icon: "fa fa-bar-chart-o"
					},
					{
					    icon: "fa fa-line-chart"
					},
					{
					    icon: "fa fa-pie-chart"
					}],
				},{
					name:"货币类图标",
					list:[{
					    icon: "fa fa-bitcoin"
					},
					{
					    icon: "fa fa-btc"
					},
					{
					    icon: "fa fa-cny"
					},
					{
					    icon: "fa fa-dollar"
					},
					{
					    icon: "fa fa-eur"
					},
					{
					    icon: "fa fa-euro"
					},
					{
					    icon: "fa fa-gbp"
					},
					{
					    icon: "fa fa-gg"
					},
					{
					    icon: "fa fa-gg-circle"
					},
					{
					    icon: "fa fa-ils"
					},
					{
					    icon: "fa fa-inr"
					},
					{
					    icon: "fa fa-jpy"
					},
					{
					    icon: "fa fa-krw"
					},
					{
					    icon: "fa fa-money"
					},
					{
					    icon: "fa fa-rmb"
					},
					{
					    icon: "fa fa-rouble"
					},
					{
					    icon: "fa fa-rub"
					},
					{
					    icon: "fa fa-ruble"
					},
					{
					    icon: "fa fa-rupee"
					},
					{
					    icon: "fa fa-shekel"
					},
					{
					    icon: "fa fa-sheqel"
					},
					{
					    icon: "fa fa-try"
					},
					{
					    icon: "fa fa-turkish-lira"
					},
					{
					    icon: "fa fa-usd"
					},
					{
					    icon: "fa fa-won"
					},
					{
					    icon: "fa fa-yen"
					}],
				},{
					name:"文字编辑类图标",
					list:[{
					    icon: "fa fa-align-center"
					},
					{
					    icon: "fa fa-align-justify"
					},
					{
					    icon: "fa fa-align-left"
					},
					{
					    icon: "fa fa-align-right"
					},
					{
					    icon: "fa fa-bold"
					},
					{
					    icon: "fa fa-chain"
					},
					{
					    icon: "fa fa-chain-broken"
					},
					{
					    icon: "fa fa-clipboard"
					},
					{
					    icon: "fa fa-columns"
					},
					{
					    icon: "fa fa-copy"
					},
					{
					    icon: "fa fa-cut"
					},
					{
					    icon: "fa fa-dedent"
					},
					{
					    icon: "fa fa-eraser"
					},
					{
					    icon: "fa fa-file"
					},
					{
					    icon: "fa fa-file-o"
					},
					{
					    icon: "fa fa-file-text"
					},
					{
					    icon: "fa fa-file-text-o"
					},
					{
					    icon: "fa fa-files-o"
					},
					{
					    icon: "fa fa-floppy-o"
					},
					{
					    icon: "fa fa-font"
					},
					{
					    icon: "fa fa-header"
					},
					{
					    icon: "fa fa-indent"
					},
					{
					    icon: "fa fa-italic"
					},
					{
					    icon: "fa fa-link"
					},
					{
					    icon: "fa fa-list"
					},
					{
					    icon: "fa fa-list-alt"
					},
					{
					    icon: "fa fa-list-ol"
					},
					{
					    icon: "fa fa-list-ul"
					},
					{
					    icon: "fa fa-outdent"
					},
					{
					    icon: "fa fa-paperclip"
					},
					{
					    icon: "fa fa-paragraph"
					},
					{
					    icon: "fa fa-paste"
					},
					{
					    icon: "fa fa-repeat"
					},
					{
					    icon: "fa fa-rotate-left"
					},
					{
					    icon: "fa fa-rotate-right"
					},
					{
					    icon: "fa fa-save"
					},
					{
					    icon: "fa fa-scissors"
					},
					{
					    icon: "fa fa-strikethrough"
					},
					{
					    icon: "fa fa-subscript"
					},
					{
					    icon: "fa fa-superscript"
					},
					{
					    icon: "fa fa-table"
					},
					{
					    icon: "fa fa-text-height"
					},
					{
					    icon: "fa fa-text-width"
					},
					{
					    icon: "fa fa-th"
					},
					{
					    icon: "fa fa-th-large"
					},
					{
					    icon: "fa fa-th-list"
					},
					{
					    icon: "fa fa-underline"
					},
					{
					    icon: "fa fa-undo"
					},
					{
					    icon: "fa fa-unlink"
					}],
				},{
					name:"箭头类图标",
					list:[{
					    icon: "fa fa-angle-double-down"
					},
					{
					    icon: "fa fa-angle-double-left"
					},
					{
					    icon: "fa fa-angle-double-right"
					},
					{
					    icon: "fa fa-angle-double-up"
					},
					{
					    icon: "fa fa-angle-down"
					},
					{
					    icon: "fa fa-angle-left"
					},
					{
					    icon: "fa fa-angle-right"
					},
					{
					    icon: "fa fa-angle-up"
					},
					{
					    icon: "fa fa-arrow-circle-down"
					},
					{
					    icon: "fa fa-arrow-circle-left"
					},
					{
					    icon: "fa fa-arrow-circle-o-down"
					},
					{
					    icon: "fa fa-arrow-circle-o-left"
					},
					{
					    icon: "fa fa-arrow-circle-o-right"
					},
					{
					    icon: "fa fa-arrow-circle-o-up"
					},
					{
					    icon: "fa fa-arrow-circle-right"
					},
					{
					    icon: "fa fa-arrow-circle-up"
					},
					{
					    icon: "fa fa-arrow-down"
					},
					{
					    icon: "fa fa-arrow-left"
					},
					{
					    icon: "fa fa-arrow-right"
					},
					{
					    icon: "fa fa-arrow-up"
					},
					{
					    icon: "fa fa-arrows"
					},
					{
					    icon: "fa fa-arrows-alt"
					},
					{
					    icon: "fa fa-arrows-h"
					},
					{
					    icon: "fa fa-arrows-v"
					},
					{
					    icon: "fa fa-caret-down"
					},
					{
					    icon: "fa fa-caret-left"
					},
					{
					    icon: "fa fa-caret-right"
					},
					{
					    icon: "fa fa-caret-square-o-down"
					},
					{
					    icon: "fa fa-caret-square-o-left"
					},
					{
					    icon: "fa fa-caret-square-o-right"
					},
					{
					    icon: "fa fa-caret-square-o-up"
					},
					{
					    icon: "fa fa-caret-up"
					},
					{
					    icon: "fa fa-chevron-circle-down"
					},
					{
					    icon: "fa fa-chevron-circle-left"
					},
					{
					    icon: "fa fa-chevron-circle-right"
					},
					{
					    icon: "fa fa-chevron-circle-up"
					},
					{
					    icon: "fa fa-chevron-down"
					},
					{
					    icon: "fa fa-chevron-left"
					},
					{
					    icon: "fa fa-chevron-right"
					},
					{
					    icon: "fa fa-chevron-up"
					},
					{
					    icon: "fa fa-exchange"
					},
					{
					    icon: "fa fa-hand-o-down"
					},
					{
					    icon: "fa fa-hand-o-left"
					},
					{
					    icon: "fa fa-hand-o-right"
					},
					{
					    icon: "fa fa-hand-o-up"
					},
					{
					    icon: "fa fa-long-arrow-down"
					},
					{
					    icon: "fa fa-long-arrow-left"
					},
					{
					    icon: "fa fa-long-arrow-right"
					},
					{
					    icon: "fa fa-long-arrow-up"
					},
					{
					    icon: "fa fa-toggle-down"
					},
					{
					    icon: "fa fa-toggle-left"
					},
					{
					    icon: "fa fa-toggle-right"
					},
					{
					    icon: "fa fa-toggle-up"
					}],
				},{
					name:"播放器类图标",
					list:[{
					    icon: "fa fa-arrows-alt"
					},
					{
					    icon: "fa fa-backward"
					},
					{
					    icon: "fa fa-compress"
					},
					{
					    icon: "fa fa-eject"
					},
					{
					    icon: "fa fa-expand"
					},
					{
					    icon: "fa fa-fast-backward"
					},
					{
					    icon: "fa fa-fast-forward"
					},
					{
					    icon: "fa fa-forward"
					},
					{
					    icon: "fa fa-pause"
					},
					{
					    icon: "fa fa-pause-circle"
					},
					{
					    icon: "fa fa-pause-circle-o"
					},
					{
					    icon: "fa fa-play"
					},
					{
					    icon: "fa fa-play-circle"
					},
					{
					    icon: "fa fa-play-circle-o"
					},
					{
					    icon: "fa fa-random"
					},
					{
					    icon: "fa fa-step-backward"
					},
					{
					    icon: "fa fa-step-forward"
					},
					{
					    icon: "fa fa-stop"
					},
					{
					    icon: "fa fa-stop-circle"
					},
					{
					    icon: "fa fa-stop-circle-o"
					},
					{
					    icon: "fa fa-youtube-play"
					}],
				},{
					name:"商标图标",
					list:[{
					    icon: "fa fa-500px"
					},
					{
					    icon: "fa fa-adn"
					},
					{
					    icon: "fa fa-amazon"
					},
					{
					    icon: "fa fa-android"
					},
					{
					    icon: "fa fa-angellist"
					},
					{
					    icon: "fa fa-apple"
					},
					{
					    icon: "fa fa-bandcamp"
					},
					{
					    icon: "fa fa-behance"
					},
					{
					    icon: "fa fa-behance-square"
					},
					{
					    icon: "fa fa-bitbucket"
					},
					{
					    icon: "fa fa-bitbucket-square"
					},
					{
					    icon: "fa fa-bitcoin"
					},
					{
					    icon: "fa fa-black-tie"
					},
					{
					    icon: "fa fa-bluetooth"
					},
					{
					    icon: "fa fa-bluetooth-b"
					},
					{
					    icon: "fa fa-btc"
					},
					{
					    icon: "fa fa-buysellads"
					},
					{
					    icon: "fa fa-cc-amex"
					},
					{
					    icon: "fa fa-cc-diners-club"
					},
					{
					    icon: "fa fa-cc-discover"
					},
					{
					    icon: "fa fa-cc-jcb"
					},
					{
					    icon: "fa fa-cc-mastercard"
					},
					{
					    icon: "fa fa-cc-paypal"
					},
					{
					    icon: "fa fa-cc-stripe"
					},
					{
					    icon: "fa fa-cc-visa"
					},
					{
					    icon: "fa fa-chrome"
					},
					{
					    icon: "fa fa-codepen"
					},
					{
					    icon: "fa fa-codiepie"
					},
					{
					    icon: "fa fa-connectdevelop"
					},
					{
					    icon: "fa fa-contao"
					},
					{
					    icon: "fa fa-css3"
					},
					{
					    icon: "fa fa-dashcube"
					},
					{
					    icon: "fa fa-delicious"
					},
					{
					    icon: "fa fa-deviantart"
					},
					{
					    icon: "fa fa-digg"
					},
					{
					    icon: "fa fa-dribbble"
					},
					{
					    icon: "fa fa-dropbox"
					},
					{
					    icon: "fa fa-drupal"
					},
					{
					    icon: "fa fa-edge"
					},
					{
					    icon: "fa fa-eercast"
					},
					{
					    icon: "fa fa-empire"
					},
					{
					    icon: "fa fa-envira"
					},
					{
					    icon: "fa fa-etsy"
					},
					{
					    icon: "fa fa-expeditedssl"
					},
					{
					    icon: "fa fa-fa"
					},
					{
					    icon: "fa fa-facebook"
					},
					{
					    icon: "fa fa-facebook-f"
					},
					{
					    icon: "fa fa-facebook-official"
					},
					{
					    icon: "fa fa-facebook-square"
					},
					{
					    icon: "fa fa-firefox"
					},
					{
					    icon: "fa fa-first-order"
					},
					{
					    icon: "fa fa-flickr"
					},
					{
					    icon: "fa fa-font-awesome"
					},
					{
					    icon: "fa fa-fonticons"
					},
					{
					    icon: "fa fa-fort-awesome"
					},
					{
					    icon: "fa fa-forumbee"
					},
					{
					    icon: "fa fa-foursquare"
					},
					{
					    icon: "fa fa-free-code-camp"
					},
					{
					    icon: "fa fa-ge"
					},
					{
					    icon: "fa fa-get-pocket"
					},
					{
					    icon: "fa fa-gg"
					},
					{
					    icon: "fa fa-gg-circle"
					},
					{
					    icon: "fa fa-git"
					},
					{
					    icon: "fa fa-git-square"
					},
					{
					    icon: "fa fa-github"
					},
					{
					    icon: "fa fa-github-alt"
					},
					{
					    icon: "fa fa-github-square"
					},
					{
					    icon: "fa fa-gitlab"
					},
					{
					    icon: "fa fa-gittip"
					},
					{
					    icon: "fa fa-glide"
					},
					{
					    icon: "fa fa-glide-g"
					},
					{
					    icon: "fa fa-google"
					},
					{
					    icon: "fa fa-google-plus"
					},
					{
					    icon: "fa fa-google-plus-circle"
					},
					{
					    icon: "fa fa-google-plus-official"
					},
					{
					    icon: "fa fa-google-plus-square"
					},
					{
					    icon: "fa fa-google-wallet"
					},
					{
					    icon: "fa fa-gratipay"
					},
					{
					    icon: "fa fa-grav"
					},
					{
					    icon: "fa fa-hacker-news"
					},
					{
					    icon: "fa fa-houzz"
					},
					{
					    icon: "fa fa-html5"
					},
					{
					    icon: "fa fa-imdb"
					},
					{
					    icon: "fa fa-instagram"
					},
					{
					    icon: "fa fa-internet-explorer"
					},
					{
					    icon: "fa fa-ioxhost"
					},
					{
					    icon: "fa fa-joomla"
					},
					{
					    icon: "fa fa-jsfiddle"
					},
					{
					    icon: "fa fa-lastfm"
					},
					{
					    icon: "fa fa-lastfm-square"
					},
					{
					    icon: "fa fa-leanpub"
					},
					{
					    icon: "fa fa-linkedin"
					},
					{
					    icon: "fa fa-linkedin-square"
					},
					{
					    icon: "fa fa-linode"
					},
					{
					    icon: "fa fa-linux"
					},
					{
					    icon: "fa fa-maxcdn"
					},
					{
					    icon: "fa fa-meanpath"
					},
					{
					    icon: "fa fa-medium"
					},
					{
					    icon: "fa fa-meetup"
					},
					{
					    icon: "fa fa-mixcloud"
					},
					{
					    icon: "fa fa-modx"
					},
					{
					    icon: "fa fa-odnoklassniki"
					},
					{
					    icon: "fa fa-odnoklassniki-square"
					},
					{
					    icon: "fa fa-opencart"
					},
					{
					    icon: "fa fa-openid"
					},
					{
					    icon: "fa fa-opera"
					},
					{
					    icon: "fa fa-optin-monster"
					},
					{
					    icon: "fa fa-pagelines"
					},
					{
					    icon: "fa fa-paypal"
					},
					{
					    icon: "fa fa-pied-piper"
					},
					{
					    icon: "fa fa-pied-piper-alt"
					},
					{
					    icon: "fa fa-pied-piper-pp"
					},
					{
					    icon: "fa fa-pinterest"
					},
					{
					    icon: "fa fa-pinterest-p"
					},
					{
					    icon: "fa fa-pinterest-square"
					},
					{
					    icon: "fa fa-product-hunt"
					},
					{
					    icon: "fa fa-qq"
					},
					{
					    icon: "fa fa-quora"
					},
					{
					    icon: "fa fa-ra"
					},
					{
					    icon: "fa fa-ravelry"
					},
					{
					    icon: "fa fa-rebel"
					},
					{
					    icon: "fa fa-reddit"
					},
					{
					    icon: "fa fa-reddit-alien"
					},
					{
					    icon: "fa fa-reddit-square"
					},
					{
					    icon: "fa fa-renren"
					},
					{
					    icon: "fa fa-resistance"
					},
					{
					    icon: "fa fa-safari"
					},
					{
					    icon: "fa fa-scribd"
					},
					{
					    icon: "fa fa-sellsy"
					},
					{
					    icon: "fa fa-share-alt"
					},
					{
					    icon: "fa fa-share-alt-square"
					},
					{
					    icon: "fa fa-shirtsinbulk"
					},
					{
					    icon: "fa fa-simplybuilt"
					},
					{
					    icon: "fa fa-skyatlas"
					},
					{
					    icon: "fa fa-skype"
					},
					{
					    icon: "fa fa-slack"
					},
					{
					    icon: "fa fa-slideshare"
					},
					{
					    icon: "fa fa-snapchat"
					},
					{
					    icon: "fa fa-snapchat-ghost"
					},
					{
					    icon: "fa fa-snapchat-square"
					},
					{
					    icon: "fa fa-soundcloud"
					},
					{
					    icon: "fa fa-spotify"
					},
					{
					    icon: "fa fa-stack-exchange"
					},
					{
					    icon: "fa fa-stack-overflow"
					},
					{
					    icon: "fa fa-steam"
					},
					{
					    icon: "fa fa-steam-square"
					},
					{
					    icon: "fa fa-stumbleupon"
					},
					{
					    icon: "fa fa-stumbleupon-circle"
					},
					{
					    icon: "fa fa-superpowers"
					},
					{
					    icon: "fa fa-telegram"
					},
					{
					    icon: "fa fa-tencent-weibo"
					},
					{
					    icon: "fa fa-themeisle"
					},
					{
					    icon: "fa fa-trello"
					},
					{
					    icon: "fa fa-tripadvisor"
					},
					{
					    icon: "fa fa-tumblr"
					},
					{
					    icon: "fa fa-tumblr-square"
					},
					{
					    icon: "fa fa-twitch"
					},
					{
					    icon: "fa fa-twitter"
					},
					{
					    icon: "fa fa-twitter-square"
					},
					{
					    icon: "fa fa-usb"
					},
					{
					    icon: "fa fa-viacoin"
					},
					{
					    icon: "fa fa-viadeo"
					},
					{
					    icon: "fa fa-viadeo-square"
					},
					{
					    icon: "fa fa-vimeo"
					},
					{
					    icon: "fa fa-vimeo-square"
					},
					{
					    icon: "fa fa-vine"
					},
					{
					    icon: "fa fa-vk"
					},
					{
					    icon: "fa fa-wechat"
					},
					{
					    icon: "fa fa-weibo"
					},
					{
					    icon: "fa fa-weixin"
					},
					{
					    icon: "fa fa-whatsapp"
					},
					{
					    icon: "fa fa-wikipedia-w"
					},
					{
					    icon: "fa fa-windows"
					},
					{
					    icon: "fa fa-wordpress"
					},
					{
					    icon: "fa fa-wpbeginner"
					},
					{
					    icon: "fa fa-wpexplorer"
					},
					{
					    icon: "fa fa-wpforms"
					},
					{
					    icon: "fa fa-xing"
					},
					{
					    icon: "fa fa-xing-square"
					},
					{
					    icon: "fa fa-y-combinator"
					},
					{
					    icon: "fa fa-y-combinator-square"
					},
					{
					    icon: "fa fa-yahoo"
					},
					{
					    icon: "fa fa-yc"
					},
					{
					    icon: "fa fa-yc-square"
					},
					{
					    icon: "fa fa-yelp"
					},
					{
					    icon: "fa fa-yoast"
					},
					{
					    icon: "fa fa-youtube"
					},
					{
					    icon: "fa fa-youtube-play"
					},]
				},{
					name:"医疗类图标",
					list:[{
					    icon: "fa fa-ambulance"
					},
					{
					    icon: "fa fa-h-square"
					},
					{
					    icon: "fa fa-heart"
					},
					{
					    icon: "fa fa-heart-o"
					},
					{
					    icon: "fa fa-heartbeat"
					},
					{
					    icon: "fa fa-hospital-o"
					},
					{
					    icon: "fa fa-medkit"
					},
					{
					    icon: "fa fa-plus-square"
					},
					{
					    icon: "fa fa-stethoscope"
					},
					{
					    icon: "fa fa-user-md"
					},
					{
					    icon: "fa fa-wheelchair"
					},
					{
					    icon: "fa fa-wheelchair-alt"
					}]
				}],
		currentSymbolKey: '',
		symbolName: '',
		popoverVisible: false,
		editPopoverVisible: false,
		keyValeUpdateVisible: false,
		keyValeCreateVisible: false,
		selectIndex: 1,
		attr: {
			html: '',
			value: ''
		},
		childrenCopy: '',
		layout: {},

		activeCtrlIndex: 0,
		activeCtrlLvl: 1,

		activePage: {},

		constructionMenuStyle: {
			position: 'fixed',
			top: '',
			left: '',
			display: 'none'
		},

		activeCtrl: {},
		heightUnit: 'px',
		widthUnit: '%',
		VDControllerListScroll: 'hidden'
	},

    subscriptions: {

        setup({ dispatch, history }) {
            history.listen(({
                pathname
            }) => {

				if(!localStorage.canSetup || localStorage.canSetup == 'true'){
					dispatch({
	                    type: 'getInitialData'
	                })
				}

            });
        }

    },

	reducers: {

		getInitialData(state, {payload: params}) {

			state.defaultExpandedKeys = initialData.vdCtrlTree.defaultExpandedKeys;
			state.expandedKeys = initialData.vdCtrlTree.expandedKeys;
			state.activeCtrlIndex = initialData.vdCtrlTree.activeCtrlIndex;
			state.activePage = initialData.vdCtrlTree.activePage;
			state.layout = initialData.vdCtrlTree.layout;
			state.activeCtrl = {};
			return {...state};
		},

		changeVDControllerListScroll(state, {payload: params}) {
			state.VDControllerListScroll = params;
			state.linkTo = params.linkTo;
			return {...state}
		},

		initState(state, { payload: params}) {

			state.activeCtrl = params.UIState.activeCtrl || {};
			state.layout = params.UIState.layout || [];
			state.activePage = params.UIState.activePage || {
				key: 'index.html'
			};
			state.selectIndex = params.UIState.selectIndex || 0;
			state.symbols = params.UIState.symbols || [];
			state.activeCtrlLvl = params.UIState.activeCtrlLvl || 0;
			state.activeCtrlIndex = params.UIState.activeCtrlIndex || 1;
			state.defaultExpandedKeys = params.UIState.defaultExpandedKeys || [];
			state.defaultSelectedKeys = params.UIState.defaultSelectedKeys || [''];
			setTimeout(function(){
				console.log('reload');
				window.VDDesignerFrame.postMessage({
					pageSelected: state.layout[state.activePage.key]
				}, '*');
			}, 2500);
			return {...state};
		},
		initLayout(state, {payload: params}){

			state.layout = params.layout;
			setTimeout(function(){
				window.VDDesignerFrame.postMessage({
					pageSelected: state.layout['index.html']
				}, '*');
			}, 2500);
			return {...state};
		},
		handleUnit(state, { payload: params}) {

			state[params.target] = params.value;

			let currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			if (currentActiveCtrl.controller.attrs[0].children[2]) {
				var style = currentActiveCtrl.controller.attrs[0].children[2].value;
				if (params.target == 'height') {
					style = style.replace(/height: \d*(%|px);/, "height: " + currentActiveCtrl.controller.attrs[0].children[3].value + params.value + ";");
				}
				if (params.target == 'width') {
					style = style.replace(/width: \d*(%|px);/, "width: " + currentActiveCtrl.controller.attrs[0].children[4].value + params.value + ";");
				}
				currentActiveCtrl.controller.attrs[0].children[2].value = style;
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						attrType: {
							key: 'slider-setting'
						},
						attr: currentActiveCtrl.controller.attrs[0].children[2],
						activeCtrl: currentActiveCtrl.controller
					}
				}, '*');
				for (var i = 0; i < currentActiveCtrl.controller.children[1].children.length; i++) {
					currentActiveCtrl.controller.children[1].children[i].children[0].attrs[0].children[2].value = style;
					window.VDDesignerFrame.postMessage({
						VDAttrRefreshed: {
							attrType: {
								key: 'slider-setting'
							},
							attr: currentActiveCtrl.controller.children[1].children[i].children[0].attrs[0].children[2],
							activeCtrl: currentActiveCtrl.controller.children[1].children[i].children[0],
						}
					}, '*');
				}
			}
			state.activeCtrl = currentActiveCtrl.controller;
			return {...state};
		},
		editStyleNameA(state, { payload: params}) {

			const editStyleNameRec = (state, originStyleName, newStyleName, activePage) => {
				let
					controllers = state.layout[activePage.key];

				const loopControllers = function(controllers, level) {
					level = level || 1;
					for (let i = 0; i < controllers.length; i++) {
						let currentControl = controllers[i];
						if (currentControl.children) {
							loopControllers(currentControl.children, level++);
						}

						var pos = currentControl.customClassName.indexOf(originStyleName);

						if (pos != -1) {
							currentControl.customClassName.splice(pos, 1);
							currentControl.customClassName.push(newStyleName);

							//通知dom更新
							window.VDDesignerFrame.postMessage({
								styleNameEdited: {
									vdid: currentControl.vdid,
									originStyleName,
									newStyleName
								}
							}, '*');

						}

						if (currentControl.activeStyle == originStyleName) {
							currentControl.activeStyle = newStyleName;
						}

					}
				}

				loopControllers(controllers, 1);
			};

			//更新所有组件树
			editStyleNameRec(state, params.origin, params.newStyleName, state.activePage);

			//更新activeCtrl
			if (state.activeCtrl.activeStyle == params.origin) {
				state.activeCtrl.activeStyle = params.newStyleName;
			}

			var pos = state.activeCtrl.customClassName.indexOf(params.origin);

			if (pos != -1) {
				state.activeCtrl.customClassName.splice(pos, 1);
				state.activeCtrl.customClassName.push(params.newStyleName);
			}

			return {...state};
		},

		removeStyleNameA(state, { payload: params}) {

			const editStyleNameRec = (state, originStyleName, newStyleName, activePage) => {
				let controllers = state.layout[activePage.key];

				const loopControllers = function(controllers, level) {
					level = level || 1;
					for (let i = 0; i < controllers.length; i++) {
						let currentControl = controllers[i];
						if (currentControl.children) {
							loopControllers(currentControl.children, level++);
						}

						if (!currentControl.customClassName) {
							continue;
						}

						var pos = currentControl.customClassName.indexOf(originStyleName);

						if (pos != -1) {
							currentControl.customClassName.splice(pos, 1);

							//通知dom更新
							window.VDDesignerFrame.postMessage({
								styleNameEdited: {
									vdid: currentControl.vdid,
									originStyleName,
									newStyleName: ''
								}
							}, '*');

						}

						if (currentControl.activeStyle == originStyleName) {
							if (currentControl.customClassName[pos - 1]) {
								currentControl.activeStyle = currentControl.customClassName[pos - 1];
							} else {
								currentControl.activeStyle = '';
							}
						}

					}
				}

				loopControllers(controllers, 1);
			};

			//更新所有组件树
			editStyleNameRec(state, params.origin, params.newStyleName, state.activePage);

			//更新activeCtrl
			if (state.activeCtrl.activeStyle == params.origin) {
				if (state.activeCtrl.customClassName[pos - 1]) {
					state.activeCtrl.activeStyle = state.activeCtrl.customClassName[pos - 1];
				} else {
					state.activeCtrl.activeStyle = '';
				}
			}

			var pos = state.activeCtrl.customClassName.indexOf(params.origin);

			if (pos != -1) {
				state.activeCtrl.customClassName.splice(pos, 1);
			}

			return {...state};
		},

		showCtrlTreeContextMenu(state, {payload: proxy}) {
			return {...state,
				constructionMenuStyle: {
					position: 'fixed',
					display: 'block',
					left: proxy.event.pageX,
					top: proxy.event.pageY,
				}
			};
		},

		hideCtrlTreeContextMenu(state) {
			return {...state,
				constructionMenuStyle: {
					position: 'fixed',
					display: 'none',
					left: 0,
					top: 0,
				}
			};
		},

		handleCurrentSymbolKey(state, {payload: key}) {
			state.currentSymbolKey = key;
			return {...state};
		},
		handleSymbolNameChange(state, {payload: value}) {
			state.symbolName = value;
			return {...state};
		},
		handleAddSymbol(state) {

			if (!methods.checkName(state.symbols, state.symbolName)) {
				openNotificationWithIcon('info', '该控件名已被占用，请重新输入');
				return {...state
				};
			} else {

				if (!state.activeCtrl.tag) {
					message.error('请选择一个控件或添加一个控件再进行操作');
					return {...state
					};
				}

				var addController = {
					name: localStorage.symbolName,
					key: randomString(8, 10),
					controllers: {
						details: state.activeCtrl
					}
				}
				state.popoverVisible = false;
				state.symbolName = '';
				state.symbols.push(addController);

				window.VDDesignerFrame.postMessage({
					symbolsAdded: addController
				}, '*');
			}

			return {...state};
		},
		handlePopoverVisbile(state, {payload: value}) {

			state.popoverVisible = value;
			return {...state};
		},
		handleEditPopoverVisbile(state, {payload: value}) {

			state.editPopoverVisible = value;
			return {...state};
		},
		handleUpdateVisible(state, {payload: value}) {

			state.keyValeUpdateVisible = value;
			return {...state};
		},
		handleCreateVisible(state, {payload: value}) {

			state.keyValeCreateVisible = value;
			state.attr.html = '';
			state.attr.value = '';
			return {...state};
		},
		editSymbol(state) {

			if (!methods.checkName(state.symbols, state.symbolName)) {
				openNotificationWithIcon('info', '控件名已被占用');
			} else {
				var index = methods.getSymbolIndexByKey(state.symbols, state.currentSymbolKey);

				if (index == undefined) {
					openNotificationWithIcon('error', '修改错误,请重试');
				} else {
					state.symbols[index].name = state.symbolName;
				}
			}
			state.symbolName = '';
			state.currentSymbolKey = '';
			state.editPopoverVisible = false;
			return {...state};
		},
		deleteSymbol(state, {payload: key}) {
			var index = methods.getSymbolIndexByKey(state.symbols, key);
			if (index == undefined) {
				openNotificationWithIcon('error', '删除失败,请重试');
			} else {
				state.symbols.splice(index, 1);
			}
			return {...state};
		},
		handleSelectIndex(state, {payload: index}) {

			state.selectIndex = index;
			return {...state};
		},
		handleChildrenAttrChange(state, {payload: params}) {
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			if (params.attr.isTab) {
				currentActiveCtrl.controller.children[0].children[state.selectIndex].children[0].attrs[0].children[4][params.attr.name] = params.attr.value;
			} else {
				currentActiveCtrl.controller.children[state.selectIndex].attrs[0].children[0][params.attr.name] = params.attr.value;
			}
			state.activeCtrl = currentActiveCtrl.controller;
			return {...state};
		},
		uploadBgImg(state, {payload: params}) {

			// var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			// 	currentActiveCtrl.controller.attrs[0].children[0].fileInfo = [params];
			// 	var url = currentActiveCtrl.controller.attrs[0].children[0].fileInfo.url
			// url = params.url;

			window.postMessage({
				fetchImgFromSrc: {
					url: params.url
				}
			}, '*');
			return {...state}
		},
		uploadPreviewImg(state, {payload: params}) {

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			if (currentActiveCtrl.controller.attrs[0].key == 'slider-setting') {
				var activeCtrl = currentActiveCtrl.controller.children[1].children[state.selectIndex].children[0];
				currentActiveCtrl.controller.children[1].children[state.selectIndex].children[0].attrs[0].children[0].value = params.url
				url = params.url;

				window.VDDesignerFrame.postMessage({
					uploadImgRefreshed: {
						activeCtrl: activeCtrl,
						url: url
					}
				}, '*');
			} else {
				currentActiveCtrl.controller.attrs[0].children[0].fileInfo = [params];
				currentActiveCtrl.controller.attrs[0].children[0].value = params.url;
				state.activeCtrl = currentActiveCtrl.controller;
				var url = currentActiveCtrl.controller.attrs[0].children[0].fileInfo[0].url,
					activeCtrl = currentActiveCtrl.controller;
				window.VDDesignerFrame.postMessage({
					uploadImgRefreshed: {
						activeCtrl: activeCtrl,
						url: url
					}
				}, '*');
			}

			return {...state}
		},

		handleAddChildrenAttr(state, {payload: params}) {
			state.attr[params.name] = params.value
			return {...state};
		},
		//当前活跃控件子删除    scasdsacsas
		handleChildrenDelete(state, {payload: params}) {

			if (params.index == state.selectIndex) {

				if (params.index == 0) {
					state.selectIndex = 1;
				}
				state.selectIndex = params.index - 1;
			}

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			var children = params.children;
			var parentCtrl = currentActiveCtrl.controller;

			var i = 0;

			function childrenDeleteBylevel(parent) {
				i++;
				if (i < params.level) {
					childrenDeleteBylevel(parent.children[0]);
				} else {
					parent.children.splice(params.index, 1);
					if (parent.children == null || parent.children == undefined) {
						parent.children = [];
					}
				}
			}
			if(params.attrType.key = 'tabs-setting'){
				currentActiveCtrl.controller.children[1].children.splice(params.index, 1);
			}
			childrenDeleteBylevel(parentCtrl)
			state.activeCtrl = currentActiveCtrl.controller;
			window.VDDesignerFrame.postMessage({
				VDChildrenDelete: {
					activeCtrl: children,
					attrType: params.attrType
				}
			}, '*');

			return {...state};
		},
		handleComplextChildrenDelete(state, {payload: params}) {

			var currentActiveCtrl,
				target;
			const deleteChildrenByType = {
				'navbar-drop-down' () {
					target = state.activeCtrl.parent;
					var parent = VDTreeActions.getCtrlByKey(state, state.activeCtrl.parent, state.activePage).controller.parent;
					currentActiveCtrl = VDTreeActions.getCtrlByKey(state, parent, state.activePage);
					state.activeCtrl = currentActiveCtrl.controller;
				},
				'slider-delete' () {
					target = params.target,
						currentActiveCtrl = VDTreeActions.getCtrlByKey(state, params.parent, state.activePage);
					var root = VDTreeActions.getCtrlByKey(state, currentActiveCtrl.controller.root, state.activePage).controller;

					window.VDDesignerFrame.postMessage({
						VDChildrenDelete: {
							activeCtrl: {
								vdid: root.children[0].children[params.index].vdid
							},
							attrType: params.attrType
						}
					}, '*');
					root.children[0].children.splice(params.index, 1);
					for (var i = 0; i < root.children[0].children.length; i++) {
						root.children[0].children[i].attrs[0].children[1].value = i;
						window.VDDesignerFrame.postMessage({
							VDAttrRefreshed: {
								attrType: {
									key: 'slider-setting'
								},
								attr: root.children[0].children[i].attrs[0].children[1],
								activeCtrl: root.children[0].children[i]
							}
						}, '*');

					}
				}
			}
			state.selectIndex = 0;
			deleteChildrenByType[params.type]();

			for (var i = 0; i < currentActiveCtrl.controller.children.length; i++) {

				if (currentActiveCtrl.controller.children[i].vdid == target) {
					currentActiveCtrl.controller.children.splice(i, 1);
				}
			}
			state.activeCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage).controller;
			window.VDDesignerFrame.postMessage({
				VDChildrenDelete: {
					activeCtrl: {
						vdid: target
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},
		handleComplexChildrenAdd(state, {payload: params}) {

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.parent, state.activePage);
			const addChildrenByType = {

				'navbar-drop-down' () {
					var parent = currentActiveCtrl.controller.children[1];
					params.children.parent = parent.vdid;
					if (parent.children) {
						parent.children.push(params.children);
					} else {
						var chidren = new Array();
						chidren.push(params.children);
						parent.children = children;
					}
					return parent;
				}
			}
			addChildrenByType[params.type]();

			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						attrName: 'children',
						action: 'add',
						children: params.children,
						parent: params.children.parent
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},
		//当前活跃控件 添加一个子控件
		handleChildrenAdd(state, {payload: params}) {

			if (params.children.tag == 'option') {
				params.children.attrs[0].children[0].html = state.attr.html;
				params.children.attrs[0].children[0].value = state.attr.value;
			}

			params.children.root = state.activeCtrl.root;
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			var parentCtrl = currentActiveCtrl.controller;
			var parentCtrlVdid;
			var i = 0;

			function childrenAddBylevel(parent) {
				let parentIndex = 0;
				for (var j = 0; j < params.levelsInfo.length; j++) {
					if (i == params.levelsInfo[j].level) {
						parentIndex = params.levelsInfo[j].index;
					}
				}
				i++;
				if (i < params.level) {
					childrenAddBylevel(parent.children[parentIndex]);
				} else {
					parentCtrlVdid = parent.vdid;
					params.children.parent = parentCtrlVdid;
					if (parent.children) {
						parent.children.push(params.children);
					} else {
						var chidren = new Array();
						chidren.push(params.children);
						parent.children = children;
					}
				}
			}
			childrenAddBylevel(parentCtrl);

			state.activeCtrl = currentActiveCtrl.controller;
			state.keyValeCreateVisible = false;
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						attrName: 'children',
						action: 'add',
						children: params.children,
						parent: parentCtrlVdid
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},
		//当前活跃控件子控件更新
		handleChildrenUpdate(state, {payload: params}) {
			state.keyValeUpdateVisible = false;
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						attrName: 'children',
						action: 'update'
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},
		//修改控件的Class
		handleClassNameChange(state, {payload: params}) {

			let currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage),
				i = 0,
				target;

			function changeClassNameByLevel(parent) {

				let parentIndex = 0;
				for (var j = 0; j < params.levelsInfo.length; j++) {
					if (i == params.levelsInfo[j].level) {
						parentIndex = params.levelsInfo[j].index;
					}
				}
				i++;
				if (i < params.level) {
					changeClassNameByLevel(parent.children[parentIndex]);
				} else {
					if (parent.children) {
						target = parent.children[parentIndex]
					}
				}
			}
			changeClassNameByLevel(currentActiveCtrl.controller);
			if (!target) {
				target = currentActiveCtrl.controller;
				target.attrs[0].children[params.index].value = params.replacement;
			}
			for (var k = 0; k < target.className.length; k++) {
				if (target.className[k] == params.remove) {
					target.className.splice(k, 1, params.replacement)
				}
			}
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						action: 'replaceClass',
						attrName: 'classOperate',
						remove: params.remove,
						replacement: params.replacement,
						target: target,
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},
		//更改当前活跃ctrl
		handleChangeCurrentCtrl(state, {payload: params}) {

			var parent = VDTreeActions.getCtrlByKey(state, state.activeCtrl.parent, state.activePage);

			if (params.toDropDown) {
				params.parent = parent.controller.parent,
					params.replacement.vdid = parent.controller.vdid;
				params.replacement.children[0].parent = parent.controller.vdid;
				parent.controller.children = [];
				for (var i = 0; i < params.replacement.children.length; i++) {
					parent.controller.children.push(params.replacement.children[i]);
				}
				state.activeCtrl = params.replacement.children[0];
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: params.replacement,
						attr: {
							attrName: 'children',
							action: 'update'
						},
					}
				}, '*');
			} else {
				parent.controller.children = [];
				parent.controller.children.push(params.replacement);
				state.activeCtrl = params.replacement;
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: state.activeCtrl,
						attr: {
							attrName: 'replaceElem',
							parent: parent.controller.vdid
						},
					}
				}, '*');
			}
			return {...state};
		},
		handleActive(state, {payload: params}) {

			//根据level获取要更改节点的父节点的数据结构
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage),
				i = 0,
				target;

			function findParent(parent) {

				let parentIndex = 0;
				for (var j = 0; j < params.levelsInfo.length; j++) {
					if (i == params.levelsInfo[j].level) {
						parentIndex = params.levelsInfo[j].index;
						if (params.action == 'tab') {
							for (var k = 0; k < parent.children.length; k++) {
								for (var m = 0; m < parent.children[k].children[0].className.length; m++) {
									if (parent.children[k].children[0].className[m] == 'active') {
										parent.children[k].children[0].className.splice(m, 1);
									}
								}
							}
						}
					}
				}
				i++;
				if (i < params.level) {
					findParent(parent.children[parentIndex]);
				} else {
					//切换active
					for (var j = 0; j < parent.children.length; j++) {
						for (var k = 0; k < parent.children[j].className.length; k++) {

							if (parent.children[j].className[k] == 'active') {
								parent.children[j].className.splice(k, 1);
								if (params.action == 'next') {
									if (j == parent.children.length - 1) {
										params.index = 0;
									} else {
										params.index = j + 1;
									}
								}
								if (params.action == 'last') {
									if (j == 0) {
										params.index = parent.children.length - 1;
									} else {
										params.index = j - 1;
									}
								}
								break;
							}
						}
					}
					target = parent.children[params.index];
					target.className.push('active');
				}
			}
			findParent(currentActiveCtrl.controller);
			state.activeCtrl = currentActiveCtrl.controller;
			state.selectIndex = params.index;
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: target,
					attr: {
						attrName: 'children',
						action: 'changeActive',
						index: params.index,
						parent: target.parent,
						type: params.action
					},
				}
			}, '*');
			return {...state};
		},
		handleFade(state, {payload: params}) {

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			if (params.value) {
				for (var i = 0; i < currentActiveCtrl.controller.children[1].children.length; i++) {

					currentActiveCtrl.controller.children[1].children[i].className.push('fade');
				}
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: state.activeCtrl,
						attr: {
							attrName: 'children',
							action: 'update'
						},
						attrType: params.attrType
					}
				}, '*');

			} else {
				for (var i = 0; i < currentActiveCtrl.controller.children[1].children.length; i++) {

					for (var j = 0; j < currentActiveCtrl.controller.children[1].children[i].className.length; j++) {
						if (currentActiveCtrl.controller.children[1].children[i].className[j] == 'fade') {
							currentActiveCtrl.controller.children[1].children[i].className.splice(j, 1);
							break;
						}
					}
				}
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: state.activeCtrl,
						attr: {
							action: 'batchClassRemove',
							attrName: 'classOperate',
							parent: currentActiveCtrl.controller.children[1].vdid,
							targetClass: 'fade',
						},
						attrType: params.attrType
					}
				}, '*');
			}
			currentActiveCtrl.controller.attrs[0].children[0].value = params.value;
			state.activeCtrl = currentActiveCtrl.controller;
			return {...state};
		},
		triggerMenu(state) {

			state.showLabel = state.showLabel == '打开菜单' ? '关闭菜单' : '打开菜单';
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						action: 'triggerMenu',
						attrName: 'scriptOperate',
						target: state.activeCtrl.children[0].children[1].vdid,
					},
				}
			}, '*');
			return {...state};
		},
		deletePage(state, {payload: params}) {
			state.activeCtrl = {};
			state.activePage.key = 'index.html';
			delete state.layout[params.key];
			window.VDDesignerFrame.postMessage({
				pageSelected: state.layout[state.activePage.key]
			}, '*');
			return {...state};
		},
		handlePreview(state, {payload: params}) {

			state.previewImage = params.previewImage;
			state.previewVisible = params.previewVisible;
			return {...state};
		},

		handleChange(state, {payload: fileList}) {
			state.fileList = fileList;
			return {...state};
		},

		handleCancel(state) {
			state.previewVisible = false;
			return {...state};
		},

		generateCtrlTree(state, {payload: ctrl}) {
			let controller = ctrl.details;

			// const specialAttrList = ['custom-attr', 'link-setting', 'list-setting', 'heading-type', 'image-setting', 'select-setting'];

			let deepCopiedController = VDTreeActions.deepCopyObj(controller);
			deepCopiedController.vdid = deepCopiedController.key ? (deepCopiedController.key + '-' + randomString(8, 10)) : randomString(8, 10);
			let root = deepCopiedController.vdid;

			let animationClassList = [{
				animate: '',
				name: 'None',
				duration: '',
				condition: 'none',
				vdid: [],
				key: 'none'
			}];

			const loopAttr = (controller, parent) => {

				let childCtrl = {},
					tmpAttr = {},
					ctrl = {};

				tmpAttr = controller.attrs;
				for (let i = 0, len = tmpAttr.length; i < len; i++) {
					// if(specialAttrList.indexOf(tmpAttr[i].key) !== -1) {
					// 	continue;
					// }
					for (var j = 0; j < tmpAttr[i].children.length; j++) {
						var attr = tmpAttr[i].children[j];
						attr['id'] = randomString(8, 10);
					};
				}
				if (controller.vdid == parent.vdid) {
					ctrl = {
						vdid: root,
						attrs: tmpAttr,
						tag: controller.tag,
						className: controller.className,
						customClassName: [],
						animationClassList: controller.animationClassList || animationClassList,
						activeStyle: '',
						children: [],
						isRander: controller.isRander || '',
						ignore: controller.ignore || false,
						root: root || '',
						isRoot: true,
						unCtrl: controller.unCtrl,
						unActive: controller.unActive,
						isBeforeHTMLValue: controller.isBeforeHTMLValue || false
					};
				} else {
					ctrl = {
						vdid: controller.key ? (controller.key + '-' + randomString(8, 10)) : randomString(8, 10),
						attrs: tmpAttr,
						tag: controller.tag,
						className: controller.className,
						customClassName: [],
						animationClassList: controller.animationClassList || animationClassList,
						activeStyle: '',
						children: [],
						isRander: controller.isRander || '',
						ignore: controller.ignore || false,
						root: root || '',
						parent: parent.vdid,
						unCtrl: controller.unCtrl,
						unActive: controller.unActive,
						isBeforeHTMLValue: controller.isBeforeHTMLValue || false
					};
				}

				if (controller.children) {
					for (var i = 0; i < controller.children.length; i++) {
						var currentCtrl = controller.children[i];
						childCtrl = loopAttr(currentCtrl, ctrl);
						ctrl.children.push(childCtrl);
					};
				} else {
					ctrl.children = undefined;
				}

				state.defaultSelectedKeys = [ctrl.vdid];

				return ctrl;
			}

			let tmpCtrl = loopAttr(deepCopiedController, deepCopiedController);
			//slider唯一id设置
			if (ctrl.key == 'slider') {
				var slider = randomString(8, 10);
				tmpCtrl.attrs[0].children[1].value = slider;
				tmpCtrl.children[0].children[0].attrs[0].children[0].value = '#' + slider;
				tmpCtrl.children[0].children[1].attrs[0].children[0].value = '#' + slider;

				tmpCtrl.children[2].attrs[0].children[0].value = '#' + slider;
				tmpCtrl.children[3].attrs[0].children[0].value = '#' + slider;
				state.heightUnit = 'px';
				state.widthUnit = '%';
			}

			let activeCtrl = VDTreeActions.getActiveCtrl(state);

			VDDesignerFrame.postMessage({
				ctrlTreeGenerated: {
					controller: tmpCtrl,
					activeCtrl
				}
			}, '*');

			state.showLabel = '打开菜单';
			return {...state};
		},

		// handleElemAdded(state, { payload: params }) {
		// 	// state.layout[params.activePage][0].children.push(params.ctrl);
		// 	state.activeCtrl = params.ctrl;
		// 	var ctrlInfo = VDTreeActions.getActiveControllerIndexAndLvlByKey(state, params.ctrl.vdid, state.activePage);
		// 	state.activeCtrlIndex = ctrlInfo.index;
		// 	state.activeCtrlLvl = ctrlInfo.level;
		// 	return {...state};
		// },

		setActivePage(state, {payload: params}) {

			state.activePage.key = params.activePage.key;
			window.VDDesignerFrame.postMessage({
				pageSelected: state.layout[params.activePage.key]
			}, '*');
			return {...state};
		},

		handleTreeExpaned(state, {payload: expandedKeys}) {
			return {...state,
				expandedKeys: expandedKeys,
				autoExpandParent: false
			};
		},

		setActiveCtrlInTree(state, {payload: params}) {
			state.defaultSelectedKeys = params;
			return {...state};
		},

		ctrlSelected(state, {payload: data}) {

			if (data.unCtrl && !data.dblclick) {
				let currentActiveCtrl = VDTreeActions.getActiveControllerIndexAndLvlByKey(state, data.root, state.activePage);
				state.activeCtrl = currentActiveCtrl.controller;
				state.activeCtrlIndex = currentActiveCtrl.index;
				state.activeCtrlLvl = currentActiveCtrl.level;
				state.defaultSelectedKeys = [data.root];
			} else {
				let ctrlInfo = VDTreeActions.getActiveControllerIndexAndLvlByKey(state, data.vdid, state.activePage);
				state.activeCtrl = ctrlInfo.controller;
				state.activeCtrlIndex = ctrlInfo.index;
				state.activeCtrlLvl = ctrlInfo.level;
				state.defaultSelectedKeys = [data.vdid];
			}

			if (state.expandedKeys.indexOf(state.activeCtrl.vdid) === -1) {
				state.expandedKeys.push(state.activeCtrl.vdid);
			}
			state.autoExpandParent = true;

			return {...state};
		},
		handleAttrFormChangeA(state, {payload: params}) {

			let currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);

			var ctrlAttrs = currentActiveCtrl.controller.attrs;
			var targetAttr;
			for (var i = 0; i < ctrlAttrs.length; i++) {
				for (var j = 0; j < ctrlAttrs[i].children.length; j++) {
					var attr = ctrlAttrs[i].children[j];
					var flag = false;
					if (attr.id == params.attrId) {
						targetAttr = attr.name;
						attr.value = params.newVal;
						flag = true;
						if (attr.attrName === 'id') {
							currentActiveCtrl.controller.id = params.newVal;
						}
						break;
					}
					if (flag) {
						break;
					}
				};
			};

			if (currentActiveCtrl.controller.attrs[0].children[2]) {
				var style = currentActiveCtrl.controller.attrs[0].children[2].value;
				if (targetAttr == 'height') {
					style = style.replace(/height: \d*(%|px);/, "height: " + params.newVal + state.heightUnit + ";");
				}
				if (targetAttr == 'width') {
					style = style.replace(/width: \d*(%|px);/, "width: " + params.newVal + state.widthUnit + ";");
				}
				currentActiveCtrl.controller.attrs[0].children[2].value = style;
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						attrType: params.attrType,
						attr: currentActiveCtrl.controller.attrs[0].children[2],
						activeCtrl: currentActiveCtrl.controller
					}
				}, '*');
			}

			if (params.attrType.key == 'slider-setting') {
				for (var i = 0; i < currentActiveCtrl.controller.children[1].children.length; i++) {
					currentActiveCtrl.controller.children[1].children[i].children[0].attrs[0].children[2].value = style;
					window.VDDesignerFrame.postMessage({
						VDAttrRefreshed: {
							attrType: params.attrType,
							attr: currentActiveCtrl.controller.children[1].children[i].children[0].attrs[0].children[2],
							activeCtrl: currentActiveCtrl.controller.children[1].children[i].children[0],
						}
					}, '*');
				}
			}
			state.activeCtrl = currentActiveCtrl.controller;
			return {...state}; 
		},
		handleAttrFormChangeNotRefreshActiveCtrl(state, {payload: params}) {

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, params.target, state.activePage);
			if (params.attrName === 'id') {
				currentActiveCtrl.controller.id = params.newVal;
			}
			var attr = currentActiveCtrl.controller.attrs[0].children[params.index];
			attr.value = params.newVal;
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: currentActiveCtrl.controller,
					attrType: params.attrType,
					attr: attr
				}
			}, '*');
			return {...state};
		},
		handleAttrRefreshed(state, {payload: params}) {

			//判断是否需要切换标签
			if (params.attrType.isChangeTag && params.attr.name == 'tag') {
				var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
				currentActiveCtrl.controller.attrs.tag = params.attr.value;
				state.activeCtrl = currentActiveCtrl.controller;
				params.activeCtrl.tag = params.attr.value;
			}
			if (params.attr.isStyle) {
				var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
				state.activeCtrl.attrs[currentActiveCtrl.index].children[currentActiveCtrl.level - 1].value = params.attr.value;
				params.activeCtrl.attrs[currentActiveCtrl.index].children[currentActiveCtrl.level - 1].value = params.attr.value;
				state.activeCtrl = currentActiveCtrl.controller;
			}
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: params
			}, '*');
			return {...state};
		},

		handleCustomAttrRemoved(state, {payload: params}) {
			var attrName = state.activeCtrl.attrs[params.attrTypeIndex].children[params.index].key;
			state.activeCtrl.attrs[params.attrTypeIndex].children.splice(params.index, 1);
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						attrName: attrName,
						action: 'remove'
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},

		handleCustomAttrInputChange(state, {payload: params}) {

			state.activeCtrl.attrs[params.attrTypeIndex].children[params.customAttrIndex][params.attrName] = params.value
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						value: params.value,
						index: params.index,
						attrName: params.attrName,
						attrTypeIndex: params.attrTypeIndex,
						action: 'modify'
					},
					attrType: params.attrType
				}
			}, '*');

			return {...state};
		},

		saveCustomAttr(state, {payload: params}) {

			state.activeCtrl.attrs[params.attrTypeIndex].children.push({
				key: params.key,
				value: params.value
			});

			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						value: {
							key: params.key,
							value: params.value
						},
						action: 'add'
					},
					attrType: params.attrType
				}
			}, '*');

			return {...state};
		},

		//栅格数变化
		handleColumnCountChange(state, {payload: params}) {
			let column = params.column;
			let currentRootVdid = params.currentRootVdid;
			let tmpColumns = params.tmpColumns;

			let colClass = 'col-md-' + tmpColumns[0].value;

			let currentColumsInfo = VDTreeActions.getCtrlByKey(state, currentRootVdid, state.activePage);
			let currentColums = currentColumsInfo.controller //当前的栅格
			let currentCount = currentColums.attrs[0].children[0].value; //当前栅格里面的格子数
			let changCount = params.value - currentCount;

			currentColums.attrs[0].children[0].value = params.value;
			currentColums.attrs[0].children[1].value = tmpColumns;

			//改变className及其属性值
			let changClassName = function() {
				for (let i = 0; i < currentColums.children.length; i++) {

					let currentChild = currentColums.children[i];

					currentChild.attrs[0].children[0].value = params.value;
					currentChild.attrs[0].children[1].value = tmpColumns;

					let originalClassName = currentChild.className;
					for (let j = 0; j < originalClassName.length; j++) {
						if (originalClassName[j].indexOf('col-md-') !== -1) {
							originalClassName[j] = colClass;
							break;
						}
					}
				}
			}

			let deepCopiedController = VDTreeActions.deepCopyObj(column);

			if (changCount > 0) {

				let animationClassList = [{
					animate: '',
					name: 'None',
					duration: '',
					condition: 'none',
					vdid: [],
					key: 'none'
				}];

				const loopAttr = (controller) => {

					let childCtrl = {},
						tmpAttr = {},
						ctrl = {};

					tmpAttr = controller.attrs;
					for (let i = 0, len = tmpAttr.length; i < len; i++) {
						for (var j = 0; j < tmpAttr[i].children.length; j++) {
							var attr = tmpAttr[i].children[j];
							attr['id'] = randomString(8, 10);
						};
					}

					tmpAttr[0].children[0].value = params.value;
					tmpAttr[0].children[1].value = tmpColumns;

					ctrl = {
						vdid: controller.key ? (controller.key + '-' + randomString(8, 10)) : randomString(8, 10),
						attrs: tmpAttr,
						tag: controller.tag,
						className: controller.className,
						customClassName: [],
						animationClassList: controller.animationClassList || animationClassList,
						activeStyle: '',
						children: [],
						isRander: controller.isRander || '',
						ignore: controller.ignore || false,
						root: currentRootVdid || '',
						parent: currentRootVdid,
						unCtrl: controller.unCtrl,
						unActive: controller.unActive,
					};


					if (controller.children) {
						for (var i = 0; i < controller.children.length; i++) {
							var currentCtrl = controller.children[i];
							childCtrl = loopAttr(currentCtrl, ctrl);
							ctrl.children.push(childCtrl);
						};
					} else {
						ctrl.children = undefined;
					}

					return ctrl;
				}

				changClassName();

				let addedColumn = [];

				for (let i = 0; i < changCount; i++) {
					let tmpCtrl = loopAttr(deepCopiedController);
					tmpCtrl.className = ['vd-empty', colClass];
					currentColums.children.push(tmpCtrl);
					addedColumn.push(tmpCtrl)
				}

				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: currentColums,
						attr: {
							attrName: 'columns',
							action: 'add',
							column: addedColumn,
							parent: currentRootVdid,
							count: changCount,
							colClass: colClass
						},
						attrType: params.attrType
					}
				}, '*');
			} else {
				for (let i = 0; i < -changCount; i++) {
					currentColums.children.pop();
				}
				changClassName();
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: currentColums,
						attr: {
							attrName: 'columns',
							action: 'delete',
							column: '',
							parent: currentRootVdid,
							count: -changCount,
							colClass: colClass
						}
					}
				}, '*');
			}

			// let actrl = VDTreeActions.getActiveControllerIndexAndLvlByKey(state, currentRootVdid, state.activePage);
			// state.activeCtrl = currentColums;
			state.activeCtrl = currentColums;
			state.activeCtrlIndex = currentColumsInfo.index;
			state.activeCtrlLvl = currentColumsInfo.level;
			state.defaultSelectedKeys = [currentColumsInfo.vdid];

			return {...state};
		},

		shrinkLeftColumn(state, {payload: params}) {

			let currentRootVdid = state.activeCtrl.root,
				currentColums = VDTreeActions.getCtrlByKey(state, currentRootVdid, state.activePage);
			currentColums = currentColums.controller;

			let needChangeAttr = currentColums.attrs[0].children[1].value;

			let changClassName = (classNames, className) => {
				for (let i = 0; i < classNames.length; i++) {
					if (classNames[i].indexOf('col-md-') !== -1) {
						classNames[i] = className;
					}
				}
			}

			if (needChangeAttr[params.index].value > 1) {
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: currentColums.children[params.index],
						attr: {
							attrName: 'classOperate',
							action: 'replaceClass',
							remove: 'col-md-' + (needChangeAttr[params.index].value),
							replacement: 'col-md-' + (needChangeAttr[params.index].value - 1),
							target: {
								vdid: currentColums.children[params.index].vdid
							}
						}
					}
				}, '*');

				needChangeAttr[params.index].span -= 2;
				needChangeAttr[params.index].value -= 1;
				for (let i = 0; i < currentColums.children.length; i++) {
					currentColums.children[i].attrs[0].children[1].value[params.index].span = needChangeAttr[params.index].span;
					currentColums.children[i].attrs[0].children[1].value[params.index].value = needChangeAttr[params.index].value;
				}

				changClassName(currentColums.children[params.index].className, 'col-md-' + (needChangeAttr[params.index].value));

				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: currentColums.children[params.index + 1],
						attr: {
							attrName: 'classOperate',
							action: 'replaceClass',
							remove: 'col-md-' + (needChangeAttr[params.index + 1].value),
							replacement: 'col-md-' + (needChangeAttr[params.index + 1].value + 1),
							target: {
								vdid: currentColums.children[params.index + 1].vdid
							}
						}
					}
				}, '*');

				needChangeAttr[params.index + 1].span += 2;
				needChangeAttr[params.index + 1].value += 1;

				for (let i = 0; i < currentColums.children.length; i++) {
					currentColums.children[i].attrs[0].children[1].value[params.index + 1].span = needChangeAttr[params.index + 1].span;
					currentColums.children[i].attrs[0].children[1].value[params.index + 1].value = needChangeAttr[params.index + 1].value;
				}

				changClassName(currentColums.children[params.index + 1].className, 'col-md-' + (needChangeAttr[params.index + 1].value));
			}

			return {...state};

		},

		expandLeftColumn(state, {payload: params}) {


			let currentRootVdid = state.activeCtrl.root,
				currentColums = VDTreeActions.getCtrlByKey(state, currentRootVdid, state.activePage);
			currentColums = currentColums.controller //当前的栅格

			let needChangeAttr = currentColums.attrs[0].children[1].value;

			let changClassName = (classNames, className) => {
				for (let i = 0; i < classNames.length; i++) {
					if (classNames[i].indexOf('col-md-') !== -1) {
						classNames[i] = className;
					}
				}
			}

			if (needChangeAttr[params.index + 1].value > 1) {
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: currentColums.children[params.index],
						attr: {
							attrName: 'classOperate',
							action: 'replaceClass',
							remove: 'col-md-' + (needChangeAttr[params.index].value),
							replacement: 'col-md-' + (needChangeAttr[params.index].value + 1),
							target: {
								vdid: currentColums.children[params.index].vdid
							}
						}
					}
				}, '*');
				//
				needChangeAttr[params.index].span += 2;
				needChangeAttr[params.index].value += 1;

				for (let i = 0; i < currentColums.children.length; i++) {
					currentColums.children[i].attrs[0].children[1].value[params.index].span = needChangeAttr[params.index].span;
					currentColums.children[i].attrs[0].children[1].value[params.index].value = needChangeAttr[params.index].value;
				}
				changClassName(currentColums.children[params.index].className, 'col-md-' + (needChangeAttr[params.index].value));

				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: currentColums.children[params.index + 1],
						attr: {
							attrName: 'classOperate',
							action: 'replaceClass',
							remove: 'col-md-' + (needChangeAttr[params.index + 1].value),
							replacement: 'col-md-' + (needChangeAttr[params.index + 1].value - 1),
							target: {
								vdid: currentColums.children[params.index + 1].vdid
							}
						}
					}
				}, '*');
				needChangeAttr[params.index + 1].span -= 2;
				needChangeAttr[params.index + 1].value -= 1;

				for (let i = 0; i < currentColums.children.length; i++) {
					currentColums.children[i].attrs[0].children[1].value[params.index + 1].span = needChangeAttr[params.index + 1].span;
					currentColums.children[i].attrs[0].children[1].value[params.index + 1].value = needChangeAttr[params.index + 1].value;
				}

				changClassName(currentColums.children[params.index + 1].className, 'col-md-' + (needChangeAttr[params.index + 1].value));
			}

			return {...state};
		},

		modifyCustomAttr(state, { payload: params }) {return {...state};},

		setActiveStyle(state, { payload: activeStyle }) {
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			currentActiveCtrl.controller.activeStyle = activeStyle;
			state.activeCtrl = currentActiveCtrl.controller;
			return {...state
			};
		},

		handleTreeNodeDrop(state, { payload: info }) {
			const dropKey = info.node.props.eventKey;
			const dragKey = info.dragNode.props.eventKey;
			// const dragNodesKeys = info.dragNodesKeys;
			const loop = (data, key, parent, callback) => {
				data.forEach((item, index, arr) => {
					if (item.vdid === key) {
						return callback(item, index, arr, parent);
					}
					if (item.children) {
						return loop(item.children, key, item, callback);
					}
				});
			};

			const data = state.layout[state.activePage.key];
			let dragObj;
			loop(data, dragKey, state.layout, (item, index, arr, parent) => {
				arr.splice(index, 1);
				if (arr.length === 0 && parent.tag !== 'body') {
					parent.className.push("vd-empty");
					window.VDDesignerFrame.postMessage({
						VDAttrRefreshed: {
							activeCtrl: state.activeCtrl,
							attr: {
								action: 'replaceClass',
								attrName: 'classOperate',
								remove: '',
								replacement: 'vd-empty',
								target: {
									vdid: parent.vdid
								},
								needSelect: true
							},
							attrType: ''
						}
					}, '*');
				}

				dragObj = item;
			});
			if (info.dropToGap) {
				let ar;
				let i;
				loop(data, dropKey, state.layout, (item, index, arr) => {
					ar = arr;
					i = index;
				});
				ar.splice(i, 0, dragObj);

				VDDesignerFrame.postMessage({
					treeNodeDroped: {
						target: dropKey,
						dragNode: dragKey,
						type: 'before'
					}
				}, "*")

			} else {
				loop(data, dropKey, state.layout, (item) => {
					item.children = item.children || [];
					if (item.children.length === 0) {
						item.className.splice(item.className.indexOf('vd-empty'), 1);
						window.VDDesignerFrame.postMessage({
							VDAttrRefreshed: {
								activeCtrl: state.activeCtrl,
								attr: {
									action: 'replaceClass',
									attrName: 'classOperate',
									remove: 'vd-empty',
									replacement: '',
									target: {
										vdid: item.vdid
									},
									needSelect: true
								},
								attrType: ''
							}
						}, '*');
					}

					item.children.push(dragObj);
				});

				VDDesignerFrame.postMessage({
					treeNodeDroped: {
						target: dropKey,
						dragNode: dragKey,
						type: 'append'
					}
				}, "*")
			}

			return {...state};
		},

		changeCustomClass(state, { payload: params }) {
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);

			if (!currentActiveCtrl.controller) {
				message.error('请先添加控件再进行操作！');
				return {...state
				};
			}

			var className = '';

			if (params.push) {
				if (typeof params.value == 'string') {
					params.value = [params.value];
				}
				currentActiveCtrl.controller.customClassName.push(params.value[0]);
				currentActiveCtrl.controller.activeStyle = params.value[params.value.length - 1];
				className = params.value[0];
			} else {
				currentActiveCtrl.controller.customClassName = params.value;
				currentActiveCtrl.controller.activeStyle = params.value[params.value.length - 1];
				className = params.value;
			}

			state.activeCtrl = currentActiveCtrl.controller;

			if (!params.dontChangeAttr) {
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: state.activeCtrl,
						attr: {
							attrName: 'class',
							action: 'remove',
							value: className
						},
						attrType: {
							key: 'className'
						}
					}
				}, '*');
			}

			return {...state};
		},

		handleLinkSettingTypeChange(state, { payload: params }) {
			params.item.activeLinkType = params.value;
			return { ...state };
		},

		addPageToLayout(state, { payload: params }) {
			var pageInfo = params.page;

			state.layout[pageInfo.key] = [{
				className: [],
				id: '',
				tag: 'body',
				vdid: 'body-' + randomString(8, 10),
				ctrlName: 'body',
				children: [],
				customClassName: [],
				animationClassList: [{
					animate: '',
					name: 'None',
					duration: '',
					condition: 'none',
					vdid: [],
					key: 'none'
				}],
				attrs: []
			}];
			state.activePage.key = pageInfo.key;

			window.VDDesignerFrame.postMessage({
				pageSelected: state.layout[pageInfo.key]
			}, '*');

			return {...state};
		},

		copyCtrl(state, { payload: params }) {

			if (state.activeCtrl && state.activeCtrl !== 'none') {
				sessionStorage.copiedCtrl = JSON.stringify(state.activeCtrl);
			}

			return {...state};},

		pastCtrl(state, { payload: params }) {

			if (!sessionStorage.copiedCtrl) {
				return {...state};
			}

			let controller = JSON.parse(sessionStorage.copiedCtrl);
			let activeCtrl = state.activeCtrl;

			if (state.layout[state.activePage.key][0].children.length === 0) {
				//页面为空时的粘贴
				params.type = 'append';
				activeCtrl = state.layout[state.activePage.key][0];
			}else if (!activeCtrl || !activeCtrl.tag) {
				return {...state};
			}

			controller.vdid = controller.key ? (controller.key + '-' + randomString(8, 10)) : randomString(8, 10);
			controller.parent = activeCtrl.vdid;
			controller.isRoot = controller.isRoot;
			if (!controller.isRoot) {
				controller.root = activeCtrl.root;
				controller.parent = activeCtrl.parent;
			}
			const loopAttr = (controller, wrapperVdid, activeCtrl) => {
				controller.vdid = controller.key ? (controller.key + '-' + randomString(8, 10)) : randomString(8, 10);
				controller.root = controller.root;
				controller.isRoot = controller.isRoot;
				controller.parent = controller.parent;

				for (let i = 0, len = controller.attrs.length; i < len; i++) {
					let tmpAttr = controller.attrs[i];
					if (tmpAttr.key === 'basic') {
						for (let j = 0; j < tmpAttr.children.length; j++) {
							if (tmpAttr.children[j].name === 'id') {
								tmpAttr.children[j].value = '';
							}
						}
					}
					for (let j = 0; j < tmpAttr.children.length; j++) {
						let attr = tmpAttr.children[j];
						attr['id'] = randomString(8, 10);
					};
				}

				if (controller.children && controller.children.length) {
					for (let i = 0; i < controller.children.length; i++) {
						loopAttr(controller.children[i], wrapperVdid, activeCtrl);
					}
				}

			}

			loopAttr(controller, controller.vdid, activeCtrl);

			const pastHandler = {
				append(activeCtrl, controller) {
					activeCtrl.children = activeCtrl.children || [];
					activeCtrl.children.push(controller);
					if (state.expandedKeys.indexOf(activeCtrl.vdid) === -1) {
						state.expandedKeys.push(activeCtrl.vdid);

					}
					state.autoExpandParent = true;
				},

				prepend(activeCtrl, controller) {
					activeCtrl.children = activeCtrl.children || [];
					activeCtrl.children.splice(0, 0, controller);
					if (state.expandedKeys.indexOf(activeCtrl.vdid) === -1) {
						state.expandedKeys.push(activeCtrl.vdid);

					}
					state.autoExpandParent = true;
				},

				after(activeCtrl, controller) {
					let parentInfo = VDTreeActions.getParentCtrlByKey(state, activeCtrl.vdid, state.activePage);
					parentInfo.parentCtrl.children.splice(parentInfo.index + 1, 0, controller);
					if (state.expandedKeys.indexOf(parentInfo.parentCtrl.vdid) === -1) {
						state.expandedKeys.push(parentInfo.parentCtrl.vdid);

					}
					state.autoExpandParent = true;
				},

				before(activeCtrl, controller) {
					let parentInfo = VDTreeActions.getParentCtrlByKey(state, activeCtrl.vdid, state.activePage);
					parentInfo.parentCtrl.children.splice(parentInfo.index, 0, controller);
					if (state.expandedKeys.indexOf(parentInfo.parentCtrl.vdid) === -1) {
						state.expandedKeys.push(parentInfo.parentCtrl.vdid);

					}
					state.autoExpandParent = true;
				}
			}
			pastHandler[params.type](activeCtrl, controller);

			VDDesignerFrame.postMessage({
				ctrlDataPasted: {
					controller,
					activeCtrlVdid: activeCtrl.vdid,
					type: params.type,
					activeCtrlTag: activeCtrl.tag
				}
			}, "*");

			if ((params.type === 'append' || params.type === 'prepend') && activeCtrl.children.length === 1 && activeCtrl.tag !== 'body') {
				let index = activeCtrl.className.indexOf('vd-empty');
				activeCtrl.className.splice(index, 1);
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: state.activeCtrl,
						attr: {
							action: 'replaceClass',
							attrName: 'classOperate',
							remove: 'vd-empty',
							replacement: '',
							target: {
								vdid: activeCtrl.vdid
							},
							needSelect: true
						},
						attrType: ''
					}
				}, '*');
			}

			return {...state};
		},

		handleDeleteCtrl(state, { payload: params }) {

			let deleteParentInfo = params.deleteParentInfo,
				deleteParentCtrl = deleteParentInfo.parentCtrl,
				deleteIndex = deleteParentInfo.index;
			deleteParentCtrl.children.splice(deleteIndex, 1);

			window.VDDesignerFrame.postMessage({
				deleteCtrl: params.deleteKey
			}, '*');

			if (deleteParentCtrl.children.length === 0) {

				let expandedKeysIndex = state.expandedKeys.indexOf(deleteParentCtrl.vdid);
				if (expandedKeysIndex !== -1) {
					state.expandedKeys.splice(expandedKeysIndex, 1);
				}

				if (deleteParentCtrl.vdid.split('-')[0] === 'body') {
					state.activeCtrl = 'none';
					state.activeCtrlIndex = 'none';
					state.activeCtrlLvl = 'none';
					state.defaultSelectedKeys = ['none'];
				} else {
					state.activeCtrl = deleteParentCtrl;
					state.activeCtrlIndex = deleteParentInfo.parentIndex;
					state.activeCtrlLvl = deleteParentInfo.level - 1;
					state.defaultSelectedKeys = [deleteParentCtrl.vdid];

					window.VDDesignerFrame.postMessage({
						VDAttrRefreshed: {
							activeCtrl: '',
							attr: {
								action: 'replaceClass',
								attrName: 'classOperate',
								remove: '',
								replacement: 'vd-empty',
								target: {
									vdid: deleteParentCtrl.vdid
								},
							},
							attrType: ''
						}
					}, '*');
					deleteParentCtrl.className.push('vd-empty');
				}

			} else if (typeof deleteParentCtrl.children[deleteIndex] !== 'undefined') {
				state.activeCtrl = deleteParentCtrl.children[deleteIndex];
				state.activeCtrlIndex = deleteIndex
				state.activeCtrlLvl = deleteParentInfo.level;
				state.defaultSelectedKeys = [state.activeCtrl.vdid];
			} else {
				state.activeCtrl = deleteParentCtrl.children[deleteIndex - 1];
				state.activeCtrlIndex = deleteIndex - 1
				state.activeCtrlLvl = deleteParentInfo.level;
				state.defaultSelectedKeys = [state.activeCtrl.vdid];
			}

			if (state.activeCtrl !== 'none') {
				window.VDDesignerFrame.postMessage({
					VDCtrlSelected: {
						vdid: state.defaultSelectedKeys,
						isFromCtrlTree: true
					}
				}, '*');
			} else {
				window.VDDesignerFrame.postMessage({
					hideDesignerDraggerBorder: {}
				}, '*');
			}

			return {...state};
		},

		ctrlMovedAndDroped(state, { payload: params }) {
			let moveCtrl, children, newParent;
			if (params.dropTargetVdid) {
				let newParentInfo = VDTreeActions.getCtrlByKey(state, params.dropTargetVdid, state.activePage);
				newParent = newParentInfo.controller;
				newParent.children = newParent.children || [];
				children = newParent.children;
				if (children.length === 0) {
					window.VDDesignerFrame.postMessage({
						VDAttrRefreshed: {
							activeCtrl: '',
							attr: {
								action: 'replaceClass',
								attrName: 'classOperate',
								remove: 'vd-empty',
								replacement: '',
								target: {
									vdid: newParent.vdid
								},
								needSelect: true
							},
							attrType: ''
						}
					}, '*');
					let index = newParent.className.indexOf('vd-empty');
					newParent.className.splice(index, 1);
				}

				state.activeCtrlLvl = newParentInfo.level + 1;
			} else {
				newParent = state.layout[state.activePage.key][0];
				children = newParent.children;
				state.activeCtrlLvl = 2
			}

			if (params.isFromSelf) {
				let originalParentInfo = VDTreeActions.getParentCtrlByKey(state, params.moveElemVdid, state.activePage);
				let originalParentChildren = originalParentInfo.parentCtrl.children;
				moveCtrl = originalParentChildren.splice(originalParentInfo.index, 1);
				if (originalParentChildren.length === 0 && !(newParent && newParent.vdid === originalParentInfo.parentCtrl.vdid)) {
					window.VDDesignerFrame.postMessage({
						VDAttrRefreshed: {
							activeCtrl: '',
							attr: {
								action: 'replaceClass',
								attrName: 'classOperate',
								remove: '',
								replacement: 'vd-empty',
								target: {
									vdid: originalParentInfo.parentCtrl.vdid
								},
								needSelect: true
							},
							attrType: ''
						}
					}, '*');
					originalParentInfo.parentCtrl.className.push('vd-empty');
				}

			} else {
				moveCtrl = [params.ctrl];
			}
			children.splice(params.index, 0, moveCtrl[0]);
			state.activeCtrl = moveCtrl[0];
			state.activeCtrlIndex = params.index;
			state.defaultSelectedKeys = [moveCtrl[0].vdid];

			let newParentVdid = newParent.vdid;
			if (state.expandedKeys.indexOf(newParentVdid) === -1) {
				state.expandedKeys.push(newParentVdid);
			}
			state.autoExpandParent = true;

			return {...state};
		},

		handleInteractionOnSelect(state, { payload: params }) {

			//加动画类

			let currentList = state.activeCtrl.animationClassList;
			currentList.pop();
			currentList.push(params);

			if (params.key !== 'none' && params.condition !== 'laod') {

				window.VDDesignerFrame.postMessage({
					animateElement: {
						id: state.activeCtrl.vdid,
						animateName: params.animate
					}
				}, '*');
			}

			return {...state};
		},

		handleRemoveInteraction(state, {payload: deletedInteraction}) {
			let vdids = deletedInteraction.vdid;

			VDTreeActions.loopAllApp(state, (ctrl) => {
				let index = vdids.indexOf(ctrl.vdid);
				if (index !== -1) {
					ctrl.animationClassList[0] = {
						animate: '',
						name: 'None',
						duration: '',
						condition: 'none',
						vdid: [],
						key: 'none'
					}
					vdids.splice(index, 1);
					if (vdids.length === 0) {
						return false;
					}
					return true;
				}
				return true;
			})

			return {...state};
		}
	},

	effects: {

		* handleAttrFormChange({ payload: params }, { call, put, select }) {
			var activePage = yield select(state => state.vdpm.activePage);
			yield put({
				type: 'handleAttrFormChangeA',
				payload: {
					newVal: params.newVal,
					attrId: params.attrId,
					attrType: params.attrType,
					activePage: activePage
				}
			})
		},

		* deleteCtrl({ payload: params }, { call, put, select }) {

			let vdCtrlTree = yield select(state => state.vdCtrlTree);
			let activeCtrl = vdCtrlTree.activeCtrl;
			let deleteKey;

			if (params && params.isFromFrames) {
				deleteKey = activeCtrl.vdid;
			} else if (params && params.fromKeyboard) {
				deleteKey = activeCtrl.vdid;

				if (!deleteKey) {
					return false;
				}

			} else {
				deleteKey = sessionStorage.currentSelectedConstructionKey;
			}

			let deleteParentInfo = VDTreeActions.getParentCtrlByKey(vdCtrlTree, deleteKey, vdCtrlTree.activePage);

			yield put({
				type: 'handleDeleteCtrl',
				payload: {
					deleteKey,
					deleteParentInfo
				}
			})

			yield put({
				type: 'vdanimations/handleDeleteCtrl',
				payload: {
					deleteKey,
					deleteParentInfo
				}
			})
		},

		*cutCtrl({ payload: params }, { call, put, select }) {

			let vdCtrlTree = yield select(state => state.vdCtrlTree);
			let activeCtrl = vdCtrlTree.activeCtrl;
			if (!activeCtrl || !activeCtrl.tag) {
				return;
			}
			sessionStorage.copiedCtrl = JSON.stringify(activeCtrl);
			let deleteKey = activeCtrl.vdid;
			let deleteParentInfo = VDTreeActions.getParentCtrlByKey(vdCtrlTree, deleteKey, vdCtrlTree.activePage);
			yield put({
				type: 'handleDeleteCtrl',
				payload: {
					deleteKey,
					deleteParentInfo
				}
			})
		}

	}

}
