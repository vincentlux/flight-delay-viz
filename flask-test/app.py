#!/anaconda/envs/py36/bin/python3.6.5

# credit to https://github.com/yosiasz/d3-python-flask-mysql/
from flask import Flask, jsonify, render_template, redirect, url_for, g, Response, request
from flask_cors import CORS
import json
import pymysql
from . import passw

app = Flask(__name__)
CORS(app)
'''cors = CORS(app, resources={r"/*": {"origins": "*"}})'''



@app.before_request
def db_connect():
    g.conn = pymysql.Connect(host=passw.HOST,
                              user=passw.USER,
                              passwd=passw.PASS,
                              db='inls641-aws')
    g.cursor = g.conn.cursor()

@app.after_request
def db_disconnect(response):
    g.cursor.close()
    g.conn.close()
    return response
  
@app.route('/')
def home():
    '''return render_template('index.html',  title = 'Projects')'''
    return redirect(url_for('static', filename='flight.html'))


@app.route("/flight", methods=['GET'])
def flight():
    g.cursor.execute('select id,ArrDelay from flight_2017 where OriginCityName = "Charlotte, NC" and DestCityName = "Phoenix, AZ" and DayOfMonth = "17"')
    row_headers=[x[0] for x in g.cursor.description]
    data = g.cursor.fetchall()  
    json_data=[]
    for item in data:
        json_data.append(dict(zip(row_headers,item)))
        # i = {
        # 'Year':item[0],
        # 'Quarter':item[1],
        # 'Month':item[2],
        # 'DayOfMonth':item[3]
        # }
        # flight_list.append(i)
    data = json.dumps(json_data)
    resp = Response(data, status=200, mimetype='application/json')
    return resp


if __name__ == '__main__':
    app.run(debug=True)