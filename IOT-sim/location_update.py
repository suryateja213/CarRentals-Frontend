import requests
from random import choice, random
from time import sleep
import json

url = "http://127.0.0.1:3000/car/setlocation"
headers = {"Content-Type": "application/json"} 

latitude = 17.4477228
longitude = 78.3757079

cars = ["TS02DB1234", "AP00BG0517", "AP01BG0517", "TS12PQ1701", "TS12PQ5021", "TS12PQ1702", "TS12PQ5367", "TS12PQ5555", "TS12PQ5034", "TS12PQ5321", "TS12PQ5953", "TS12PQ5912"]

while True:
	latitude += random() * 0.001
	longitude += random() * 0.001
	data = {
		"car_no": choice(cars),
		"latitude": latitude,
		"longitude": longitude
	}
	r = requests.post(url, json=data, headers=headers)
	print(r.text)
	sleep(1)

