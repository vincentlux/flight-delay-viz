#!/anaconda/envs/py36/bin/python3.6.5

# refer to https://github.com/yosiasz/d3-python-flask-mysql/
# https://github.com/adilmoujahid/DonorsChoose_Visualization/blob/master/app.py
from flask import Flask, jsonify, render_template, redirect, url_for, g, Response, request
from flask_cors import CORS
from flask_wtf import FlaskForm
from wtforms import StringField
from pymongo import MongoClient
from bson import json_util
from bson.json_util import dumps
import json
import pymysql
from . import passw

app = Flask(__name__)
app.secret_key = 'test_ajax'


DB_NAME = 'flight'
COLLECTION = 'flight2017'
# FIELDS = {'school_state': True, 'resource_type': True}

connection = MongoClient(passw.URI)
collection = connection[DB_NAME][COLLECTION]



class OurForm(FlaskForm):
    # define all forms here
    # right now only support type in manually
    orig_state = StringField('orig_state')
    orig_city = StringField('orig_city')

@app.route('/')
def home():
    form = OurForm()
    print("come to home")
    return render_template('flight.html', form=form)


@app.route('/region', methods=['post'])
def region():
    form = OurForm()

    if form.validate_on_submit():
        print(form.orig_state.data, form.orig_city.data)
        # test db connection
        data = collection.find({'OriginState': form.orig_state.data,'OriginCityName': form.orig_city.data}).limit(10)
        json_docs = []
        for one in data:
            json_doc = json.dumps(one, default=json_util.default)
            json_docs.append(json_doc)
        # return Response(data, status=200, mimetype='application/json')
        # return jsonify()
        return jsonify(json_docs)
    return jsonify(data=form.errors)




# @app.route("/flight", methods=['GET'])
# def flight():
#     g.cursor.execute('select id,ArrDelay from flight_2017 where OriginCityName = "Charlotte, NC" and DestCityName = "Phoenix, AZ" and DayOfMonth = "17"')
#     row_headers=[x[0] for x in g.cursor.description]
#     data = g.cursor.fetchall()  
#     json_data=[]
#     for item in data:
#         json_data.append(dict(zip(row_headers,item)))

#     data = json.dumps(json_data)
#     resp = Response(data, status=200, mimetype='application/json')
#     return resp





if __name__ == '__main__':
    app.run(debug=True)