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
            opacity : args.highlightEffect ? 0.5 : 1
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
