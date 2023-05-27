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
  requireAccount: function() {
    if (this.isGuest()) {
      alertError("An account is needed to perform this action!", {
        text: "Login",
        url: this.extension.path + "login.html"
      });
      return true;
    }
    return false;
  },
  cloud: {
    version: 104,
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
    getUserProfileAbout: async function(userId, error) {
      return await this.run("getUserProfileAbout", {
        u: userId
      }).catch(error);
    },
    getGalleryPosts: async function(userId, rating, timestamp, error) {
      return await this.run("getGalleryPosts", {
        d: timestamp,
        r: rating,
        u: userId
      }).catch(error);
    },
    getGalleryFavPosts2: async function(userId, rating, timestamp, error) {
      return await this.run("getGalleryFavPosts2", {
        d: timestamp,
        r: rating,
        u: userId
      }).catch(error);
    },
    getFollowers: async function(userId, returnFollowing, timestamp, error) {
      return await this.run("getFollowers", {
        d: timestamp,
        f: returnFollowing,
        u: userId
      }).catch(error);
    },
    getProfileComments: async function(userId, timestamp, error) {
      return await this.run("getProfileComments", {
        d: timestamp,
        u: userId
      }).catch(error);
    },
    createPost2: async function(type, file, thumbnail, width, height, title, content, description, artist, source, tags, categories, rating, hideFromFeed, preventDownloads, error) {
      return await this.run("createPost2", {
        a: width,
        b: height,
        c: categories,
        e: artist,
        f: title,
        g: content,
        h: file,
        i: description,
        j: thumbnail,
        l: preventDownloads,
        r: rating,
        s: source,
        t: tags,
        u: type,
        x: hideFromFeed
      }).catch(error);
    },
    deletePost: async function(postId, error) {
      return await this.run("deletePost", {
        p: postId
      }).catch(error);
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
    },
    follow: function(obj) {
      if (obj == undefined) return;
      return {
        id: obj.id,
        follower: this.user(obj.get("f")),
        following: this.user(obj.get("t")),
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
        if (!e[i].readonly) d.addEventListener("click", ((t) => () => {
          if (t.classList.contains("checked")) return;
          var n = t.getAttribute("name");
          var c = document.querySelector("radio.checked" + (n != null ? "[name=" + n + "]" : ""));
          if (c) c.classList.remove("checked");
          t.classList.add("checked");
        })(d));
      }
      if (e[i].tagName == "checkbox") {
        if (e[i].selected) d.classList.add("checked");
        if (!e[i].readonly) d.addEventListener("click", ((t) => () => {
          var n = t.getAttribute("name");
          if (t.classList.contains("checked")) t.classList.remove("checked");
          else if (t.max == undefined || document.querySelectorAll("checkbox.checked" + (n != null ? "[name=" + n + "]" : "")).length < t.max) t.classList.add("checked");
        })(d));
      }
      if (e[i].tagName == "switch") {
        if (e[i].selected) d.classList.add("on");
        if (!e[i].readonly) d.addEventListener("click", ((t) => () => {
          if (t.classList.contains("on")) t.classList.remove("on");
          else t.classList.add("on");
        })(d));
      }
      var z = y(e[i].children, o);
      for (var q = 0; q < z.length; q++) d.appendChild(z[q]);
      var k = Object.keys(e[i]);
      k.splice(k.indexOf("tagName"), 1);
      if (k.includes("children")) k.splice(k.indexOf("children"), 1);
      if (k.includes("equals")) k.splice(k.indexOf("equals"), 1);
      for (var q = 0; q < k.length; q++) {
        var w = e[i][k[q]];
        if (typeof w != "string") {
          if (k[q].startsWith("__")) d.setAttribute(k[q].substring(2), w);
          else d[k[q]] = w;
          continue;
        }
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

function alertError(msg, link) {
  var err = document.createElement("p");
  err.className = "error";
  err.innerText = msg;
  if (link) err.appendChild(pageRenderer.parseObject({
    tagName: "a",
    className: "errorLink",
    innerText: link.text,
    href: link.url
  }));
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

// totally not stolen from https://stackoverflow.com/a/63474748
function getVideoCover(file, seekTo = 0.0) {
  return new Promise((resolve, reject) => {
    var videoPlayer = document.createElement('video');
    videoPlayer.setAttribute("src", URL.createObjectURL(file));
    videoPlayer.load();
    videoPlayer.addEventListener("error", (ex) => reject("error when loading video file", ex));
    videoPlayer.addEventListener("loadedmetadata", () => {
      if (videoPlayer.duration < seekTo) {
        reject("video is too short.");
        return;
      }
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      videoPlayer.addEventListener("seeked", () => {
        var canvas = document.createElement("canvas");
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        ctx.canvas.toBlob(
          blob => resolve(blob),
          "image/jpeg",
          0.75 // result quality/compression
        );
      });
    });
  });
}

function getImageDimensions(file) {
  return new Promise(rs => {
    var fr = new FileReader();
    fr.onload = () => {
      var img = new Image();
      img.onload = () => {
        rs({width: img.width, height: img.height});
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

function getVideoDimensions(file){
  return new Promise(rs => {
    var video = document.createElement("video");
    video.onloadedmetadata = () => rs({width: video.videoWidth, height: video.videoHeight});
    video.src = URL.createObjectURL(file);
  });
}

function createDrawer(isGuest, selected, padded) {
  // create drawer
  var drawer = pageRenderer.compile("app", "drawer", {
    login: isGuest ? "Log in" : undefined,
    mode: config.settings.sb > 1 && config.settings.sc > 0 ? (config.rating > 0 ? "SFW" : "NSFW") : undefined,
    mode_color: config.rating > 0 ? "lime" : "orange",
    username: Parse.User.current().get("username")
  });
  if (padded) drawer.get("drawer").classList.add("padding");
  drawer.appendTo(document.body);
  if (selected != null) drawer.get(selected).classList.add("selected");
  // create actions
  if (drawer.get("login")) drawer.get("login").onclick = () => location.href = parse.extension.path + "login.html";
  if (config.settings.sb > 1 && config.settings.sc > 0) drawer.get("mode").onclick = () => {
    if (config.rating > 0) localStorage.removeItem("eFurWeb.nsfw");
    else {
      if (parse.requireAccount()) return;
      if (config.settings.sc == 1) localStorage.setItem("eFurWeb.nsfw", "1");
      else if (config.settings.sc == 2) localStorage.setItem("eFurWeb.nsfw", "2");
    }
    location.reload();
  };
  drawer.get("following").onclick = () => goto("feed@following");
  drawer.get("feed").onclick = () => goto("feed");
  drawer.get("news").onclick = () => goto("feed@news");
  drawer.get("notifications").onclick = () => goto("notifications");
  drawer.get("messages").onclick = () => goto("chat");
  drawer.get("discover").onclick = () => alert("Coming soon!");
  drawer.get("create").onclick = () => goto("createchooser");
  drawer.get("profile").onclick = () => goto("profile@" + Parse.User.current().id);
  drawer.get("settings").onclick = () => goto("settings");
  drawer.get("about").onclick = () => goto("about");
}

function createMenu(items, raw, excludeBreak) {
  var menu = document.createElement("div");
  menu.className = "htmlMenu";
  if (!raw) {
    for (var i = 0; i < items.length; i++) {
      var item = document.createElement("p");
      item.className = "htmlMenuItem";
      item.innerText = items[i].innerText;
      item.onclick = ((c) => () => {
        c();
        if (!excludeBreak) menu.break();
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

function appendInfo(menu, appendTo, hasHeader) {
  menu.style.position = "fixed";
  menu.style.right = "10px";
  menu.style.top = hasHeader ? "80px" : "10px";
  menu.classList.add("postInfoMenu");
  appendTo.appendChild(menu);
}

function registerTabs(tabs) {
  var q = tabs.querySelectorAll("tab");
  for (var i = 0; i < q.length; i++) {
    q[i].onclick = ((tabs, v, c) => () => {
      var f = tabs.querySelector("tab.selected");
      if (f == v) return;
      if (f) f.classList.remove("selected");
      v.classList.add("selected");
      if (c) c();
      v.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    })(tabs, q[i], q[i].onclick);
  }
}

async function translatePost(post, postElem) {
  var storyText = postElem.get("post_content") ?? {innerText:""};
  postElem.get("body").innerHTML = "<p class=\"mediaPost postTitle\">Translating...</p>";
  post.translated = true;
  // recreate content
  //   image/gif
  if (post.type == 0 || post.type == 2) {
    var response = await fetch("https://translate.flexan.cf/translate?text=" + encodeURIComponent((post.title ?? "") + "<!>" + (post.artist ?? "") + "<!>" + (post.description ?? "")) + "&tlang=" + config.lang).then((j) => j.json()).catch((e) => {return {success:false,error:e.message}});
    if (!response.success) {
      postElem.get("body").querySelector("p").innerText = response.error;
      return;
    }
    postElem.get("body").innerHTML = "";
    pageRenderer.compile("feed", "imageBody", {
      post_title: response.output.text.split("<!>")[0].trim() == "" ? undefined : response.output.text.split("<!>")[0],
      post_pic_url: post.type == 2 ? post.image.full : post.image.preview,
      post_artist: response.output.text.split("<!>")[1].trim() == "" ? undefined : response.output.text.split("<!>")[1],
      post_desc: response.output.text.split("<!>")[2].trim() == "" ? undefined : response.output.text.split("<!>")[2]
    }).appendTo(postElem.get("body"));
    return;
  }
  //   story
  if (post.type == 1) {
    var response = await fetch("https://translate.flexan.cf/translate?text=" + encodeURIComponent((post.title ?? "") + "<!>" + (post.artist ?? "") + "<!>" + (post.description ?? "") + "<!>" + (storyText.innerText ?? "")) + "&tlang=" + config.lang).then((j) => j.json()).catch((e) => {return {success:false,error:e.message}});
    if (!response.success) {
      postElem.get("body").querySelector("p").innerText = response.error;
      return;
    }
    postElem.get("body").innerHTML = "";
    pageRenderer.compile("feed", "storyBody", {
      post_title: response.output.text.split("<!>")[0].trim() == "" ? undefined : response.output.text.split("<!>")[0],
      post_content: response.output.text.split("<!>")[3].trim() == "" ? undefined : response.output.text.split("<!>")[3],
      post_artist: response.output.text.split("<!>")[1].trim() == "" ? undefined : response.output.text.split("<!>")[1],
      post_desc: response.output.text.split("<!>")[2].trim() == "" ? undefined : response.output.text.split("<!>")[2]
    }).appendTo(postElem.get("body"));
    return;
  }
  //   poll
  if (post.type == 3) {
    var response = await fetch("https://translate.flexan.cf/translate?text=" + encodeURIComponent((post.poll.title ?? "") + "<!>" + (post.artist ?? "") + "<!>" + (post.description ?? "")) + "&tlang=" + config.lang).then((j) => j.json()).catch((e) => {return {success:false,error:e.message}});
    if (!response.success) {
      postElem.get("body").querySelector("p").innerText = response.error;
      return;
    }
    var loadPoll = (postElem, post, pollVote) => {
      if (!pollVote && post.user.id == Parse.User.current().id) {
        loadPoll(postElem, post, {
          options: []
        });
        return;
      }
      postElem.get("body").innerHTML = "";
      var poll = pageRenderer.compile("feed", "pollBody", {
        poll_title: response.output.text.split("<!>")[0].trim() == "" ? undefined : response.output.text.split("<!>")[0],
        poll_count: post.poll.total_votes,
        post_artist: response.output.text.split("<!>")[1].trim() == "" ? undefined : response.output.text.split("<!>")[1],
        post_desc: response.output.text.split("<!>")[2].trim() == "" ? undefined : response.output.text.split("<!>")[2]
      });
      var a = [];
      for (var z = 0; z < post.poll.options.length; z++) {
        var r = [{tagName: post.poll.multi ? "checkbox" : "radio", innerText: post.poll.options[z], __name: "poll-" + post.poll.id, voteIndex: z + ""}];
        if (pollVote) {
          r[0].readonly = true;
          r[0].selected = pollVote.options.includes(z);
          r.push({tagName: "p", innerText: post.poll.votes[z] + " furs" + (post.poll.total_choices > 0 ? ", " + Math.floor(post.poll.votes[z] / +post.poll.total_choices * 100) + "%" : ""), className: "pollResult"});
        }
        r.push({tagName: "br"});
        var o = pageRenderer.parseObjects(r, {});
        a.push(o.children[0]);
        o.appendTo(poll.get("poll_options"));
      }
      poll.appendTo(postElem.get("body"));
      var submit = poll.get("poll_submit");
      submit.onclick = async () => {
        var v = [];
        if (post.poll.multi) {
          // multi
          var s = document.querySelectorAll("checkbox.checked[name=poll-" + post.poll.id + "]");
          if (s.length == 0) {
            alertError("Select at least one option!");
            return;
          }
          for (var x = 0; x < s.length; x++) v.push(+s[x].voteIndex);
        } else {
          // single
          var s = document.querySelector("radio.checked[name=poll-" + post.poll.id + "]");
          if (s == null) {
            alertError("Select at least one option!");
            return;
          }
          v.push(+s.voteIndex);
        }
        // vote on poll
        var r = parse.parse.pollVote(await parse.cloud.voteOnPoll(post.poll.id, v, (e) => alertError(e.message)));
        loadPoll(postElem, post, r);
      };
      if (!pollVote) (async () => {
        var v = parse.parse.pollVote(await parse.cloud.getPollVote(post.poll.id, (e) => alertError(e.message)));
        if (v != null) loadPoll(postElem, post, v);
      })();
      else submit.parentNode.removeChild(submit);
    };
    loadPoll(postElem, post);
    return;
  }
  //   video
  if (post.type == 4) {
    var response = await fetch("https://translate.flexan.cf/translate?text=" + encodeURIComponent((post.title ?? "") + "<!>" + (post.artist ?? "") + "<!>" + (post.description ?? "")) + "&tlang=" + config.lang).then((j) => j.json()).catch((e) => {return {success:false,error:e.message}});
    if (!response.success) {
      postElem.get("body").querySelector("p").innerText = response.error;
      return;
    }
    postElem.get("body").innerHTML = "";
    pageRenderer.compile("feed", "videoBody", {
      post_title: response.output.text.split("<!>")[0].trim() == "" ? undefined : response.output.text.split("<!>")[0],
      post_thumb_url: post.video.preview,
      post_vid_url: post.video.video,
      post_artist: response.output.text.split("<!>")[1].trim() == "" ? undefined : response.output.text.split("<!>")[1],
      post_desc: response.output.text.split("<!>")[2].trim() == "" ? undefined : response.output.text.split("<!>")[2]
    }).appendTo(postElem.get("body"));
    return;
  }
}

function createPostContent(post, postElem, fullFeatures) {
  postElem.get("body").innerHTML = "";
  post.translated = false;
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
      if (!pollVote && post.user.id == Parse.User.current().id) {
        loadPoll(postElem, post, {
          options: []
        });
        return;
      }
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
          r.push({tagName: "p", innerText: post.poll.votes[z] + " furs" + (post.poll.total_choices > 0 ? ", " + Math.floor(post.poll.votes[z] / +post.poll.total_choices * 100) + "%" : ""), className: "pollResult"});
        }
        r.push({tagName: "br"});
        var o = pageRenderer.parseObjects(r, {});
        a.push(o.children[0]);
        o.appendTo(poll.get("poll_options"));
      }
      poll.appendTo(postElem.get("body"));
      var submit = poll.get("poll_submit");
      submit.onclick = async () => {
        var v = [];
        if (post.poll.multi) {
          // multi
          var s = document.querySelectorAll("checkbox.checked[name=poll-" + post.poll.id + "]");
          if (s.length == 0) {
            alertError("Select at least one option!");
            return;
          }
          for (var x = 0; x < s.length; x++) v.push(+s[x].voteIndex);
        } else {
          // single
          var s = document.querySelector("radio.checked[name=poll-" + post.poll.id + "]");
          if (s == null) {
            alertError("Select at least one option!");
            return;
          }
          v.push(+s.voteIndex);
        }
        // vote on poll
        var r = parse.parse.pollVote(await parse.cloud.voteOnPoll(post.poll.id, v, (e) => alertError(e.message)));
        loadPoll(postElem, post, r);
      };
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
    postElem.apiPost = post;
    postElem.get("profile_picture").onclick = postElem.get("profile_name").onclick = ((id) => () => goto("profile@" + id))(post.user.id);
    // add menu to post
    var options = [
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
      })(post.id)},
      {innerText: "Translate", onclick: ((post, postElem, fullFeatures) => async () => {
        if (!localStorage.getItem("eFurWeb.subscription")) {
          alertError("Enable 'Preview features' in settings to use this feature.");
          return;
        }
        if (!post.translated) translatePost(post, postElem);
        else createPostContent(post, postElem, fullFeatures);
      })(post, postElem, fullFeatures)}
    ];
    if (post.user.id == Parse.User.current().id) options.push({innerText: "Delete", onclick: ((id, elem) => async () => {
      await parse.cloud.deletePost(id, (e) => alertError(e.message));
      alert("Successfully deleted your post!");
      elem.get("post").parentNode.removeChild(elem.get("post"));
    })(post.id, postElem)});
    var menu = createMenu(options);
    postElem.get("more").onclick = ((menu) => () => {
      appendMenu(menu, document.body);
    })(menu);
    // create content
    createPostContent(post, postElem, fullFeatures);
    // favorite functionality
    var fav = postElem.get("isfavorite");
    postElem.get("favorite").onclick = ((count, fav, id) => async () => {
      if (parse.requireAccount()) return;
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
      if (parse.requireAccount()) return;
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
      if (parse.requireAccount()) return;
      var err = false;
      await parse.cloud.createComment(aff, s.get("content").value, sub ? sub : id, sub ? id : undefined, (e) => {
        err = true;
        alertError(e.message);
      });
      if (!err) goto("post@" + aff, true);
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
  if (config.history.length == 0) return goto("feed");
  config.history.pop();
  window.onhashchange = undefined;

  initPage(config.history[config.history.length - 1].page, config.history.length - 1 > 0, true);
}

var config = {
  rating: localStorage.getItem("eFurWeb.nsfw") != null ? +localStorage.getItem("eFurWeb.nsfw") : 0,
  history: [],
  posts: {
    cache: {
      f: {},
      p: {}
    },
    cacheHtml: []
  },
  busy: false,
  lang: "en"
};

async function goto(name, removeTraces) {
  if (config.busy) return;
  config.busy = true;
  await initPage(name, true, false);
  if (removeTraces) config.history.pop();
  config.busy = false;
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
    // create info menu
    if (!localStorage.getItem("eFurWeb.disablePostInfo")) {
      (async () => {
        var menu = [{tagName: "p", className: "postInfoHeader", innerText: "Favourited by"}];
        var favedBy = await parse.cloud.getPostFavedBy(aff, (e) => alertError(e.message));
        for (var i = 0; i < favedBy.length; i++) {
          var user = parse.parse.user(favedBy[i].get("u"));
          menu.push({
            tagName: "img",
            className: "postInfoIcon",
            src: user.icon ? user.icon.preview : parse.extension.path + "res/default_icon.png",
            onclick: ((id) => () => goto("profile@" + id))(user.id)
          });
        }
        menu.push({tagName: "p", className: "postInfoHeader", innerText: "Details"});
        menu.push({tagName: "p", className: "postInfoText", innerText: "Artist: " + (post.apiPost.artist ?? "None")});
        menu.push({tagName: "p", className: "postInfoText", innerText: "Source: " + (post.apiPost.source ?? "None")});
        if (post.apiPost.type == 0 || post.apiPost.type == 2 || post.apiPost.type == 4) menu.push({tagName: "p", className: "postInfoText", innerText: "Dimensions: " + post.apiPost.image_width + "x" + post.apiPost.image_height});
        menu.push({tagName: "p", className: "postInfoText", innerText: "Tags: " + post.apiPost.tags.join(", ")});
        if (config.history[config.history.length - 1].page == page + "@" + aff) appendInfo(createMenu(pageRenderer.parseObjects(menu, {}).children, true, true), document.body, true);
      })();
    }
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
      if (!err) goto("post@" + aff, true);
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
  // page: profile
  if (page == "profile") {
    // create drawer
    var selected = null;
    if (aff == Parse.User.current().id) selected = "profile";
    createDrawer(parse.isGuest(), selected, false);
    // get profile
    var profile = parse.parse.profile(await parse.cloud.getUserProfile(aff, (e) => alertError(e.message)));
    // recreate drawer
    document.body.innerHTML = "";
    createDrawer(parse.isGuest(), selected, fromHash);
    // create page
    var p = pageRenderer.render(page, {
      hash: fromHash,
      background: profile.background ? profile.background.preview : parse.extension.path + "res/default_background.png",
      icon: profile.icon ? profile.icon.preview : parse.extension.path + "res/default_icon.png",
      username: profile.username,
      following: profile.followingCount ?? 0,
      followers: profile.followerCount ?? 0,
      posts: profile.postCount ?? 0,
      since: formatTime(new Date(profile.memberSince), 2).toUpperCase()
    });
    // setup tabs
    p.body.get("tab_about").onclick = async () => {
      window.onscroll = undefined;
      p.body.get("info_page").innerHTML = "";
      var x = pageRenderer.compile("profile", "about", {});
      x.appendTo(p.body.get("info_page"));
      // get stats
      var stats = await parse.cloud.getUserProfileAbout(aff, (e) => alertError(e.message));
      if (stats.i) x.get("presentation").innerHTML = DOMPurify.sanitize(marked.parse(stats.i));
      if (stats.s) x.get("stats").innerText = [
        (stats.s.g ?? "0") + " posts created",
        (stats.s.e ?? "0") + " comments written",
        (stats.s.f ?? "0") + " comments received",
        (stats.s.c ?? "0") + " liked posts",
        (stats.s.d ?? "0") + " likes received",
        (stats.s.a ?? "0") + " users followed",
        (stats.s.b ?? "0") + " followers"
      ].join("\n");
    };
    p.body.get("tab_gallery").onclick = async () => {
      window.onscroll = undefined;
      p.body.get("info_page").innerHTML = "";
      var x = pageRenderer.compile("profile", "gallery", {});
      x.appendTo(p.body.get("info_page"));
      // get posts
      var posts = await parse.cloud.getGalleryPosts(aff, config.rating, undefined, (e) => alertError(e.message));
      posts.p = parse.parse.array(posts.p, "post");
      var y = (posts) => {
        for (var i = 0; i < posts.p.length; i++) {
          history.scrollTime = +posts.p[i].createdAt;
          var d = document.createElement("div");
          d.className = "cell";
          d.onclick = ((id) => () => {
            goto("post@" + id);
          })(posts.p[i].id);
          p.body.get("view").appendChild(d);
          if (posts.p[i].type == 0 || posts.p[i].type == 2) { // image/gif
            pageRenderer.parseObjects([{
              tagName: "img",
              src: posts.p[i].image.thumbnail
            }], {}).appendTo(d);
            continue;
          }
          if (posts.p[i].type == 1) { // story
            pageRenderer.parseObjects([{
              tagName: "p",
              className: "icon textIcon androidIcon",
              innerText: "format_size"
            },
            {
              tagName: "p",
              className: "text",
              innerText: posts.p[i].content
            }], {}).appendTo(d);
            continue;
          }
          if (posts.p[i].type == 3) { // poll
            pageRenderer.parseObjects([{
              tagName: "p",
              className: "icon androidIcon",
              innerText: "poll"
            },
            {
              tagName: "p",
              innerText: posts.p[i].poll.title
            }], {}).appendTo(d);
            continue;
          }
        }
      };
      y(posts);
      
      var wait = false;
      window.onscroll = async () => {
        if (wait) return;
        if (document.documentElement.scrollTop >= document.documentElement.scrollHeight - window.innerHeight * 2) {
          wait = true;
          var posts = await parse.cloud.getGalleryPosts(aff, config.rating, history.scrollTime, (e) => alertError(e.message));
          posts.p = parse.parse.array(posts.p, "post");
          y(posts);
          wait = false;
        }
      };
    };
    p.body.get("tab_favourites").onclick = async () => {
      window.onscroll = undefined;
      p.body.get("info_page").innerHTML = "";
      var x = pageRenderer.compile("profile", "gallery", {});
      x.appendTo(p.body.get("info_page"));
      // get posts
      var posts = await parse.cloud.getGalleryFavPosts2(aff, config.rating, undefined, (e) => alertError(e.message));
      var y = (posts) => {
        for (var i = 0; i < posts.f.length; i++) {
          var x = parse.parse.post(posts.f[i].p);
          history.scrollTime = +x.createdAt;
          var d = document.createElement("div");
          d.className = "cell";
          d.onclick = ((id) => () => {
            goto("post@" + id);
          })(x.id);
          p.body.get("view").appendChild(d);
          if (x.type == 0 || x.type == 2) { // image/gif
            pageRenderer.parseObjects([{
              tagName: "img",
              src: x.image.thumbnail
            }], {}).appendTo(d);
            continue;
          }
          if (x.type == 1) { // story
            pageRenderer.parseObjects([{
              tagName: "p",
              className: "icon textIcon androidIcon",
              innerText: "format_size"
            },
            {
              tagName: "p",
              className: "text",
              innerText: x.content
            }], {}).appendTo(d);
            continue;
          }
          if (x.type == 3) { // poll
            pageRenderer.parseObjects([{
              tagName: "p",
              className: "icon androidIcon",
              innerText: "poll"
            },
            {
              tagName: "p",
              innerText: x.poll.title
            }], {}).appendTo(d);
            continue;
          }
        }
      };
      y(posts);
      
      var wait = false;
      window.onscroll = async () => {
        if (wait) return;
        if (document.documentElement.scrollTop >= document.documentElement.scrollHeight - window.innerHeight * 2) {
          wait = true;
          var posts = await parse.cloud.getGalleryFavPosts2(aff, config.rating, history.scrollTime, (e) => alertError(e.message));
          y(posts);
          wait = false;
        }
      };
    };
    p.body.get("tab_comments").onclick = async () => {
      window.onscroll = undefined;
      p.body.get("info_page").innerHTML = "";
      var x = pageRenderer.compile("profile", "comments", {});
      x.appendTo(p.body.get("info_page"));
      // get comments
      var comments = await parse.cloud.getProfileComments(aff, undefined, (e) => alertError(e.message));
      var y = (comments) => {
        for (var i = 0; i < comments.length; i++) {
          var x = parse.parse.comment(comments[i]);
          history.scrollTime = +x.createdAt;
          var d = pageRenderer.compile("post", "comment", {
            pfp_url: x.user.icon ? x.user.icon.preview : parse.extension.path + "res/default_icon.png",
            username: x.user.username,
            upload_time: formatTime(x.createdAt, 1),
            content: x.content
          });
          d.get("foot").parentNode.removeChild(d.get("foot"));
          d.get("comment").style.cursor = "pointer";
          d.get("comment").onclick = ((id) => () => {
            goto("post@" + id);
          })(x.post.id);
          d.appendTo(p.body.get("view"));
        }
      };
      y(comments);
      
      var wait = false;
      window.onscroll = async () => {
        if (wait) return;
        if (document.documentElement.scrollTop >= document.documentElement.scrollHeight - window.innerHeight * 2) {
          wait = true;
          var comments = await parse.cloud.getProfileComments(aff, history.scrollTime, (e) => alertError(e.message));
          y(comments);
          wait = false;
        }
      };
    };
    p.body.get("tab_followers").onclick = async () => {
      window.onscroll = undefined;
      p.body.get("info_page").innerHTML = "";
      var x = pageRenderer.compile("profile", "follow", {});
      x.appendTo(p.body.get("info_page"));
      // get followers
      var followers = await parse.cloud.getFollowers(aff, false, undefined, (e) => alertError(e.message));
      var y = (followers) => {
        for (var i = 0; i < followers.length; i++) {
          var x = parse.parse.follow(followers[i]);
          history.scrollTime = +x.createdAt;
          var d = document.createElement("div");
          d.className = "item";
          if (!x.follower) x.follower = {username: "Deleted account"};
          else d.onclick = ((id) => () => {
            goto("profile@" + id);
          })(x.follower.id);
          pageRenderer.parseObjects([{
            tagName: "img",
            className: "background",
            src: x.follower.background ? x.follower.background.preview : parse.extension.path + "res/default_background.png"
          }, {
            tagName: "img",
            className: "icon",
            src: x.follower.icon ? x.follower.icon.preview : parse.extension.path + "res/default_icon.png"
          }, {
            tagName: "span",
            className: "username",
            innerText: x.follower.username
          }, {
            tagName: "p",
            className: "time",
            innerText: "Follower for " + formatTime(x.createdAt, 0)
          }], {}).appendTo(d);
          p.body.get("view").appendChild(d);
        }
      };
      y(followers);
      
      var wait = false;
      window.onscroll = async () => {
        if (wait) return;
        if (document.documentElement.scrollTop >= document.documentElement.scrollHeight - window.innerHeight * 2) {
          wait = true;
          var followers = await parse.cloud.getFollowers(aff, false, history.scrollTime, (e) => alertError(e.message));
          y(followers);
          wait = false;
        }
      };
    };
    p.body.get("tab_following").onclick = async () => {
      window.onscroll = undefined;
      p.body.get("info_page").innerHTML = "";
      var x = pageRenderer.compile("profile", "follow", {});
      x.appendTo(p.body.get("info_page"));
      // get following
      var following = await parse.cloud.getFollowers(aff, true, undefined, (e) => alertError(e.message));
      var y = (following) => {
        for (var i = 0; i < following.length; i++) {
          var x = parse.parse.follow(following[i]);
          history.scrollTime = +x.createdAt;
          var d = document.createElement("div");
          d.className = "item";
          if (!x.following) x.following = {username: "Deleted account"};
          else d.onclick = ((id) => () => {
            goto("profile@" + id);
          })(x.following.id);
          pageRenderer.parseObjects([{
            tagName: "img",
            className: "background",
            src: x.following.background ? x.following.background.preview : parse.extension.path + "res/default_background.png"
          }, {
            tagName: "img",
            className: "icon",
            src: x.following.icon ? x.following.icon.preview : parse.extension.path + "res/default_icon.png"
          }, {
            tagName: "span",
            className: "username",
            innerText: x.following.username
          }, {
            tagName: "p",
            className: "time",
            innerText: "Following for " + formatTime(x.createdAt, 0)
          }], {}).appendTo(d);
          p.body.get("view").appendChild(d);
        }
      };
      y(following);
      
      var wait = false;
      window.onscroll = async () => {
        if (wait) return;
        if (document.documentElement.scrollTop >= document.documentElement.scrollHeight - window.innerHeight * 2) {
          wait = true;
          var following = await parse.cloud.getFollowers(aff, true, history.scrollTime, (e) => alertError(e.message));
          y(following);
          wait = false;
        }
      };
    };
    p.body.get("tab_about").onclick();
    registerTabs(p.body.get("tabs"));

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
    return Return();
  }
  // page: settings
  if (page == "settings") {
    // create drawer
    createDrawer(parse.isGuest(), "settings");
    // create page
    var p = pageRenderer.render(page, {
      post_width: localStorage.getItem("eFurWeb.postWidth") ? +localStorage.getItem("eFurWeb.postWidth") * 200 + " pixels" : "600 pixels",
      post_width_value: localStorage.getItem("eFurWeb.postWidth") ?? "3"
    });
    if (localStorage.getItem("eFurWeb.subscription")) p.body.get("preview_features").classList.add("on");
    if (localStorage.getItem("eFurWeb.disablePostInfo")) p.body.get("disable_post_info").classList.add("on");
    p.body.get("preview_features").onclick = () => {
      if (p.body.get("preview_features").classList.contains("on")) {
        localStorage.setItem("eFurWeb.subscription", "free");
        return;
      }
      localStorage.removeItem("eFurWeb.subscription");
    };
    p.body.get("disable_post_info").onclick = () => {
      if (p.body.get("disable_post_info").classList.contains("on")) {
        localStorage.setItem("eFurWeb.disablePostInfo", "true");
        return;
      }
      localStorage.removeItem("eFurWeb.disablePostInfo");
    };
    p.body.get("post_width_slider").oninput = () => p.body.get("post_width").innerText = "Post width: " + (p.body.get("post_width_slider").value * 200) + " pixels";
    p.body.get("post_width_slider").onchange = () => {
      var value = p.body.get("post_width_slider").value;
      p.body.get("post_width").innerText = "Post width: " + (value * 200) + " pixels";
      if (value == 3) {
        localStorage.removeItem("eFurWeb.postWidth");
        document.body.style = "--post-width:600px";
        return;
      }
      localStorage.setItem("eFurWeb.postWidth", value);
      document.body.style = "--post-width:" + (value * 200) + "px";
    };
    p.body.get("logout").onclick = () => {
      Parse.User.logOut();
      location.href = parse.extension.path + "login.html";
    };
    p.body.appendTo(document.body);
    return Return();
  }
  // page: create
  if (page == "create") {
    if (!fromHash || fromHistory) return goto("feed");
    var createPage = (options) => {
      // create drawer
      createDrawer(parse.isGuest(), "create", true);
      // create page
      var p = pageRenderer.render(page, options);
      p.body.appendTo(document.body);
      // setup header
      p.body.get("html_back").onclick = () => back();

      var categories = [];
      for (var i = 0; i < config.attributes.categories.length; i++) {
        var cat = config.attributes.categories[i];
        categories.push({
          tagName: "checkbox",
          innerText: cat.n.replace("&amp;", "&"),
          index: cat.i,
          __name: "categories",
          max: 3
        });
        categories.push({tagName: "br"});
      }
      pageRenderer.parseObjects(categories, {}).appendTo(p.body.get("post_categories"));
      return p;
    };
    var p;
    if (aff != "image" && aff != "gif" && aff != "video") p = createPage({type: aff});

    var defaultclick = () => {
      var categories = Array.from(document.querySelectorAll("checkbox.checked[name=\"categories\"]"), c => c.index);
      if (categories.length == 0) categories = [13];
      var title = p.body.get("post_title").value;
      var content = p.body.get("post_content") ? p.body.get("post_content").value : undefined;
      var description = p.body.get("post_description").value;
      var artist = p.body.get("post_artist").value;
      var source = p.body.get("post_source").value;
      var tags = p.body.get("post_tag").value != "" ? p.body.get("post_tag").value.split(",").map((t) => t.toLowerCase().trim()) : [];
      return {title, content, description, artist, source, tags, categories, rating: document.querySelector("radio.checked[name=\"rating\"]")};
    };

    if (aff == "story") {
      p.body.get("post_prevent").parentNode.parentNode.removeChild(p.body.get("post_prevent").parentNode);
      p.body.get("post_create").onclick = async () => {
        p.body.get("post_create").disabled = true;
        var c = defaultclick();
        await parse.cloud.createPost2(1, undefined, undefined, undefined, undefined, c.title != "" ? c.title : undefined, c.content != "" ? c.content : undefined, c.description != "" ? c.description : undefined, c.artist != "" ? c.artist : undefined, c.source != "" ? c.source : undefined, c.tags, c.categories, c.rating.rating, p.body.get("post_hide").classList.contains("on"), undefined, (e) => alertError(e.message));
        goto("feed");
      };
      return Return();
    }

    if (aff == "image" || aff == "gif" || aff == "video") {
      var input = document.createElement("input");
      input.type = "file";
      // a little hack to detect the cancel button
      var dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([], "/\\;?.A", {
        type: 'text/plain',
        lastModified: new Date()
      }));
      input.files = dataTransfer.files;

      input.onchange = () => {
        if (input.files.length > 1) alert("You can only upload one file at a time! Only the first image will be uploaded.");
        if (input.files.length > 0) {
          // recreate page
          p = createPage({
            type: aff,
            post_image: aff == "video" ? undefined : URL.createObjectURL(input.files[0]),
            post_video: aff == "video" ? URL.createObjectURL(input.files[0]) : undefined
          });

          p.body.get("post_content").parentNode.removeChild(p.body.get("post_content"));
          p.body.get("post_create").onclick = async () => {
            p.body.get("post_create").disabled = true;
            var file = new Parse.File(parse.cloud.version + "_" + Parse.User.current().id + (aff == "image" ? ".jpg" : (aff == "video" ? ".mp4" : ".gif")), input.files[0]);
            await file.save().catch((e) => alertError(e.message));
            var thumb;
            if (aff == "video") {
              thumb = await new Parse.File(parse.cloud.version + "_" + Parse.User.current().id + ".jpg", await getVideoCover(input.files[0]));
              await thumb.save().catch((e) => alertError(e.message));
            }
            var c = defaultclick();
            var dims = aff == "video" ? await getVideoDimensions(input.files[0]) : await getImageDimensions(input.files[0]);
            await parse.cloud.createPost2(aff == "gif" ? 2 : (aff == "video" ? 4 : 0), file, thumb, dims.width, dims.height, c.title != "" ? c.title : undefined, c.content != "" ? c.content : undefined, c.description != "" ? c.description : undefined, c.artist != "" ? c.artist : undefined, c.source != "" ? c.source : undefined, c.tags, c.categories, c.rating.rating, p.body.get("post_hide").classList.contains("on"), p.body.get("post_prevent").classList.contains("on"), (e) => alertError(e.message));
            goto("feed");
          };
          return;
        }
        back();
      };
      input.click();
      return Return();
    }

    if (aff == "poll") {
      back();
      alert("Coming soon!");
      return Return();
    }

    if (aff == "comic") {
      back();
      alert("Coming soon!");
      return Return();
    }
    back();
    return Return();
  }
  // page: createchooser
  if (page == "createchooser") {
    // create drawer
    createDrawer(parse.isGuest(), "create");
    // create page
    var p = pageRenderer.render(page, {});
    p.body.appendTo(document.body);

    p.body.get("image").onclick = () => goto("create@image");
    p.body.get("gif").onclick = () => goto("create@gif");
    p.body.get("story").onclick = () => goto("create@story");
    p.body.get("poll").onclick = () => goto("create@poll");
    p.body.get("video").onclick = () => goto("create@video");
    p.body.get("comic").onclick = () => goto("create@comic");

    return Return();
  }

  config.busy = false;
  goto("feed");
}

if (window.loadExtension) window.loadExtension();

// track mouse position
var mousePos = {x: undefined, y: undefined};
window.addEventListener("mousemove", (event) => mousePos = {x: event.clientX, y: event.clientY});

// run first time
var pages;
(async function() {
  // initialize app
  console.log("[eFur] Initializing...");
  parse.init();
  await pageRenderer.init();
  console.log("[eFur] Getting config...");
  config.attributes = (await Parse.Config.get()).attributes;
  console.log("[eFur] Initialized!");

  // setting custom post width (if set)
  if (localStorage.getItem("eFurWeb.postWidth")) document.body.style = "--post-width:" + (+localStorage.getItem("eFurWeb.postWidth") * 200) + "px";

  // check if user is logged in
  if (Parse.User.current() == null) {
    location.href = parse.extension.path + "login.html" + (location.hash != "" ? "?redirect=" + location.hash.substring(1) : "");
    return;
  }

  // get user settngs
  config.settings = await parse.cloud.getUserSettings((e) => alertError(e.message));
  
  // make the hash partially control the page
  window.onhashchange = () => {
    if (location.hash != "") initPage(location.hash.substring(1), true, undefined, true);
  };
  initPage(location.hash != "" ? location.hash.substring(1) : "feed", undefined, undefined, true);

  var news = await fetch("https://translate.flexan.cf/news").then((j) => j.json()).catch((e) => alertError(e.message));
  if (localStorage.getItem("eFurWeb.news") != news[0]) {
    localStorage.setItem("eFurWeb.news", news[0]);
    news[1].push({
      tagName: "button",
      className: "htmlMenuButton",
      innerText: "Close",
      onclick: () => newsMenu.break()
    });
    var newsMenu = createMenu(pageRenderer.parseObjects(news[1]).children, true);
    appendMenu(newsMenu, document.body, true);
  }

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