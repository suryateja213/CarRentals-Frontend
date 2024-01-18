var stop = false

function track(id) {
	id = id.split('-')[0]
	localStorage.setItem('track', id)
	location.href = './map.html'
}

function display(id) {
	window.scrollTo(0, 0);
	$(".togg").hide();
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:3000/car/view",
		headers: {
            'token': localStorage.getItem('token'),
        },
		contentType: "application/json",
		data: JSON.stringify({ car_no: id }),
		dataType: "json",
		success: function (result) {
			console.log(result)
			let html = `
				<div style="height: 200px; display:flex; justify-content: space-between">
					<div>
						<h3>Car No. ${id}</h3>
						<h6>Car Company: ${result.company}</h6>	
						<h6>Car Model: ${result.model}</h6>	
					</div>
					<img class="h-100" src="${result.car_picture}"></img>
				</div>
				<ul>
			`
			for (const book of result.booking) {
				html += `
					<li >
						<h4>Booking</h4>
						<div style="display: flex">
							<div class="col-1"></div>
							<div class="col-3">
								<p>email: </p>
								<p>From: </p>
								<p>To: </p>
							</div>
							<div class="col-8">
								<p>${book.email}</p>
								<p>${book.from_time + ' / ' + book.from_date}</p>
								<p>${book.to_time + ' / ' + book.to_date}</p>
							</div>
						</div>
					</li>
				`
			}
			html += '</ul>'
			$(".togg").html(html);
			if (!result.booking.length) {
				$(".togg").html('<h4  style="text-align: center">No bookings</h4>');
			}
			$(".togg").toggle(1000);
		},
	})
}

function bookDisplay(id) {
	window.scrollTo(0, 0);
	$(".togg").hide();
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:3000/car/view",
		headers: {
            'token': localStorage.getItem('token'),
        },
		contentType: "application/json",
		data: JSON.stringify({ car_no: id }),
		dataType: "json",
		success: function (result) {
			console.log(result)
			$(".togg").html(`
				<div style="height: 200px; display:flex; justify-content: space-between">
					<div>
						<h3>Car No. ${id}</h3>	
					</div>
					<img class="h-100" src="${result.car_picture}"></img>
				</div>
				<div class="det">
					<ul>
						<li>
							<h4 class="col-11">Details</h4>
						</li>
					</ul>		
					<div style="display: flex">
						<div class="col-1"></div>
						<div class="col-5">
							<p>name: </p>
							<p>price per day: </p>
							<p>price per hour: </p>
							<p>Seater Type: </p>
							<p>Manifactured year: </p>
						</div>
						<div class="col-6">
							<p>${result.company} ${result.model}</p>
							<p>${result.price_per_day}</p>
							<p>${result.price_per_hour}</p>
							<p>${result.seater_type}</p>
							<p>${result.manifactured_year}</p>
						</div>
					</div>
				</div>
			`);
			// if (!result.booking.length) {
			// 	$(".togg").html('<h4  style="text-align: center">No bookings</h4>');
			// }
			$(".togg").toggle(1000);
		},
	})
}

function find_loc(id) {
	console.log(id)
}

function PostData() {
	data = {}
	if (stop) {
		return
	}
	setTimeout(1000, () => {
		stop = false
	})
	stop = true
	var user_data = localStorage.getItem("user_data");
	user_data = JSON.parse(user_data);
	data._id = user_data._id;
	/**
	 * Ajax code here
	 */
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:3000/user/cars",
		headers: {
            'token': localStorage.getItem('token'),
        },
		contentType: "application/json",
		data: JSON.stringify(data),
		dataType: "json",
		success: function (result) {
			console.log(result);
			if (result.errno != undefined) {
				alert("Invalid User");
			} else {
				// location.href = "login.html"
				$(".car-tab").empty();
				for (const car of result.host) {
					$('.car-tab').append(`
						<div class="grid-item py-5">
							<div class="card" style="width: 22rem;">
								<div class="card-body mgreen">
									<h5 class="card-title my-3">${car.company + " " + car.model}</h5>
									<p class="card-text">Car No. ${car.car_no}</p>
									<p class="card-text">This month bookings ${car.used_this_month}</p>
									<div class="my-3" style="display: flex; justify-content: space-around">
										<button class="btn btn-primary round" onclick=display('${car.car_no}')>Show</button>
										<button class="btn btn-primary round" onclick=track('${car.car_no}')>Track</button>
									</div>
								</div>
							</div>
						</div>
					`)
				}
				$(".car-book").empty();
				for (const car of result.car_booked) {
					$(".car-book").append(`
						<div class="grid-item py-5">
							<div class="card" style="width: 22rem;">
								<div class="card-body mgreen">
									<h5 class="card-title my-3">Car No. ${car.car_no}</h5>
									<p class="card-text">Booked from: ${car.from_time + " / " + car.from_date}</p>
									<p class="card-text">Booked to: ${car.to_time + " / " + car.to_date}</p>
									<div class="my-3" style="display: flex; justify-content: space-around">
										<button class="btn btn-primary round" onclick=bookDisplay('${car.car_no}')>Show</button>
										<button class="btn btn-primary round" onclick=track('${car.car_no}')>Track</button>
									</div>
								</div>
							</div>
						</div>
					`)
				}
			}
		},
	});
	var email = localStorage.getItem('email')
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:3000/user/profile",
		headers: {
            'token': localStorage.getItem('token'),
        },
		contentType: "application/json",
		data: JSON.stringify({ email: email }),
		dataType: "json",
		success: function (result) {
			$("#picture").attr("src", result.picture)
		},
	})
}

function onLoad() {
	var user_data = localStorage.getItem("user_data");
	if (!user_data) {
		location.href = "login.html";
		return;
	}
	PostData();
}

function changeProfile() {
	$("#submit_pic").click(function () {
		var formData = new FormData()
		console.log($('#pro-pic')[0].files[0])
		formData.append('profile_picture', $('#pro-pic')[0].files[0])
		formData.append('email', localStorage.getItem('email'))
		console.log(formData)
		$.ajax({
			type: "POST",
			url: "http://127.0.0.1:3000/user/upload",
			headers: {
				'token': localStorage.getItem('token'),
			},
			contentType: false,
			processData: false,
			data: formData,
			success: function (result) {
				console.log(result)
				location.reload()
			},
		})
	})
}

$(document).ready(function () {
	onLoad();
	window.onload = onLoad();
	window.blur = onLoad();
	changeProfile()
});
