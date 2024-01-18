function PostData(data) {
    console.log(data)
    for (const [k, v] of Object.entries(data)) {
        if (v == "") {
            window.alert("please fill " + k + " field")
            return
        }
    }
    data.owner = localStorage.getItem("_id")
    /**
     * Ajax code here
     */
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3000/car/addcar",
        headers: {
            'token': localStorage.getItem('token'),
        },
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (result) {
            console.log(result)
            if (result.errno != undefined) {
                alert("Car Not Registered")
            } else {
                location.href = "gallery.html"
            }
        }
    })
}


function submit() {
    const form = document.forms['car-form']
    const formData = new FormData(form)
    var data = {}
    for (const [k, v] of formData.entries()) {
        data[k] = v
    }
    /**
     * validate here 
     */
    PostData(data)
}


const button = document.querySelector("#submitCar")

button.addEventListener('click', submit)

function onLoad() {
    if (localStorage.getItem('token') == undefined) {
        location.href = "login.html"
        return
    }
}

$(document).ready(function () {
    onLoad()
    window.onload = onLoad()
    window.blur = onLoad()
})
