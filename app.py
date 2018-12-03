from flask import Flask, jsonify, render_template, redirect, url_for, g, Response, request
from flask_cors import CORS
from flask_wtf import FlaskForm
from wtforms import StringField
from pymongo import MongoClient
from bson import json_util
from bson.json_util import dumps
import json
# import pymysql
import os

app = Flask(__name__)
app.secret_key = 'todo'
CORS(app)

DB_NAME = 'flight'
# docker run -e URI=test <image-name>
connection = MongoClient("mongodb://account-db:password@ip-address:27017")


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/reasons')
def reasons():
    return render_template('reasons.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/router', methods=['POST'])
def router():
    COLLECTION = 'HeatMapDataV2'
    collection = connection[DB_NAME][COLLECTION]

    origin = request.json["departure_airport"]
    dest = request.json["arrival_airport"]
    data = collection.find({'Origin':origin ,'Dest': dest}, {'_id':0})
    
    json_docs = []
    for one in data:

        json_doc = json.dumps(one, default=json_util.default)
        json_doc = eval(json_doc)
        json_docs.append(json_doc)
    return jsonify(json_docs)


# Add linechart here
@app.route('/fakeline', methods=['POST'])
def fakeline():
    year = request.json["year"]
    carrier = request.json["carrier"]
    json_docs = [{"year":year}, {"carrier": carrier}]

    return jsonify(json_docs)


    


# Send json file for dynamic dropdown
@app.route('/send')
def send():
    return "<a href=%s>file</a>" % url_for('static', filename='StateCityCode.json')

@app.route('/sendline')
def sendline():
    return "<a href=%s>file</a>" % url_for('static', filename='LineChart.json')


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)