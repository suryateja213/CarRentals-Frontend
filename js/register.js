function PostData(data) {
  console.log(data);
  for (const [k, v] of Object.entries(data)) {
    if (v == "") {
      window.alert("please fill " + k + " field");
      return;
    }
  }
  /**
   * Ajax code here
   */
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:3000/user/register",
    contentType: "application/json",
    data: JSON.stringify(data),
    dataType: "json",
    success: function (result) {
      console.log(result);
      if (result.errno != undefined) {
        alert("error while Registering or already Registered");
      } else {
        location.href = "login.html";
      }
    },
  });
}

function submit() {
  const form = document.forms["register-form"];
  const formData = new FormData(form);
  var data = {};
  for (const [k, v] of formData.entries()) {
    data[k] = v;
  }

  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  $(document).ready(function () {
    let name = $("#name").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let cpassword = $("#cpassword").val();
    let phone = $("#phone").val();

    if (name == "") {
      alert("Please enter your name");
    } else if (email == "" || !isEmail(email)) {
      alert("Please enter valid email");
    } else if (password == "" || password.length < 6) {
      alert("! password length > 6");
    } else if (!cpassword === password) {
      alert("password not match");
    } else if (phone == "" || phone.length != 10) {
      alert("Please enter valid phone number");
    }
  });
  /**
   * validate here
   */
  PostData(data);
}

const button = document.querySelector("#submitRegister");

button.addEventListener("click", submit);

window.onload = () => localStorage.clear();
