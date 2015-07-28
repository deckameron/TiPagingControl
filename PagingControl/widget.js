exports.create = function(args) {
	
	var tabsCtrl = require("/services/PagingControl/tabs");
	var OS_IOS = Titanium.Platform.osname != "android";
	
	localArgs = args;
	
	// fill undefined args with defaults
	if (localArgs.indicatorColor == null) {
		localArgs.indicatorColor = "#000";
	};
	if (localArgs.indicatorHeight == null) {
		localArgs.indicatorHeight = 5;
	};
	if (localArgs.top == null) {
		localArgs.top = 0;
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
	if (localArgs.scrollableViewHeight == null) {
		localArgs.scrollableViewHeight = Titanium.UI.FILL;
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
	if (localArgs.tabWidth == null) {
		localArgs.tabWidth = "80";
	};
	if (localArgs.labelsColor == null) {
		localArgs.labelsColor = "#000";
	};
	if (localArgs.highlightEffect == null) {
		localArgs.highlightEffect = false;
	};
	if (localArgs.shadowBar == null) {
		localArgs.shadowBar = true;
	};
	if (localArgs.font == null) {
		localArgs.font = {
	    	fontSize: "14dp",
	    	fontFamily: 'Roboto-Medium',
	    	fontWeight: "normal"
	    };
	};
	
	var iWidth,
	    indicator,
	    localArgs,
	    anterior = 0, 
		atual = 0;
	
	var scrollableView = Titanium.UI.createScrollableView({
		top: localArgs.top,
		backgroundColor: 'transparent',
		bubbleParent: false,
		cacheSize: 1,
		currentPage: 0,
		height: localArgs.scrollableViewHeight,
		overScrollMode: Titanium.UI.Android.OVER_SCROLL_NEVER,
		zIndex: 100
		//showPagingControl: true
	});
	
	var pagingcontrol = Titanium.UI.createScrollView({
		scrollType : 'horizontal',
		bubbleParent: false,
		scrollingEnabled: true,
		width : Ti.UI.FILL,
		contentWidth : 'auto',
		contentHeight : Ti.UI.FILL,
		showHorizontalScrollIndicator : false,
		showVerticalScrollIndicator : false,
		top: 0
	});
	
	function postLayout(callback) {
		pagingcontrol.addEventListener('postlayout', function onPostLayout(evt) {
			//Titanium.API.info('---------- PagingControl ScrollView PostLayout ----------');
			// callback
			callback();
	
			// remove eventlistener
			evt.source.removeEventListener('postlayout', onPostLayout);
		});
	}

	
	////Titanium.API.info(JSON.stringify(localArgs));
	
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
	
	// additional adjustments for tabs
	if (localArgs.hasTabs) {
		localArgs.tabProps = {
			dividerColor : localArgs.dividerColor,
			width : localArgs.tabWidth.toString()
		};
	}

	// apply properties of Ti.UI.View that can be applied to paging control view
	var propsArray = ["backgroundColor", "backgroundImage", "backgroundLeftCap", "backgroundRepeat", "backgroundTopCap", "borderRadius", "borderWidth", "bottom", "height", "horizontalWrap", "left", "opacity", "right", "visible", "width", "zIndex"];

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
			if(tempViewArray[v].title){
				titlesArray.push(tempViewArray[v].title.toUpperCase());
			}else{
				Titanium.API.error('A View de índice ' + v + ' não tem o atributo "title"');
			}
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
	
		if(localArgs.shadowBar){
			var shadowBar = Titanium.UI.createImageView({
				top: pagingcontrol.height,
				left: 0,
				right: 0,
				image: "/shadowBar.png",
				height: Titanium.UI.SIZE,
				touchEnabled: false
			});
			scrollableView.add(shadowBar);
		}
		
		// add tab select listener
		tabsCtrl.addEventListener('select', function(e) {
			
			//Titanium.API.info("============= EVENT ==============");
			////Titanium.API.info(JSON.stringify(e));
			//Titanium.API.info("============= EVENT ==============");
	
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
	
	// FUNCTIONS SECTIO ======================================================================
	/**
	 * Callback for scroll event
	 */
	function onScroll(e) {
		//Titanium.API.info("========== PagingControl ScrollableView Scroll ===========");
		
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
		    tabsWidth = tabsCtrl.getWidth,
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
		var totalWidth = localArgs.hasTabs ? tabsCtrl.getWidth : pagingcontrol.size.width;
		iWidth = Math.floor(totalWidth / scrollableView.views.length);
		indicator.setWidth(iWidth);
		indicator.setLeft(scrollableView.getCurrentPage() * iWidth);
	}
	
	scrollableView.cleanup = function() {
		scrollableView.setViews([]);
		scrollableView.removeAllChildren();
		localArgs.tabs && tabsCtrl && tabsCtrller.removeAllChildren();
	};
	
	return scrollableView;
};
