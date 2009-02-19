/* -- Variables -- */

// username of the intended target
var user = '';

// skeleton structure for json data
var data = {
	"bg_colour": "#ffffff",
	"elements":[
	{
		"type": 		"pie",
		"colours":[
		"#ff0000",
		"#ffcc33",
		"#ffff00",
		"#00ff00",
		"#0000ff",
		"#00ffff",
		"#9933cc"
		],
		"border": 		2,
		"start-angle": 	90,
		"animate": 		true,
		"label-colour": "#432baf",
		"alpha": 		0.75,
		"tip": 			"#label#\nWatchers: #val#",
		"no-labels": 	true,
		"values": 		[]
	}
	]
};

/* -- OFC 2 -- */

// load data from json string
function open_flash_chart_data() {
	return JSON.stringify(data);
}

function findSWF(movieName) {
	if (navigator.appName.indexOf("Microsoft")!= -1) {
		return window[movieName];
	} else {
		return document[movieName];
	}
}

/* -- Functions -- */
// retrieves data from github's api
function githotness(u) {
	user = u;

	$.getJSON("http://github.com/api/v1/json/" + user + "?callback=?", function(json) {
		var githotness = 0;
		$.each(json.user.repositories, function(i) {

			// creates a new object to store number of watchers, name of repo, and url
			var val = new Object;
			val['value'] = this.watchers;
			val['label'] = this.name;
			val['on-click'] = this.url;

			githotness += this.watchers;

			// add to the original json data
			data['elements'][0]['values'][i] = val;
		});

		$("#git-hotness").fadeOut("slow", function() {
			$(this).html("<span class=\"big\">Ohh, the git-hotness of " + user + ".. <span class=\"highlight\">" + githotness + "</span></span>").fadeIn("slow");
			$("#stupid-me").hide();
			$("#try-again").fadeIn("slow");
		});

		$("#git-chart").show();

		// load the chart
		tmp = findSWF("git-chart");
		x = tmp.load(JSON.stringify(data));
	});
}

// bind enter key
$(document).ready(function() {
	$("#git-user").bind("keypress", function(e) {
		if (e.keyCode == 13) {
			$("#git-hotness").fadeOut("slow", function() {
				var gituser = $("#git-user").val();
				githotness(gituser);
				
				$(this).html("<span class=\"big\">Now checking the git-hotness of <span class=\"highlight\">" + gituser + "</span>...</span>").fadeIn("slow");
				$("#stupid-me").fadeIn(7000);
			});
		}
	});
});