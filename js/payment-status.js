function onLoad() {
  let datajson = localStorage.getItem("payment_status");
  const data = JSON.parse(datajson);
  console.log("payment-status", data);
  if (data.index == 0) {
    $("img").attr("src", "../img/denied.gif");
    $("#status").text("Payment Failed");
    $("#amount").text("₹ " + 0);
    $("#cno").text("NA");
    $("#umail").text("NA");
    $("#bperiod").text("NA");
  } else {
    let booking_data_json = localStorage.getItem("booking_data");
    const booking_data = JSON.parse(booking_data_json);
    $("img").attr("src", "../img/checkmark.gif");
    $("#amount").text("₹ " + localStorage.getItem("amount"));
    $("#cno").text(booking_data.car_no);
    $("#umail").text(booking_data.email);
    $("#bperiod").text(booking_data.from_date + " - " + booking_data.to_date);
  }
}

$(document).ready(function () {
  onLoad();
});

function gohome() {
  location.href = "./home.html";
}
