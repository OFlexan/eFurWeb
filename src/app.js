// initialize config
var parse = {
  init: function() {
    Parse.initialize("MiGt7yG9h5WAf7zXRsDHp");
    Parse.serverURL = "https://api.efur.app/parse";
  },
  cloud: {
    version: 100,
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
      // image posts: 0
      if (type == 0) return {
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
        comment: this.user(obj.get("c")),
        user: this.user(obj.get("f")),
        post: this.post(obj.get("p")),
        type: type,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      }
      if (type == 3) return {
        id: obj.id,
        unknown_a: obj.get("a"),
        comment: this.user(obj.get("c")),
        repliedTo: obj.get("e"),
        user: this.user(obj.get("f")),
        post: this.post(obj.get("p")),
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
        votes: [],
        multi: obj.get("v"),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      };
      for (var i = 0; i < x.length; i++) o.votes.push(obj.get("s" + i));
      return o;
    },
    array: function(arr, type) {
      var a = [];
      for (var i = 0; i < arr.length; i++) {
        a.push(this[type](arr[i]));
      }
      return a;
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
      var z = y(e[i].children, o);
      for (var q = 0; q < z.length; q++) d.appendChild(z[q]);
      var k = Object.keys(e[i]);
      k.splice(k.indexOf("tagName"), 1);
      if (k.includes("children")) k.splice(k.indexOf("children"), 1);
      if (k.includes("equals")) k.splice(k.indexOf("equals"), 1);
      for (var q = 0; q < k.length; q++) {
        var w = e[i][k[q]];
        var u = "";
        while (w.includes(">[") && w.includes("]<")) {
          u += w.substring(0, w.indexOf(">["));
          u += o[w.substring(w.indexOf(">[") + 2, w.indexOf("]<"))];
          w = w.substring(w.indexOf("]<") + 2);
        }
        u += w;
        d[k[q]] = u;
      }
      p.push(d);
    }
    return p;
  };
  return {
    init: async function() {
      pages = await fetch("./pages.json").then((j) => j.json());
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
function formatTime(date, type) {
  var diff = Date.now() - date.getTime();
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
  }, 10000);
}

function createPost(posts, preventCache) {
  if (!preventCache) {
    for (var i = 0; i < posts.f.length; i++) config.cache.posts.f.push(posts.f[i]);
    for (var i = 0; i < posts.p.length; i++) config.cache.posts.p.push(posts.p[i]);
  }
  var f = [];
  for (var i = 0; i < posts.p.length; i++) {
    var post = posts.p[i];
    // create post without content
    var postElem = pageRenderer.compile("new", "post", {
      pfp_url: post.user.icon ? post.user.icon.preview : "./res/default_icon.png",
      username: post.user.username,
      categories: "Stories / Text",
      upload_time: formatTime(post.createdAt, 0),
      favorite: posts.f.includes(post.id) ? "favorite" : "favorite_border",
      favorite_count: post.favorites ?? 0,
      comments_count: post.comments ?? 0
    });
    // create content
    //   image
    if (post.type == 0) {
      pageRenderer.compile("new", "imageBody", {
        post_title: post.title,
        post_pic_url: post.image.preview,
        post_artist: post.artist,
        post_desc: post.description
      }).appendTo(postElem.get("body"));
    }
    //   story
    if (post.type == 1) {
      pageRenderer.compile("new", "storyBody", {
        post_title: post.title,
        post_content: post.content,
        post_artist: post.artist,
        post_desc: post.description
      }).appendTo(postElem.get("body"));
    }
    //   poll
    if (post.type == 3) {
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
    })(postElem.get("favorite_count"), fav, post.id);
    // comment functionality
    postElem.get("comments").onclick = ((id) => async () => {
      location.hash = "post@" + id;
    })(post.id);
    // cache post
    f.push(postElem);
    if (!preventCache) {
      config.cache.postHtml[post.id] = postElem;
      config.lastTime.post = +post.createdAt;
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
    var commentElem = pageRenderer.compile("post", "comment", {
      pfp_url: comment.user.icon ? comment.user.icon.preview : "./res/default_icon.png",
      username: comment.user.username,
      upload_time: formatTime(comment.createdAt, 1),
      content: comment.content,
      like: comments.f.includes(comment.id) ? "thumb_up_alt" : "thumb_up_off_alt",
      like_count: comment.likes ?? 0,
      replies: !sub && comment.replies > 0 ? comment.replies : undefined,
      mention: sub && comment.reply ? comment.reply.user.username : undefined
    });
    /*
    // favorite functionality
    var fav = postElem.get("isfavorite");
    postElem.get("favorite").onclick = ((count, fav, id) => async () => {
      var a = fav.innerText != "favorite";
      fav.innerText = a ? "favorite" : "favorite_border";
      count.innerText = a ? +count.innerText + 1 : +count.innerText - 1;
      var c = await parse.cloud.favPost(a, id, (e) => {
        alertError(e.message);
      });
      if (c == undefined) return;
      fav.innerText = c.g ? "favorite" : "favorite_border";
      count.innerText = c.f;
    })(postElem.get("favorite_count"), fav, post.id);
    // get replies functionality
    postElem.get("comments").onclick = ((id) => async () => {
      location.hash = "post@" + id;
    })(post.id);
    */
    // add replies functionality
    var r = commentElem.get("comment_replies");
    if (r) r.onclick = ((dom, sub, r, s) => async () => {
      s.onclick = undefined;
      s.innerText = "Loading...";
      await createComments(dom, sub, r);
      s.parentNode.removeChild(s);
    })(aff, comment.id, commentElem.get("comment_replies_container"), r);
    // add comment
    commentElem.appendTo(d);
  }
}

var config = {
  rating: 0,
  lastTime: {
    post: undefined
  },
  cache: {
    posts: {f:[],p:[]},
    postHtml: {}
  }
};

async function initPage(page, fromHash) {
  console.log("[eFur] Switched to page '" + page + "'");
  document.body.innerHTML = "";
  document.body.scrollTo();
  var useCache = false;
  if (page.endsWith("~")) {
    page = page.substring(0, page.length - 1);
    if (!fromHash) {
      location.hash = page;
      return;
    }
    useCache = true;
  }
  var aff;
  if (page.includes("@")) {
    aff = page.split("@")[1];
    page = page.split("@")[0];
  }
  // reset events
  window.onscroll = undefined;
  
  // page: new
  if (page == "new") {
    // create page
    var p = pageRenderer.render(page, {});
    p.body.appendTo(document.body);
    // get posts
    var posts;
    if (useCache) {
      posts = config.cache.posts;
    } else {
      config.lastTime.post = undefined;
      config.cache.posts = {f:[],p:[]};
      config.cache.postHtml = {};
      posts = await parse.cloud.getNewPosts(config.rating, undefined, (e) => alertError(e.message));
      posts.p = parse.parse.array(posts.p, "post");
    }
    // append posts
    createPost(posts, useCache).forEach((e) => e.appendTo(p.body.get("container")));
    var wait = false;
    window.onscroll = async () => {
      if (wait) return;
      if (document.documentElement.scrollTop >= document.documentElement.scrollHeight - window.innerHeight * 2) {
        wait = true;
        // get posts
        var posts = await parse.cloud.getNewPosts(config.rating, config.lastTime.post, (e) => alertError(e.message));
        posts.p = parse.parse.array(posts.p, "post");
        // append posts
        createPost(posts).forEach((e) => e.appendTo(p.body.get("container")));
        wait = false;
      }
    };
    return;
  }
  // page: post
  if (page == "post") {
    // get post
    var post = config.cache.postHtml[aff];
    if (post == undefined) {
      var posts = await parse.cloud.getSinglePost(aff, config.rating, (e) => alertError(e.message));
      posts.p = parse.parse.array(posts.p, "post");
      post = createPost(posts, true)[0];
    }
    // create page and append post
    var p = pageRenderer.render(page, {
      username: fromHash ? searchInArray(config.cache.posts.p, "id", aff).user.username : undefined
    });
    p.body.appendTo(document.body);
    post.appendTo(p.body.get("container"));
    if (fromHash) {
      // setup header
      p.body.get("container").classList.add("htmlHasHeader");
      p.body.get("html_back").onclick = function() {
        location.hash = "new~";
      };
    }
    // get comments
    await createComments(aff, undefined, p.body.get("container"));
    return;
  }
  location.hash = "new";
}

// run first time
var pages;
(async function() {
  // initialize app
  console.log("[eFur] Initializing...");
  parse.init();
  await pageRenderer.init();
  // remove loading screen
  console.log("[eFur] Initialized!");

  // check if user is logged in
  if (Parse.User.current() == null) {
    location.href = "./login.html" + (location.hash != "" ? "?redirect=" + location.hash.substring(1) : "");
    return;
  }

  // make the hash control the page
  window.onhashchange = () => initPage(location.hash != "" ? location.hash.substring(1) : "new", true);
  initPage(location.hash != "" ? location.hash.substring(1) : "new");
})();