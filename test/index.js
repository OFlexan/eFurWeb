nav.setContainer(document.querySelector("#test"));
nav.start();

nav.listen("index", function() {
  nav.add("p", {
    class: "test",
    $innerText: "Hello world!"
  });
});