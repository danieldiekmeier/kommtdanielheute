# -*- coding: utf-8 -*-

from kommtdanielheute import app

from flask import session, redirect, url_for, g, render_template
from functools import wraps

from contextlib import closing # for database-things

import sqlite3

@app.errorhandler(404)
def page_not_found(e):
	return render_template('404.html'), 404

def query_db(query, args=(), one=False):
	cur = g.db.execute(query, args)
	rv = [dict((cur.description[idx][0], value) for idx, value in enumerate(row)) for row in cur.fetchall()]
	return (rv[0] if rv else None) if one else rv

def connect_db():
	return sqlite3.connect(app.config['DATABASE'])

def init_db():
	with closing(connect_db()) as db:
		with app.open_resource('schema.sql') as f:
			db.cursor().executescript(f.read())
		db.commit()

def add_line(s, key, line):
	return s + '\n' + key + " = u'" + unicode(line) + "'"