$(function() {
	if (document.domain != 'localhost') {
		document.domain = 'gospely.com';
	}

	var jq = jQuery.noConflict();

	var dndHandlder = function () {
		var postMessageToFather = {
			ctrlClicked: function (c) {
				parent.postMessage({ 'ctrlClicked': c }, "*");
			},

			pageSelected: function (c) {
				parent.postMessage({ 'pageSelected': c }, "*");
			}
		}

		//点击其他区域隐藏border和i
        jq("body").on("click", function(e) {
            controllerOperations.hideDesignerDraggerBorder();
            postMessageToFather.pageSelected({
                key: ''
            });
            
        });

	}

	var controllerOperations = {
		hideDesignerDraggerBorder: function () {
			console.log(4)
		}
	}
})