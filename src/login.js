Parse.initialize("MiGt7yG9h5WAf7zXRsDHp");
Parse.serverURL = "https://api.efur.app/parse";
if (Parse.User.current() != null) location.href = "./index.html";

window.onload = function() {
  document.querySelector("button").onclick = async function() {
    document.querySelector("button").disabled = true;
    await Parse.User.logIn(document.querySelector("input[type=email]").value, document.querySelector("input[type=password]").value).then(() => {
      location.href = "./index.html";
    }).catch((e) => {
      document.querySelector(".error").innerText = e.message;
      document.querySelector("input[type=password]").value = "";
    });
    document.querySelector("button").disabled = false;
  };
};