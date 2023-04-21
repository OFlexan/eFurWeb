Parse.initialize("MiGt7yG9h5WAf7zXRsDHp");
Parse.serverURL = "https://api.efur.app/parse";
if (Parse.User.current() == null) location.href = "./login.html";
var o = Object.fromEntries(new URLSearchParams(location.search));
if (!o["type"] || !o["id"]) {
  window.close();
  location.href = "./login.html";
}

var parse = {
  reportContent: async function(type, id, reason, error) {
    // type = 0 (post), 1 (comment)
    return await this.run("reportContent", {
      i: id,
      r: reason,
      t: type
    }).catch(error);
  },
  run: async function(name, request) {
    if (request == undefined) request = {};
    request.z = this.version;
    return Parse.Cloud.run(name, request);
  },
  version: 101
};

window.onload = function() {
  document.querySelector("h1").innerText += " " + o["type"];
  document.querySelector("button").onclick = async function() {
    document.querySelector(".error").innerText = "";
    document.querySelector("button").disabled = true;
    var l = false;
    await parse.reportContent(o["type"] == "post" ? 0 : 1, o["id"], document.querySelector("input[name=reason]:checked").value + ": " + document.querySelector("input[type=text]").value, (e) => {
      document.querySelector(".error").innerText = e.message;
      l = true;
    });
    if (!l) {
      alert("Report sent!");
      window.close();
      location.href = "./login.html";
    }
    document.querySelector("button").disabled = false;
  };
  document.querySelector("#cancel").onclick = () => {
    window.close();
    location.href = "./login.html";
  };
};