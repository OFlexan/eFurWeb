const nav = (function() {
  var on = {};
  var current = null;
  var container = null;
  var history = [];
  var forward = [];
  var events = [];
  var elems = [];
  var newnav = {
    settings: {
      reloadOnConflict: false,
      keepHistory: true,
      automaticErase: true
    },
    start: function(page) {
      if (document.readyState == "complete") {
        if (container == null) container = document.body;
        nav.to(page ?? "index");
        return newnav;
      }
      window.addEventListener("load", function() {
        if (container == null) container = document.body;
        nav.to(page ?? "index");
      });
    },
    onerror: null,
    setContainer: function(elem) {
      container = elem;
    },
    listen: function(page, callback) {
      on[page] = callback;
    },
    addEvent: function(type, listener) {
      events.push({type, listener});
      container.addEventListener(type, listener);
    },
    to: function(page) {
      if (page == current && !this.reloadOnConflict) return;
      if (!on[page]) {
        if (this.onerror) this.onerror(new Error("Page '" + page + "' is not registered."));
        return;
      }
      var item = disablePage();
      if (this.settings.keepHistory) history.push(item);
      current = page;
      on[page]();
    },
    back: function() {
      if (!this.settings.keepHistory) {
        if (this.onerror) this.onerror(new Error("Cannot go back because history is not enabled. Set `settings.keepHistory` to true before calling this method."));
        return;
      }
      if (history.length == 0) {
        if (this.onerror) this.onerror(new Error("Cannot go back because there is no history. Check `canBack` before calling this method."));
        return;
      }
      var previous = disablePage();
      forward.push(previous);

      var item = history.pop();
      current = item.name;
      for (var i = 0; i < item.content.length; i++) container.appendChild(item.content[i]);
      for (var i = 0; i < item.events.length; i++) container.addEventListener(item.events[i].type, item.events[i].listener);
    },
    forward: function() {
      if (!this.settings.keepHistory) {
        if (this.onerror) this.onerror(new Error("Cannot go forward because history is not enabled. Set `settings.keepHistory` to true before calling this method."));
        return;
      }
      if (forward.length == 0) {
        if (this.onerror) this.onerror(new Error("Cannot go forward because there is no forward history. Check `canForward` before calling this method."));
        return;
      }
      var previous = disablePage();
      history.push(previous);

      var item = forward.pop();
      current = item.name;
      for (var i = 0; i < item.content.length; i++) container.appendChild(item.content[i]);
      for (var i = 0; i < item.events.length; i++) container.addEventListener(item.events[i].type, item.events[i].listener);
    },
    canBack: function() {
      return this.settings.keepHistory && history.length > 0;
    },
    canForward: function() {
      return this.settings.keepHistory && forward.length > 0;
    },
    reload: function() {
      if (!on[page]) {
        if (this.onerror) this.onerror(new Error("Page '" + page + "' is not registered."));
        return;
      }
      disablePage();
      on[page]();
    },
    addCustomElement: function(type, listener) {
      elems.push({type, listener});
    },
    new: function(type, attributes) {
      var elem;
      for (var i = 0; i < elems.length; i++) {
        if (type == elems[i].type) elem = elems[i].listener();
      }
      if (elem == undefined) elem = document.createElement(type);
      var keys = Object.keys(attributes);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].startsWith("$")) {
          elem[keys[i].substring(1)] = attributes[keys[i]];
          continue;
        }
        elem.setAttribute(keys[i], attributes[keys[i]]);
      }
      return elem;
    },
    add: function(type, attributes) {
      var elem = this.new(type, attributes);
      container.appendChild(elem);
      return elem;
    },
    addElem: function(elem) {
      container.appendChild(elem);
    }
  };
  var disablePage = function() {
    var persist = [];
    for (var i = 0; i < container.children.length; i++) persist.push(container.children[i]);
    var item = {
      name: current,
      content: persist,
      events: events
    };
    for (var i = 0; i < events.length; i++) container.removeEventListener(events[i].type, events[i].listener);
    events = [];
    if (newnav.settings.automaticErase) container.innerHTML = "";
    return item;
  };
  return newnav;
})();