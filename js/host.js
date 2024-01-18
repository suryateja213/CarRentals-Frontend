function PostData(data) {
    console.log(data)
    for (const [k, v] of Object.entries(data)) {
        if (v == "") {
            window.alert("please fill " + k + " field")
            return
        }
    }
    var user_data = localStorage.getItem("user_data")
    user_data = JSON.parse(user_data)
    data.owner = user_data._id
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
                location.href = "profile.html"
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
    var user_data = localStorage.getItem("user_data")
    if (!user_data) {
        location.href = "login.html"
        return
    }
    user_data = JSON.parse(user_data)
}

$(document).ready(function () {
    onLoad()
    window.onload = onLoad()
    window.blur = onLoad()
})
