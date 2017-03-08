
var VDPackager = {

	fileStructure: {
		css: '',
		pages: {},
		scripts: ''
	},

	pages: {},
	css: {},
	layout: {},

	htmlTpl: {
		head: `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Gospel</title><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="generator" content="Gospel"><link rel="stylesheet" type="text/css" href="css/normalize.css"><link rel="stylesheet" type="text/css" href="css/gospel.css"><link rel="stylesheet" type="text/css" href="css/styles.css"><link rel="stylesheet" type="text/css" href="//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css"><link href="//cdn.bootcss.com/animate.css/3.5.2/animate.min.css" rel="stylesheet"><script type="text/javascript" src="js/modernizr.js"></script>`,

		body: `</head><body>`,

		footer: `<script src="//cdn.bootcss.com/jquery/3.1.1/jquery.min.js"></script><script src="js/bootstrap.min.js"></script><!--[if lte IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/placeholders/3.0.2/placeholders.min.js"></script><![endif]--></body></html>`
	},

	pack (params) {

		this.fileStructure = {
			css: '',
			pages: {}
		};

		this.pages = params.pages;
		this.css = params.css;
		this.layout = params.layout;

		this.fileStructure.css = this.compileCSS();

		this.compilePage();

		this.compileScripts();

		return this.fileStructure;
	},

	compileCSS () {
		return window.stylesGenerator(this.css);
	},

	compileScripts () {
		return '';
	},

	compilePage () {
		var self = this;

		const pageGenerator = (pages, directory, parentDir) => {

			for (var i = 0; i < pages.length; i++) {
				var currentPage = pages[i];

				var meta = {
					description: ''
				};

				if(currentPage.children) {
					var tmpParentDir = {};

					if(directory) {
						parentDir[currentPage.key] = {};
						tmpParentDir = parentDir[currentPage.key];
					}else {
						this.fileStructure.pages[currentPage.key] = {};
						tmpParentDir = this.fileStructure.pages[currentPage.key];
					}
					pageGenerator(currentPage.children, true, tmpParentDir);
				}else {
					meta.description = self.compileDescription(currentPage.seo.description);
					var realHTML = '', htmlText = '';

					if(this.layout[currentPage.key]) {
						realHTML = this.compileLayout(this.layout[currentPage.key]);
					}

					htmlText = this.htmlTpl.head + meta.description + this.htmlTpl.body + realHTML + this.htmlTpl.footer;

					if(directory) {
						parentDir[currentPage.key] = htmlText;
					}else {
						this.fileStructure.pages[currentPage.key] = htmlText;
					}
				}
			};

		}

		pageGenerator(this.pages);

		return this.fileStructure;
	},

	compileDescription (description) {
		return '<meta name="description" content="' + description + '">';
	},

	compileLayout (layout) {

		var bodyChildren = layout[0].children,
			resultTpl = '';

		for (var i = 0; i < bodyChildren.length; i++) {
            var currentController = bodyChildren[i],
            	elem = new window.ElemGenerator(currentController),
           		elemToAdd = $(elem.createElement());

           	resultTpl += elemToAdd[0].outerHTML;
        };

        return resultTpl;
	}

}

export default VDPackager;
