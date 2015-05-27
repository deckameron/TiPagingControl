var pagingControl = require("/services/PagingControl/widget");

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
    hasTabs: true,
    tabs: tabs,
    font:{
    	fontSize: "16dp",		// The font family or specific font to use.
    	fontFamily: "Robotto",		// Font size, in platform-dependent units. (pixels (px, pt, dp or dip, mm, in)
    	fontWeight: "normal" 		// Valid values are "bold" or "normal".
    },
    tabWidth: "150"
});
window.add(pg);

window.open();
