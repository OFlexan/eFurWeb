(async function() {
  Parse.initialize("MiGt7yG9h5WAf7zXRsDHp");
  Parse.serverURL = "https://api.efur.app/parse";
  if (Parse.User.current() == null) await Parse.AnonymousUtils.logIn();
  var o = Object.fromEntries(new URLSearchParams(location.search));
  if (o["type"] == "guest") {
    location.href = "./index.html";
    return;
  }
  if (o["type"] == undefined || o["id"] == undefined) location.href = "./index.html";
  location.href = "./index.html#" + o["type"] + "@" + o["id"];
})();