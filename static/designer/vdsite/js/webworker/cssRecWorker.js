var state = {};

var generateStylesList = function(cssPropertyState) {

	var styles = {};

	var recCSSProperty = function(currentCSSStyle, cssProperties) {

		var cssPropertiesIndex = 0;

		for (var k = 0; k < cssProperties.length; k++) {
			var cssProperty = cssProperties[k];
			if(cssProperty.key == 'bgimg-bgradius'){
				continue;
			}
			if(state.propertiesNeedRec.indexOf(cssProperty.key) != -1) {
				//某些拥有复杂交互的CSS属性需要递归查询属性
				recCSSProperty(currentCSSStyle, cssProperty.valueList);
			}else {
				if(!cssProperty.props) {
					continue;
				}
				if(cssProperty.properties) {
					if(cssProperty.properties.props.value != '' && cssProperty.properties.key) {
						styles['.' + currentCSSStyle.name][cssProperty.properties.key] = cssProperty.properties.props.value;
					}
				}else {
					if(cssProperty.props.value != '' && cssProperty.key) {
						styles['.' + currentCSSStyle.name][cssProperty.key] = cssProperty.props.value;
					}
				}
			}
		};
	}

	var cssPropertyStateIndex = 0;

	while(cssPropertyStateIndex < cssPropertyState.length){

		var currentCSSStyle = cssPropertyState[cssPropertyStateIndex],
			currentCSSStyleProperty = currentCSSStyle.cssProperty;
		styles['.' + currentCSSStyle.name] = {};

		var currentCSSStylePropertyIndex = 0;

		while(currentCSSStylePropertyIndex < currentCSSStyleProperty.length) {
			var cssProperties = currentCSSStyleProperty[currentCSSStylePropertyIndex].properties;
			recCSSProperty(currentCSSStyle, cssProperties);			
			currentCSSStylePropertyIndex++;
		}

		cssPropertyStateIndex++;
	}

	return styles;
}

var generateCSSText = function(stylesList) {
	var cssText = '';
	for(var styleName in stylesList) {
		var currentStyle = stylesList[styleName],
			cssClass = styleName + '{';
		for(var property in currentStyle) {
			var currentTableStyle = currentStyle[property];
			cssClass += property + ':' + currentTableStyle + ';'
		}
		cssClass += '}';
		cssText += cssClass;
	}

	return cssText.toString();
}

onmessage = function(event) {
	state = JSON.parse(event.data);
	var cssText = generateCSSText(generateStylesList(state.cssPropertyState));
	postMessage(cssText);
}

