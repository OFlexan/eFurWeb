Parse.initialize("MiGt7yG9h5WAf7zXRsDHp");
Parse.serverURL = "https://api.efur.app/parse";
var r = Object.fromEntries(new URLSearchParams(location.search))["redirect"];
if (Parse.User.current() != null && Parse.User.current().get("username").length != 25) location.href = "./index.html" + (r ? "#" + r : "");

window.onload = function() {
  document.querySelector("button").onclick = async function() {
    document.querySelector(".error").innerText = "";
    document.querySelector("button").disabled = true;
    await Parse.User.logIn(document.querySelector("input[type=email]").value, document.querySelector("input[type=password]").value).then(() => {
      location.href = "./index.html" + (r ? "#" + r : "");
    }).catch((e) => {
      document.querySelector(".error").innerText = e.message;
      document.querySelector("input[type=password]").value = "";
    });
    document.querySelector("button").disabled = false;
  };
};