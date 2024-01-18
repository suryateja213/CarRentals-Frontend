button_list = document.getElementsByClassName("location_button");
for (let ind = 0; ind < button_list.length; ind++) {
    const location_button = button_list[ind]
    location_button.addEventListener("click", function (event) {
        location_value = location_button.getAttribute('Value');
        localStorage.setItem('location', `${location_value}`)
        var new_loc = localStorage.getItem('location')
        let user_loc = document.getElementById("user_location")
        user_loc.innerText = new_loc
        location.href = "home.html"
    });
}


function isValidLocation(event) {
    const input = document.querySelector("#city")
    const city_name = input.value
    console.log(city_name)
    /**
     * Ajax code here
     */
    localStorage.setItem("city", city_name)
    location.href = 'home.html'
}

function displayNames(value) {
    input_bar.value = value
    localStorage.setItem("location",`${value}`)
    removeElements()
}

function removeElements() {
    let items = document.querySelectorAll(".list-items")
    items.forEach((item) => {
        item.remove()
    })
}

function getSuggestions(event) {
    removeElements()
    if (event.target.value.length < 1) {
        return
    }
    /**
     * Ajax code here
     */
    let cities_unordered = [
        "Visakhapatnam",
        "Vijayawada",
        "Guntur",
        "Nellore",
        "Rajamahendravaram",
        "Kurnool",
        "Kakinada",
        "Tirupati",
        "Kadapa",
        "Eluru",
        "Vizianagaram",
        "Anantapur",
        "Nandyal",
        "Ongole",
        "Adoni",
        "Madanapalle",
        "Machilipatnam",
        "Tenali",
        "Proddatur",
        "Chittoor",
        "Hindupur",
        "Srikakulam",
        "Bhimavaram",
        "Tadepalligudem",
        "Guntakal",
        "Dharmavaram",
        "Gudivada",
        "Narasaraopet",
        "Kadiri",
        "Tadipatri",
        "Mangalagiri",
        "Chilakaluripet",
    ]
    let cities = cities_unordered.sort()
    let val = event.target.value
    const list = document.querySelector(".list")
    for (let city of cities) {
        if (city.toLowerCase().startsWith(val.toLowerCase())) {
            let listItem = document.createElement("li")
            listItem.classList.add("list-items")
            listItem.style.cursor = "pointer"
            listItem.setAttribute("onclick", `displayNames('${city}')`)
            let word = "<b>" + city.slice(0, val.length) + "</b>" + city.slice(val.length)
            listItem.innerHTML = word
            list.appendChild(listItem)
        }
    }
}

const set_button = document.querySelector("#submitlocation")
const input_bar = document.querySelector("#city")

set_button.addEventListener("click", isValidLocation)
input_bar.addEventListener("keyup", getSuggestions)

$(document).ready(function () {
    $(".location_button").hover(function () {
        console.log("hover")
        console.log($(this))
    })
    $(".location_button").mouseleave(function() {
        console.log("mouse leave")

    })
})