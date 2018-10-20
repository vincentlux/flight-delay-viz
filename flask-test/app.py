#!/anaconda/envs/py36/bin/python3.6.5
from flask import Flask, jsonify, render_template, redirect, url_for
from flask_cors import CORS
from flask import g
from flask import Response
from flask import request
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
                              db='scheduler')
  g.cursor = g.conn.cursor()




@app.after_request
def db_disconnect(response):
  g.cursor.close()
  g.conn.close()
  return response
  
@app.route('/')
def home():
  '''return render_template('index.html',  title = 'Projects')'''
  return redirect(url_for('static', filename='index.html'))

@app.route('/rooms', methods=['GET'])  
def rooms():
  g.cursor.execute('SELECT roomid, roomname from rooms')
  rooms = g.cursor.fetchall()
  return jsonify({'rooms': rooms.name})
	
@app.route("/names", methods=['GET'])
def names():
  g.cursor.execute('SELECT personid, firstname, lastname from persons')
  result = g.cursor.fetchall()
  data = json.dumps(result)
  resp = Response(data, status=200, mimetype='application/json')
  return resp

@app.route("/sales", methods=['GET'])
def sales():
  g.cursor.execute('select year,age,sex,people from sales')
  data = g.cursor.fetchall()  
  sales_list=[]
  for item in data:
    i = {
    'year':item[0],
    'age':item[1],
    'people':item[2]
    }
    sales_list.append(i)
  data = json.dumps(sales_list)
  resp = Response(data, status=200, mimetype='application/json')
  return resp
  '''return {'StatusCode':'200','Sales':sales_list}'''
  
if __name__ == '__main__':
    app.run(debug=True)
    
    '''  return jsonify(year=result[0],
                 age=result[1],
                 people=result[2])'''  