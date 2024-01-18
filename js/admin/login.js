

function fetchData(data) {
    for (const [k, v] of Object.entries(data)) {
        if (v == "") {
            window.alert("please fill " + k + " field")
            return
        }
    }
    /**
     * Ajax code here
     */
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3000/admin/login",
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (result) {
            console.log(result)
            if (result.errno != undefined) {
                alert("Username or password incorrect")
            } else {
                localStorage.setItem("token", result.jwt)
                localStorage.setItem("_id", result._id)
                localStorage.setItem("email", result.email)
                localStorage.setItem("track", 'TS12PQ5912')
                location.href = "home.html"
            }
        }
    })
}


function submit() {
    const form = document.forms['login-form']
    const formData = new FormData(form)
    var data = {}
    for (const [k, v] of formData.entries()) {
        data[k] = v
    }
    /**
     * validate here 
     */
    fetchData(data)
}


const button = document.querySelector("#submitlogin")

button.addEventListener('click', submit) 
