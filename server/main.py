#!/usr/bin/python
from flask import Flask, render_template, request
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
    h = int(request.args.get('h'))
    s = int(request.args.get('s'))
    l = int(request.args.get('l'))
    b.get_api()
    lights = b.get_light_objects()
    filteredLights = filter(lambda a : a.name != 'Bedside lamp', lights)
    for light in filteredLights:
        light.hue = h
        light.saturation = s
        light.brightness = l
    return "ayy lmao"

@app.route("/changeColorXY")
def changeColorXY():
    x = float(request.args.get('x'))
    y = float(request.args.get('y'))
    l = int(request.args.get('l'))
    b.get_api()
    lights = b.get_light_objects()
    filteredLights = filter(lambda a : a.name != 'Bedside lamp', lights)
    for light in filteredLights:
        light.brightness = l
        light.xy = [x,y]
    return "ayy lmaoyyy"
