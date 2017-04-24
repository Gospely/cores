$(function() {
	if (document.domain != 'localhost') {
		document.domain = 'gospely.com';
	}

	//animation动画函数(在这里定义全局变量才能解绑)
	window.animationTrigger = function (e) {
		var selected = jQuery("#vd-OutlineSelectedActiveNode");
		var target = jQuery(e.target);
		target.animateCss(e.data.animate);
		if (selected.offset().top === target.offset().top && selected.offset().left === target.offset().left) {
			selected.css({
				animationDuration: target.css("animationDuration")
			});
			selected.animateCss(e.data.animate);
		}

	}

	//绑定键盘事件，在react中也有绑定，但有时会被拦截，故两边都绑定
	// jq(window).off("keyup");
 //    jq(window).on("keyup", function (e) {
 //        e.stopPropagation();
 //        e.preventDefault();
 //        if (e.keyCode === 46) {
 //            parentWindow.postMessage({ 'ctrlClicked': c }, "*");
 //        }
 //    })

	var jq = jQuery.noConflict();

	jQuery.fn.isChildOf = function(b) {
        return (this.closest(b).length > 0);
    };

    var drawCanvas = function (left, top , width, height) {
    	jq("#drawLegalArea").remove();
    	var $canvas = jq('<canvas id="drawLegalArea" class="vd-drop-mask"></canvas>');
    	var windowHeight = jq(window).height();
    	var windowWidth = jq(window).width();
    	jq('body').append($canvas);

    	var ctx = $canvas[0].getContext("2d");
    	ctx.fillStyle = "rgba(1, 1, 1, .37)";
    	ctx.fillRect(0, 0, windowWidth, windowHeight);
    	ctx.fillStyle = "rgba(1, 1, 1, 1)";
    	ctx.globalCompositeOperation = 'destination-out';
    	ctx.fillRect(left, top, width, height);
    }

    var guide = jq("#vdInsertGuide");
    var guideHidden = jq("#vdInsertGuideHidden");
    var parentGuide = jq("#vdOutlineDropParentNode");

	//拖拽过程中的一些数据及函数
	var dndData = {
		//开始拖拽时生成的dom
		elemToAdd: '',

		//拖拽增加控件时生成的控件的数据
		ctrlToAddData: '',

		dragOverElem: '',
		dragElem: '',
		originalY: '',
		originalX: '',
		dragElemParent: '',

		errorMessage: '非法位置',


		//判断是否是合格子元素的方法
		isLegalChild: function (e, target) {

			if (guideHidden.parent().data("specialChild")) {

				var specialChild = guideHidden.parent().data("specialChild");
				var dragClass = dndData.dragElem[0].className;
				var dragTag = dndData.dragElem[0].tagName;

				if (dragClass.indexOf(specialChild.className) === -1 || specialChild.tag.indexOf(dragTag) === -1) {
					return [false, specialChild.errorMessage];
				}

				return [true, ''];
			}

			return [true, ''];

		},

		//是否是合格父元素
		isLegalParent: function (e, target) {
			if (dndData.dragElem.data("specialParent")) {

				var specialParent = dndData.dragElem.data("specialParent");
				var specialTag = specialParent.tag;
				var specialClassName = specialParent.className;
				var parentClass = guideHidden.parent()[0].className;
				var parentTag = guideHidden.parent()[0].tagName;

				// jq("#VDDesignerContainer").addClass('illegalArea');
				// jq("#VDDesignerContainer").find("*").addClass('illegalArea');
				// jq("#VDDesignerContainer").find("*").each(function () {
				// 	var $this = jq(this);
				// 		if (this.className.indexOf(specialClassName) !== -1) {
				// 			// $this.removeClass('illegalArea');
				// 			// $this.find('*').removeClass('illegalArea');
				// 	}
				// })
				// var parent = guideHidden.parent();
				// drawCanvas(parent.offset().left, parent.offset().top, parent.outerWidth(), parent.outerHeight());

				if (parentClass.indexOf(specialClassName) === -1 || specialTag.indexOf(parentTag) === -1) {
					return [false, specialParent.errorMessage];
				}

				return [true, ''];
			}

			return [true, ''];
		},

		//每次位置变动前的处理
		actionBeforeMove: function (e, target) {

			if (!(dndData.isMouseDown && guide.css("display") === 'none')) {
				dndData.dragElemParent = guideHidden.parent();
			}

		},

		needShowParentGuide: function (e, target) {
			var parent = target.parent();

			if (parent.data("container") || parent.attr('id') === 'VDDesignerContainer') {
				parentGuide.css({
					left: parent.offset().left,
					top: parent.offset().top,
					width: parent.outerWidth(),
					height: parent.outerHeight(),
					display: 'block'
				})
			}
		},

		//每次位置变动后的处理
		actionAfterMove: function (e, target) {

			var isLegalChild = dndData.isLegalChild(e, target);
			var isLegalParent = dndData.isLegalParent(e, target);

			if (isLegalChild[0] && isLegalParent[0]) {
				guide.removeClass("error");
				parentGuide.removeClass("error");
			}

			if (!isLegalChild[0]) {
				guide.addClass("error");
				parentGuide.addClass("error");
				dndData.errorMessage = isLegalChild[1];
			}

			if (!isLegalParent[0]) {
				guide.addClass("error");
				parentGuide.addClass("error");
				dndData.errorMessage = isLegalParent[1];
			}

			dndData.originalX = e.pageX;
			dndData.originalY = e.pageY;

		},

		isMouseDown: false,

		verticalBefore: function (e, target, isContainerSpecial) {

			if (target.prev().attr("id") === "vdInsertGuideHidden" && guide.css("display") !== "none") {
				return false;
			}

			dndData.actionBeforeMove(e, target);

			target.before(guideHidden);

			dndData.needShowParentGuide(e, target);

			if (isContainerSpecial) {
				guide.css({
					width: target.parent().innerWidth(),
					height: 2,
					display: 'block',
					top: target.offset().top,
					// position: 'fixed',
					left: target.offset().left
				})
			}else {
				guide.css({
					width: target.outerWidth(),
					height: 2,
					display: 'block',
					top: target.offset().top,
					// position: 'fixed',
					left: target.offset().left
				})
			}

			dndData.actionAfterMove(e, target);
		},

		verticalAfter: function (e, target, isContainerSpecial) {

			if (target.next().attr("id") === "vdInsertGuideHidden" && guide.css("display") !== "none") {
				return false;
			}

			dndData.actionBeforeMove(e, target);

			target.after(guideHidden);
			dndData.needShowParentGuide(e, target);

			if (isContainerSpecial) {
				guide.css({
					width: target.parent().innerWidth(),
					display: 'block',
					height: 2,
					top: target.offset().top + target.outerHeight(),
					left: target.parent().children().eq(0).offset().left
				})
			}else {
				guide.css({
					width: target.outerWidth(),
					display: 'block',
					height: 2,
					top: target.offset().top + target.outerHeight(),
					left: target.offset().left
				})
			}


			dndData.actionAfterMove(e, target);
		},

		verticalAppend: function (e, target) {

			if (target.children().length) {
				if(target.children()[target.children().length - 1].id === 'vdInsertGuideHidden' && guide.css("display") !== "none") {
					return false;
				}
			}

			dndData.actionBeforeMove(e, target);

			var lastChild = target.children().last();

			if (lastChild.length && lastChild.attr('id') === 'vdInsertGuideHidden') {
        		lastChild = lastChild.prev();
        	}

			var lastPosition = 0;
        	if (lastChild.length) {
        		lastPosition = lastChild.offset().top + lastChild.outerHeight()
        	}

			target.append(guideHidden);
			guide.css({
				width: target.innerWidth(),
				display: 'block',
				height: 2,
				// position: 'fixed',
				top: target.offset().top + 10 + lastPosition,
				left: target.offset().left
			})

			parentGuide.css({
				left: target.offset().left,
				top: target.offset().top,
				width: target.outerWidth(),
				height: target.outerHeight(),
				display: 'block'
			})

			dndData.actionAfterMove(e, target, 'append');
		},

        horizontalBefore: function (e, target) {

        	if (target.prev().attr("id") === "vdInsertGuideHidden" && guide.css("display") !== "none") {
				return false;
			}

        	dndData.actionBeforeMove(e, target);

        	dndData.needShowParentGuide(e, target);
			target.before(guideHidden);

			guide.css({
				width: 2,
				height: target.outerHeight(),
				display: 'block',
				top: target.offset().top,
				left: target.offset().left,
				// position: 'fixed'
			})
			dndData.actionAfterMove(e, target);
        },

        horizontalAfter: function (e, target) {

        	if (target.next().attr("id") === "vdInsertGuideHidden" && guide.css("display") !== "none") {
				return false;
			}

        	dndData.actionBeforeMove(e, target);

        	dndData.needShowParentGuide(e, target);
			target.after(guideHidden);
			guide.css({
				width: 2,
				display: 'block',
				top: target.offset().top,
				left: target.offset().left + target.outerWidth(),
				// position: 'fixed'
			})
			dndData.actionAfterMove(e, target);
        },

        horizontalAppend: function (e, target) {

        	if (target.children().length) {
				if(target.children()[target.children().length - 1].id === 'vdInsertGuideHidden' && guide.css("display") !== "none") {
					return false;
				}
			}

        	dndData.actionBeforeMove(e, target);

        	var lastChild = target.children().last();
        	var lastPosition = 0;
        	if (lastChild.length) {
        		lastPosition = lastChild.offset().top + lastChild.outerHeight()
        	}
			target.append(guideHidden);
			guide.css({
				width: target.innerWidth(),
				display: 'block',
				height: 2,
				// position: 'fixed',
				top: target.offset().top + 10 + lastPosition,
				left: target.offset().left
			})
			parentGuide.css({
				left: target.offset().left,
				top: target.offset().top,
				width: target.outerWidth(),
				height: target.outerHeight(),
				display: 'block'
			})

			dndData.actionAfterMove(e, target, 'append');
        },

        containerSpecialHandle: function (e, target) {

			var firAndLas = [];
			target.children().each(function () {

				if (e.pageY >= jq(this).offset().top && e.pageY <= jq(this).offset().top + jq(this).outerHeight()) {
					firAndLas.push(jq(this))
				}

			})

			var first = firAndLas[0],
				last = firAndLas[firAndLas.length - 1];

			if (first && last && first[0].id !== "vdInsertGuideHidden") {
				var heigher = first.outerHeight();

				if (heigher < last.outerHeight()) {
					heigher = last.outerHeight()
				}

				var ref = (e.pageY - first.offset().top) / heigher;

				parentGuide.css({
					left: target.offset().left,
					top: target.offset().top,
					width: target.outerWidth(),
					height: target.outerHeight(),
					display: 'block'
				})

				if (ref > 0.5) {
					dndData.verticalAfter(e, last, true);
				}else if (ref <= 0.5) {
					dndData.verticalBefore(e, first, true);
				}
			}else {

				dndData.verticalAppend(e, target);
			}

        }

	};

	var dndHandlder = function () {

		var parentWindow = window.parent;

		//点击组件
		jq(document).on("click", function (e) {
			e.stopPropagation();
			var targetData = jq(e.target).data('controller');
            if(!targetData) {
                controllerOperations.desSelect(targetData);
            }
		})

		//给父级发送消息
		var postMessageToFather = {
			ctrlClicked: function (c) {
				parentWindow.postMessage({ 'ctrlClicked': c }, "*");
			},

			pageSelected: function (c) {
				parentWindow.postMessage({ 'pageSelected': c }, "*");
			},

			generateCtrlTree: function(c) {

				parentWindow.postMessage({ 'generateCtrlTree': c }, "*");
			},

			elemAdded: function (c) {
				parentWindow.postMessage({ 'elemAdded': c }, "*");
			},

			ctrlSelected: function (c) {
				parentWindow.postMessage({ 'ctrlSelected': c }, "*");
			},

			ctrlMovedAndDroped: function (c) {
				parentWindow.postMessage({ 'ctrlMovedAndDroped' : c }, "*");
			},

			showErrorMessage: function (c) {
				parentWindow.postMessage({ 'showErrorMessage' : c }, "*");
			},

			copyCtrl: function (c) {
				parentWindow.postMessage({ 'copyCtrl' : c }, "*");
			},

			cutCtrl: function (c) {
				parentWindow.postMessage({ 'cutCtrl' : c }, "*");
			},

			pastCtrl: function (c) {
				parentWindow.postMessage({ 'pastCtrl' : c }, "*");
			},

			deleteCtrl: function (c) {
				parentWindow.postMessage({ 'deleteCtrl' : c }, "*");
			},

			ctrlDomPasted: function (c) {
				parentWindow.postMessage({ 'ctrlDomPasted' : c }, "*");
			}

		};

		//监听父级消息
		var listenParentMessage = function() {

            var self = this;

            window.addEventListener('message', function(evt) {

                var data = evt.data;
                var eventName = '';

                var evtAction = {
                    ctrlTreeGenerated: function() {
                        var elem = new ElemGenerator(data.controller);
                        var elemToAdd = jq(elem.createElement());
                        dndData.elemToAdd = elemToAdd;
                        dndData.dragElem = elemToAdd;
                        dndData.ctrlToAddData = data.controller;
                    },

                    upLoadBgImg: function(){

						jq('[vdid="'+ data.activeCtrl.vdid + '"]').css('background-image', 'url("' + data.url + '")');

                    },

                    uploadImgRefreshed: function(){
                    	jq('[vdid="'+ data.activeCtrl.vdid + '"]').attr('src', data.url);
                    },

                    VDAttrRefreshed: function() {
                        controllerOperations.refreshCtrl(data.activeCtrl, data.attr, data.attrType);
                        controllerOperations.select(data.activeCtrl, true);
                        if(data.attrType && data.attrType.key == "image-setting") {
                        	jq('#imgPreview').attr('src', data.attr.value);
                        }

                    },

                    applyCSSIntoPage: function() {
                        pageOperations.applyCSS(data.cssText);

                        if (data.activeCtrl.tag) {
                        	controllerOperations.select(data.activeCtrl, true);
                        }
                    },

                    applyScriptIntoPage: function () {
                    	pageOperations.applyScript(data);
                    },

					VDChildrenDelete: function(){
						controllerOperations.deleteChildren(data.activeCtrl, data.attrType);
					},

					VDChildrenAdd: function(){
						controllerOperations.addChildren(data.activeCtrl, data.attrType);
					},

					VDChildrenUpdate: function(){
						controllerOperations.updateChildren(data.activeCtrl, data.attrType);
					},

                    pageSelected: function() {
                    	var VDDesignerContainer = jq('#VDDesignerContainer');
                       	VDDesignerContainer.html('');
                        controllerOperations.hideDesignerDraggerBorder();
                        var elemBody = new ElemGenerator(data[0]);
                        elemBody.handleBody();
                        for (var i = 0; i < data[0].children.length; i++) {
                            var currentController = data[0].children[i];
                            var elem = new ElemGenerator(currentController);
                            var elemToAdd = jq(elem.createElement());
                            VDDesignerContainer.append(elemToAdd);
                            dndData.elemToAdd = elemToAdd;
                            dndData.dragElem = elemToAdd;
                            dndData.ctrlToAddData = data.controller;
                        };

                        setTimeout(function () {
                        	var container = jq("#VDDesignerContainer");
                        	var last = container.children().last();

                        	if (!last || last.length === 0) {
								container.css({
									height: '100%'
								});

								return;
							}

                        	if (last.outerHeight() + last.offset().top + 100 > jq(window).innerHeight()) {
								container.css({
									height: 'auto'
								})
							}else {
								container.css({
									height: '100%'
								})
							}
                        }, 500)

                    },

                    VDCtrlSelected: function() {
                        controllerOperations.select(data, true);
                    },

                    deleteCtrl: function () {
                    	jq('[vdid=' + data + ']').remove();
                    	controllerOperations.changeContainerHeight();
                    },

                    hideDesignerDraggerBorder: function () {
                    	controllerOperations.hideDesignerDraggerBorder();
                    },

                    animateElement: function() {

                    	var selected = jQuery("#vd-OutlineSelectedActiveNode");
                    	var target = jq('[vdid="' + data.id + '"]');
                    	target.animateCss(data.animateName);
                    	if (selected.offset().top === target.offset().top && selected.offset().left === target.offset().left) {
							selected.css({
								animationDuration: target.css("animationDuration")
							});
							selected.animateCss(data.animateName);
						}
                    },

                    styleNameEdited: function() {
                    	jq('[vdid="' + data.vdid + '"]').removeClass(data.originStyleName);
                    	jq('[vdid="' + data.vdid + '"]').addClass(data.newStyleName);
                    },

                    symbolsAdded: function() {
		        		var self = this;
		        		var components = jq(parentWindow.document, parentWindow.document).find('.symbols-ctrl').eq(data.index);

	        			jq(components).attr("draggable", true);
	        			jq(components).on("dragstart", function (e) {
			        		postMessageToFather.generateCtrlTree(parentWindow.VDDnddata);
			        		e.stopPropagation();
			        	});

			        	jq(components).on("dragend", function (e) {
			        		e.preventDefault();
			        	});
                    },

                    initSymbols: function() {
		        		var self = this;
		        		var components = jq(parentWindow.document, parentWindow.document).find('.symbols-ctrl');

		        		components.each(function(n) {
		        			jq(this).attr("draggable", true);
		        			jq(this).on("dragstart", function (e) {
				        		postMessageToFather.generateCtrlTree(parentWindow.VDDnddata);
				        		e.stopPropagation();
				        	});

				        	jq(this).on("dragend", function (e) {
				        		e.preventDefault();
				        	});
		        		});

                    },

                    ctrlDataPasted: function () {

                    	var elem = new ElemGenerator(data.controller);
                        var elemToAdd = jq(elem.createElement());

                        if (data.activeCtrlTag === 'body') {
                        	jq("#VDDesignerContainer")[data.type](elemToAdd);
                        }else {
                        	var parent = jq("[vdid=" + data.activeCtrlVdid + "]");
                        	parent[data.type](elemToAdd);
                        }
                        controllerOperations.select(data.controller);
                        controllerOperations.changeContainerHeight();

                        postMessageToFather.ctrlDomPasted(data.controller);
                    },

                    treeNodeDroped: function () {
                    	jq("[vdid=" + data.target + "]")[data.type](jq("[vdid=" + data.dragNode + "]"));
                    }
                };

                for (var key in data) {
                    eventName = key;
                }

                if (evtAction[eventName]) {
                    data = data[key];
                    evtAction[eventName]();
                }

            });

        }();
		const scriptOperate = {
			triggerMenu(activeCtrl, attr){

				var elem = jq('[vdid='+ attr.target + ']');
				if(elem.hasClass('in')){
					elem.removeClass('in');
				}else {
					elem.addClass('in');
				}

			}
		}

		//右键菜单
		var rightClickMenu = function () {
	    	jq("#vdCopy").click(function (e) {
		    	e.stopPropagation();
		    	e.preventDefault();
		    	postMessageToFather.copyCtrl({});
		    	jq("#vdRightClickMenu").hide();

		    })

		    jq("#vdPast").click(function (e) {
		    	e.stopPropagation();
		    	e.preventDefault();
		    	if (jq(e.target).hasClass('disabled')) {
		    		return false;
		    	}
		    	postMessageToFather.pastCtrl({type: 'append'});
		    	jq("#vdRightClickMenu").hide();
		    })

		    jq("#vdCut").click(function (e) {
		    	e.stopPropagation();
		    	e.preventDefault();
		    	jq("#vdRightClickMenu").hide();
		    	postMessageToFather.cutCtrl({});
		    })

		    jq("#vdPastPre").click(function (e) {
		    	e.stopPropagation();
		    	e.preventDefault();
		    	if (jq(e.target).hasClass('disabled')) {
		    		return false;
		    	}
		    	postMessageToFather.pastCtrl({type: 'prepend'});
		    	jq("#vdRightClickMenu").hide();
		    })

		    jq("#vdDelete").click(function (e) {
		    	e.stopPropagation();
		    	e.preventDefault();
		    	postMessageToFather.deleteCtrl({});
		    	jq("#vdRightClickMenu").hide();
		    })

		    jq("#vdPastBefore").click(function (e) {
		    	e.stopPropagation();
		    	e.preventDefault();
		    	if (jq(e.target).hasClass('disabled')) {
		    		return false;
		    	}
		    	postMessageToFather.pastCtrl({type: 'before'});
		    	jq("#vdRightClickMenu").hide();
		    })

		    jq("#vdPastAfter").click(function (e) {
		    	e.stopPropagation();
		    	e.preventDefault();
		    	if (jq(e.target).hasClass('disabled')) {
		    		return false;
		    	}
		    	postMessageToFather.pastCtrl({type: 'after'});
		    	jq("#vdRightClickMenu").hide();
		    })

	    }();

		//class操作
		const classOperate = {
			//替换class
			replaceClass: function(activeCtrl, attr){

				var elem = jq('[vdid='+ attr.target.vdid + ']');
				elem.removeClass(attr.remove);
				elem.addClass(attr.replacement);
				if (attr.needSelect) {
					controllerOperations.showDesignerDraggerBorder(dndData.dragElem);
				}

			},
			//删除children的class
			batchClassRemove: function(activeCtrl, attr){
				var elem = jq('[vdid='+ attr.parent + ']');
				var childrens = elem.children('.' +attr.targetClass);
				for (var i = 0; i < childrens.length; i++) {
					jq(childrens[i]).removeClass(attr.targetClass);
				}
			}
		}
		//对子节点的操作
		const childrenOperate = {

			'update': function(activeCtrl, attr){

				var vdid  = activeCtrl.vdid;
				var elem = jq('[vdid='+ activeCtrl.vdid + ']');
				activeCtrl.vdid = activeCtrl.vdid + 'c';
				var elemGen = new ElemGenerator(activeCtrl);
				var tempElem = elemGen.createElement();
				tempElem.attr('vdid', vdid);
				var clone = tempElem.clone(true);
				elem.replaceWith(clone);
				// elem.children().remove();
				elem = jq('[vdid='+ activeCtrl.vdid + ']');
				if(activeCtrl.chidren){
	 				for (var i = 0; i < activeCtrl.children.length; i++) {
	 					elem.append(new ElemGenerator(activeCtrl.children[i]).createElement());
	 				}
	 			}
				activeCtrl.vdid = vdid;
				elem.data('controller', activeCtrl);
			},
			'add': function(activeCtrl, attr){

				var elem = jq('[vdid='+ attr.parent + ']');
				var elemGen = new ElemGenerator(attr.children);
				var tempElem = elemGen.createElement();
				elem = elem.append(tempElem);
			},
			//将要设置为active的children
			changeActive: function(activeCtrl , attr){

				var elem = jq('[vdid='+ attr.parent + ']');
				var childrens = elem.children('.active');
				if(attr.type == 'tab'){
					var parent = elem.parent();
					childrens = parent.find('.active');
				}
				jq(childrens).removeClass('active');
				jq(elem.children()[attr.index]).addClass('active');
			}
		}
		//栅格操作
		const columnsOperate = {
			'add': function(activeCtrl, column, parent, count, colClass){
				var elem = jq('[vdid='+ parent + ']');

				elem.children().each(function () {
					var classList = this.className.split(' ');

					for (var i = 0; i < classList.length; i++) {
						if(classList[i].indexOf('col-md-') !== -1) {
							classList[i] = colClass;
							break;
						}
					}

					jq(this).attr("class", classList.join(' '));
				})

				for(var i = 0; i < count; i ++){
					var elemGen = new ElemGenerator(column[i]);
					var tempElem = elemGen.createElement();
					elem.append(tempElem);
				}

				var childrenData = [];
				for(var i = 0; i < activeCtrl.children.length; i ++) {
					childrenData.push(activeCtrl.children[i]);
				}
				controllerOperations.refreshData(parent, activeCtrl, childrenData)

			},

			delete: function (activeCtrl, column, parent, count, colClass) {
				var elem = jq('[vdid='+ parent + ']');
				for(var i = 0; i < count; i ++){
					elem.children().eq(-1).remove();
				}
				elem.children().each(function () {
					var classList = this.className.split(' ');

					for (var i = 0; i < classList.length; i++) {
						if(classList[i].indexOf('col-md-') !== -1) {
							classList[i] = colClass;
							break;
						}
					}

					jq(this).attr("class", classList.join(' '));
				})

				var childrenData = [];
				for(var i = 0; i < activeCtrl.children.length; i ++) {
					childrenData.push(activeCtrl.children[i]);
				}
				controllerOperations.refreshData(parent, activeCtrl, childrenData)
			}
		}

		//对控件的一些操作
		var controllerOperations = {
			hideDesignerDraggerBorder: function () {
                jq('#vd-OutlineSelectedActiveNode').hide();
                jq('#vdInsertGuide').hide();
                jq('#vdOutlineDropParentNode').hide();
			},

			showDesignerDraggerBorder: function (target) {
                if(target.length === 0) {
                    return false;
                }

                jq('#vd-OutlineSelectedActiveNode').css({
                    top: target.offset().top,
                    left: target.offset().left,
                    width: target.outerWidth(),
                    height: target.outerHeight(),
                    display: 'block'
                });
			},

			changeContainerHeight: function () {
				var container = jq("#VDDesignerContainer");
				var last = container.children().last();

				if (!last || last.length === 0) {
					container.css({
						height: '100%'
					});
					return;
				}
				if (last.outerHeight() + last.offset().top + 100 > jq(window).innerHeight()) {
					container.css({
						height: 'auto'
					})
				}else {
					container.css({
						height: '100%'
					})
				}
			},

			desSelect: function (data) {
			},

            select: function(data, notPostMessage) {

            	jq("#vdRightClickMenu").hide();
				if(data) {

                    if(data.vdid == '') {
                        controllerOperations.hideDesignerDraggerBorder();
                        return false;
                    }

                    notPostMessage = notPostMessage || false;
                    var currentCtrl = jq('[vdid=' + data.vdid + ']');
	                controllerOperations.showDesignerDraggerBorder(currentCtrl);
                    if(data.isFromCtrlTree) {
                        data = currentCtrl.data('controller');
                    }
                    jq('#ctrl-title-clicked').html(data.tag + (data.customClassName.length > 0 ? '.' + data.customClassName.join('.') : ''));
	                if(!notPostMessage) {
	                    postMessageToFather.ctrlSelected(data);
	                }

				}
            },

            showRightClickMenu: function (e) {

            	var pastInside = jq("#vdPast, #vdPastPre");
            	var pastBrother = jq("#vdPastBefore, #vdPastAfter");
            	var target = jq(e.target);
            	var menu = jq("#vdRightClickMenu");
            	var left = e.pageX;
            	var top = e.pageY;

            	if (jq(window).width() - e.pageX < menu.outerWidth()) {
            		left = jq(window).width() - menu.outerWidth() - 10 + jq(window).scrollLeft();
            	}
            	if (jq(window).height() - e.pageY < menu.outerHeight()) {
            		//top = jq(window).height() - menu.outerHeight() - 10 + jq(window).scrollTop();
            		top = e.pageY;
            	}
            	menu.css({
            		display: 'block',
            		left: left,
            		top: top
            	})

            	if (!sessionStorage.copiedCtrl || (!target.data('container') && target.attr('id') !== 'VDDesignerContainer')) {
            		pastInside.addClass('disabled');
            	}else {
            		pastInside.removeClass('disabled')
            	}

            	if (!sessionStorage.copiedCtrl) {
            		pastInside.addClass('disabled');
            		pastBrother.addClass('disabled');
            	}else {
            		if (target.parent().data("specialChild")) {
					var controller = JSON.parse(sessionStorage.copiedCtrl);
					var specialChild = target.parent().data("specialChild");
					var ctrlClass = controller.className.join(' ');
					var ctrlTag = controller.tag;
					if (typeof ctrlTag === 'object') {
						ctrlTag = ctrlTag[0];
					}

					if (ctrlClass.indexOf(specialChild.className) === -1 || specialChild.tag.indexOf(ctrlTag.toUpperCase()) === -1) {
						pastBrother.addClass('disabled');
					}else {
						pastBrother.removeClass('disabled');
					}

					}else {
						pastBrother.removeClass('disabled');
					}
            	}
            },

            refreshData: function (rootVdid, rootData, childrenData) {
            	jq('[vdid=' + rootVdid + ']').data('controller', rootData)
            	.children().each(function (index) {
            		jq(this).data('controller', childrenData[index]);
            	});

            },

            refreshCtrl: function(activeCtrl, attr, attrType) {

				if(attr.isTag) {
					childrenOperate.update(activeCtrl);
				}
				if(attr.attrName == 'children'){
					childrenOperate[attr.action](activeCtrl, attr);
				}else if (attr.attrName == 'columns') {
					columnsOperate[attr.action](activeCtrl, attr.column, attr.parent, attr.count, attr.colClass);
				}else if(attr.attrName == 'classOperate'){
					classOperate[attr.action](activeCtrl, attr);
				}else if(attr.attrName == 'replaceElem'){

					var parent = jq('[vdid='+ attr.parent + ']');
					parent.children().remove();
					var elemGen = new ElemGenerator(activeCtrl);
					var tempElem = elemGen.createElement();
					parent = parent.append(tempElem);
				}else  if (attr.attrName == 'scriptOperate') {
					scriptOperate[attr.action](activeCtrl, attr);
				}else{
					new ElemGenerator(activeCtrl).setAttributeByAttr(attr, attrType);
				}
            },
			deleteChildren: function(activeCtrl,attrType) {
				var vdid  = activeCtrl.vdid;
				var elem = jq('[vdid='+ activeCtrl.vdid + ']');
				elem.remove();
            },
			addChildren: function(activeCtrl, children){

			},
			updateChildren: function(activeCtrl, children) {

			}
		};

        var pageOperations = {
            applyCSS: function(cssText) {
                var oldStyle = jq('[sid="global-css"]').remove();
                var css = jq('<style sid="global-css">' + cssText + '</style>');
                jq('head').append(css);
            },

            applyScript: function (scriptText) {
            	var oldScript = jq('[sid="global-script"]').remove();

        		var script = jq('<script sid="global-script">' + scriptText + '</script>');
        		jq('body').append(script);

            },

            reload: function() {

            }
        };

		//点击其他区域隐藏border和i
        jq("body").on("click", function(e) {
            // controllerOperations.hideDesignerDraggerBorder();
            // postMessageToFather.pageSelected({
            //     key: ''
            // });

            jq("#vdRightClickMenu").hide();

        });

        //拖拽初始化类
        function DndInitialization(options) {

            var self = this;

            this.containerSelector = '#VDDesignerContainer';
            this.inter = 0;

            this.makeComponentsDraggable();

        	jq(self.containerSelector).on("drop", function (e) {
        		self.onDrop(e);
        	})

        	jq(self.containerSelector).on("dragover", function (e) {
        		self.onOver(e);
        	})

        	jq(self.containerSelector).on("dragenter", function (e) {
        		self.onEnter(e);
        	})

        	jq(self.containerSelector).on("dragleave", function (e) {
        		dndData.isMouseDown = false;
        		controllerOperations.hideDesignerDraggerBorder();
        		// jq("#VDDesignerContainer").find("*").removeClass('illegalArea');
        		// jq("#VDDesignerContainer").removeClass('illegalArea');
        	})

        }

        DndInitialization.prototype = {
        	makeComponentsDraggable: function(cb) {
        		var self = this;
        		var components = jq(parentWindow.document, parentWindow.document).find('.anticons-list-item');

        		components.each(function(n) {
        			jq(this).attr("draggable", true);
        			jq(this).on("dragstart", function (e) {
		        		postMessageToFather.generateCtrlTree(parentWindow.VDDnddata);

		        		e.originalEvent.dataTransfer.setData("Text",'for compatible with firefox');//为兼容firfox必须设置这个

		        		e.stopPropagation();
		        	});

		        	jq(this).on("dragend", function (e) {
		        		e.preventDefault();
		        	});
        		});
        	},

        	onEnter: function (e) {
        		e.stopPropagation();
        		e.preventDefault();
        		dndData.originalY = e.pageY;
        		dndData.originalX = e.pageY;
        	},

        	onOver: function (e) {
        		e.preventDefault();
        		e.stopPropagation();

        		var target = jq(e.target);
        		var targetIsChild = target.isChildOf(dndData.dragElem);
        		var isContainer = target.data("container");

        		dndData.dragOverElem = target;

        		//不准拖动的组件找父级
        		if (target.data("controller") && target.data("controller").unActive && target.attr('vdid') === dndData.dragElem.attr('vdid')) {

        			var findParent = function (elem) {
        				if (elem.parent().length) {
        					findParent(elem.parent())
        				}
        				if (elem.data("controller") && !elem.data("controller").unActive) {
        					target = elem;
        					dndData.dragOverElem = elem;
        					dndData.dragElem = elem;
        				}
        			}
        			findParent(target);

        		}

        		//当拖动容器时可能会出现自己append到自己里面去的情况，在此防止
        		if(targetIsChild) {
        			dndData.dragOverElem = dndData.dragElem;
					target = dndData.dragElem;
					isContainer = false;
				}

        		if (target.outerWidth() < target.parent().innerWidth() && e.target.className.indexOf('col-md-') === -1 &&
        			target.css('display') !== 'block' && target.css('display') !== 'flex') {
        			//是否是行级元素
        			var ref = (e.pageX - target.offset().left) / target.outerWidth();
        			var moveX = e.pageX - dndData.originalX;

	        		if (isContainer) {

        				if (ref <= 1/3) {

        					if (e.target.className.indexOf('col-md-') === -1) {
        						dndData.horizontalBefore(e, target);
        					}else {
        						dndData.verticalBefore(e, target.parent());
        					}

		        		} else if (ref > 1/3 && ref < 2/3) {

		        			dndData.containerSpecialHandle(e, target);

		        		} else if (ref >= 2/3) {

		        			if (e.target.className.indexOf('col-md-') === -1) {
		        				dndData.horizontalAfter(e, target);
		        			}else {
		        				dndData.verticalAfter(e, target.parent());
		        			}

		        		}

        			}else {

	        			 if (target.attr("id") === 'VDDesignerContainer') {

		        			dndData.containerSpecialHandle(e, target);

		        		} else if (ref < 1/2) {

		        			dndData.horizontalBefore(e, target);

		        		} else if (ref >= 1/2) {

		        			dndData.horizontalAfter(e, target);

		        		}
		        	}
        		}else {

        			var ref = (e.pageY - target.offset().top) / target.outerHeight();
        			var moveY = e.pageY - dndData.originalY;

        			if (isContainer) {

        				if (ref <= 1/3) {

        					if (e.target.className.indexOf('col-md-') > -1) {
        						target = target.parent();
        						dndData.dragOverElem = target;
        					}

		        			dndData.verticalBefore(e, target);

		        		} else if (ref > 1/3 && ref < 2/3) {

		        			dndData.containerSpecialHandle(e, target);

		        		} else if (ref >= 2/3) {

		        			if (e.target.className.indexOf('col-md-') > -1) {
        						target = target.parent();
        						dndData.dragOverElem = target;
        					}

		        			dndData.verticalAfter(e, target);

		        		}

        			}else {

	        			if (target.attr("id") === 'VDDesignerContainer') {

		        			dndData.containerSpecialHandle(e, target);

		        		}else if (ref < 1/2) {

		        			dndData.verticalBefore(e, target);

		        		} else if (ref >= 1/2) {

		        			dndData.verticalAfter(e, target);

		        		}
		        	}

        		}

        	},

        	onDrop: function (e) {
        		e.preventDefault();
        		e.stopPropagation();

        		var dragElem = dndData.dragElem;

        		var handler = function () {

        			dndData.isMouseDown = false;
        			controllerOperations.showDesignerDraggerBorder(dragElem);
        			// jq("#VDDesignerContainer").find("*").removeClass('illegalArea');
        			// jq("#VDDesignerContainer").removeClass('illegalArea');
        			dndData.errorMessage = '非法位置';

        			controllerOperations.changeContainerHeight();

        		}

        		if(guide.css("display") === 'none') {
        			var container = jq("#VDDesignerContainer");
        			dndData.isMouseDown = false;
        			dndData.errorMessage = '非法位置';
        			// container.find("*").removeClass('illegalArea');
        			// container.removeClass('illegalArea');


					return false;
				}

				// jq("#VDDesignerContainer").find("*").removeClass('illegalArea');
				// jq("#VDDesignerContainer").removeClass('illegalArea');
        		controllerOperations.hideDesignerDraggerBorder();

        		if (guide.hasClass("error")) {

        			postMessageToFather.showErrorMessage({
        				errorMessage: dndData.errorMessage
        			});

        			dndData.isMouseDown = false;
        			dndData.errorMessage = '非法位置';
        			controllerOperations.showDesignerDraggerBorder(dragElem);
        			// jq("#VDDesignerContainer").find("*").removeClass('illegalArea');
        			// jq("#VDDesignerContainer").removeClass('illegalArea');
					return false;
        		}

        		jq("#vdInsertGuideHidden").after(dragElem);
        		postMessageToFather.ctrlMovedAndDroped({
        			moveElemVdid: dragElem.attr("vdid"),
        			dropTargetVdid: dragElem.parent().attr("vdid"),
        			index: dragElem.prevAll().length - 1,
        			isFromSelf: dndData.isMouseDown,
        			ctrl: dndData.ctrlToAddData || '',
        			closeVDLeftPanelDivId:"closeVDLeftPanel"
        		});

        		// if (!dndData.isMouseDown) {
        			// postMessageToFather.elemAdded(dndData.ctrlToAddData);
        		// }
        		handler();

        	}
        }

        //生成dom类
        function ElemGenerator(params) {
        	this.controller = params;
        	this.tag = typeof this.controller.tag == 'object' ? this.controller.tag[0] : this.controller.tag;
        	this.elemLoaded = false;
			var designerContainer = jq("#VDDesignerContainer");

			if(!designerContainer.data('register')){
				this.makeElemAddedDraggable();
			}
        	return this;
        }

        parent.ElemGenerator = ElemGenerator;

        ElemGenerator.prototype = {

        	initElem: function () {
        		if(this.controller.tag == 'body') {
        			this.elem = jq('body');
        			this.elemLoaded = true;
        			return false;
        		}

        		if (!this.elemLoaded) {
                    var docCtrl = jq('[vdid='+ this.controller.vdid + ']');
                    this.elem = docCtrl.length > 0 ? docCtrl : jq(document.createElement(this.tag));
                    this.elemLoaded = true;
                    // this.refresh = docCtrl.length > 0;
                }
        	},

        	bindData: function () {
        		this.initElem();
        		this.elem.data('controller', this.controller);
        	},

            setCustomAttr: function(attr) {
                var self = this;
                var attrAction = {
                    add: function() {
                        self.elem.attr(attr.value.key, attr.value.value);
                    },

                    modify: function() {
                        self.elem.attr(attr.attrName, attr.value);
                    },

                    remove: function() {
                        self.elem.attr(attr.attrName, '');
                    }
                }

                if(attrAction[attr.action]) {
                    attrAction[attr.action]();
                }
            },

            setBasic: function(attr) {

                if(attr.isAttr) {
                    if(attr.value) {
                        if(attr.isScrollFlag) {
                            this.elem.attr('data-section', attr.value);
                            this.elem.attr('id', attr.value);
                        }else {
                            this.elem.attr(attr.attrName, attr.value);
                        }
                    }
                }

                if(attr.isScreenSetting) {
                    var className = attr.value,
                        currentCtrlClass = this.elem.attr('class');

                    if(currentCtrlClass) {
                        var currentCtrlClassList = currentCtrlClass.split(' ');
                        for (var i = 0; i < currentCtrlClassList.length; i++) {
                            var cls = currentCtrlClassList[i];
                            for (var j = 0; j < attr.valueList.length; j++) {
                                var val = attr.valueList[j];
                                if(val.value == cls) {
                                    this.elem.removeClass(cls);
                                }
                            };
                        };
                    }
					if(className) {
						for (var i = 0; i < className.length; i++) {
	                        var cls = className[i];
	                        this.elem.addClass(cls);
	                    };
					}
                }
            },

            setAttr: function(attr) {
                if(attr.isHTML) {

					if(attr.html){
						this.elem.html(attr.html);
					}else{
						var childrens = this.elem.children();
						this.elem.html('');
						if(attr.desc == '文本内容') {
							this.elem.html(attr.value);
						}else{
							if(childrens){
								for (var i = 0; i < childrens.length; i++) {
									this.elem.append(childrens[i]);
							}
								this.elem.innerText = '';
								this.elem.append(attr.value);
							}else {
								this.elem.html(attr.value);
							}
						}

					}

                }
				if(attr.isToggleAttr){
					if(attr.isSetVal){
						if(attr.attrName == 'aria-expanded'){
							var className = attr.value? 'dropdown open' : 'dropdown';
							this.elem.parent().removeClass("open");
							this.elem.parent().addClass(className);
						}
						this.elem.attr(attr.attrName, attr.value);
					}else{
						if(!attr.value)
							this.elem.removeAttr(attr.attrName);
						this.elem.attr(attr.attrName, attr.value);
					}
				}
                if(attr.isAttr) {
					this.elem.attr(attr.attrName, attr.value);
                }
                if (attr.isContainer) {
                	this.elem.data(attr.name, attr.value);
                }

                if (attr.isSpecialParent) {
                	this.elem.data(attr.name, attr.value);
                }

                if (attr.isSpecialChild) {
                	this.elem.data(attr.name, attr.value);
                }

				if(attr.isStyle){
					this.elem.css(attr.name, attr.value);
				}

            },

            setLinkSetting: function(attr) {
                var self = this;

				if(attr.isHTML){
					this.setAttr(attr);
				}else {
					if(attr.isAttr) {

						if(attr.attrName == 'target') {
							if(attr.value) {
								this.elem.attr(attr.attrName, '_blank');
							}else {
								this.elem.attr(attr.attrName, '');
							}
						}else {

							if(this.controller.attrs[0].activeLinkType == attr.attrType) {

								var attrValue = attr.value,

									getAttrValue = function (val, type) {
										var typeList = {
											'link': function() {
	                                            return '';
	                                        },
											'mail': function() {
	                                            return 'mailto:';
	                                        },
											'phone': function() {
	                                            return 'phone:';
	                                        },
											'page': function() {
	                                            return '';
	                                        },
											'section': function() {
	                                            self.elem.attr('data-nav-section', val);
	                                            return '#';
	                                        }
										}

	                                    if(typeList[type]) {
	                                        return typeList[type]() + val;
	                                    }else {
											self.elem.attr('href', val);
	                                        return '';
	                                    }
									}

								attrValue = getAttrValue(attrValue, this.controller.attrs[0].activeLinkType);

	                            if(attrValue) {
	                                attrValue = attrValue == 'undefined' ? '' : attrValue;
	                                this.elem.attr(attr.attrName, attrValue);
	                            }

							}

						}
					}
				}
            },

            setImageSetting: function(attr) {
                if(attr.attrName == 'src') {
                    if(attr.value != '') {
                        this.withImage = true;
                    }
                }

                if(attr.isAttr) {
                    this.elem.attr(attr.attrName, attr.value);
                }

                if(attr.isImagePlaceholder) {
                    if(!this.withImage) {
                        this.elem.attr('src', window.parent.placeholderImgBase64);
                    }
                }
            },

            setClassName: function(attr) {
                var classList = this.controller.className.concat(this.controller.customClassName);
                this.elem.attr('class', classList.join(' '));
            },
			setSelectSetting: function(attr){
				this.setAttr(attr);
			},
			setTabsSetting: function(attr){
				this.setAttr(attr);
			},
			setNavbarSetting: function(attr){
				this.setAttr(attr);
			},
			setDropdownSetting: function(attr){
				this.setAttr(attr);
			},
			setSliderSetting: function(attr){
				this.setAttr(attr);
			},
			setIconSetting: function(attr){
				this.setAttr(attr);
			},
			setUnctrlSetting(attr){
				this.setAttr(attr);
			},
            transformTypeToUpper: function(type) {
                var settingTypeSplit = type.split('-'),
                    upperTypeName = '';
                for (var j = 0; j < settingTypeSplit.length; j++) {
                    var type = settingTypeSplit[j];
                    type = type.replace(/^\S/,function(s){return s.toUpperCase();});
                    upperTypeName += type;
                };

                return upperTypeName;
            },
        	setAttribute: function () {
        		this.initElem();
				if(this.controller) {
					for(var i = 0, len = this.controller.attrs.length; i < len; i ++) {
	        			var attr = this.controller.attrs[i];

	                    if(attr.isAttrSetting) {
	                        //基础属性设置（无复杂交互）统一处理
	                        for (var j = 0; j < attr.children.length; j++) {
	                            var att = attr.children[j];
	                            this.setAttr(att);
	                        };
	                    }else {

	                        //调用所需要的属性设置类型
	                        var upperTypeName = this.transformTypeToUpper(attr.key);

	                        if(this['set' + upperTypeName]) {
	                            for (var j = 0; j < attr.children.length; j++) {
	                                var att = attr.children[j];
	                                this['set' + upperTypeName](att);
	                            };
	                        }

	                    }
	        		}
	        		this.elem.attr('vdid', this.controller.vdid);
				}
        	},

            setAttributeByAttr: function(attr, attrType) {

                this.initElem();
                this.bindData();
                var upperTypeName = this.transformTypeToUpper(attrType.key);
                if(attrType.isAttrSetting || attr.isStyle) {
                    this.setAttr(attr);
                }else {
                    if(this['set' + upperTypeName]) {
                        this['set' + upperTypeName](attr);
                    }
                }
            },

            handleBody: function() {
            	this.initElem();
            	this.addClass();
            	this.bindData();

            	this.elem.attr('vdid', this.controller.vdid);
            },

            addClass: function() {

        		var className = this.controller.className;
        		if (className) {
        			for(var i = 0, len = className.length; i < len; i ++) {
        				this.elem.addClass(className[i]);
        			}
        		}

        		var customClassName = this.controller.customClassName;
        		if (customClassName) {
        			for(var i = 0, len = customClassName.length; i < len; i ++) {
        				this.elem.addClass(customClassName[i]);
        			}
        		}

            },

        	createElement: function () {
        		var self = this;

        		this.initElem();
        		this.bindData();
        		this.setAttribute();

        		this.addClass();

        		var component = this.elem;

        		if (this.controller.children && this.controller.children.length > 0) {

                    for (var i = 0; i < this.controller.children.length; i++) {
                        var currentCtrl = this.controller.children[i];

                        var reComGenerator = new ElemGenerator(currentCtrl),

                            loopComponent = reComGenerator.createElement(),

                            jqComponent = jq(component);

                        if(currentCtrl.isBeforeHTMLValue) {
                            jqComponent.prepend(jq(loopComponent));
                        }else {
                            jqComponent.append(jq(loopComponent));
                        }

                    };

                }
				if(!this.elem.data('isRegister')){
					this.listenHover();
	                this.listenClick();
	                this.listenContextmenu();
					this.elem.data('isRegister', 'true')
				}
                return component;
        	},

            listenHover: function() {
                var self = this;

                this.elem.hover(function(e) {
                    var target = jq(e.target);
                    var targetHeight = 0;
                    var elemData = jq(e.target).data('controller');
                	jq('#ctrl-title-hover').html(elemData.tag + (elemData.customClassName.length > 0 ? '.' + elemData.customClassName.join('.') : ''));

                    targetHeight = target.height();

                    jq('#vd-OutlineSelectedHoverNode').css({
                        top: target.offset().top,
                        left: target.offset().left,
                        width: target.outerWidth(),
                        height: target.outerHeight(),
                        display: 'block',
                        zIndex: 65532
                    });
                }, function(e) {
                    jq('#vd-OutlineSelectedHoverNode').hide();
                });
            },

            listenClick: function() {

                var self = this;
                this.elem.click(function(e) {

                    e.stopPropagation();
                    e.preventDefault();
                    var target = jq(e.target);
					var data = target.data('controller');
					data.dblclick = false;
                    controllerOperations.select(data);

                    return false;
                });
				this.elem.dblclick(function(e) {

                    e.stopPropagation();
                    e.preventDefault();
                    var target = jq(e.target);
					var data = target.data('controller');
					data.dblclick = true;
                    controllerOperations.select(data);
                    return false;
                });
            },

            listenContextmenu: function () {
            	this.elem.contextmenu(function (e) {
            		e.preventDefault();
            		//controllerOperations.select(jq(e.target).data('controller'));
            		controllerOperations.showRightClickMenu(e);
            	})
            },

        	makeElemAddedDraggable: function () {

        		var self = this;

        		var designerContainer = jq("#VDDesignerContainer");

        		designerContainer.on("mousedown", function (e) {

        			if (e.which === 1) {
        				self.onDown(e);
        			}

        		});

        		designerContainer.on("mouseenter", function (e) {
        			self.onEnter(e);
        		});

        		designerContainer.on("mousemove", function (e) {
        			self.onMove(e);
        		});

        		designerContainer.on("mousemove", function (e) {
        			self.onMove(e);
        		})

        		designerContainer.on("mouseup", function (e) {
        			self.onUp(e);
        		});
				designerContainer.data('register', true);
        	},

        	onMove: function (e) {
        		if (dndData.isMouseDown) {
        			jq(e.target).css({
        				cursor: 'pointer'
        			})
        			DndInitialization.prototype.onOver(e);
        		}
        	},
        	onEnter: function (e) {
        		if (dndData.isMouseDown) {
        			DndInitialization.prototype.onEnter(e);
        		}
        	},
        	onDown: function (e) {

        		var target = jq(e.target);

        		if (target.attr('id') === 'VDDesignerContainer') {
        			return false;
        		}

        		e.stopPropagation();
        		e.preventDefault();

        		dndData.dragElemParent = target.parent();
        		dndData.dragElem = target;
        		dndData.isMouseDown = true;

        		if (target.data("controller") && target.data("controller").unActive) {
        			var findParent = function (elem) {
        				if (elem.parent().length) {
        					findParent(elem.parent())
        				}
        				if (elem.data("controller") && !elem.data("controller").unActive) {
        					dndData.dragElem = elem;
        					dndData.dragElemParent = elem;
        				}
        			}
        			findParent(target);
        		}

        	},
        	onUp: function (e) {
    			DndInitialization.prototype.onDrop(e);
        	}
        }

        new DndInitialization();

	};

	//iframe加载完再执行
	window.addEventListener('message', function (evt) {
		var eventName = '',
			data = evt.data;

		for(var key in data) {
			eventName = key
		}

		if(eventName == 'VDDesignerLoaded') {
			dndHandlder();
		}

	})

})

window.onload = function () {
	window.parent.postMessage({
		allLoaded: {}
	}, "*")

	jQuery(document).on('keydown', function (e) {
		e.stopPropagation();
		e.preventDefault();
		window.parent.postMessage({
			keyDown: e.keyCode
		}, "*")
	})
}
