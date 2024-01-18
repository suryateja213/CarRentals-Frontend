function view(car_no) {
  localStorage.setItem("car_no", car_no);
  location.href = "view.html";
}

function onLoad({ latitude, longitude, kms }) {
  /**
   * Ajax code here
   */
  let data = {
    latitude: latitude,
    longitude: longitude,
    kms: kms,
  };
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:3000/car/nearby",
    headers: {
      token: localStorage.getItem("token"),
    },
    contentType: "application/json",
    data: JSON.stringify(data),
    dataType: "json",
    success: function (result) {
      card_cars = result;
      if (result.errno != undefined) {
        alert("No cars avaliable");
      } else {
        rearrangeArray();
        console.log(result);
      }
    },
  });
}

function loadCars(value) {
  var email = localStorage.getItem("email");
  console.log(email);
  if (email == undefined) {
    location.href = "login.html";
  }
  $("#display-km").text(value);
  navigator.geolocation.getCurrentPosition(function (data) {
    data.coords.kms = +value;
    onLoad(data.coords);
  });
}

let filter_attributes = new Map();

let card_cars = [];
let display_cars = [];
let hour_cost = 300;

function setHourCost(value) {
  hour_cost = +value;
  $(".hour-cost").text(hour_cost);
  rearrangeArray();
}

function rearrangeArray() {
  let filters = [];
  for (const [key, val] of filter_attributes.entries()) {
    filters.push([key, val]);
  }
  display_cars = [];
  for (const car of card_cars) {
    let flag = true;
    for (const i of filters) {
      if (car[i[0]] != i[1]) {
        flag = false;
        break;
      }
    }
    if (flag && car.price_per_hour <= hour_cost) display_cars.push(car);
  }
  console.log(display_cars.length);
  $("#cars-ava").text(display_cars.length);
  setCardCars(display_cars);
}

$(".fil-btn").click(function () {
  let name = $(this).attr("name");
  let [key, value] = [name, $(this).val()];
  $(`.${key}`).css("color", "#666666");
  $(`.${key}`).css("background-color", "#FFFFFF");
  if (filter_attributes.has(key) && filter_attributes.get(key) == value) {
    filter_attributes.delete(key);
    $(this).css("color", "#666666");
  } else {
    filter_attributes.set(key, value);
    $(this).css("color", "white");
    $(this).css("background-color", "green");
  }
  console.log(filter_attributes);
  rearrangeArray();
});

$(".sort-btn").click(function () {
  let mult = 1,
    key = $(this).val();
  if (key == "price_per_day") {
    mult = $(this).attr("id") == "asc" ? 1 : -1;
  }
  card_cars.sort((a, b) => (a[key] - b[key]) * mult);
  rearrangeArray();
});

function setCardCars(cars) {
  $(".card-cars").empty();
  for (const car of cars) {
    $(".card-cars").append(`
      <div class="col-lg-3 col-md-5 col-10 py-5 mx-5">
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
              <button class="btn btn-primary" onclick="view('${car.car_no}')">View Car</button>
          </div>
        </div>
      </div>
    `);
  }
}

$(document).ready(function () {
  loadCars(15);
  $("#sidecostinput").change(function () {
    mainfilter();
  });
});
