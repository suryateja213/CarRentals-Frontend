

function fetchData(data) {
    for (const [k, v] of Object.entries(data)) {
        if (v == "") {
            window.alert("please fill " + k + " field")
            return
        }
    }
    console.log(data)
    /**
     * Ajax code here
     */
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3000/admin/add-coupon",
        headers: {
            'token': localStorage.getItem('token')
        },
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (result) {
            console.log(result)
            if (result.errno != undefined) {
                alert("Coupon adding failed")
            } else {
                alert("Coupon added successfully")
            }
        }
    })
}


function submit() {
    const form = document.forms['coupon-form']
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


const button = document.querySelector("#submitCoupon")

button.addEventListener('click', submit) 
