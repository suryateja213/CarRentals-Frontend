// Admin view.js

var data = localStorage.getItem("single_car");
if (data == null) {
  data = localStorage.getItem("search_car");
}
const car = JSON.parse(data);

console.log("car in viewjs", car);

for (const book of car.booking) {
  $(".books").append(`
        <tr>
            <td>${book.from_time} / ${book.from_date}</td>
            <td>${book.to_time} / ${book.to_date}</td>
            <td>${book.user}</td>
        </tr>
    `);
}

$(document).ready(function () {
  $("#cardetails").append(`
    <div class="card" class="col-12">
    <img class="card-img-top" src="${car.car_picture}" alt="Card image cap" />
    <div class="card-body">
        <h5 class="card-title">Car No. ${car.car_no}</h5>
        <div class="d-flex">
            <div class="col-12">
              <div class="d-flex">
                <p class="col-6">Company: </p>
                <p class="col-6">${car.company} ${car.model}</p>
              </div>
              <div class="d-flex">
                <p class="col-6">Car Type: </p>
                <p class="col-6">${car.car_type}</p>
              </div>
              <div class="d-flex">
                <p class="col-6">Owner: </p>
                <p class="col-6">${car.owner}</p>
              </div>
              <div class="d-flex">
                <p class="col-6">Daily cost: </p>
                <p class="col-6">${car.price_per_day}</p>
              </div>
              <div class="d-flex">
                <p class="col-6">Hourly cost: </p>
                <p class="col-6">${car.price_per_hour}</p>
              </div>
              <div class="d-flex">
                <p class="col-6">Manifactured in: </p>
                <p class="col-6">${car.manifactured_year}</p>
              </div>
              <div class="d-flex">
                <p class="col-6">Distance Driven: </p>
                <p class="col-6">${car.driven_distance}</p>
              </div>
              <div class="d-flex">
                <p class="col-6">Transmission Type: </p>
                <p class="col-6">${car.transmision}</p>
              </div>
              <div class="d-flex">
                <p class="col-6">Seater Type: </p>
                <p class="col-6">${car.seater_type}</p>
              </div>
            </div>
        </div>
        
    </div>
  </div> 
        
        `);

  renderMap();
});

function renderMap() {
  console.log("rendering map");
  var map = L.map("map").setView([car.location[0], car.location[1]], 15);
  L.marker([car.location[0], car.location[1]])
    .bindPopup("Car is Here")
    .openPopup()
    .addTo(map);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}
