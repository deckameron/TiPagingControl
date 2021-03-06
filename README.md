# TiPagingControl

CommonJS Module for a page indication on ScrollableViews.

### The credits for this code goes entirely to [manumaticx](https://github.com/manumaticx)

This lib is a conversion of [pagingcontrol](https://github.com/manumaticx/pagingcontrol) into a non-Alloy javascript. I converted this code in order to help the developers who are not so familiarized with Titanium Alloy development.

![](https://github.com/manumaticx/pagingcontrol/blob/master/demo_android.gif)

## Quick Start

### Usage

Here's the complete example from the above gif:

`app.js`
```javascript
var pagingControl = require("/PagingControl/widget");

var window = Titanium.UI.createWindow({
	backgroundColor: "#fff",
    layout: "vertical"
});

var tabsProps = [
	{title: "Atlético MG", backgroundColor: "yellow"},
	{title: "Corinthinas", backgroundColor: "black"},
	{title: "São Paulo", backgroundColor: "red"}, 
	{title: "Cruzeiro", backgroundColor: "purple"}, 
	{title: "Grêmio", backgroundColor: "blue"}, 
	{title: "Palmeiras", backgroundColor: "yellow"}, 
	{title: "Flamengo", backgroundColor: "black"}
];

var tabs = [];

for(var i=0,j=tabsProps.length; i<j; i++){
	tabs.push(Titanium.UI.createView(tabsProps[i]));
};

var pg = pagingControl.create({
    top: 0,
    indicatorColor: "#09C",
    tabsColor: "#DEDEDE",
    dividerColor: "#CCC",
    labelsColor: "#000",
    //hasTabs: true,
    highlightEffect : true,
    shadowBar: true,
    tabs: tabs,
    tabWidth: "120",
    font:{
    	fontSize: "16dp",			// The font family or specific font to use.
    	fontFamily: "Robotto",		// Font size, in platform-dependent units. (pixels (px, pt, dp or dip, mm, in)
    	fontWeight: "bold" 			// Valid values are "bold" or "normal".
    },
    fancyScroll: true
});
window.add(pg);

window.open();
```

## API

#### Methods

* `create( )` - method to create the PagingControl

#### Properties

* `scrollableView` - reference the scrollableView
* `indicatorColor` - Color of the indicator
* `indicatorHeight` - Thickness the indicator
* `hasTabs` (Boolean) - wether to use tabs or only the indicator
* `tabWidth` - width of a tab
  * if not passed, a default tabWidth of a quarter of the total with is used
  * if `auto` is used, tabs will fit the width
* `tabsColor` - tabs background color
* `labelsColor` - color of the tabs labels,
* `font` - font properties of the tabs
* `tabs` - Views to be set as the ScrollableView views
* `dividerColor` - Color of the divider between the tabs
* `findScrollableView` - whether should widget is find scrollableView
* `fancyScroll` (Boolean) - when clicking on tab should generate a smooth or abrupt view change
* `highlightEffect` (Boolean) - highlights the current tab label
* `shadowBar` (Boolean) - if the widget should show a drop shadow under the Paging Control

#### Events

* `select` - lets you know when a tab was pressed and which one was
* `scroll` - fired repeatedly as the view is being scrolled
* `scrollend` - fired when the view has stopped moving completely

## License

    The MIT License (MIT)

    Copyright (c) 2014 Manuel Lehner

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
