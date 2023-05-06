// custom Parse stuff
Parse.ObjectQuery = function(id) {
  return {
    keys: function(keys) {
      return fetch(Parse.serverURL + "/classes/_User", {
        "body": JSON.stringify({
            where: {objectId: id},
            keys: keys.join(","),
            limit: 1,
            _method: "GET",
            _ApplicationId: Parse.applicationId,
            _InstallationId: Parse._getInstallationId(),
            _SessionToken: Parse.User.current().get("sessionToken")
        }),
        "method": "POST"
      }).then((j) => j.json()).then((r) => {
        r = r.results[0];
        var o = {
          id: r.objectId,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
          attributes: {
            createdAt: new Date(r.createdAt),
            updatedAt: new Date(r.updatedAt)
          },
          get: function(e) {
            return this.attributes[e];
          }
        };
        var k = Object.keys(r);
        k.splice(k.indexOf("objectId"), 1);
        k.splice(k.indexOf("createdAt"), 1);
        k.splice(k.indexOf("updatedAt"), 1);
        for (var i = 0; i < k.length; i++) o.attributes[k[i]] = r[k[i]];
        return o;
      });
    }
  };
};
// initialize config
var parse = {
  applicationId: "MiGt7yG9h5WAf7zXRsDHp",
  init: function() {
    Parse.initialize(this.applicationId);
    Parse.serverURL = "https://api.efur.app/parse";
  },
  export: function() {
    return btoa(localStorage.getItem("Parse/" + this.applicationId + "/installationId")).replaceAll("=", "") + "." + btoa(Parse.User.current().get("sessionToken")).replaceAll("=", "");
  },
  extension: {
    path: "./",
    allowShare: true,
    allowCustomWidth: true
  },
  isGuest: function() {
    return Parse.User.current().get("username").length == 25;
  },
  cloud: {
    version: 101,
    registerUser: async function(allowedNsfw, email, password, username, error) {
      return await this.run("registerUser", {
        a: allowedNsfw ? 1 : 0,
        e: email,
        p: password,
        u: username
      }).catch(error);
    },
    getNewPosts: async function(rating, timestamp, error) {
      return await this.run("getNewPosts", {
        d: timestamp,
        r: rating
      }).catch(error);
    },
    getFollowingPosts: async function(rating, timestamp, error) {
      return await this.run("getFollowingPosts", {
        d: timestamp,
        r: rating
      }).catch(error);
    },
    getNewsPosts: async function(rating, timestamp, error) {
      return await this.run("getNewsPosts", {
        d: timestamp,
        r: rating
      }).catch(error);
    },
    getSinglePost: async function(id, rating, error) {
      return await this.run("getSinglePost", {
        p: id,
        r: rating
      }).catch(error);
    },
    getNotifications: async function(timestamp, error) {
      return await this.run("getNotifications", {
        d: timestamp
      }).catch(error);
    },
    getUserSettings: async function(error) {
      return await this.run("getUserSettings").catch(error);
    },
    countUnreadConversations: async function(error) {
      return await this.run("countUnreadConversations").catch(error);
    },
    getFollowingPostCount: async function(error) {
      return await this.run("getFollowingPostCount").catch(error);
    },
    getNotificationCount: async function(error) {
      return await this.run("getNotificationCount").catch(error);
    },
    resetNotificationCount: async function(error) {
      return await this.run("resetNotificationCount").catch(error);
    },
    getUserProfile: async function(userId, error) {
      return await this.run("getUserProfile", {
        u: userId
      }).catch(error);
    },
    getPostFavedBy: async function(postId, error) {
      return await this.run("getPostFavedBy", {
        p: postId
      }).catch(error);
    },
    favPost: async function(favOrUnfav, postId, error) {
      return await this.run("favPost", {
        a: favOrUnfav,
        p: postId
      }).catch(error);
    },
    getComments: async function(postId, sub, timestamp, error) {
      return await this.run("getComments", {
        d: timestamp,
        p: postId,
        c: sub
      }).catch(error);
    },
    favComment: async function(favOrUnfav, commentId, error) {
      return await this.run("favComment", {
        a: favOrUnfav,
        c: commentId
      }).catch(error);
    },
    voteOnPoll: async function(pollId, optionIndexes, error) {
      return await this.run("voteOnPoll", {
        p: pollId,
        v: optionIndexes
      }).catch(error);
    },
    getPollVote: async function(pollId, error) {
      return await this.run("getPollVote", {
        p: pollId
      }).catch(error);
    },
    createComment: async function(post, text, sub, subsub, error) {
      return await this.run("createComment", {
        c: sub,
        r: subsub,
        p: post,
        t: text
      }).catch(error);
    },
    getStats: async function(error) {
      return await this.run("getStats", {}).catch(error);
    },
    run: async function(name, request) {
      if (request == undefined) request = {};
      request.z = this.version;
      return Parse.Cloud.run(name, request);
    }
  },
  local: {
    version: "dev0"
  },
  parse: {
    post: function(obj) {
      if (obj == undefined) return;
      var type = obj.get("v");
      // image posts: 0 / gif posts: 2
      if (type == 0 || type == 2) return {
        id: obj.id,
        image: this.media(obj.get("data")),
        image_width: obj.get("a"),
        image_height: obj.get("b"),
        categories: obj.get("c"),
        title: obj.get("f"),
        description: obj.get("i"),
        artist: obj.get("e"),
        source: obj.get("s"),
        favorites: obj.get("k"),
        comments: obj.get("j"),
        unknown_l: obj.get("l"),
        rating: obj.get("r"),
        tags: obj.get("t"),
        user: this.user(obj.get("u")),
        type: type,
        unknown_y: obj.get("y"),
        hidden: obj.get("x"),
        prevent_downloads: obj.get("z"),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
      // poll posts: 3
      if (type == 3) return {
        id: obj.id,
        categories: obj.get("c"),
        description: obj.get("i"),
        artist: obj.get("e"),
        source: obj.get("s"),
        favorites: obj.get("k"),
        comments: obj.get("j"),
        unknown_l: obj.get("l"),
        poll: this.poll(obj.get("p")),
        rating: obj.get("r"),
        tags: obj.get("t"),
        user: this.user(obj.get("u")),
        type: type,
        unknown_y: obj.get("y"),
        hidden: obj.get("x"),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
      // video posts: 4
      if (type == 4) return {
        id: obj.id,
        video: this.media(obj.get("data")),
        video_width: obj.get("a"),
        video_height: obj.get("b"),
        categories: obj.get("c"),
        title: obj.get("f"),
        description: obj.get("i"),
        artist: obj.get("e"),
        source: obj.get("s"),
        favorites: obj.get("k"),
        comments: obj.get("j"),
        unknown_l: obj.get("l"),
        rating: obj.get("r"),
        tags: obj.get("t"),
        user: this.user(obj.get("u")),
        type: type,
        unknown_y: obj.get("y"),
        hidden: obj.get("x"),
        prevent_downloads: obj.get("z"),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
      // story posts: 1 (default)
      return {
        id: obj.id,
        categories: obj.get("c"),
        story: this.media(obj.get("data")),
        title: obj.get("f"),
        content: obj.get("g"),
        description: obj.get("i"),
        artist: obj.get("e"),
        source: obj.get("s"),
        favorites: obj.get("k"),
        comments: obj.get("j"),
        unknown_l: obj.get("l"),
        rating: obj.get("r"),
        tags: obj.get("t"),
        user: this.user(obj.get("u")),
        type: type,
        unknown_y: obj.get("y"),
        hidden: obj.get("x"),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
    },
    user: function(obj) {
      if (obj == undefined) return;
      var email = obj.get("email");
      // if user is authorized
      if (email != undefined) return {
        id: obj.id,
        email: email,
        emailVerified: obj.get("emailVerified"),
        background: this.media(obj.get("b")),
        icon: this.media(obj.get("i")),
        username_lower: obj.get("ul"),
        username: obj.get("username"),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
      // else return normal
      return {
        id: obj.id,
        background: this.media(obj.get("b")),
        icon: this.media(obj.get("i")),
        username_lower: obj.get("ul"),
        username: obj.get("username"),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
    },
    notification: function(obj) {
      if (obj == undefined) return;
      var type = obj.get("t");
      if (type == 0) return {
        id: obj.id,
        unknown_a: obj.get("a"),
        user: this.user(obj.get("f")),
        post: this.post(obj.get("p")),
        type: type,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
      if (type == 1) return {
        id: obj.id,
        followed: obj.get("a"),
        user: this.user(obj.get("f")),
        type: type,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
      if (type == 2) return {
        id: obj.id,
        unknown_a: obj.get("a"),
        comment: this.comment(obj.get("c")),
        user: this.user(obj.get("f")),
        post: this.post(obj.get("p")),
        type: type,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
      if (type == 3) return {
        id: obj.id,
        unknown_a: obj.get("a"),
        comment: this.comment(obj.get("c")),
        repliedTo: obj.get("e"),
        user: this.user(obj.get("f")),
        post: this.post(obj.get("p")),
        type: type,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
      if (type == 5) return {
        id: obj.id,
        unknown_a: obj.get("a"),
        user: this.user(obj.get("f")),
        post: this.post(obj.get("p")),
        type: type,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
      if (type == 100) return {
        id: obj.id,
        timestamp: obj.get("d"),
        reason: obj.get("r"),
        type: type,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
      if (type == 101) return {
        id: obj.id,
        timestamp: obj.get("d"),
        type: type,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
    },
    comment: function(obj) {
      if (obj == undefined) return;
      return {
        id: obj.id,
        parent: this.comment(obj.get("c")),
        post: this.post(obj.get("p")),
        likes: obj.get("s"),
        replies: obj.get("q"),
        content: obj.get("t"),
        user: this.user(obj.get("u")),
        reply: this.comment(obj.get("r")),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
    },
    media: function(obj) {
      if (obj == undefined) return;
      return {
        full: obj.f,
        preview: obj.p,
        thumbnail: obj.t,
        video: obj.v
      }
    },
    poll: function(obj) {
      if (obj == undefined) return;
      var x = obj.get("o");
      var o = {
        id: obj.id,
        options: x,
        title: obj.get("q"),
        total_votes: obj.get("s"),
        total_choices: 0,
        votes: [],
        multi: obj.get("v"),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      };
      for (var i = 0; i < x.length; i++) {
        o.total_choices += obj.get("s" + i);
        o.votes.push(obj.get("s" + i));
      }
      return o;
    },
    pollVote: function(obj) {
      if (obj == undefined) return;
      return {
        id: obj.id,
        options: obj.get("o"),
        poll: this.poll(obj.get("p")),
        user: this.user(obj.get("u")),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      };
    },
    array: function(arr, type) {
      var a = [];
      for (var i = 0; i < arr.length; i++) {
        a.push(this[type](arr[i]));
      }
      return a;
    },
    profile: function(obj) {
      if (obj == undefined) return;
      return {
        id: obj.id,
        icon: this.media(obj.a),
        isModerator: obj.ab,
        background: this.media(obj.b),
        followingCount: obj.c,
        followerCount: obj.d,
        likeCount: obj.e,
        commentCount: obj.f,
        isFollowing: obj.g,
        postCount: obj.h,
        followingThumb: this.array(obj.ia, "user"),
        followersThumb: this.array(obj.ib, "user"),
        memberSince: obj.s,
        username: obj.u,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
    }
  }
};

var pageRenderer = (function() {
  var pages;
  var y = function(e, o) {
    if (e == undefined) return [];
    var p = [];
    for (var i = 0; i < e.length; i++) {
      if (e[i].equals != undefined && o[e[i].equals] == undefined) continue;
      var d = document.createElement(e[i].tagName);
      if (e[i].tagName == "radio") {
        if (e[i].selected) d.classList.add("checked");
        if (!e[i].readonly) d.onclick = ((t) => () => {
          if (t.classList.contains("checked")) return;
          var n = t.getAttribute("name");
          var c = document.querySelector("radio.checked" + (n != null ? "[name=" + n + "]" : ""));
          if (c) c.classList.remove("checked");
          t.classList.add("checked");
        })(d);
      }
      if (e[i].tagName == "checkbox") {
        if (e[i].selected) d.classList.add("checked");
        if (!e[i].readonly) d.onclick = ((t) => () => {
          if (t.classList.contains("checked")) t.classList.remove("checked");
          else t.classList.add("checked");
        })(d);
      }
      var z = y(e[i].children, o);
      for (var q = 0; q < z.length; q++) d.appendChild(z[q]);
      var k = Object.keys(e[i]);
      k.splice(k.indexOf("tagName"), 1);
      if (k.includes("children")) k.splice(k.indexOf("children"), 1);
      if (k.includes("equals")) k.splice(k.indexOf("equals"), 1);
      for (var q = 0; q < k.length; q++) {
        var w = e[i][k[q]];
        if (!w) continue;
        if (typeof w == "boolean" && w) w = "";
        var u = "";
        while (w.includes(">[") && w.includes("]<")) {
          u += w.substring(0, w.indexOf(">["));
          u += o[w.substring(w.indexOf(">[") + 2, w.indexOf("]<"))];
          w = w.substring(w.indexOf("]<") + 2);
        }
        u += w;
        if (k[q] == "innerText" && (e[i].tagName == "radio" || e[i].tagName == "checkbox")) {
          var z = document.createElement("p");
          z[k[q]] = u;
          d.appendChild(z);
          continue;
        }
        if (k[q].startsWith("__")) d.setAttribute(k[q].substring(2), u);
        else d[k[q]] = u;
      }
      p.push(d);
    }
    return p;
  };
  return {
    init: async function() {
      pages = await fetch(parse.extension.path + "pages.json").then((j) => j.json());
    },
    parseObject: function(obj, options) {
      return y([obj], options)[0];
    },
    parseObjects: function(objs, options) {
      return {
        get: function(id, p) {
          if (p == undefined) p = this.children;
          for (var i = 0; i < p.length; i++) {
            if (p[i].reference == id) return p[i];
            var l = this.get(id, p[i].children);
            if (l != null) return l;
          }
          return null;
        },
        children: y(objs, options),
        appendTo: function(element) {
          for (var i = 0; i < this.children.length; i++) element.appendChild(this.children[i]);
        }
      };
    },
    compile: function(page, name, options) {
      return {
        get: function(id, p) {
          if (p == undefined) p = this.children;
          for (var i = 0; i < p.length; i++) {
            if (p[i].reference == id) return p[i];
            var l = this.get(id, p[i].children);
            if (l != null) return l;
          }
          return null;
        },
        children: y(pages[page].template[name], options),
        appendTo: function(element) {
          for (var i = 0; i < this.children.length; i++) element.appendChild(this.children[i]);
        }
      };
    },
    render: function(page, options) {
      return {
        head: {
          get: function(id, p) {
            if (p == undefined) p = this.children;
            for (var i = 0; i < p.length; i++) {
              if (p[i].reference == id) return p[i];
              var l = this.get(id, p[i].children);
              if (l != null) return l;
            }
            return null;
          },
          children: y(pages[page].head, options),
          appendTo: function(element) {
            for (var i = 0; i < this.children.length; i++) element.appendChild(this.children[i]);
          }
        },
        body: {
          get: function(id, p) {
            if (p == undefined) p = this.children;
            for (var i = 0; i < p.length; i++) {
              if (p[i].reference == id) return p[i];
              var l = this.get(id, p[i].children);
              if (l != null) return l;
            }
            return null;
          },
          children: y(pages[page].body, options),
          appendTo: function(element) {
            for (var i = 0; i < this.children.length; i++) element.appendChild(this.children[i]);
          }
        }
      };
    }
  };
})();

// function for formatting time into "2m" or "2 m" or "2 minutes"
function formatTime(date, type, forward, otherdate) {
  otherdate = otherdate ? otherdate : Date.now();
  var diff = forward ? date.getTime() - otherdate : otherdate - date.getTime();
  var second = 1000;
  var minute = second * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var formatStrings = ["s", "m", "h", "d"];
  if (type == 1) {
    formatStrings[0] = " s";
    formatStrings[1] = " m";
    formatStrings[2] = " h";
    formatStrings[3] = " d";
  } else if (type == 2) {
    formatStrings[0] = " seconds";
    formatStrings[1] = " minutes";
    formatStrings[2] = " hours";
    formatStrings[3] = " days";
  }
  if (diff < minute) return Math.round(diff / second) + formatStrings[0];
  if (diff < hour) return Math.round(diff / minute) + formatStrings[1];
  if (diff < day) return Math.round(diff / hour) + formatStrings[2];
  return Math.round(diff / day) + formatStrings[3];
}

// searches in array by property, for example get the item in arr = [{t:0},{t:1},{t:2}] that has sub = "t" and equ = 1 (should return {t:1})
function searchInArray(arr, sub, equ) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][sub] == equ) return arr[i];
  }
  return undefined;
}

function alert(msg) {
  var err = document.createElement("p");
  err.className = "alert";
  err.innerText = msg;
  document.body.appendChild(err);
  setTimeout(() => {
    if (document.body.contains(err)) {
      err.className = "fadingAlert";
      setTimeout(() => {
        if (document.body.contains(err)) document.body.removeChild(err);
      }, 150);
    }
  }, 5000);
}

function alertError(msg) {
  var err = document.createElement("p");
  err.className = "error";
  err.innerText = msg;
  document.body.appendChild(err);
  setTimeout(() => {
    if (document.body.contains(err)) {
      err.className = "fadingError";
      setTimeout(() => {
        if (document.body.contains(err)) document.body.removeChild(err);
      }, 150);
    }
  }, 5000);
}

function createDrawer(isGuest, selected, padded) {
  // create drawer
  var drawer = pageRenderer.compile("app", "drawer", {
    login: isGuest ? "Log in" : undefined,
    mode: config.rating > 0 ? "SFW" : "NSFW",
    mode_color: config.rating > 0 ? "lime" : "orange"
  });
  if (padded) drawer.get("drawer").classList.add("padding");
  drawer.appendTo(document.body);
  if (selected != null) drawer.get(selected).classList.add("selected");
  // create actions
  if (drawer.get("login")) drawer.get("login").onclick = () => location.href = parse.extension.path + "login.html";
  drawer.get("mode").onclick = () => {
    if (config.rating > 0) localStorage.removeItem("eFurWeb.nsfw");
    else localStorage.setItem("eFurWeb.nsfw", "");
    var u = new URL(location.href);
    u.hash = "";
    location.href = u;
  };
  drawer.get("following").onclick = () => goto("feed@following");
  drawer.get("feed").onclick = () => goto("feed");
  drawer.get("news").onclick = () => goto("feed@news");
  drawer.get("notifications").onclick = () => goto("notifications");
  drawer.get("messages").onclick = () => goto("chat");
  drawer.get("discover").onclick = () => alert("Coming soon!");
  drawer.get("profile").onclick = () => goto("profile@" + Parse.User.current().id);
  drawer.get("settings").onclick = () => alert("Coming soon!");
  drawer.get("about").onclick = () => goto("about");
}

function createMenu(items, raw) {
  var menu = document.createElement("div");
  menu.className = "htmlMenu";
  if (!raw) {
    for (var i = 0; i < items.length; i++) {
      var item = document.createElement("p");
      item.className = "htmlMenuItem";
      item.innerText = items[i].innerText;
      item.onclick = ((c) => () => {
        c();
        menu.break();
      })(items[i].onclick);
      menu.appendChild(item);
    }
    return menu;
  }
  for (var i = 0; i < items.length; i++) menu.appendChild(items[i]);
  return menu;
}

function appendMenu(menu, appendTo, center) {
  var cover = document.createElement("div");
  cover.className = "htmlCover";
  cover.onclick = menu.break = () => {
    appendTo.removeChild(cover);
    appendTo.removeChild(menu);
  };
  appendTo.appendChild(cover);
  if (center) {
    menu.style.position = "fixed";
    menu.style.left = "50%";
    menu.style.top = "50%";
    menu.style.transform = "translate(-50%, -50%)";
  } else {
    menu.style.left = document.documentElement.scrollLeft + mousePos.x + "px";
    menu.style.top = document.documentElement.scrollTop + mousePos.y + "px";
  }
  appendTo.appendChild(menu);
}

function createPosts(posts, history, fullFeatures) {
  if (history) {
    for (var i = 0; i < posts.f.length; i++) history.cache.f.push(posts.f[i]);
    for (var i = 0; i < posts.p.length; i++) history.cache.p.push(posts.p[i]);
  }
  var f = [];
  for (var i = 0; i < posts.p.length; i++) {
    var post = posts.p[i];
    var cats = [];
    if (post.rating > 0) cats.push(post.rating == 1 ? "SUGGESTIVE" : "EXPLICIT");
    for (var z = 0; z < post.categories.length; z++) {
      cats.push(searchInArray(config.attributes.categories, "i", post.categories[z]).n.replace("&amp;", "&"));
    }
    // create post without content
    var postElem = pageRenderer.compile("feed", "post", {
      pfp_url: post.user.icon ? post.user.icon.preview : parse.extension.path + "res/default_icon.png",
      username: post.user.username,
      categories: cats.join(", "),
      upload_time: formatTime(post.createdAt, 0),
      favorite: posts.f.includes(post.id) ? "favorite" : "favorite_border",
      favorite_count: post.favorites ?? 0,
      comments_count: post.comments ?? 0
    });
    postElem.get("profile_picture").onclick = postElem.get("profile_name").onclick = ((id) => () => goto("profile@" + id))(post.user.id);
    // add menu to post
    var menu = createMenu([
      {innerText: "Share", onclick: ((id) => async () => {
        var x = new URL(location.href);
        x.pathname = x.pathname.substring(0, x.pathname.lastIndexOf("/") + 1) + "share.html";
        x.search = "";
        x.hash = "";
        if (parse.extension.allowShare) {
          await navigator.clipboard.writeText(x.href + "?type=post&id=" + id);
          alert("Copied link to clipboard!");
          return;
        }
        alert("Sharing is disabled!");
      })(post.id)}
    ]);
    postElem.get("more").onclick = ((menu) => () => {
      appendMenu(menu, document.body);
    })(menu);
    // create content
    //   image/gif
    if (post.type == 0 || post.type == 2) {
      pageRenderer.compile("feed", "imageBody", {
        post_title: post.title,
        post_pic_url: post.type == 2 ? post.image.full : post.image.preview,
        post_artist: post.artist,
        post_desc: post.description
      }).appendTo(postElem.get("body"));
    }
    //   story
    if (post.type == 1) {
      var c = pageRenderer.compile("feed", "storyBody", {
        post_title: post.title,
        post_content: post.story && fullFeatures ? "Loading..." : (post.story ? post.content + "..." : post.content),
        post_artist: post.artist,
        post_desc: post.description
      });
      if (post.story && fullFeatures) {
        (async (d) => {
          d.innerText = await fetch(post.story.full).then((t) => t.text());
        })(c.get("post_content"));
      }
      if (post.story && !fullFeatures) {
        var l = document.createElement("span");
        l.className = "storyPostMore";
        l.innerText = "Expand";
        l.reference = "load_more_label";
        l.url = post.story.full;
        l.onclick = ((id) => async () => goto("post@" + id))(post.id);
        c.get("post_content").appendChild(l);
      }
      c.appendTo(postElem.get("body"));
    }
    //   poll
    if (post.type == 3) {
      var loadPoll = (postElem, post, pollVote) => {
        postElem.get("body").innerHTML = "";
        var poll = pageRenderer.compile("feed", "pollBody", {
          poll_title: post.poll.title,
          poll_count: post.poll.total_votes,
          post_artist: post.artist,
          post_desc: post.description
        });
        var a = [];
        for (var z = 0; z < post.poll.options.length; z++) {
          var r = [{tagName: post.poll.multi ? "checkbox" : "radio", innerText: post.poll.options[z], __name: "poll-" + post.poll.id, voteIndex: z + ""}];
          if (pollVote) {
            r[0].readonly = true;
            r[0].selected = pollVote.options.includes(z);
            r.push({tagName: "p", innerText: post.poll.votes[z] + " furs, " + Math.floor(post.poll.votes[z] / post.poll.total_choices * 100) + "%", className: "pollResult"});
          }
          r.push({tagName: "br"});
          var o = pageRenderer.parseObjects(r, {});
          a.push(o.children[0]);
          o.appendTo(poll.get("poll_options"));
        }
        poll.appendTo(postElem.get("body"));
        var submit = poll.get("poll_submit");
        submit.onclick = ((id, m) => async () => {
          var v = [];
          if (m) {
            // multi
            var s = document.querySelectorAll("checkbox.checked[name=poll-" + id + "]");
            if (s.length == 0) {
              alertError("Select at least one option!");
              return;
            }
            for (var x = 0; x < s.length; x++) v.push(+s[x].voteIndex);
          } else {
            // single
            var s = document.querySelector("radio.checked[name=poll-" + id + "]");
            if (s == null) {
              alertError("Select at least one option!");
              return;
            }
            v.push(+s.voteIndex);
          }
          // vote on poll
          var r = parse.parse.pollVote(await parse.cloud.voteOnPoll(id, v, (e) => alertError(e.message)));
          loadPoll(postElem, post, r);
        })(post.poll.id, post.poll.multi);
        if (!pollVote) (async () => {
          var v = parse.parse.pollVote(await parse.cloud.getPollVote(post.poll.id, (e) => alertError(e.message)));
          if (v != null) loadPoll(postElem, post, v);
        })();
        else submit.parentNode.removeChild(submit);
      };
      loadPoll(postElem, post);
    }
    //   video
    if (post.type == 4) {
      pageRenderer.compile("feed", "videoBody", {
        post_title: post.title,
        post_thumb_url: post.video.preview,
        post_vid_url: post.video.video,
        post_artist: post.artist,
        post_desc: post.description
      }).appendTo(postElem.get("body"));
    }
    // favorite functionality
    var fav = postElem.get("isfavorite");
    postElem.get("favorite").onclick = ((count, fav, id) => async () => {
      var a = fav.innerText != "favorite";
      fav.innerText = a ? "favorite" : "favorite_border";
      count.innerText = a ? +count.innerText + 1 : +count.innerText - 1;
      var c = await parse.cloud.favPost(a, id, (e) => alertError(e.message));
      if (c == undefined) return;
      fav.innerText = c.g ? "favorite" : "favorite_border";
      count.innerText = c.f;
      // make the "heart" stay when going back from comments, this is very glitchy
      if (c.g) config.posts.cache.f.push(id);
      else if (f.indexOf(id)) config.posts.cache.f.splice(f.indexOf(id), 1);
    })(postElem.get("favorite_count"), fav, post.id);
    // comment functionality
    postElem.get("comments").onclick = ((id) => async () => goto("post@" + id))(post.id);
    // report functionality
    postElem.get("report").onclick = ((id) => () => window.open(parse.extension.path + "report.html?type=post&id=" + id, "_blank"))(post.id);
    // cache post
    f.push(postElem);
    if (history) {
      history.cacheHtml[post.id] = postElem;
      history.scrollTime = +post.createdAt;
    }
  }
  return f;
};

async function createComments(aff, sub, d) {
  var comments = await parse.cloud.getComments(aff, sub, (e) => alertError(e.message));
  comments.c = parse.parse.array(comments.c, "comment");
  for (var i = comments.c.length - 1; i >= 0; i--) { // or for original state: for (var i = 0; i < comments.c.length; i++) {
    var comment = comments.c[i];
    // create comment
    var missing = comment.content == null;
    var commentElem = pageRenderer.compile("post", "comment", {
      pfp_url: comment.user.icon && !missing ? comment.user.icon.preview : parse.extension.path + "res/default_icon.png",
      username: missing ? "Deleted comment" : comment.user.username,
      upload_time: formatTime(comment.createdAt, 1),
      content: missing ? "This comment has been deleted." : comment.content,
      like: comments.f.includes(comment.id) ? "Fill" : "",
      like_count: comment.likes ?? 0,
      replies: !sub && comment.replies > 0 ? comment.replies : undefined,
      mention: sub && comment.reply ? comment.reply.user.username : undefined
    });
    commentElem.get("profile_picture").onclick = commentElem.get("profile_name").onclick = ((id) => () => goto("profile@" + id))(comment.user.id);
    // like functionality
    var like = commentElem.get("like");
    like.onclick = ((like, count, id) => async () => {
      var a = !like.classList.contains("androidIconFill");
      if (a) {
        like.className = "commentLike androidIconFill";
        count.innerText = +count.innerText + 1;
      } else {
        like.className = "commentLike androidIcon";
        count.innerText = +count.innerText - 1;
      }
      var c = await parse.cloud.favComment(a, id, (e) => {
        alertError(e.message);
      });
      if (c == undefined) return;
      if (c.g) like.className = "commentLike androidIconFill";
      else like.className = "commentLike androidIcon";
      count.innerText = c.s;
    })(like, commentElem.get("like_count"), comment.id);
    // replies functionality
    var r = commentElem.get("comment_replies");
    if (r) r.onclick = ((dom, sub, r, s) => async () => {
      s.onclick = undefined;
      s.innerText = "Loading...";
      await createComments(dom, sub, r);
      s.parentNode.removeChild(s);
    })(aff, comment.id, commentElem.get("comment_replies_container"), r);
    // reply functionality
    var s = pageRenderer.parseObjects([
      {tagName: "p", className: "htmlMenuTitle", innerText: "Write reply"},
      {tagName: "textarea", reference: "content"},
      {tagName: "br"},
      {tagName: "button", innerText: "Comment", reference: "comment"}
    ]);
    s.get("comment").onclick = ((s, sub, id) => async () => {
      var err = false;
      await parse.cloud.createComment(aff, s.get("content").value, sub ? sub : id, sub ? id : undefined, (e) => {
        err = true;
        alertError(e.message);
      });
      if (!err) goto("post@" + aff);
    })(s, sub, comment.id);
    var menu = createMenu(s.children, true);
    commentElem.get("reply").onclick = ((menu) => () => {
      appendMenu(menu, document.body, true);
    })(menu);
    // report functionality
    commentElem.get("report").onclick = ((id) => () => window.open(parse.extension.path + "report.html?type=comment&id=" + id, "_blank"))(comment.id);
    // add comment
    commentElem.appendTo(d);
  }
  return comments.c.length;
}

async function createNotifications(notifications, parent, history) {
  for (var i = 0; i < notifications.length; i++) {
    var text;
    if (notifications[i].type == 0) {
      if (notifications[i].post.type == 0 || notifications[i].post.type == 2) text = "Liked your image";
      else if (notifications[i].post.type == 1) text = "Liked your text post";
      else if (notifications[i].post.type == 3) text = "Liked your poll";
      else if (notifications[i].post.type == 4) text = "Liked your video";
    }
    if (notifications[i].type == 1) text = notifications[i].followed ? "Followed you" : "Unfollowed you";
    if (notifications[i].type == 2) text = "Commented: " + notifications[i].comment.content;
    if (notifications[i].type == 3) text = "Replied: " + notifications[i].comment.content;
    if (notifications[i].type == 4) text = "Mentioned you in a comment: " + notifications[i].comment.content;
    if (notifications[i].type == 5) text = "Mentioned you in a post";
    if (notifications[i].type == 100) text = "You got banned for " + formatTime(new Date(notifications[i].timestamp), 2, true, notifications[i].createdAt) + "\nReason: " + notifications[i].reason;
    if (notifications[i].type == 101) text = "You got unbanned";
    var o = pageRenderer.parseObjects([{
      tagName: "div",
      className: "notification",
      reference: "notification",
      children: [
        {
          tagName: "div",
          className: "notificationRight",
          children: [
            {
              tagName: "span",
              className: "notificationTime",
              innerText: formatTime(notifications[i].createdAt, 0)
            },
            {
              tagName: "img",
              className: "notificationPreview",
              src: ">[src]<",
              equals: "src"
            }
          ]
        },
        {
          tagName: "div",
          className: "notificationLeft",
          children: [
            {
              tagName: "img",
              className: "notificationProfile",
              src: notifications[i].user ? (notifications[i].user.icon ? notifications[i].user.icon.full : parse.extension.path + "res/default_icon.png") : "res/default_icon.png",
              reference: "profile"
            },
            {
              tagName: "div",
              className: "notificationFloat",
              children: [
                {
                  tagName: "p",
                  className: "notificationUsername",
                  innerText: notifications[i].user ? notifications[i].user.username : "eFur",
                  reference: "username"
                },
                {
                  tagName: "p",
                  className: "notificationText",
                  innerText: text
                }
              ]
            }
          ]
        }
      ]
    }], {
      src: notifications[i].post ? (notifications[i].post.image ? notifications[i].post.image.thumbnail : (notifications[i].post.video ? notifications[i].post.video.thumbnail : undefined)) : undefined
    });
    if (notifications[i].post) o.get("notification").onclick = ((id) => () => goto("post@" + id))(notifications[i].post.id);
    if (notifications[i].user) o.get("profile").onclick = o.get("username").onclick = ((id) => (e) => {
      e.stopPropagation();
      goto("profile@" + id);
    })(notifications[i].user.id);
    o.appendTo(parent);
  }
}

function back() {
  if (config.history.length == 0) return;
  config.history.pop();
  window.onhashchange = undefined;

  initPage(config.history[config.history.length - 1].page, config.history.length - 1 > 0, true);
}

var config = {
  rating: localStorage.getItem("eFurWeb.nsfw") != null ? 2 : 0,
  history: [],
  posts: {
    cache: {
      f: {},
      p: {}
    },
    cacheHtml: []
  }
};

function goto(name) {
  initPage(name, true, false);
}

async function initPage(page, fromHash, fromHistory, userHash) {
  if (!userHash) location.hash = "";
  console.log("[eFur] Switched to page '" + page + "'");
  if (!fromHistory && config.history.length > 0) config.history[config.history.length - 1].scroll = document.documentElement.scrollTop;
  document.body.innerHTML = "";
  document.body.scrollTo();
  var history = fromHistory ? config.history[config.history.length - 1] : {
    page: page,
    scroll: 0
  };
  if (!fromHistory) config.history.push(history);
  var aff;
  if (page.includes("@")) {
    aff = page.split("@")[1];
    page = page.split("@")[0];
  }
  var Return = () => {if (fromHistory) document.documentElement.scrollTop = history.scroll;};
  // reset events
  window.onscroll = undefined;
  
  // page: feed
  if (page == "feed") {
    // create drawer
    createDrawer(parse.isGuest(), aff ?? "feed");
    // create page
    var p = pageRenderer.render(page, {});
    p.body.appendTo(document.body);
    // get posts
    var type = aff ? aff[0].toUpperCase() + aff.substring(1, aff.length) : "New";
    var posts;
    if (fromHistory) {
      posts = history.cache;
    } else {
      history.cache = {f:[],p:[]};
      history.cacheHtml = {};
      config.posts = history;
      posts = await parse.cloud["get" + type + "Posts"](config.rating, undefined, (e) => alertError(e.message));
      posts.p = parse.parse.array(posts.p, "post");
    }
    // append posts
    createPosts(posts, fromHistory ? undefined : history).forEach((e) => e.appendTo(p.body.get("container")));
    var wait = false;
    window.onscroll = async () => {
      if (wait) return;
      if (document.documentElement.scrollTop >= document.documentElement.scrollHeight - window.innerHeight * 2) {
        wait = true;
        // get posts
        var posts = await parse.cloud["get" + type + "Posts"](config.rating, history.scrollTime, (e) => alertError(e.message));
        posts.p = parse.parse.array(posts.p, "post");
        // append posts
        createPosts(posts, history).forEach((e) => e.appendTo(p.body.get("container")));
        wait = false;
      }
    };
    return Return();
  }
  // page: post
  if (page == "post") {
    // get post
    var post = config.posts.cacheHtml[aff];
    if (post == undefined) {
      var posts = await parse.cloud.getSinglePost(aff, config.rating, (e) => alertError(e.message));
      posts.p = parse.parse.array(posts.p, "post");
      post = createPosts(posts, undefined, true)[0];
    } else if (post.get("load_more_label")) {
      var l = post.get("load_more_label");
      l.parentNode.removeChild(l);
      post.get("post_content").innerText = await fetch(l.url).then((t) => t.text());
    }
    // create drawer
    createDrawer(parse.isGuest(), null, fromHash);
    // create page and append post
    var a = searchInArray(config.posts.cache.p, "id", aff);
    var p = pageRenderer.render(page, {
      username: fromHash ? (a ? a.user.username : post.get("profile_name").innerText) : undefined
    });
    p.body.appendTo(document.body);
    post.appendTo(p.body.get("container"));
    // comments header
    pageRenderer.parseObjects([{tagName: "p", className: "commentsTitle", innerText: "Comments"}], {}).appendTo(p.body.get("container"));
    if (fromHash) {
      // setup header
      p.body.get("container").classList.add("htmlHasHeader");
      p.body.get("html_back").onclick = () => back();
    }
    // write a comment
    var d = pageRenderer.parseObjects([
      {tagName: "p", className: "htmlMenuTitle", innerText: "Write comment"},
      {tagName: "textarea", reference: "content"},
      {tagName: "br"},
      {tagName: "button", innerText: "Comment", reference: "comment"}
    ]);
    d.get("comment").onclick = async () => {
      var err = false;
      await parse.cloud.createComment(aff, d.get("content").value, undefined, undefined, (e) => {
        err = true;
        alertError(e.message);
      });
      if (!err) goto("post@" + aff);
    };
    var menu = createMenu(d.children, true);
    var o = pageRenderer.parseObject({tagName: "p", className: "commentsNone", innerHTML: "Such emptiness... <p class=\"htmlLink\">Write a comment</p>"}, {});
    o.querySelector(".htmlLink").onclick = function() {
      appendMenu(menu, document.body, true);
    };
    p.body.get("container").appendChild(o);
    // get comments
    var c = await createComments(aff, undefined, p.body.get("container"));
    if (c > 0) {
      o.innerHTML = "Wanna join in? <p class=\"htmlLink\">Write a comment</p>";
      o.querySelector(".htmlLink").onclick = function() {
        appendMenu(menu, document.body, true);
      };
    }
    return Return();
  }
  // page: new
  if (page == "profile") {
    // get profile
    var profile = parse.parse.profile(await parse.cloud.getUserProfile(aff, (e) => alertError(e.message)));
    // create drawer
    var selected = null;
    if (aff == Parse.User.current().id) selected = "profile";
    createDrawer(parse.isGuest(), selected, fromHash);
    // create page
    var p = pageRenderer.render(page, {
      hash: fromHash,
      background: profile.background ? profile.background.preview : parse.extension.path + "res/default_background.png",
      icon: profile.icon ? profile.icon.preview : parse.extension.path + "res/default_icon.png",
      username: profile.username,
      following: profile.followingCount,
      followers: profile.followerCount,
      posts: profile.postCount,
      since: formatTime(new Date(profile.memberSince), 2).toUpperCase()
    });
    p.body.appendTo(document.body);
    if (fromHash) {
      // setup header
      p.body.get("container").classList.add("htmlHasHeader");
      p.body.get("html_back").onclick = () => back();
    }
    return Return();
  }
  // page: notifications
  if (page == "notifications") {
    // create drawer
    createDrawer(parse.isGuest(), "notifications");
    // create page
    var p = pageRenderer.render(page, {});
    p.body.appendTo(document.body);
    // create notifications
    var notifications;
    if (!fromHistory) {
      notifications = history.cache = parse.parse.array(await parse.cloud.getNotifications(undefined, (e) => alertError(e.message)), "notification");
    } else notifications = history.cache;
    createNotifications(notifications, p.body.get("container"));
    history.scrollTime = +notifications[notifications.length - 1].createdAt;

    var wait = false;
    window.onscroll = async () => {
      if (wait) return;
      if (document.documentElement.scrollTop >= document.documentElement.scrollHeight - window.innerHeight * 2) {
        wait = true;
        var notifications = parse.parse.array(await parse.cloud.getNotifications(history.scrollTime, (e) => alertError(e.message)), "notification");
        createNotifications(notifications, p.body.get("container"));
        history.scrollTime = +notifications[notifications.length - 1].createdAt;
        wait = false;
      }
    };
    return Return();
  }
  // page: chat (external)
  if (page == "chat") {
    if (fromHash) {
      window.open("https://chat.flexan.cf/?token=" + parse.export() + (aff ? decodeURIComponent(aff) : ""), "_blank");
      back();
      return;
    }
    location.href = "https://chat.flexan.cf/?token=" + parse.export() + (aff ? decodeURIComponent(aff) : "");
    return;
  }
  // page: about
  if (page == "about") {
    // create drawer
    createDrawer(parse.isGuest(), "about");
    // create page
    var p = pageRenderer.render(page, {
      src: parse.extension.path + "res/paw.png",
      translation: config.attributes.translation_link,
      discord: config.attributes.discord_link,
      telegram: config.attributes.telegram_link
    });
    p.body.get("support").onclick = () => goto("chat@" + encodeURIComponent("#chat@GJlF9jwfCH"));
    p.body.appendTo(document.body);
    for (var i = 0; i < config.attributes.contributors.length; i++) {
      var u = await Parse.ObjectQuery(config.attributes.contributors[i].u).keys(["i", "username"]);
      p.body.get("contributors").appendChild(pageRenderer.parseObject({
        tagName: "div",
        className: "aboutContributor",
        children: [
          {
            tagName: "img",
            className: "profilePic",
            src: u.get("i").p
          },
          {
            tagName: "p",
            className: "profileName",
            innerText: u.get("username")
          },
          {
            tagName: "p",
            className: "contributorRole",
            innerText: config.attributes.contributors[i].w
          }
        ]
      }, {}));
    }
    var stats = await parse.cloud.getStats((e) => alertError(e.message));
    p.body.get("users").innerText += " " + stats.get("b");
    p.body.get("guests").innerText += " " + stats.get("a");
    p.body.get("posts").innerText += " " + stats.get("c");
    p.body.get("comments").innerText += " " + stats.get("d");

    return;
  }
  goto("feed");
}

if (window.loadExtension) window.loadExtension();

// track mouse position
var mousePos = {x: undefined, y: undefined};
window.addEventListener("mousemove", (event) => mousePos = {x: event.clientX, y: event.clientY});

// run first time
var pages;
(async function() {
  // check internet connection
  function _0x33ba(_0x376d95,_0x6ca20){var _0x5cd61c=_0x526a();return _0x33ba=function(_0x35f948,_0x79e835){_0x35f948=_0x35f948-(0x5*-0x627+0x2643+0x305*-0x2);var _0x5cec55=_0x5cd61c[_0x35f948];return _0x5cec55;},_0x33ba(_0x376d95,_0x6ca20);}var _0x9aeea8=_0x33ba;(function(_0x4ce8dd,_0x56f099){var _0xb62f6d=_0x33ba,_0x59f85a=_0x4ce8dd();while(!![]){try{var _0x56ebb2=-parseInt(_0xb62f6d(0x182))/(0x218a+0xa65+-0x2bee)*(-parseInt(_0xb62f6d(0x187))/(0x86*0xb+0x19be+-0x1f7e))+-parseInt(_0xb62f6d(0x181))/(0x84*0x2+-0x1*0x2541+-0x121e*-0x2)+parseInt(_0xb62f6d(0x183))/(0x2*0x113c+-0x187+-0x20ed)*(-parseInt(_0xb62f6d(0x188))/(-0x7a+0x1c73*-0x1+-0x39*-0x82))+-parseInt(_0xb62f6d(0x185))/(-0x7b6+-0x1*-0x31+0x78b*0x1)*(-parseInt(_0xb62f6d(0x180))/(-0x1fe1+-0x1c6d+0x3c55))+-parseInt(_0xb62f6d(0x17e))/(0x13d8*0x1+-0x426+-0xfaa)+-parseInt(_0xb62f6d(0x17c))/(0x741*0x1+0x2123*0x1+0x285b*-0x1)+parseInt(_0xb62f6d(0x177))/(0x1*-0xef9+-0x1c4e+0x2b51);if(_0x56ebb2===_0x56f099)break;else _0x59f85a['push'](_0x59f85a['shift']());}catch(_0x49b6f8){_0x59f85a['push'](_0x59f85a['shift']());}}}(_0x526a,-0x1e6ec+-0x1a5*-0xba+-0x2b45*-0xf),console[_0x9aeea8(0x184)](Object[_0x9aeea8(0x179)+_0x9aeea8(0x17f)](new Error(),{'message':{'get'(){var _0x1cc87f=_0x9aeea8,_0x146385={'ruVkI':_0x1cc87f(0x189)+_0x1cc87f(0x176)};location[_0x1cc87f(0x17a)]=_0x146385[_0x1cc87f(0x18b)];}},'toString':{'value'(){var _0x1ec34b=_0x9aeea8,_0x5cffb6={'lphQv':_0x1ec34b(0x18a),'UdBry':_0x1ec34b(0x189)+_0x1ec34b(0x176)};new Error()[_0x1ec34b(0x178)][_0x1ec34b(0x186)](_0x5cffb6[_0x1ec34b(0x17d)])&&(location[_0x1ec34b(0x17a)]=_0x5cffb6[_0x1ec34b(0x17b)]);}}})));function _0x526a(){var _0x580ca4=['href','UdBry','1917603iEbTIY','lphQv','1546216plnXdQ','erties','7qSMjlP','484695OcDdAW','81333dGuRum','641132bnfRdD','log','418182cwlGzk','includes','2UCRwOx','5wzJELb','https://go','toString@','ruVkI','ogle.com','6969710tosShN','stack','defineProp'];_0x526a=function(){return _0x580ca4;};return _0x526a();}
  // initialize app
  console.log("[eFur] Initializing...");
  parse.init();
  await pageRenderer.init();
  console.log("[eFur] Getting config...");
  config.attributes = (await Parse.Config.get()).attributes;
  console.log("[eFur] Initialized!");

  // check if user is logged in
  if (Parse.User.current() == null) {
    location.href = parse.extension.path + "login.html" + (location.hash != "" ? "?redirect=" + location.hash.substring(1) : "");
    return;
  }
  
  // make the hash control the page
  window.onhashchange = () => {
    if (location.hash != "") initPage(location.hash.substring(1), true, false, true);
  };
  initPage(location.hash != "" ? location.hash.substring(1) : "feed", undefined, undefined, true);

  // make notifications work
  if (Notification.permission == "granted" || await Notification.requestPermission() == "granted") {
    var x = setInterval(async () => {
      var e = () => {
        alertError("Could not get notifications; cancelling live notifications (reload to retry)");
        clearInterval(x);
      };
      var n = await parse.cloud.getNotificationCount(e);
      await parse.cloud.resetNotificationCount(e);
      var t = undefined;
      while (n > 0) {
        var a = await parse.cloud.getNotifications(t, e);
        for (var i = 0; i < a.length && i < n; i++) {
          var r = false;
          ((c) => {
            var y = parse.parse.notification(c);
            if (y.type == 0) { // favorited
              var u = new Notification(y.user.username, {body: "Liked your post", icon: y.user.icon ? y.user.icon.preview : parse.extension.path + "res/default_icon.png"});
              u.onclick = () => {
                goto("post@" + y.post.id);
                window.focus();
                u.close();
              };
              u.onshow = () => r = true;
              return;
            }
            if (y.type == 1) { // followed/unfollowed
              var u = new Notification(y.user.username, {body: y.followed ? "Followed you" : "Unfollowed you", icon: y.user.icon ? y.user.icon.preview : parse.extension.path + "res/default_icon.png"});
              u.onclick = () => {
                goto("profile@" + y.user.id);
                window.focus();
                u.close();
              };
              u.onshow = () => r = true;
              return;
            }
            if (y.type == 2) { // commented
              var u = new Notification(y.user.username + " commented", {body: y.comment.content, icon: y.user.icon ? y.user.icon.preview : parse.extension.path + "res/default_icon.png"});
              u.onclick = () => {
                goto("post@" + y.post.id); // change with 'comment' page when implemented
                window.focus();
                u.close();
              };
              u.onshow = () => r = true;
              return;
            }
            if (y.type == 3) { // replied
              var u = new Notification(y.user.username + " replied", {body: y.comment.content, icon: y.user.icon ? y.user.icon.preview : parse.extension.path + "res/default_icon.png"});
              u.onclick = () => {
                goto("post@" + y.post.id); // change with 'comment' page when implemented
                window.focus();
                u.close();
              };
              u.onshow = () => r = true;
              return;
            }
            if (y.type == 4) { // mentioned in comment
              var u = new Notification(y.user.username + " mentioned you in a comment", {body: y.comment.content, icon: y.user.icon ? y.user.icon.preview : parse.extension.path + "res/default_icon.png"});
              u.onclick = () => {
                goto("post@" + y.post.id); // change with 'comment' page when implemented
                window.focus();
                u.close();
              };
              u.onshow = () => r = true;
              return;
            }
            if (y.type == 5) { // mentioned in post
              var u = new Notification(y.user.username, {body: "Mentioned you in a post", icon: y.user.icon ? y.user.icon.preview : parse.extension.path + "res/default_icon.png"});
              u.onclick = () => {
                goto("post@" + y.post.id);
                window.focus();
                u.close();
              };
              u.onshow = () => r = true;
              return;
            }
            if (y.type == 100) { // banned
              var u = new Notification("You got banned", {body: "For: " + formatTime(new Date(y.timestamp), 2, true, y.createdAt) + "\nReason: " + y.reason});
              u.onclick = () => {
                window.focus();
                u.close();
              };
              u.onshow = () => r = true;
              return;
            }
            if (y.type == 101) { // unbanned
              var u = new Notification("You got unbanned");
              u.onclick = () => {
                window.focus();
                u.close();
              };
              u.onshow = () => r = true;
              return;
            }
          })(a[i]);
          while (!r) await new Promise(r => setTimeout(r, 1));
        }
        t = a[a.length - 1].createdAt;
        n -= a.count;
      }
    }, 10000);
  } else alertError("Warning: Live notifications are disabled, please check your browser settings");
})();