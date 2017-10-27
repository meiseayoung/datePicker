require.config({
	map: {
		'*': {
			'css': 'require-css/css',
			'text':'require-text/text'
		}
	}
});
require(["DatePicker"], function(DatePicker) {
	var date = document.getElementById("date");
	var date2 = document.getElementById("date2");
	dp = new DatePicker({
		renderTo: date,
		value: new Date().format("YYYY/MM/DD"),
		editable: false,
		splitSymbol: "/",
		lang: "cn"
	});
	dp2 = new DatePicker({
		renderTo: date2,
		value: new Date().format("YYYY/MM/DD"),
		interval: 301,
		editable: false,
		lang: "en"
	});
})