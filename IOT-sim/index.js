
const express = require('express');
const socket = require('socket.io-client')('http://localhost:4000');
const cors = require('cors')
const body_parser = require('body-parser')

const app = express();
app.use(body_parser({limit: '5mb'}));
// app.use(express.json());
app.use(cors());

let arr = [], n = 0, car, i = 0;

app.post('/', async (req, res) => {
    car = req.body.car_no
    arr = req.body.points 
    n = arr.length
    console.log('hello')
    res.send('Hello')
})

socket.on('connect', function () {
    console.log('connected');
    setInterval(() => {
        if (arr.length > 0) {
            socket.emit('change', car, arr[i % n].lat, arr[i % n].lng);
            i++
        }
    }, 1000)
});

app.listen(6000);
