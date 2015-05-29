var tabsCtrl = require(“/PagingControl/tabs");
var OS_IOS = Titanium.Platform.osname != "android";

var iWidth,
    indicator,
    localArgs,
    anterior = 0,
    atual = 0;

var scrollableView = Titanium.UI.createScrollableView();

var pagingcontrol = Titanium.UI.createScrollView({
	scrollType : 'horizontal',
	width : Ti.UI.FILL,
	contentWidth : 'auto',
	contentHeight : Ti.UI.FILL,
	showHorizontalScrollIndicator : false,
	showVerticalScrollIndicator : false,
	top: 0
});


function postLayout(callback) {
	pagingcontrol.addEventListener('postlayout', function onPostLayout(evt) {

		// callback
		callback();

		// remove eventlistener
		evt.source.removeEventListener('postlayout', onPostLayout);
	});
}

exports.create = function(args) {
	
	localArgs = args;
	
	Titanium.API.info(JSON.stringify(localArgs));
	
	// xml boolean localArgs is string ("false" == true)

	var checkBoolArgs = ['hasTabs', 'findScrollableView'];
	for (item in checkBoolArgs) {
		try {
			localArgs[checkBoolArgs[item]] = JSON.parse(localArgs[checkBoolArgs[item]]);
		} catch (e) {
			delete localArgs[checkBoolArgs[item]];
			Ti.API.error("Unable to set argument '" + checkBoolArgs[item] + "'. It must be boolean.");
		}
	}

	// fill undefined args with defaults
	if (localArgs.indicatorColor == null) {
		localArgs.indicatorColor = "#000";
	};
	if (localArgs.indicatorHeight == null) {
		localArgs.indicatorHeight = 5;
	};
	if (localArgs.hasTabs == null) {
		localArgs.hasTabs = true;
	};
	if (localArgs.scrollOffset == null) {
		localArgs.scrollOffset = 40;
	};
	if (localArgs.height == null) {
		localArgs.height = localArgs.hasTabs ? 48 : 5;
	};
	if (localArgs.width == null) {
		localArgs.width = Ti.UI.FILL;
	};
	if (localArgs.findScrollableView == null) {
		localArgs.findScrollableView = true;
	};
	if (localArgs.tabsColor == null) {
		localArgs.tabsColor = "#EDEDED";
	};
	if (localArgs.dividerColor == null) {
		localArgs.dividerColor = "#CCC";
	};
	if (localArgs.labelsColor == null) {
		localArgs.labelsColor = "#000";
	};
	if (localArgs.highlightEffect == null) {
		localArgs.highlightEffect = false;
	};
	if (localArgs.font == null) {
		localArgs.font = {
	    	fontSize: "12dp",
	    	fontFamily: "Robotto",
	    	fontWeight: "normal"
	    };
	};


	// additional adjustments for tabs
	if (localArgs.hasTabs) {
		localArgs.tabProps = {
			dividerColor : localArgs.dividerColor,
			width : localArgs.tabWidth.toString()
		};
	}

	// apply properties of Ti.UI.View that can be applied to paging control view
	var propsArray = ["backgroundColor", "backgroundImage", "backgroundLeftCap", "backgroundRepeat", "backgroundTopCap", "borderRadius", "borderWidth", "bottom", "height", "horizontalWrap", "left", "opacity", "right", "top", "visible", "width", "zIndex"];

	for (prop in propsArray) {
		if (localArgs[propsArray[prop]]) {
			pagingcontrol[propsArray[prop]] = localArgs[propsArray[prop]];
		}
	}

	// assign passed reference of scrollable view
	if (localArgs["scrollableView"]) {
		scrollableView = localArgs.scrollableView;
	}

	if (localArgs.hasTabs) {

		scrollableView.setViews(localArgs.tabs);

		var titlesArray = [];
		var tempViewArray = localArgs.tabs;
		for (v in tempViewArray) {
			titlesArray.push(tempViewArray[v].title);
		}
		tempViewArray = null;

		// create tabs
		tabsCtrl = tabsCtrl.init({
			tabs : localArgs.tabProps,
			titles : titlesArray,
			font: localArgs.font,
			labelsColor: localArgs.labelsColor,
			highlightEffect: localArgs.highlightEffect
		});
		
		// add tabs
		pagingcontrol.setBackgroundColor(localArgs.tabsColor);
		pagingcontrol.add(tabsCtrl);

		// add bottom border
		pagingcontrol.add(Ti.UI.createView({
			width : Ti.UI.FILL,
			height : 2,
			bottom : 0,
			backgroundColor : localArgs.tabsColor
		}));
		
		scrollableView.add(pagingcontrol);
		
		// add tab select listener
		tabsCtrl.addEventListener('select', function(e) {
			
			scrollableView.fireEvent('select', {
				tab : e.tab,
				view : e.view
			});
			
			if(localArgs.fancyScroll){
				scrollableView.scrollToView(e.tab);
			}else{
				scrollableView.currentPage = e.tab;
				indicator.setLeft(e.tab * iWidth);	
			}
		});
	}

	// create the indicator view
	indicator = Ti.UI.createView({
		backgroundColor : localArgs.indicatorColor,
		height : localArgs.indicatorHeight,
		width : Ti.UI.SIZE,
		bottom : 0,
		left : 0,
		zIndex : 2
	});

	adjustePositions();

	// add the indicator
	pagingcontrol.add(indicator);

	// add scroll listener to scrollable view
	scrollableView.addEventListener('scroll', onScroll);
	
	return scrollableView;
};

/**
 * Callback for scroll event
 */
function onScroll(e) {
	Titanium.API.info("Scroll");
	
	// restrict this to scrollableView to support nesting scrollableViews
	if (e.source !== scrollableView){
		return;
	}
	
	// update the indicator position
	indicator.setLeft(e.currentPageAsFloat * iWidth);
	updateOffset(e.currentPageAsFloat);
		
	if(e.currentPage != undefined){
		atual = e.currentPage;
		if(anterior != atual && localArgs.highlightEffect){
			this.getChildren()[0].getChildren()[0].getChildren()[anterior * 2].getChildren()[0].opacity = 0.4;
			anterior = atual;
		}
		this.getChildren()[0].getChildren()[0].getChildren()[atual * 2].getChildren()[0].opacity = 1;
	}
}

/**
 * sets the tab bar offset
 * @param {Number} index
 */
function updateOffset(index) {
	var width = pagingcontrol.size.width,
	    tabsWidth = tabsCtrl.getWidth(),
	    maxOffset = tabsWidth - width,
	    tabSpace = tabsWidth * index / scrollableView.views.length;
	
	if (width < tabsWidth) {
		
		var offset = tabSpace - localArgs.scrollOffset,
		    offsetDp = offset < maxOffset ? offset : maxOffset,
		    newOffset = OS_IOS ? (offsetDp < 0 ? 0 : offsetDp) : DPUnitsToPixels(offsetDp);

		pagingcontrol.setContentOffset({
			x : newOffset,
			y : 0
		}, {
			animated : false
		});
	}
}

function DPUnitsToPixels(TheDPUnits)
{
  return (TheDPUnits * (Titanium.Platform.displayCaps.dpi / 160));
}

/**
 * Adjust initial layout positions
 */
function adjustePositions() {
	var totalWidth = localArgs.hasTabs ? tabsCtrl.getWidth() : pagingcontrol.size.width;
	iWidth = Math.floor(totalWidth / scrollableView.views.length);
	indicator.setWidth(iWidth);
	indicator.setLeft(scrollableView.getCurrentPage() * iWidth);
}

/**
 * if you need to set it in the controller
 * @param {Titanium.UI.Scrollableview} scrollable view
 */
exports.setScrollableView = function(_sv) {
	if (scrollableView) {
		Ti.API.error("Already initialized");
		return;
	}
	scrollableView = _sv;
	postLayout(create);
};
