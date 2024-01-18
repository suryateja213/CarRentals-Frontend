
$(document).ready(function () {
    function onLoad() {
        var new_loc = localStorage.getItem('location')
        $("#user_location").text(new_loc ? new_loc : "Select Location")
        var user_data = localStorage.getItem("user_data")
        var email = localStorage.getItem("email")
        if (email == undefined) {
            return
        }
        user_data = JSON.parse(user_data)
        $("#n-user-name").text(user_data.name)
        $("#login-logout").text("Logout")
    }
    window.onload = onLoad()
    window.blur = onLoad()
    $("#login-logout").click(function () {
        localStorage.clear()
        location.href = "home.html"
    })
})

