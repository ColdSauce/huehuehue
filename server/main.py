#!/usr/bin/python

from phue import Bridge
import time
import random
ip = '10.0.1.128'
b = Bridge(ip)

# Get the bridge state (This returns the full dictionary that you can explore)
b.get_api()

#If running for the first time, press button on bridge and run with b.connect() uncommented
#b.connect()

lights = b.get_light_objects()

for light in lights:
    # make everything read
    light.hue = 0
