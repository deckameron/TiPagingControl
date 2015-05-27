var opts = {};
var tabWidth;
var OS_ANDROID = Titanium.Platform.osname == "android";

var tabs = Titanium.UI.createView({
	layout : "horizontal"
});

function getTabWidth() {
	var displayWidth = Ti.Platform.displayCaps.platformWidth,
	    orientation = Ti.Gesture.orientation;

	OS_ANDROID && (displayWidth /= Ti.Platform.displayCaps.logicalDensityFactor);

	if (orientation == Ti.UI.LANDSCAPE_LEFT || orientation == Ti.UI.LANDSCAPE_RIGHT) {
		return Math.floor(displayWidth / 7);
	} else {
		return Math.floor(displayWidth / 4);
	}
}

exports.init = function(args) {

	if (args) {
		Titanium.API.info(JSON.stringify(args));
		Titanium.API.info(args);
	}

	opts = args;

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
			color : "#000",
			text : args.titles[i],
			font : args.font
		}));

		(function(index) {
			t.addEventListener('click', function() {
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

	return tabs;
};

function getWidth() {
	return tabWidth * opts.titles.length + opts.titles.length;
};

exports.getWidth = getWidth;
