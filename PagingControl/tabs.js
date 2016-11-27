exports.init = function(args) {
     
    var opts = {};
    var tabWidth;
    var OS_ANDROID = Titanium.Platform.osname == "android";
     
    var tabs = Titanium.UI.createView({
        layout : "horizontal"
    });
     
    if (args) {
        Titanium.API.info(JSON.stringify(args));
        Titanium.API.info(args);
    }
 
    opts = args;
     
    if (args.tabs.width === 'auto'){
        args.tabs.width = getTabWidth(args.titles.length);
    }
 
    tabWidth = args.tabs.width || getTabWidth();
 
    if ( typeof tabWidth == "string" && tabWidth.indexOf('%') > 0) {
        var newWidth = parseInt(tabWidth.slice(0, tabWidth.indexOf('%'))) / 100;
 
        if (OS_ANDROID) {
            newWidth /= Ti.Platform.displayCaps.logicalDensityFactor;
        };
 
        tabWidth = newWidth * Ti.Platform.displayCaps.platformWidth;
    }
 
    tabs.applyProperties({
        left : 0,
        width : getWidth(),
        height : Ti.UI.FILL
    });
 
    for ( i = 0; i < args.titles.length; i++) {
         
        var t = Ti.UI.createView({
            width : tabWidth,
            height : Ti.UI.FILL
        });
 
        t.add(Ti.UI.createLabel({
            text : args.titles[i],
            font : args.font,
            color : args.labelsColor,
            opacity : args.highlightEffect ? 0.5 : 1,
            touchEnabled : false
        }));
 
        (function(index) {
            t.addEventListener('click', function(e) {
                RippleEffect(e);
                var view = this;
                tabs.fireEvent('select', {
                    tab : index,
                    view : view
                });
            });
        })(i);
 
        tabs.add(t);
 
        if (i < args.titles.length - 1) {
            // add divider
            tabs.add(Ti.UI.createView({
                backgroundColor : args.tabs.dividerColor,
                height : 32,
                width : 1
            }));
        }
    }
     
    function getTabWidth(num) {
        var displayWidth = Ti.Platform.displayCaps.platformWidth,
            orientation = Ti.Gesture.orientation,
            denominator,
            width;
     
        OS_ANDROID && (displayWidth /= Ti.Platform.displayCaps.logicalDensityFactor);
     
        // there is more space in landscape, so we show more tabs then
        if (orientation == Ti.UI.LANDSCAPE_LEFT || orientation == Ti.UI.LANDSCAPE_RIGHT) {
            denominator = num || 7;
        } else {
            denominator = num || 4;
        }
     
        width = Math.floor(displayWidth / denominator);
     
        return width;
    }
     
    tabs.getWidth = getWidth();
     
    function getWidth() {
        return tabWidth * opts.titles.length + opts.titles.length;
    };
 
    return tabs;
};

function RippleEffect(e) {

	var OS_IOS = Titanium.Platform.osname != 'android';
	var _x = (OS_IOS || e.dp) ? e.x : (e.x / Ti.Platform.displayCaps.logicalDensityFactor);
	var _y = (OS_IOS || e.dp) ? e.y : (e.y / Ti.Platform.displayCaps.logicalDensityFactor);

	// Max & Min value from Width and Height of our clicked view.
	// This way we can make the circle big enough to fit the view.
	var maxHeightWidth = Math.max(e.source.rect.width, e.source.rect.height);
	var minHeightWidth = Math.min(e.source.rect.width, e.source.rect.height);

	// Our circle that will be scaled up using 2dMartix.
	var ripple = Titanium.UI.createView({
		borderRadius : minHeightWidth / 2,
		height : minHeightWidth,
		width : minHeightWidth,
		center : {
			x : _x,
			y : _y
		},
		backgroundColor : "#FFFFFF",
		zIndex : 999,
		opacity : 0,
		touchEnabled : false
	});
	// Add the ripple view inside the clicked view
	e.source.add(ripple);

	// Use chainAnimate to sequence the animation steps.
	// We'll position the view at the center of the click position, by using the center property).
	var anim_1 = Titanium.UI.createAnimation({
		center : {
			x : _x,
			y : _y
		},
		duration : 0,
		opacity : 0.3,
		transform : Ti.UI.create2DMatrix().scale(20 / maxHeightWidth)
	});

	anim_1.addEventListener('complete', function() {
		ripple.animate(anim_2);
	});

	var anim_2 = Titanium.UI.createAnimation({
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN,
		duration : 300,
		opacity : 0.0,
		transform : Ti.UI.create2DMatrix().scale((maxHeightWidth * 2) / minHeightWidth)
	});

	anim_2.addEventListener('complete', function() {
		ripple.animate(anim_3);
	});

	var anim_3 = Titanium.UI.createAnimation({
		opacity : 0.0,
		duration : 100,
		curve : Ti.UI.ANIMATION_CURVE_LINEAR
	});

	anim_3.addEventListener('complete', function() {
		e.source.remove(ripple);
	});

	ripple.animate(anim_1);
};
