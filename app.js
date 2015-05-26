var pagingControl = require("/widget");

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
	Titanium.API.info("=====================================");
	tabs.push(Titanium.UI.createView(tabsProps[i]));
};

var pg = pagingControl.init({
    top: 0,
    indicatorColor: "#09C",
    hasTabs: true,
    tabs: tabs,
    //tabWidth: 60
});
window.add(pg);

window.open();
