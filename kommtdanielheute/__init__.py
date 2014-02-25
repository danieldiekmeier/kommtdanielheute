# -*- coding: utf-8 -*-

from flask import Flask, request, session, g, redirect, abort, render_template, flash, jsonify
from flask import url_for as flask_url_for
import sqlite3, datetime
from contextlib import closing # for database-things

import os

import arrow # for datetime-things

# create our little application
app = Flask(__name__)

app.config.from_pyfile('config.py')

from kommtdanielheute.helpers import *
from kommtdanielheute.classes import *

app.create_jinja_environment()

def url_for(endpoint, **values):
	return app.config['APPLICATION_ROOT'] + flask_url_for(endpoint, **values)

app.jinja_env.globals.update(url_for=url_for)

def connect_db():
	return sqlite3.connect(app.config['DATABASE'])

@app.before_request
def before_request():
	g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
	g.db.close()

# VIEWS

@app.route("/")
def index():
	forecast = get_forecast()

	now = arrow.now()

	return render_template('index.html', forecast=forecast, now=now)
