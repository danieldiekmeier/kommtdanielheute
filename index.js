var express = require('express')
var app = express()
var swig = require('swig')
var ical = require('ical')
var moment = require('moment')

var config = require('./config.json')

app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', __dirname + '/templates')
app.set('view cache', false)
swig.setDefaults({ cache: false })

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {

  var url = config.users[config.default].url
  get_days(url, config.default, res)

})

app.get('/:name', function (req, res) {

  var name = req.params.name

  if (config.users.hasOwnProperty(name)) {
    var url = config.users[name].url
    get_days(url, name, res)
  } else {
    res.send('404')
  }

})

function getDatetime(dateString) {
  if (dateString.indexOf('":') !== -1) {
    dateString = dateString.split('":')[1]
  }
  return moment(dateString, 'YYYYMMDDTHHmmss')
}

function get_days(url, name, res) {
  var days = {}
  var next = moment()
  var end = next.clone().add(1, 'months')
  while (next <= end) {
    var currentDate = next.clone()
    days[currentDate.format('YYYY-MM-DD')] = {
      moment: currentDate
    }
    next.add(1, 'days')
  }


  ical.fromURL(url, {}, function(err, data) {
    for (var k in data) {
      if (data.hasOwnProperty(k)) {
        var ev = data[k]
        if (ev.type == 'VEVENT') {
          var startMoment = getDatetime(ev.start)
          var endMoment = getDatetime(ev.end)
          var key = startMoment.format('YYYY-MM-DD')

          if (key in days) {
            days[key].left = (startMoment.hour() + (startMoment.minute() / 60) - 9) / 9 * 100
            days[key].right = -((endMoment.hour() + (endMoment.minute() / 60) - 18) / 9 * 100)

            days[key].start = startMoment
            days[key].end = endMoment
          }
        }

      }
    }

    res.render('index', { url: url, name: name, days: days })
  })
}


var server = app.listen(63203, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('App listening at http://%s:%s', host, port)

})
