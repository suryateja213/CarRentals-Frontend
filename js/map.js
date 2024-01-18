/**
 * 20.5937° N, 78.9629° E
 */


let call = true
let car_no = localStorage.getItem('car_no')

let loc = {
    lat: 20.5937, lng: 78.9629
}

let userl = {}
let user, pos

let n = 0

// let arr = []

let map, marker, user_marker, routeControl = null

function changeLocation(lat, lng, routeControl) {
    loc.lat = lat
    loc.lng = lng
    pos = new L.LatLng(lat, lng)
    routeControl.setWaypoints([
        pos,
        routeControl.options.waypoints[1],
    ])
    marker.setLatLng(pos)
}

function renderMap() {
    map = L.map('map').setView([loc.lat, loc.lng], 15)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        // attribution: `
        //     <div>
        //         <button onclick="focusIt()" id="focusIt"> 
        //             <img src="/home/sandeepkumar.b/project/CRT/img/target-icon.svg" />
        //         </button>
        //     </div>`
    }).addTo(map);
    let CarIcon = L.Icon.extend({
        options: {
            iconUrl: './img/car-pointer.jpg',
            iconSize: [60, 60],
            shadowSize: [50, 64],
            iconAnchor: [30, 60],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        }
    })
    marker = L.marker([loc.lat, loc.lng], {
        icon: new CarIcon()
    }).addTo(map).bindPopup("Your car is here")

    user_marker = L.marker([userl.lat, userl.lng]).addTo(map).bindPopup("You'er here")

    marker.setLatLng(pos)
    user_marker.setLatLng(user)

    if (routeControl != null) {
        map.removeControl(routeControl)
    }
    routeControl = L.Routing.control({
        waypoints: [
            pos,
            user
        ],
        createMarker: function (i, wp, nWps) {
            if (i == 0) {
                return marker
            } else {
                return user_marker
            }
        }
    }).on('routesfound', function (e) {

        if (call) {
            let arr = []
            for (const obj of e.routes[0].coordinates) {
                arr.push({ lat: obj.lat, lng: obj.lng })
            }
            $.ajax({
                type: 'POST',
                url: 'http://localhost:5000/',
                contentType: 'application/json',
                data: JSON.stringify({ car_no: car_no, points: arr }),
                dataType: 'json',
                success: function (result) {
                    console.log(result)
                }
            })
            call = false
        }

        // if (arr.length == 0) {
        //     for (const obj of e.routes[0].coordinates) {
        //         arr.push({ lat: obj.lat, lng: obj.lng })
        //     }
        // }
    }).addTo(map)
}

function focusIt() {

}

function getCoords(flag) {
    let car = localStorage.getItem('track')
    /**
     * Ajax code here
     */
    $.ajax({
        type: "GET",
        url: `http://127.0.0.1:3000/car/location/${car}`,
        headers: {
            token: localStorage.getItem('token')
        },
        success: function (coords) {
            if (coords.errno != undefined) {
                alert('car no found')
                location.href = './home.html'
            } else {
                console.log(coords)
                loc.lat = coords.location[0]
                loc.lng = coords.location[1]
                // changeLocation(coords.location[0], coords.location[1])
                if (flag) {
                    pos = new L.LatLng(loc.lat, loc.lng)
                    user = new L.LatLng(userl.lat, userl.lng)
                    renderMap()
                    setTimeout(simulateTravelling, 1500)
                }
            }
        }
    })
}

function simulateTravelling() {
    let socket = io('http://0.0.0.0:4000')
    socket.emit('connected', car_no)
    socket.on('loction', function (data) {
        console.log(data)
        changeLocation(data.latitude, data.longitude, routeControl)
    })
}

$(document).ready(function () {
    if (!localStorage.getItem("email")) {
        location.href("./login.html")
    }
    if (!localStorage.getItem("track")) {
        location.href("./profile.html")
    }
    $('#plate_no').text(localStorage.getItem("track"))
    navigator.geolocation
        .getCurrentPosition(function (data) {
            userl = {
                lat: data.coords.latitude,
                lng: data.coords.longitude
            }
            getCoords(true)
        });
})
