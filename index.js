var express = require('express');
var app = express();
var swig = require('swig');
var ical = require('ical');
var moment = require('moment');

var url = 'https://www.google.com/calendar/ical/5lbbqnn4nejdarbi983749jv10%40group.calendar.google.com/public/basic.ics';


app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {

	var days = {};
	var next = moment();
	var end = next.clone().add(1, 'months');
	while (next <= end) {
		var currentDate = next.clone();
		days[currentDate.format('YYYY-MM-DD')] = {
			moment: currentDate
		};
		next.add(1, 'days');
	}


	ical.fromURL(url, {}, function(err, data) {
		for (var k in data) {
			if (data.hasOwnProperty(k)) {
				var ev = data[k];
				var startMoment = moment(ev.start);
				var endMoment = moment(ev.end);
				var key = startMoment.format('YYYY-MM-DD');

				days[key].left = (startMoment.hour() + (startMoment.minute() / 60) - 9) / 9 * 100;
				days[key].right = -((endMoment.hour() + (endMoment.minute() / 60) - 18) / 9 * 100);

				days[key].start = startMoment;
				days[key].end = endMoment;
			}
		}

		res.render('index', { days: days });
	});

});


var server = app.listen(63203, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);

});
