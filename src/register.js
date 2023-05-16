Parse.initialize("MiGt7yG9h5WAf7zXRsDHp");
Parse.serverURL = "https://api.efur.app/parse";
var r = Object.fromEntries(new URLSearchParams(location.search))["redirect"];
if (Parse.User.current() != null) {
  if (Parse.User.current().get("username").length != 25) location.href = "./index.html" + (r ? "#" + r : "");
  else Parse.AnonymousUtils.logIn();
}

window.onload = function() {
  document.querySelector("button").onclick = async function() {
    if (document.querySelector("input[type=password]").value.length < 8) {
      document.querySelector(".error").innerText = "Your password must have a minimum length of 8 characters";
      return;
    }
    if (!document.querySelector("#terms").classList.contains("checked") || !document.querySelector("#privacy").classList.contains("checked")) {
      document.querySelector(".error").innerText = "You must agree to the Terms of Service and Privacy Policy to register";
      return;
    }
    if (!document.querySelector("#age").classList.contains("checked")) {
      document.querySelector(".error").innerText = "You must be 13 years or older to register";
      return;
    }
    document.querySelector(".error").innerText = "";
    document.querySelector("button").disabled = true;
    var u = Parse.User.current();
    u.set("username", (() => {
      var result = "";
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (var i = 0; i < 15; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
      return result;
    })());
    u.set("email", document.querySelector("input[type=email]").value);
    u.set("password", document.querySelector("input[type=password]").value);
    await u.save().then(() => {
      location.href = "./index.html" + (r ? "#" + r : "");
    }).catch((e) => document.querySelector(".error").innerText = e.message);
    document.querySelector("button").disabled = false;
  };
  var c = document.querySelectorAll("checkbox");
  for (var i = 0; i < c.length; i++) {
    c[i].addEventListener("click", ((t) => () => {
      if (t.classList.contains("checked")) t.classList.remove("checked");
      else t.classList.add("checked");
    })(c[i]))
  }
};