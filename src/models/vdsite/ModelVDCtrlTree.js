import React , {PropTypes} from 'react';
import dva from 'dva';
import randomString from '../../utils/randomString.js';
import { message } from 'antd';

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
const VDTreeActions = {
	deepCopyObj(obj, result) {
		result = result || {};
		for(let key in obj) {
			if (typeof obj[key] === 'object') {
				result[key] = (obj[key].constructor === Array)? []: {};
				VDTreeActions.deepCopyObj(obj[key], result[key]);
			}else {
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

		const loopControllers = function (controllers, level) {
			level = level || 1;
			for(let i = 0; i < controllers.length; i ++) {
				let currentControl = controllers[i];
				if (currentControl.children) {
					loopControllers(currentControl.children, level ++);
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

	getParentCtrlByKey(state, key, activePage) {

		let obj = {
				index: 0,
				level: 1,
				controller: '',
				parentCtrl: '',
				parentIndex: ''
			},

			controllers = state.layout[activePage.key];

		const loopControllers = function (controllers, level, parent, parentIndex) {
			level = level || 1;
			for(let i = 0; i < controllers.length; i ++) {
				let currentControl = controllers[i];
				if (currentControl.children) {
					loopControllers(currentControl.children, level ++, currentControl, i);
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
		const loopControllers = function (controllers, level) {
			level = level || 1;
			for(let i = 0; i < controllers.length; i ++) {
				let currentControl = controllers[i];
				if (currentControl.children) {
					loopControllers(currentControl.children, level ++);
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
	setActiveCtrl(state, controllerIndex, controllerKey, level) {
	},
}

export default {
	namespace: 'vdCtrlTree',
	state: {
	    defaultExpandedKeys: ["body-main", '456', '789'],
	    defaultSelectedKeys: [""],
		symbols: [],
		icons: [
			'fa fa-external-link',
			'fa fa-font-awesome',
			'fa fa-caret-down',
			'fa fa-universal-access',
			'fa fa-flag',
			'fa fa-envelope',
			'fa fa-search',
			'fa fa-address-book',
			'fa fa-address-book-o',
			'fa fa-address-card',
			'fa fa-address-card-o',
			'fa fa-bandcamp',
			'fa fa-bath',
			'fa fa-bathtub',
			'fa fa-drivers-license',
			'fa fa-drivers-license-o',
			'fa fa-eercast',
			'fa fa-envelope-open',
			'fa fa-envelope-open-o',
			'fa fa-etsy',
			'fa fa-free-code-camp',
			'fa fa-grav',
			'fa fa-handshake-o',
			'fa fa-id-badge',
			'fa fa-id-card',
			'fa fa-id-card-o',
			'fa fa-imdb',
			'fa fa-linode',
			'fa fa-meetup',
			'fa fa-microchip',
			'fa fa-podcast',
			'fa fa-quora',
			'fa fa-ravelry',
			'fa fa-s15',
			'fa fa-shower',
			'fa fa-snowflake-o',
			'fa fa-superpowers',
			'fa fa-telegram',
			'fa fa-thermometer',
			'fa fa-thermometer-0',
			'fa fa-thermometer-1',
			'fa fa-thermometer-2',
			'fa fa-thermometer-3',
			'fa fa-thermometer-4',
			'fa fa-thermometer-empty',
			'fa fa-thermometer-full',
			'fa fa-thermometer-half',
			'fa fa-thermometer-quarter',
			'fa fa-thermometer-three-quarters',
			'fa fa-times-rectangle',
			'fa fa-times-rectangle-o',
			'fa fa-user-circle',
			'fa fa-user-circle-o',
			'fa fa-user-o',
			'fa fa-vcard',
			'fa fa-vcard-o',
			'fa fa-window-close',
			'fa fa-window-close-o',
			'fa fa-window-maximize',
			'fa fa-window-minimize',
			'fa fa-window-restore',
			'fa fa-wpexplorer',
			'fa fa-adjust',
			'fa fa-american-sign-language-interpreting',
			'fa fa-anchor',
			'fa fa-archive',
			'fa fa-area-chart',
			'fa fa-arrows',
			'fa fa-arrows-h',
			'fa fa-arrows-v',
			'fa fa-asl-interpreting',
			'fa fa-assistive-listening-systems',
			'fa fa-asterisk',
			'fa fa-at',
			'fa fa-audio-description',
			'fa fa-automobile',
			'fa fa-balance-scale',
			'fa fa-ban',
			'fa fa-bank',
			'fa fa-bar-chart',
			'fa fa-bar-chart-o',
			'fa fa-barcode',
			'fa fa-bars',
			'fa fa-battery',
			'fa fa-battery-0',
			'fa fa-battery-1',
			'fa fa-battery-2',
			'fa fa-battery-3',
			'fa fa-battery-4',
			'fa fa-battery-empty',
			'fa fa-battery-full',
			'fa fa-battery-half',
			'fa fa-battery-quarter',
			'fa fa-battery-three-quarters',
			'fa fa-bed',
			'fa fa-beer',
			'fa fa-bell',
			'fa fa-bell-o',
			'fa fa-bell-slash',
			'fa fa-bell-slash-o',
			'fa fa-bicycle',
			'fa fa-binoculars',
			'fa fa-birthday-cake',
			'fa fa-blind',
			'fa fa-bluetooth',
			'fa fa-bluetooth-b',
			'fa fa-bolt',
			'fa fa-bomb',
			'fa fa-book',
			'fa fa-bookmark',
			'fa fa-bookmark-o',
			'fa fa-braille',
			'fa fa-briefcase',
			'fa fa-bug',
			'fa fa-building',
			'fa fa-building-o',
			'fa fa-bullhorn',
			'fa fa-bullseye',
			'fa fa-bus',
			'fa fa-cab',
			'fa fa-calculator',
			'fa fa-calendar',
			'fa fa-calendar-check-o',
			'fa fa-calendar-minus-o',
			'fa fa-calendar-o',
			'fa fa-calendar-plus-o',
			'fa fa-calendar-times-o',
			'fa fa-camera',
			'fa fa-camera-retro',
			'fa fa-car',
			'fa fa-caret-square-o-down',
			'fa fa-caret-square-o-left',
			'fa fa-caret-square-o-right',
			'fa fa-caret-square-o-up',
			'fa fa-cart-arrow-down',
			'fa fa-cart-plus',
			'fa fa-cc',
			'fa fa-certificate',
			'fa fa-check',
			'fa fa-check-circle',
			'fa fa-check-circle-o',
			'fa fa-check-square',
			'fa fa-check-square-o',
			'fa fa-child',
			'fa fa-circle',
			'fa fa-circle-o',
			'fa fa-circle-o-notch',
			'fa fa-circle-thin',
			'fa fa-clock-o',
			'fa fa-clone',
			'fa fa-close',
			'fa fa-cloud',
			'fa fa-cloud-download',
			'fa fa-cloud-upload',
			'fa fa-code',
			'fa fa-code-fork',
			'fa fa-coffee',
			'fa fa-cog',
			'fa fa-cogs',
			'fa fa-comment',
			'fa fa-comment-o',
			'fa fa-commenting',
			'fa fa-commenting-o',
			'fa fa-comments',
			'fa fa-comments-o',
			'fa fa-compass',
			'fa fa-copyright',
			'fa fa-creative-commons',
			'fa fa-credit-card',
			'fa fa-credit-card-alt',
			'fa fa-crop',
			'fa fa-crosshairs',
			'fa fa-cube',
			'fa fa-cubes',
			'fa fa-cutlery',
			'fa fa-dashboard',
			'fa fa-database',
			'fa fa-deaf',
			'fa fa-deafness',
			'fa fa-desktop',
			'fa fa-diamond',
			'fa fa-dot-circle-o',
			'fa fa-download',
			'fa fa-edit',
			'fa fa-ellipsis-h',
			'fa fa-ellipsis-v',
			'fa fa-envelope-o',
			'fa fa-envelope-square',
			'fa fa-eraser',
			'fa fa-exchange',
			'fa fa-exclamation',
			'fa fa-exclamation-circle',
			'fa fa-exclamation-triangle',
			'fa fa-external-link-square',
			'fa fa-eye',
			'fa fa-eye-slash',
			'fa fa-eyedropper',
			'fa fa-fax',
			'fa fa-feed',
			'fa fa-female',
			'fa fa-fighter-jet',
			'fa fa-file-archive-o',
			'fa fa-file-audio-o',
			'fa fa-file-code-o',
			'fa fa-file-excel-o',
			'fa fa-file-image-o',
			'fa fa-file-movie-o',
			'fa fa-file-pdf-o',
			'fa fa-file-photo-o',
			'fa fa-file-picture-o',
			'fa fa-file-powerpoint-o',
			'fa fa-file-sound-o',
			'fa fa-file-video-o',
			'fa fa-file-word-o',
			'fa fa-file-zip-o',
			'fa fa-film',
			'fa fa-filter',
			'fa fa-fire',
			'fa fa-fire-extinguisher',
			'fa fa-flag-checkered',
			'fa fa-flag-o',
			'fa fa-flash',
			'fa fa-flask',
			'fa fa-folder',
			'fa fa-folder-o',
			'fa fa-folder-open',
			'fa fa-folder-open-o',
			'fa fa-frown-o',
			'fa fa-futbol-o',
			'fa fa-gamepad',
			'fa fa-gavel',
			'fa fa-gear',
			'fa fa-gears',
			'fa fa-gift',
			'fa fa-glass',
			'fa fa-globe',
			'fa fa-graduation-cap',
			'fa fa-group',
			'fa fa-hand-grab-o',
			'fa fa-hand-lizard-o',
			'fa fa-hand-paper-o',
			'fa fa-hand-peace-o',
			'fa fa-hand-pointer-o',
			'fa fa-hand-rock-o',
			'fa fa-hand-scissors-o',
			'fa fa-hand-spock-o',
			'fa fa-hand-stop-o',
			'fa fa-hard-of-hearing',
			'fa fa-hashtag',
			'fa fa-hdd-o',
			'fa fa-headphones',
			'fa fa-heart',
			'fa fa-heart-o',
			'fa fa-heartbeat',
			'fa fa-history',
			'fa fa-home',
			'fa fa-hotel',
			'fa fa-hourglass',
			'fa fa-hourglass-1',
			'fa fa-hourglass-2',
			'fa fa-hourglass-3',
			'fa fa-hourglass-end',
			'fa fa-hourglass-half',
			'fa fa-hourglass-o',
			'fa fa-hourglass-start',
			'fa fa-i-cursor',
			'fa fa-image',
			'fa fa-inbox',
			'fa fa-industry',
			'fa fa-info',
			'fa fa-info-circle',
			'fa fa-institution',
			'fa fa-key',
			'fa fa-keyboard-o',
			'fa fa-language',
			'fa fa-laptop',
			'fa fa-leaf',
			'fa fa-legal',
			'fa fa-lemon-o',
			'fa fa-level-down',
			'fa fa-level-up',
			'fa fa-life-bouy',
			'fa fa-life-buoy',
			'fa fa-life-ring',
			'fa fa-life-saver',
			'fa fa-lightbulb-o',
			'fa fa-line-chart',
			'fa fa-location-arrow',
			'fa fa-lock',
			'fa fa-low-vision',
			'fa fa-magic',
			'fa fa-magnet',
			'fa fa-mail-forward',
			'fa fa-mail-reply',
			'fa fa-mail-reply-all',
			'fa fa-male',
			'fa fa-map',
			'fa fa-map-marker',
			'fa fa-map-o',
			'fa fa-map-pin',
			'fa fa-map-signs',
			'fa fa-meh-o',
			'fa fa-microphone',
			'fa fa-microphone-slash',
			'fa fa-minus',
			'fa fa-minus-circle',
			'fa fa-minus-square',
			'fa fa-minus-square-o',
			'fa fa-mobile',
			'fa fa-mobile-phone',
			'fa fa-money',
			'fa fa-moon-o',
			'fa fa-mortar-board',
			'fa fa-motorcycle',
			'fa fa-mouse-pointer',
			'fa fa-music',
			'fa fa-navicon',
			'fa fa-newspaper-o',
			'fa fa-object-group',
			'fa fa-object-ungroup',
			'fa fa-paint-brush',
			'fa fa-paper-plane',
			'fa fa-paper-plane-o',
			'fa fa-paw',
			'fa fa-pencil',
			'fa fa-pencil-square',
			'fa fa-pencil-square-o',
			'fa fa-percent',
			'fa fa-phone',
			'fa fa-phone-square',
			'fa fa-photo',
			'fa fa-picture-o',
			'fa fa-pie-chart',
			'fa fa-plane',
			'fa fa-plug',
			'fa fa-plus',
			'fa fa-plus-circle',
			'fa fa-plus-square',
			'fa fa-plus-square-o',
			'fa fa-power-off',
			'fa fa-print',
			'fa fa-puzzle-piece',
			'fa fa-qrcode',
			'fa fa-question',
			'fa fa-question-circle',
			'fa fa-question-circle-o',
			'fa fa-quote-left',
			'fa fa-quote-right',
			'fa fa-random',
			'fa fa-recycle',
			'fa fa-refresh',
			'fa fa-registered',
			'fa fa-remove',
			'fa fa-reorder',
			'fa fa-reply',
			'fa fa-reply-all',
			'fa fa-retweet',
			'fa fa-road',
			'fa fa-rocket',
			'fa fa-rss',
			'fa fa-rss-square',
			'fa fa-search-minus',
			'fa fa-search-plus',
			'fa fa-send',
			'fa fa-send-o',
			'fa fa-server',
			'fa fa-share',
			'fa fa-share-alt',
			'fa fa-share-alt-square',
			'fa fa-share-square',
			'fa fa-share-square-o',
			'fa fa-shield',
			'fa fa-ship',
			'fa fa-shopping-bag',
			'fa fa-shopping-basket',
			'fa fa-shopping-cart',
			'fa fa-sign-in',
			'fa fa-sign-language',
			'fa fa-sign-out',
			'fa fa-signal',
			'fa fa-signing',
			'fa fa-sitemap',
			'fa fa-sliders',
			'fa fa-smile-o',
			'fa fa-soccer-ball-o',
			'fa fa-sort',
			'fa fa-sort-alpha-asc',
			'fa fa-sort-alpha-desc',
			'fa fa-sort-amount-asc',
			'fa fa-sort-amount-desc',
			'fa fa-sort-asc',
			'fa fa-sort-desc',
			'fa fa-sort-down',
			'fa fa-sort-numeric-asc',
			'fa fa-sort-numeric-desc',
			'fa fa-sort-up',
			'fa fa-space-shuttle',
			'fa fa-spinner',
			'fa fa-spoon',
			'fa fa-square',
			'fa fa-square-o',
			'fa fa-star',
			'fa fa-star-half',
			'fa fa-star-half-empty',
			'fa fa-star-half-full',
			'fa fa-star-half-o',
			'fa fa-star-o',
			'fa fa-sticky-note',
			'fa fa-sticky-note-o',
			'fa fa-street-view',
			'fa fa-suitcase',
			'fa fa-sun-o',
			'fa fa-support',
			'fa fa-tablet',
			'fa fa-tachometer',
			'fa fa-tag',
			'fa fa-tags',
			'fa fa-tasks',
			'fa fa-taxi',
			'fa fa-television',
			'fa fa-terminal',
			'fa fa-thumb-tack',
			'fa fa-thumbs-down',
			'fa fa-thumbs-o-down',
			'fa fa-thumbs-o-up',
			'fa fa-thumbs-up',
			'fa fa-ticket',
			'fa fa-times',
			'fa fa-times-circle',
			'fa fa-times-circle-o',
			'fa fa-tint',
			'fa fa-toggle-down',
			'fa fa-toggle-left',
			'fa fa-toggle-off',
			'fa fa-toggle-on',
			'fa fa-toggle-right',
			'fa fa-toggle-up',
			'fa fa-trademark',
			'fa fa-trash',
			'fa fa-trash-o',
			'fa fa-tree',
			'fa fa-trophy',
			'fa fa-truck',
			'fa fa-tty',
			'fa fa-tv',
			'fa fa-umbrella',
			'fa fa-university',
			'fa fa-unlock',
			'fa fa-unlock-alt',
			'fa fa-unsorted',
			'fa fa-upload',
			'fa fa-user',
			'fa fa-user-plus',
			'fa fa-user-secret',
			'fa fa-user-times',
			'fa fa-users',
			'fa fa-video-camera',
			'fa fa-volume-control-phone',
			'fa fa-volume-down',
			'fa fa-volume-off',
			'fa fa-volume-up',
			'fa fa-warning',
			'fa fa-wheelchair',
			'fa fa-wheelchair-alt',
			'fa fa-wifi',
			'fa fa-wrench',
			'fa fa-hand-o-down',
			'fa fa-hand-o-left',
			'fa fa-hand-o-right',
			'fa fa-hand-o-up',
			'fa fa-ambulance',
			'fa fa-subway',
			'fa fa-train',
			'fa fa-genderless',
			'fa fa-intersex',
			'fa fa-mars',
			'fa fa-mars-double',
			'fa fa-mars-stroke',
			'fa fa-mars-stroke-h',
			'fa fa-mars-stroke-v',
			'fa fa-mercury',
			'fa fa-neuter',
			'fa fa-transgender',
			'fa fa-transgender-alt',
			'fa fa-venus',
			'fa fa-venus-double',
			'fa fa-venus-mars',
			'fa fa-file',
			'fa fa-file-o',
			'fa fa-file-text',
			'fa fa-file-text-o',
			'fa fa-cc-amex',
			'fa fa-cc-diners-club',
			'fa fa-cc-discover',
			'fa fa-cc-jcb',
			'fa fa-cc-mastercard',
			'fa fa-cc-paypal',
			'fa fa-cc-stripe',
			'fa fa-cc-visa',
			'fa fa-google-wallet',
			'fa fa-paypal',
			'fa fa-bitcoin',
			'fa fa-btc',
			'fa fa-cny',
			'fa fa-dollar',
			'fa fa-eur',
			'fa fa-euro',
			'fa fa-gbp',
			'fa fa-gg',
			'fa fa-gg-circle',
			'fa fa-ils',
			'fa fa-inr',
			'fa fa-jpy',
			'fa fa-krw',
			'fa fa-rmb',
			'fa fa-rouble',
			'fa fa-rub',
			'fa fa-ruble',
			'fa fa-rupee',
			'fa fa-shekel',
			'fa fa-sheqel',
			'fa fa-try',
			'fa fa-turkish-lira',
			'fa fa-usd',
			'fa fa-won',
			'fa fa-yen',
			'fa fa-align-center',
			'fa fa-align-justify',
			'fa fa-align-left',
			'fa fa-align-right',
			'fa fa-bold',
			'fa fa-chain',
			'fa fa-chain-broken',
			'fa fa-clipboard',
			'fa fa-columns',
			'fa fa-copy',
			'fa fa-cut',
			'fa fa-dedent',
			'fa fa-files-o',
			'fa fa-floppy-o',
			'fa fa-font',
			'fa fa-header',
			'fa fa-indent',
			'fa fa-italic',
			'fa fa-link',
			'fa fa-list',
			'fa fa-list-alt',
			'fa fa-list-ol',
			'fa fa-list-ul',
			'fa fa-outdent',
			'fa fa-paperclip',
			'fa fa-paragraph',
			'fa fa-paste',
			'fa fa-repeat',
			'fa fa-rotate-left',
			'fa fa-rotate-right',
			'fa fa-save',
			'fa fa-scissors',
			'fa fa-strikethrough',
			'fa fa-subscript',
			'fa fa-superscript',
			'fa fa-table',
			'fa fa-text-height',
			'fa fa-text-width',
			'fa fa-th',
			'fa fa-th-large',
			'fa fa-th-list',
			'fa fa-underline',
			'fa fa-undo',
			'fa fa-unlink',
			'fa fa-angle-double-down',
			'fa fa-angle-double-left',
			'fa fa-angle-double-right',
			'fa fa-angle-double-up',
			'fa fa-angle-down',
			'fa fa-angle-left',
			'fa fa-angle-right',
			'fa fa-angle-up',
			'fa fa-arrow-circle-down',
			'fa fa-arrow-circle-left',
			'fa fa-arrow-circle-o-down',
			'fa fa-arrow-circle-o-left',
			'fa fa-arrow-circle-o-right',
			'fa fa-arrow-circle-o-up',
			'fa fa-arrow-circle-right',
			'fa fa-arrow-circle-up',
			'fa fa-arrow-down',
			'fa fa-arrow-left',
			'fa fa-arrow-right',
			'fa fa-arrow-up',
			'fa fa-arrows-alt',
			'fa fa-caret-left',
			'fa fa-caret-right',
			'fa fa-caret-up',
			'fa fa-chevron-circle-down',
			'fa fa-chevron-circle-left',
			'fa fa-chevron-circle-right',
			'fa fa-chevron-circle-up',
			'fa fa-chevron-down',
			'fa fa-chevron-left',
			'fa fa-chevron-right',
			'fa fa-chevron-up',
			'fa fa-long-arrow-down',
			'fa fa-long-arrow-left',
			'fa fa-long-arrow-right',
			'fa fa-long-arrow-up',
			'fa fa-backward',
			'fa fa-compress',
			'fa fa-eject',
			'fa fa-expand',
			'fa fa-fast-backward',
			'fa fa-fast-forward',
			'fa fa-forward',
			'fa fa-pause',
			'fa fa-pause-circle',
			'fa fa-pause-circle-o',
			'fa fa-play',
			'fa fa-play-circle',
			'fa fa-play-circle-o',
			'fa fa-step-backward',
			'fa fa-step-forward',
			'fa fa-stop',
			'fa fa-stop-circle',
			'fa fa-stop-circle-o',
			'fa fa-youtube-play',
			'fa fa-500px',
			'fa fa-adn',
			'fa fa-amazon',
			'fa fa-android',
			'fa fa-angellist',
			'fa fa-apple',
			'fa fa-behance',
			'fa fa-behance-square',
			'fa fa-bitbucket',
			'fa fa-bitbucket-square',
			'fa fa-black-tie',
			'fa fa-buysellads',
			'fa fa-chrome',
			'fa fa-codepen',
			'fa fa-codiepie',
			'fa fa-connectdevelop',
			'fa fa-contao',
			'fa fa-css3',
			'fa fa-dashcube',
			'fa fa-delicious',
			'fa fa-deviantart',
			'fa fa-digg',
			'fa fa-dribbble',
			'fa fa-dropbox',
			'fa fa-drupal',
			'fa fa-edge',
			'fa fa-empire',
			'fa fa-envira',
			'fa fa-expeditedssl',
			'fa fa-fa',
			'fa fa-facebook',
			'fa fa-facebook-f',
			'fa fa-facebook-official',
			'fa fa-facebook-square',
			'fa fa-firefox',
			'fa fa-first-order',
			'fa fa-flickr',
			'fa fa-fonticons',
			'fa fa-fort-awesome',
			'fa fa-forumbee',
			'fa fa-foursquare',
			'fa fa-ge',
			'fa fa-get-pocket',
			'fa fa-git',
			'fa fa-git-square',
			'fa fa-github',
			'fa fa-github-alt',
			'fa fa-github-square',
			'fa fa-gitlab',
			'fa fa-gittip',
			'fa fa-glide',
			'fa fa-glide-g',
			'fa fa-google',
			'fa fa-google-plus',
			'fa fa-google-plus-circle',
			'fa fa-google-plus-official',
			'fa fa-google-plus-square',
			'fa fa-gratipay',
			'fa fa-hacker-news',
			'fa fa-houzz',
			'fa fa-html5',
			'fa fa-instagram',
			'fa fa-internet-explorer',
			'fa fa-ioxhost',
			'fa fa-joomla',
			'fa fa-jsfiddle',
			'fa fa-lastfm',
			'fa fa-lastfm-square',
			'fa fa-leanpub',
			'fa fa-linkedin',
			'fa fa-linkedin-square',
			'fa fa-linux',
			'fa fa-maxcdn',
			'fa fa-meanpath',
			'fa fa-medium',
			'fa fa-mixcloud',
			'fa fa-modx',
			'fa fa-odnoklassniki',
			'fa fa-odnoklassniki-square',
			'fa fa-opencart',
			'fa fa-openid',
			'fa fa-opera',
			'fa fa-optin-monster',
			'fa fa-pagelines',
			'fa fa-pied-piper',
			'fa fa-pied-piper-alt',
			'fa fa-pied-piper-pp',
			'fa fa-pinterest',
			'fa fa-pinterest-p',
			'fa fa-pinterest-square',
			'fa fa-product-hunt',
			'fa fa-qq',
			'fa fa-ra',
			'fa fa-rebel',
			'fa fa-reddit',
			'fa fa-reddit-alien',
			'fa fa-reddit-square',
			'fa fa-renren',
			'fa fa-resistance',
			'fa fa-safari',
			'fa fa-scribd',
			'fa fa-sellsy',
			'fa fa-shirtsinbulk',
			'fa fa-simplybuilt',
			'fa fa-skyatlas',
			'fa fa-skype',
			'fa fa-slack',
			'fa fa-slideshare',
			'fa fa-snapchat',
			'fa fa-snapchat-ghost',
			'fa fa-snapchat-square',
			'fa fa-soundcloud',
			'fa fa-spotify',
			'fa fa-stack-exchange',
			'fa fa-stack-overflow',
			'fa fa-steam',
			'fa fa-steam-square',
			'fa fa-stumbleupon',
			'fa fa-stumbleupon-circle',
			'fa fa-tencent-weibo',
			'fa fa-themeisle',
			'fa fa-trello',
			'fa fa-tripadvisor',
			'fa fa-tumblr',
			'fa fa-tumblr-square',
			'fa fa-twitch',
			'fa fa-twitter',
			'fa fa-twitter-square',
			'fa fa-usb',
			'fa fa-viacoin',
			'fa fa-viadeo',
			'fa fa-viadeo-square',
			'fa fa-vimeo',
			'fa fa-vimeo-square',
			'fa fa-vine',
			'fa fa-vk',
			'fa fa-wechat',
			'fa fa-weibo',
			'fa fa-weixin',
			'fa fa-whatsapp',
			'fa fa-wikipedia-w',
			'fa fa-windows',
			'fa fa-wordpress',
			'fa fa-wpbeginner',
			'fa fa-wpforms',
			'fa fa-xing',
			'fa fa-xing-square',
			'fa fa-y-combinator',
			'fa fa-y-combinator-square',
			'fa fa-yahoo',
			'fa fa-yc',
			'fa fa-yc-square',
			'fa fa-yelp',
			'fa fa-yoast',
			'fa fa-youtube',
			'fa fa-youtube-square',
			'fa fa-h-square',
			'fa fa-hospital-o',
			'fa fa-medkit',
			'fa fa-stethoscope',
			'fa fa-user-md'
		],
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
	    layout: {
	    	'index.html': [{
	    		className: [],
	    		customClassName: [],
	    		id: '',
	    		tag: 'body',
	    		vdid: 'body-main',
	    		ctrlName: 'body',
	    		children: [],
	    		attrs: []
	    	}],
	    },

	    layoutState: {

	    	// activeController: {
	    	// 	index: 0,
	    	// 	key: '',
	    	// 	level: 3
	    	// }
	    },

	    activeCtrlIndex: 0,
	    activeCtrlLvl: 1,

    	activePage: {
    		key: 'index.html'
    	},

    	constructionMenuStyle: {
		    position: 'fixed',
		    top: '',
		    left: '',
		    display: 'none'
		},

	    activeCtrl: {}
	},

	reducers: {
		initState(state, {payload: params}){
			// state.activeCtrl = params.UIState.activeCtrl;
			// state.layout = params.UIState.layout;
			state.layoutState = params.UIState.layoutState;
			state.activePage = params.UIState.activePage;
			state.selectIndex = params.UIState.selectIndex;
			localStorage.flashState = true;
			return {...state};
		},

		editStyleNameA(state, { payload: params }) {

			const editStyleNameRec = (state, originStyleName, newStyleName, activePage) => {
				let 
					controllers = state.layout[activePage.key];

				const loopControllers = function (controllers, level) {
					level = level || 1;
					for(let i = 0; i < controllers.length; i ++) {
						let currentControl = controllers[i];
						if (currentControl.children) {
							loopControllers(currentControl.children, level ++);
						}

						var pos = currentControl.customClassName.indexOf(originStyleName);

						console.log('styleNameEdited=============', currentControl, pos, originStyleName);

						if (pos != -1) {
							currentControl.customClassName.splice(pos, 1);
							currentControl.customClassName.push(newStyleName);

							console.log('styleNameEdited=============');

							//通知dom更新
							window.VDDesignerFrame.postMessage({
								styleNameEdited: {
									vdid: currentControl.vdid,
									originStyleName,
									newStyleName
								}
							}, '*');

						}

						if(currentControl.activeStyle == originStyleName) {
							currentControl.activeStyle = newStyleName;
						}

					}
				}

				loopControllers(controllers, 1);
			};

			//更新所有组件树
			editStyleNameRec(state, params.origin, params.newStyleName, state.activePage);

			//更新activeCtrl
			if(state.activeCtrl.activeStyle == params.origin) {
				state.activeCtrl.activeStyle = params.newStyleName;
			}

			var pos = state.activeCtrl.customClassName.indexOf(params.origin);

			if(pos != -1) {
				state.activeCtrl.customClassName.splice(pos, 1);
				state.activeCtrl.customClassName.push(params.newStyleName);
			}

			return {...state};
		},

		showCtrlTreeContextMenu(state, { payload: proxy }) {
			return {...state, constructionMenuStyle: {
				position: 'fixed',
				display: 'block',
				left: proxy.event.pageX,
				top: proxy.event.pageY,
			}};
		},

		hideCtrlTreeContextMenu(state) {
			return {...state, constructionMenuStyle: {
				position: 'fixed',
				display: 'none',
				left: 0,
				top: 0,
			}};
		},

		handleCurrentSymbolKey(state, { payload: key}) {
			state.currentSymbolKey = key;
			return { ...state};
		},
		handleSymbolNameChange(state, { payload: value}) {
			state.symbolName = value;
			return { ...state};
		},
		handleAddSymbol(state) {

			if(!methods.checkName(state.symbols, state.symbolName)){
				 openNotificationWithIcon('info', '控件名已被占用');
			}else{
				var addController = {
					name: localStorage.symbolName,
					key: randomString(8, 10),
					controllers: [state.activeCtrl]
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
			state.attr.html = '';
			state.attr.value = '';
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
		},
		handleSelectIndex(state, { payload: index}){

			console.log('handleSelectIndex');
			state.selectIndex = index;
			return { ...state};
		},
		handleChildrenAttrChange(state, { payload: params}){
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			if(params.attr.isTab){
				currentActiveCtrl.controller.children[0].children[state.selectIndex].children[0].attrs[0].children[4][params.attr.name] = params.attr.value;
			}else{
				currentActiveCtrl.controller.children[state.selectIndex].attrs[0].children[0][params.attr.name] = params.attr.value;
			}
			state.activeCtrl = currentActiveCtrl.controller;
			return { ...state};
		},
		uploadBgImg(state, { payload: params}){

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			console.log('uploadBgImg');
			if(currentActiveCtrl.controller.attrs[0].key == 'slider-setting'){
				var activeCtrl = currentActiveCtrl.controller.children[1].children[state.selectIndex];
				console.log(activeCtrl);
				currentActiveCtrl.controller.children[1].children[state.selectIndex].attrs[0].children[0].fileInfo = [params];
				url = params.url;
			}else {
				currentActiveCtrl.controller.attrs[0].children[0].fileInfo = [params];
				currentActiveCtrl.controller.attrs[0].children[0].value = params.url;
				console.log(currentActiveCtrl.controller);
				state.activeCtrl = currentActiveCtrl.controller;
				var url =  currentActiveCtrl.controller.attrs[0].children[0].fileInfo[0].url,
				activeCtrl =  currentActiveCtrl.controller;

			}

			window.VDDesignerFrame.postMessage({
				upLoadBgImg: {
					activeCtrl:activeCtrl,
					url: url
				}
			}, '*');
			return { ...state}
		},
		uploadPreviewImg(state, { payload: params}){

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			console.log('uploadBgImg');
			if(currentActiveCtrl.controller.attrs[0].key == 'slider-setting'){
				var activeCtrl = currentActiveCtrl.controller.children[1].children[state.selectIndex].children[0];
				console.log(activeCtrl);
				currentActiveCtrl.controller.children[1].children[state.selectIndex].children[0].attrs[0].children[0].value = params.url
				url = params.url;

				window.VDDesignerFrame.postMessage({
					uploadImgRefreshed: {
						activeCtrl:activeCtrl,
						url: url
					}
				}, '*');
			}else {
				currentActiveCtrl.controller.attrs[0].children[0].fileInfo = [params];
				currentActiveCtrl.controller.attrs[0].children[0].value = params.url;
				console.log(currentActiveCtrl.controller);
				state.activeCtrl = currentActiveCtrl.controller;
				var url =  currentActiveCtrl.controller.attrs[0].children[0].fileInfo[0].url,
				activeCtrl =  currentActiveCtrl.controller;
				window.VDDesignerFrame.postMessage({
					upLoadBgImg: {
						activeCtrl:activeCtrl,
						url: url
					}
				}, '*');
			}

			return { ...state}
		},
		handleAddChildrenAttr(state, { payload: params}){
			state.attr[params.name] = params.value
			return {...state};
		},
		//当前活跃控件子删除
		handleChildrenDelete(state, {payload: params}){

			if(params.index == state.selectIndex) {

				if(params.index == 0){
					state.selectIndex = 1;
				}
				state.selectIndex = params.index -1;
			}

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			var children =  params.children;
			var parentCtrl = currentActiveCtrl.controller;

			var i = 0;
			function childrenDeleteBylevel(parent){
				i++;
				if(i < params.level) {
					childrenDeleteBylevel(parent.children[0]);
				}else {
					parent.children.splice(params.index,1);
					if(parent.children == null ||parent.children == undefined){
						parent.children = [];
					}
				}
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
		handleComplextChildrenDelete(state, {payload: params}){

			var currentActiveCtrl,
				target;
			const deleteChildrenByType = {
				'navbar-drop-down' (){
					target = state.activeCtrl.parent;
					var parent = VDTreeActions.getCtrlByKey(state, state.activeCtrl.parent, state.activePage).controller.parent;
					currentActiveCtrl = VDTreeActions.getCtrlByKey(state, parent, state.activePage);
					state.activeCtrl = currentActiveCtrl.controller;
				},
				'slider-delete' () {
					target = params.target,
					currentActiveCtrl = VDTreeActions.getCtrlByKey(state, params.parent, state.activePage);
					var root =  VDTreeActions.getCtrlByKey(state, currentActiveCtrl.controller.root, state.activePage).controller;

					window.VDDesignerFrame.postMessage({
						VDChildrenDelete: {
							activeCtrl: {
								vdid: root.children[0].children[params.index].vdid
							},
							attrType: params.attrType
						}
					}, '*');
					root.children[0].children.splice(params.index, 1);
				}
			}
			state.selectIndex = 0;
			deleteChildrenByType[params.type]();

			for (var i = 0; i < currentActiveCtrl.controller.children.length; i++) {

				if(currentActiveCtrl.controller.children[i].vdid == target){
					currentActiveCtrl.controller.children.splice(i,1);
				}
			}
			state.activeCtrl =  VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage).controller;
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
		handleComplexChildrenAdd(state, { payload: params}){

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.parent, state.activePage);
			const addChildrenByType = {

				'navbar-drop-down'(){
					var parent = currentActiveCtrl.controller.children[1];
					params.children.parent = parent.vdid;
					if(parent.children) {
						parent.children.push(params.children);
					}else {
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
		handleChildrenAdd(state, {payload: params}){

			if(params.children.tag == 'option'){
				params.children.attrs[0].children[0].html = state.attr.html;
				params.children.attrs[0].children[0].value = state.attr.value;
			}

			params.children.root = state.activeCtrl.root;
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			var parentCtrl = currentActiveCtrl.controller;
			var parentCtrlVdid;
			var i = 0;
			function childrenAddBylevel(parent){
				let parentIndex = 0;
				for (var j = 0; j < params.levelsInfo.length; j++) {
					if(i == params.levelsInfo[j].level){
						parentIndex = params.levelsInfo[j].index;
					}
				}
				i++;
				if(i < params.level) {
					childrenAddBylevel(parent.children[parentIndex]);
				}else {
					parentCtrlVdid = parent.vdid;
					params.children.parent = parentCtrlVdid;
					if(parent.children) {
						parent.children.push(params.children);
					}else {
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
		handleChildrenUpdate(state, {payload: params}){

			console.log(params);
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
		handleClassNameChange(state, { payload: params}){

			let currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage),
			i = 0,
			target;

			function changeClassNameByLevel(parent){

				let parentIndex = 0;
				for (var j = 0; j < params.levelsInfo.length; j++) {
					if(i == params.levelsInfo[j].level){
						parentIndex = params.levelsInfo[j].index;
					}
				}
				i++;
				if(i < params.level) {
					changeClassNameByLevel(parent.children[parentIndex]);
				}else {
					if(parent.children){
						target = parent.children[parentIndex]
					}
				}
			}
			changeClassNameByLevel(currentActiveCtrl.controller);
			if(!target) {
				target = currentActiveCtrl.controller;
				target.attrs[0].children[params.index].value = params.replacement;
			}
			for (var k = 0; k < target.className.length; k++) {
				if(target.className[k] == params.remove){
					target.className.splice(k,1,params.replacement)
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
		handleChangeCurrentCtrl(state, { payload: params}){

			var parent =  VDTreeActions.getCtrlByKey(state, state.activeCtrl.parent, state.activePage);

			if(params.toDropDown){
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
			}else {
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
		handleActive(state, { payload: params }){

			//根据level获取要更改节点的父节点的数据结构
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage),
			i = 0,
			target;

			function findParent(parent){

				let parentIndex = 0;
				for (var j = 0; j < params.levelsInfo.length; j++) {
					if(i == params.levelsInfo[j].level){
						parentIndex = params.levelsInfo[j].index;
						if(params.action == 'tab'){
							console.log(parent);
							for (var k = 0; k < parent.children.length; k++) {
								for (var m = 0; m < parent.children[k].children[0].className.length; m++) {
									if(parent.children[k].children[0].className[m] == 'active'){
										parent.children[k].children[0].className.splice(m,1);
									}
								}
							}
						}
					}
				}
				i++;
				if(i < params.level) {
					findParent(parent.children[parentIndex]);
				}else {
					//切换active
					for (var j = 0; j < parent.children.length; j++) {
						for (var k = 0; k < parent.children[j].className.length; k++) {

							if(parent.children[j].className[k] == 'active'){
								parent.children[j].className.splice(k,1);
								if(params.action == 'next'){
									if(j == parent.children.length -1){
										params.index = 0;
									}else {
										params.index = j + 1;
									}
								}
								if(params.action == 'last'){
									if(j == 0){
										params.index = parent.children.length -1;
									}else {
										params.index = j -1;
									}
								}
								break;
							}
						}
					}
					console.log('handleActive ssss');
					console.log(parent);
					console.log(target);
					target = parent.children[params.index];
					target.className.push('active');
				}
			}
			findParent(currentActiveCtrl.controller);
			state.activeCtrl = currentActiveCtrl.controller;
			console.log(state.activeCtrl);
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
			console.log(target);
			return {...state};
		},
		handleFade(state, { payload: params }){

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			if(params.value){
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

			}else {
				for (var i = 0; i < currentActiveCtrl.controller.children[1].children.length; i++) {

					for (var j = 0; j < currentActiveCtrl.controller.children[1].children[i].className.length; j++) {
						if(currentActiveCtrl.controller.children[1].children[i].className[j] == 'fade'){
							console.log('splice');
							currentActiveCtrl.controller.children[1].children[i].className.splice(j,1);
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
		triggerMenu(state){

			console.log('triggerMenu');
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
		deletePage(state, {payload: params}){

			console.log(state.layout);
			state.activeCtrl= {
				tag: 'div',
				className: [],
				customClassName: [],
	    		vdid: '456',
				id: '',
	    		ctrlName: 'div-block',
				attrs: [{
					title: '基础设置',
					key: 'basic',
					children: [{
						name: 'id',
						desc: 'id',
						type: 'input',
						value: '',
						id: '5443'
					}, {
						name: 'class',
						desc: '可见屏幕',
						type: 'multipleSelect',
						value: ['visible-lg-block', 'visible-md-block', 'visible-sm-block', 'visible-xs-block'],
						valueList: [{
							name: '大屏幕(桌面 (≥1200px))',
							value: 'visible-lg-block'
						}, {
							name: '中等屏幕(桌面 (≥992px))',
							value: 'visible-md-block'
						}, {
							name: '小屏幕(平板 (≥768px))',
							value: 'visible-sm-block'
						}, {
							name: '超小屏幕(手机 (<768px))',
							value: 'visible-xs-block'
						}],
						id: ''
					}]
				}, {
					title: '自定义属性',
					key: 'custom-attr',
					children: [{
						key: '123',
						value: '34'
					}]
				}],
				children: [{
					tag: 'h1',
					className: [],
					vdid: '098',
		    		ctrlName: 'heading',
					id: '',
					attrs: [{
						title: '基础设置',
						key: 'basic',
						children: [{
							name: 'id',
							desc: 'id',
							type: 'input',
							value: '',
							id: '5443'
						}, {
							name: 'class',
							desc: '可见屏幕',
							type: 'multipleSelect',
							value: ['visible-lg-block', 'visible-md-block', 'visible-sm-block', 'visible-xs-block'],
							valueList: [{
								name: '大屏幕(桌面 (≥1200px))',
								value: 'visible-lg-block'
							}, {
								name: '中等屏幕(桌面 (≥992px))',
								value: 'visible-md-block'
							}, {
								name: '小屏幕(平板 (≥768px))',
								value: 'visible-sm-block'
							}, {
								name: '超小屏幕(手机 (<768px))',
								value: 'visible-xs-block'
							}],
							id: ''
						}]
					}]
				}]
			};
			state.activePage.key = 'index.html';
			delete state.layout[params.key];
			window.VDDesignerFrame.postMessage({
	    		pageSelected: state.layout[state.activePage.key]
	    	}, '*');
			return {...state};
		},
		handlePreview(state, { payload: params }) {

			state.previewImage = params.previewImage;
			state.previewVisible = params.previewVisible;
			return {...state};
		},

		handleChange(state, { payload: fileList }) {
			state.fileList = fileList;
			return {...state};
		},

		handleCancel(state) {
			state.previewVisible = false;
			return {...state};
		},

		generateCtrlTree(state, { payload: ctrl }) {
			let controller = ctrl.details;

			// const specialAttrList = ['custom-attr', 'link-setting', 'list-setting', 'heading-type', 'image-setting', 'select-setting'];

			let deepCopiedController = VDTreeActions.deepCopyObj(controller);
			deepCopiedController.vdid = deepCopiedController.key ? (deepCopiedController.key + '-' + randomString(8, 10)) : randomString(8, 10);
			let root = deepCopiedController.vdid;

			const loopAttr = (controller, parent) => {

				let childCtrl = {},
					tmpAttr = {},
					ctrl = {};

				tmpAttr = controller.attrs;
				for(let i = 0, len = tmpAttr.length; i < len; i ++) {
					// if(specialAttrList.indexOf(tmpAttr[i].key) !== -1) {
					// 	continue;
					// }
					for (var j = 0; j < tmpAttr[i].children.length; j++) {
						var attr = tmpAttr[i].children[j];
						attr['id'] = randomString(8, 10);
					};
				}
				if(controller.vdid == parent.vdid){
					ctrl = {
						vdid: root,
						attrs: tmpAttr,
						tag: controller.tag,
						className: controller.className,
						customClassName: [],
						activeStyle: '',
						children: [],
						isRander: controller.isRander || '',
						ignore: controller.ignore || false,
						root: root || '',
						isRoot: true,
						unActive: controller.unActive,
						isBeforeHTMLValue: controller.isBeforeHTMLValue || false
					};
				}else{
					ctrl = {
						vdid: controller.key ? (controller.key + '-' + randomString(8, 10)) : randomString(8, 10),
						attrs: tmpAttr,
						tag: controller.tag,
						className: controller.className,
						customClassName: [],
						activeStyle: '',
						children: [],
						isRander: controller.isRander || '',
						ignore: controller.ignore || false,
						root: root || '',
						parent: parent.vdid,
						unActive: controller.unActive,
						isBeforeHTMLValue: controller.isBeforeHTMLValue || false
					};
				}

				if(controller.children) {
					for (var i = 0; i < controller.children.length; i++) {
						var currentCtrl = controller.children[i];
						childCtrl = loopAttr(currentCtrl, ctrl);
						ctrl.children.push(childCtrl);
					};
				}else {
					ctrl.children = undefined;
				}

				state.defaultSelectedKeys = [ctrl.vdid];

				return ctrl;
			}

			let tmpCtrl = loopAttr(deepCopiedController, deepCopiedController);
			let activeCtrl = VDTreeActions.getActiveCtrl(state);

			VDDesignerFrame.postMessage({
    			ctrlTreeGenerated: {
    				controller: tmpCtrl,
    				activeCtrl
    			}
			}, '*');

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

		setActivePage(state, { payload: params }) {

			state.activePage.key = params.activePage.key;
	    	window.VDDesignerFrame.postMessage({
	    		pageSelected: state.layout[params.activePage.key]
	    	}, '*');
			return {...state};
		},

		setActiveCtrlInTree(state, { payload: params }) {
			state.defaultSelectedKeys = params;
			return {...state};
		},

		ctrlSelected(state, { payload: data }) {

			if(data.unActive){
				let currentActiveCtrl = VDTreeActions.getActiveControllerIndexAndLvlByKey(state, data.root, state.activePage);
				state.activeCtrl = currentActiveCtrl.controller;
				state.activeCtrlIndex = currentActiveCtrl.index;
				state.activeCtrlLvl = currentActiveCtrl.level;
				state.defaultSelectedKeys = [data.root];
			}else {
				let ctrlInfo = VDTreeActions.getActiveControllerIndexAndLvlByKey(state, data.vdid, state.activePage);
				state.activeCtrl = ctrlInfo.controller;
				state.activeCtrlIndex = ctrlInfo.index;
				state.activeCtrlLvl = ctrlInfo.level;
				state.defaultSelectedKeys = [data.vdid];
			}

			return {...state};
		},
		handleAttrFormChangeA(state, { payload: params }) {

			console.log(params);
			let currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			if (params.attrName === 'id') {
				currentActiveCtrl.controller.id = params.newVal;
			}
			console.log(params)
			var ctrlAttrs = currentActiveCtrl.controller.attrs;
			var targetAttr;
  			for (var i = 0; i < ctrlAttrs.length; i++) {
  				for (var j = 0; j < ctrlAttrs[i].children.length; j++) {
  					var attr = ctrlAttrs[i].children[j];
  					var flag = false;
	  				if(attr.id == params.attrId) {
						targetAttr = attr.name;
	  					attr.value = params.newVal;
	  					flag = true;
	  					break;
	  				}
	  				if(flag) {
	  					break;
	  				}
  				};
  			};
			var style = currentActiveCtrl.controller.attrs[0].children[2].value;
			if(targetAttr == 'height'){
				style = style.replace(/height: \d*(%|px);/,"height: " + params.newVal + ";");
			}
			if(targetAttr == 'width') {
				style = style.replace(/width: \d*(%|px);/,"width: " + params.newVal + ";");
			}
			console.log(style);
			currentActiveCtrl.controller.attrs[0].children[2].value = style;
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					attrType: params.attrType,
					attr: currentActiveCtrl.controller.attrs[0].children[2],
					activeCtrl: currentActiveCtrl.controller
				}
			}, '*');
			if(params.attrType.key == 'slider-setting'){
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
		handleAttrFormChangeNotRefreshActiveCtrl(state, { payload: params}){

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, params.target, state.activePage);
			if (params.attrName === 'id') {
				currentActiveCtrl.controller.id = params.newVal;
			}
			var attr = currentActiveCtrl.controller.attrs[0].children[params.index];
			console.log(attr);
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
		handleAttrRefreshed(state, { payload: params }) {

			//判断是否需要切换标签
			if(params.attrType.isChangeTag && params.attr.name == 'tag'){
				var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
				currentActiveCtrl.controller.attrs.tag = params.attr.value;
				state.activeCtrl = currentActiveCtrl.controller;
				params.activeCtrl.tag = params.attr.value;
			}
			if(params.attr.isStyle){
				var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
				state.activeCtrl.attrs[currentActiveCtrl.index].children[currentActiveCtrl.level-1].value = params.attr.value;
				params.activeCtrl.attrs[currentActiveCtrl.index].children[currentActiveCtrl.level-1].value = params.attr.value;
				state.activeCtrl = currentActiveCtrl.controller;
			}
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: params
			}, '*');
			return {...state};
		},

		handleCustomAttrRemoved(state, { payload: params }) {
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

		handleCustomAttrInputChange(state, { payload: params }) {

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

		saveCustomAttr(state, { payload: params }) {

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
		handleColumnCountChange(state, { payload: params }) {
			console.log(params)
			let column = params.column;
			let currentRootVdid = params.currentRootVdid;
			let tmpColumns = params.tmpColumns;

			let colClass = 'col-md-' + tmpColumns[0].value;

			let currentColumsInfo = VDTreeActions.getCtrlByKey(state, currentRootVdid, state.activePage);
			let currentColums = currentColumsInfo.controller//当前的栅格
			let currentCount = currentColums.attrs[0].children[0].value;//当前栅格里面的格子数
			let changCount = params.value - currentCount;

			currentColums.attrs[0].children[0].value = params.value;
			currentColums.attrs[0].children[1].value = tmpColumns;

			//改变className及其属性值
			let changClassName = function () {
				for(let i = 0; i < currentColums.children.length; i ++){

					let currentChild = currentColums.children[i];

					currentChild.attrs[0].children[0].value = params.value;
					currentChild.attrs[0].children[1].value = tmpColumns;

					let originalClassName = currentChild.className;
					for(let j = 0; j < originalClassName.length; j ++) {
						if (originalClassName[j].indexOf('col-md-') !== -1) {
							originalClassName[j] = colClass;
							break;
						}
					}
				}
			}

			let deepCopiedController = VDTreeActions.deepCopyObj(column);

			if (changCount > 0) {


				const loopAttr = (controller) => {

					let childCtrl = {},
						tmpAttr = {},
						ctrl = {};

					tmpAttr = controller.attrs;
					for(let i = 0, len = tmpAttr.length; i < len; i ++) {
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
						activeStyle: '',
						children: [],
						isRander: controller.isRander || '',
						ignore: controller.ignore || false,
						root: currentRootVdid || '',
						parent: currentRootVdid,
						unActive: false,
					};


					if(controller.children) {
						for (var i = 0; i < controller.children.length; i++) {
							var currentCtrl = controller.children[i];
							childCtrl = loopAttr(currentCtrl, ctrl);
							ctrl.children.push(childCtrl);
						};
					}else {
						ctrl.children = undefined;
					}

					return ctrl;
				}

				changClassName();

				let addedColumn = [];

				for(let i = 0; i < changCount; i ++) {
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
			}else {
				for(let i = 0; i < -changCount; i ++) {
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
			console.log(currentColums)

			return {...state};
		},

		shrinkLeftColumn(state, { payload: params }) {

			let currentRootVdid = state.activeCtrl.root,
				currentColums = VDTreeActions.getCtrlByKey(state, currentRootVdid, state.activePage);
			currentColums = currentColums.controller;

			let needChangeAttr = currentColums.attrs[0].children[1].value;

			let changClassName = (classNames, className) => {
				for(let i = 0; i < classNames.length; i ++) {
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
				for(let i = 0; i < currentColums.children.length; i ++) {
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

				for(let i = 0; i < currentColums.children.length; i ++) {
					currentColums.children[i].attrs[0].children[1].value[params.index + 1].span = needChangeAttr[params.index + 1].span;
					currentColums.children[i].attrs[0].children[1].value[params.index + 1].value = needChangeAttr[params.index + 1].value;
				}

				changClassName(currentColums.children[params.index + 1].className, 'col-md-' + (needChangeAttr[params.index + 1].value));
			}

			return {...state};

		},

		expandLeftColumn(state, { payload: params }) {


			let currentRootVdid = state.activeCtrl.root,
				currentColums = VDTreeActions.getCtrlByKey(state, currentRootVdid, state.activePage);
			currentColums = currentColums.controller//当前的栅格

			let needChangeAttr = currentColums.attrs[0].children[1].value;

			let changClassName = (classNames, className) => {
				for(let i = 0; i < classNames.length; i ++) {
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

				for(let i = 0; i < currentColums.children.length; i ++) {
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

				for(let i = 0; i < currentColums.children.length; i ++) {
					currentColums.children[i].attrs[0].children[1].value[params.index + 1].span = needChangeAttr[params.index + 1].span;
					currentColums.children[i].attrs[0].children[1].value[params.index + 1].value = needChangeAttr[params.index + 1].value;
				}

				changClassName(currentColums.children[params.index + 1].className, 'col-md-' + (needChangeAttr[params.index + 1].value));
			}

			return {...state};
		},

		modifyCustomAttr(state, { payload: params }) {
			return {...state};
		},

		setActiveStyle(state, { payload: activeStyle }) {
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			currentActiveCtrl.controller.activeStyle = activeStyle;
			state.activeCtrl = currentActiveCtrl.controller;
			return {...state};
		},

		changeCustomClass(state, { payload: params }) {
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);

			if(!currentActiveCtrl.controller) {
				message.error('请先添加控件再进行操作！');
				return {...state};
			}

			var className = '';

			if(params.push) {
				if(typeof params.value == 'string') {
					params.value = [params.value];
				}
				currentActiveCtrl.controller.customClassName.push(params.value[0]);
				currentActiveCtrl.controller.activeStyle = params.value[params.value.length - 1];
				className = params.value[0];
			}else {
				currentActiveCtrl.controller.customClassName = params.value;
				currentActiveCtrl.controller.activeStyle  = params.value[params.value.length - 1];
				className = params.value;
			}

			state.activeCtrl = currentActiveCtrl.controller;

			if(!params.dontChangeAttr) {
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

		addPageToLayout(state, { payload: params }) {
			var pageInfo = params.page;
			state.layout[pageInfo.key] = [{
	    		className: [],
	    		id: '',
	    		tag: 'body',
	    		vdid: 'body-' + randomString(8, 10),
	    		ctrlName: 'body',
	    		children: [],
	    		attrs: []
	    	}];
	    	state.activePage.key = pageInfo.key;

	    	window.VDDesignerFrame.postMessage({
	    		pageSelected: state.layout[pageInfo.key]
	    	}, '*');

			return {...state};
		},

		deleteCtrl(state, {payload: params}) {

			let deleteKey;
			if (params && params.fromKeyboard) {
				deleteKey = state.activeCtrl.vdid;
				if (!deleteKey) {
					return {...state};
				}
			}else {
				deleteKey = sessionStorage.currentSelectedConstructionKey;
			}

			let deleteParentInfo = VDTreeActions.getParentCtrlByKey(state, deleteKey, state.activePage),
				deleteParentCtrl = deleteParentInfo.parentCtrl,
				deleteIndex = deleteParentInfo.index;
			deleteParentCtrl.children.splice(deleteIndex, 1);

			window.VDDesignerFrame.postMessage({
				deleteCtrl: deleteKey
			}, '*');

			if (deleteParentCtrl.children.length === 0) {

				if (deleteParentCtrl.vdid.split('-')[0] === 'body') {
					state.activeCtrl = 'none';
					state.activeCtrlIndex = 'none';
					state.activeCtrlLvl = 'none';
					state.defaultSelectedKeys = ['none'];
				}else {
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

			}else if (typeof deleteParentCtrl.children[deleteIndex] !== 'undefined') {
				state.activeCtrl = deleteParentCtrl.children[deleteIndex];
				state.activeCtrlIndex = deleteIndex
				state.activeCtrlLvl = deleteParentInfo.level;
				state.defaultSelectedKeys = [state.activeCtrl.vdid];
			}else {
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
			}else {
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
			}else {
				children = state.layout[state.activePage.key][0].children;
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

			}else {
				moveCtrl = [params.ctrl];
			}
			children.splice(params.index, 0, moveCtrl[0]);
			state.activeCtrl = moveCtrl[0];
			state.activeCtrlIndex = params.index;
			state.defaultSelectedKeys = [moveCtrl[0].vdid];

			return {...state};
		},

		handleInteractionOnSelect(state, { payload: params }) {

			//加动画类
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage).controller;

			if(!currentActiveCtrl) {
				message.error('请先添加控件或选择一个控件再进行操作！');
				return {...state};
			}

			if(currentActiveCtrl.customClassName.indexOf('animated') == -1) {
				currentActiveCtrl.customClassName.push('animated');
			}

			if(currentActiveCtrl.customClassName.indexOf(params.animateName) == -1) {
				currentActiveCtrl.customClassName.push(params.animateName);
			}else {
				for (var i = 0; i < currentActiveCtrl.customClassName.length; i++) {
					var crt = currentActiveCtrl.customClassName[i];
					if(crt == params.animateName) {
						currentActiveCtrl.customClassName.splice(i, 1);
					}
				};
			}

			state.activeCtrl = currentActiveCtrl;

			window.VDDesignerFrame.postMessage({
				animateElement: {
					id: state.activeCtrl.vdid,
					animateName: params.animateName
				}
			}, '*');
			return {...state};
		}
	},

	effects: {

		*handleAttrFormChange({payload: params}, {call, put, select}) {
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
		}

	}

}
