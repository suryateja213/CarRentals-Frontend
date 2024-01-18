let booking_details = {};

function onLoad() {
  if (localStorage.getItem("user_data") == undefined) {
    location.href = "./login.html";
    return;
  }
  let amount = localStorage.getItem("amount");
  booking_details = JSON.parse(localStorage.getItem("booking_data"));
  console.log(booking_details);
  $(".car_no").text(booking_details.car_no);
  $(".from_date").text(booking_details.from_date);
  $(".from_time").text(booking_details.from_time);
  $(".to_date").text(booking_details.to_date);
  $(".to_time").text(booking_details.to_time);
  $(".amount").text("Rs." + amount);
}

function createBooking() {
  let data = JSON.parse(localStorage.getItem("booking_data"));
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:3000/user/bookcar",
    headers: {
      token: localStorage.getItem("token"),
    },
    contentType: "application/json",
    data: JSON.stringify(data),
    dataType: "json",
    success: function (result) {
      console.log(result);
      if (result.errno != undefined) {
        alert("cars not avaliable");
      } else {
        location.href = "./profile.html";
      }
    },
  });
}

function pay() {
  const details = {
    amount: +localStorage.getItem("amount") * 100,
    email: localStorage.getItem("email"),
  };
  const KEY_ID = "rzp_test_8KgbvL5kpFv9Dn";
  document.getElementById("rzp-button1").onclick = async function (e) {
    e.preventDefault();
    e.target.innerText = "submitting...";
    try {
      console.log(1, details);
      let response = await fetch("http://127.0.0.1:3000/payment/paynow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: details.amount,
          email: details.email,
        }),
      });
      console.log(2, details);
      let orderDate = await response.json();
      console.log(orderDate);
      let options = {
        key: KEY_ID,
        amount: details.amount,
        currency: "INR",
        order_id: orderDate.id,
        handler: async function (response) {
          console.log(response);
          let payment = await fetch(
            "http://127.0.0.1:3000/payment/upload-status",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...details,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id || "order_id_demo",
                signature: response.razorpay_signature || "signature_demo",
                status: "success",
              }),
            }
          );
          let result = await payment.json();
          $.ajax({
            type: "POST",
            url: "http://127.0.0.1:3000/user/bookcar",
            headers: {
              token: localStorage.getItem("token"),
            },
            contentType: "application/json",
            data: JSON.stringify(booking_details),
            dataType: "json",
            success: function (result) {
              if (result.errno != undefined) {
                alert("cars not avaliable");
              } else {
                console.log("js:99", result);
                localStorage.setItem("payment_status", JSON.stringify(result));
                location.href = "./payment-status.html";
              }
            },
          });
        },
      };

      let rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", async function (response) {
        let payment = await fetch(
          "http://127.0.0.1:3000/payment/upload-status",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...details,
              payment_id: response.error.code,
              signature: response.razorpay_signature || "signature_demo",
              order_id: response.razorpay_order_id || "order_id_demo",
              status: "failed",
            }),
          }
        );
        let result = await payment.json();
        console.log("payment failed", result);
        localStorage.setItem("payment_status", JSON.stringify(result));
        location.href = "./payment-status.html";
      });
      rzp1.open();
    } catch (err) {
      console.log(err);
    }
  };
}

$(document).ready(function () {
  onLoad();
  console.log("onload");
  pay();
});
