
function validateAdmin() {
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3000/admin/isAdmin",
        headers: {
            'token': localStorage.getItem('token')
        },
        data: {},
        dataType: 'json',
        success: function (result) {

        },
        error: function (error) {
            alert(error)
            localStorage.clear()
            location.href = "login.html"
        }
    })
}

function getAllCars() {
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3000/admin/get-all-cars",
        headers: {
            'token': localStorage.getItem('token')
        },
        data: {},
        dataType: 'json',
        success: function (result) {
            console.log(result)
            createMap(result)
        },
        error: function (error) {
            alert(error)
            localStorage.clear()
            location.href = "login.html"
        }
    })
}

function createMap(clusters) {

    function dist(lat1, lon1, lat2, lon2) {
        let R = 6371
        let dLat = deg2rad(lat2 - lat1)
        let dLon = deg2rad(lon2 - lon1)
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        let d = R * c
        return d
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    function createRing(car_cache, car_no, map, lat, lng, radius, opacity) {
        let circle = L.circle([lat, lng], {
            color: 'green',
            fillColor: '#0f3',
            fillOpacity: opacity,
            radius: radius
        }).addTo(map);
        car_cache.set(car_no, circle)
    }

    function createMarker(car_cache, marker_no, map, lat, lng, no_of_cars) {
        let marker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: '../img/map-pin.png',
                iconSize: [50, 50],
                shadowSize: [50, 64],
                iconAnchor: [30, 60],
                shadowAnchor: [4, 62],
                popupAnchor: [-3, -76]
            })
        }).addTo(map).bindPopup("Contains " + no_of_cars + " cars in this area")
        car_cache.set(marker_no, marker)
    }

    let cars_cache = new Map()
    let map = L.map('map').setView([17.3850, 78.4867], 6)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    let heat_data = []

    for (let [index, cluster] of clusters.entries()) {
        let center_lat = 0, center_lng = 0
        for (let car of cluster) {
            center_lat += car.location[0]
            center_lng += car.location[1]
            createRing(cars_cache, car.car_no, map, car.location[0], car.location[1], 25, 0.5)
        }
        center_lat /= cluster.length
        center_lng /= cluster.length
        let d = 0
        for (let car of cluster) {
            d = Math.max(d, dist(car.location[0], car.location[1], center_lat, center_lng))
        }
        console.log(center_lat, center_lng, d * 1000)
        heat_data.push([center_lat, center_lng, d * 1000])
        createRing(cars_cache, 'cluster_' + index, map, center_lat, center_lng, d * 1000, 0.2)
        // createMarker(cars_cache, 'marker_' + index, map, center_lat, center_lng, cluster.length)
    }

    let heat = L.heatLayer(heat_data, { radius: 30 }).addTo(map);

}

$(document).ready(function () {
    if (localStorage.getItem('token') == undefined) {
        location.href = "login.html"
    } else {
        validateAdmin()
        getAllCars()
    }
})