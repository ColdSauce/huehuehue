#!/usr/bin/python
from flask import Flask, render_template
from phue import Bridge
app = Flask(__name__)
ip = '10.0.1.128'
b = Bridge(ip)
b.connect()

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/changeColor")
def changeColor():
    h = request.args.get('h')
    s = request.args.get('s')
    l = request.args.get('l')
    b.get_api()
    lights = b.get_light_objects()
    for light in lights:
        light.hue = h
        light.saturation = s
        light.luminosity = l
