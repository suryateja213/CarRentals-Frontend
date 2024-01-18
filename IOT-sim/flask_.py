from flask import request, Flask
from flask_cors import CORS
from time import sleep
import json
import socketio

app = Flask(__name__)
CORS(app)

def simulate(data):
	sio = socketio.Client()
	sio.connect('http://localhost:4000')
	sio.emit('change', 'AP00BG0517', '17', '23')
	# ws = create_connection("ws://localhost:4000/")


@app.route('/', methods=['GET', 'POST'])
def hello():
	# file_ = open('data.json', 'w')
	# file_.write(json.dumps(request.get_json()))
	# file_.close()
	data = request.get_json()
	print(len(data["points"]))
	simulate(data)
	return "Hello"

simulate({})

if __name__ == '__main__':
	app.run(debug=True)

