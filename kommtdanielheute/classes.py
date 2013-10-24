import sqlite3
from kommtdanielheute.helpers import query_db
import arrow

date_format = "%Y-%m-%d"

def get_forecast(days = 7):
	date = arrow.now()
	forecast = []
	for plus_day in xrange(days):
		day = Day( date.replace(days=plus_day).format('YYYY-MM-DD') )
		forecast.append(day)
	return forecast

class Day:
	def __init__(self, date):
		print date

		day = query_db('SELECT * FROM forecast WHERE date = ?', [date], one=True)
		if day:
			self.will_come = bool(day['will_come'])
			self.time = day['time']

			self.datetime = arrow.get( day['date']+' '+day['time']+'+02:00', 'YYYY-MM-DD HH:mmZZ')
		else:
			self.will_come = False
			self.datetime = arrow.get( date )
		return None

	def __str__(self):
		return self.will_come
	def __repr__(self):
		return self.__str__()

	def weekday(self):
		return self.datetime.isoweekday()