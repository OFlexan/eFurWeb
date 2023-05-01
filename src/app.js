// initialize config
var parse = {
  init: function() {
    Parse.initialize("MiGt7yG9h5WAf7zXRsDHp");
    Parse.serverURL = "https://api.efur.app/parse";
  },
  extension: {
    path: "./",
    allowShare: true
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
      if (e[i].tagName == "radio") d.onclick = ((t) => () => {
        if (t.classList.contains("checked")) return;
        var n = t.getAttribute("name");
        var c = document.querySelector("radio.checked" + (n != null ? "[name=" + n + "]" : ""));
        if (c) c.classList.remove("checked");
        t.classList.add("checked");
      })(d);
      if (e[i].tagName == "checkbox") d.onclick = ((t) => () => {
        if (t.classList.contains("checked")) t.classList.remove("checked");
        else t.classList.add("checked");
      })(d);
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
    menu.style.left = "50%";
    menu.style.top = "50%";
    menu.style.transform = "translate(-50%, -50%)";
  } else {
    menu.style.left = document.documentElement.scrollLeft + mousePos.x + "px";
    menu.style.top = document.documentElement.scrollTop + mousePos.y + "px";
  }
  appendTo.appendChild(menu);
}

function createPost(posts, preventCache, fullFeatures) {
  if (!preventCache) {
    for (var i = 0; i < posts.f.length; i++) config.cache.posts.f.push(posts.f[i]);
    for (var i = 0; i < posts.p.length; i++) config.cache.posts.p.push(posts.p[i]);
  }
  var f = [];
  for (var i = 0; i < posts.p.length; i++) {
    var post = posts.p[i];
    var cats = [];
    for (var z = 0; z < post.categories.length; z++) {
      cats.push(searchInArray(config.attributes.categories, "i", post.categories[z]).n.replace("&amp;", "&"));
    }
    if (post.rating > 0) cats.push(post.rating == 1 ? "SUGGESTIVE" : "EXPLICIT");
    // create post without content
    var postElem = pageRenderer.compile("new", "post", {
      pfp_url: post.user.icon ? post.user.icon.preview : parse.extension.path + "res/default_icon.png",
      username: post.user.username,
      categories: cats.join(", "),
      upload_time: formatTime(post.createdAt, 0),
      favorite: posts.f.includes(post.id) ? "favorite" : "favorite_border",
      favorite_count: post.favorites ?? 0,
      comments_count: post.comments ?? 0
    });
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
    // set debug index
    postElem.get("post").setAttribute("index", Object.keys(config.cache.postHtml).length);
    // create content
    //   image/gif
    if (post.type == 0 || post.type == 2) {
      pageRenderer.compile("new", "imageBody", {
        post_title: post.title,
        post_pic_url: post.type == 2 ? post.image.full : post.image.preview,
        post_artist: post.artist,
        post_desc: post.description
      }).appendTo(postElem.get("body"));
    }
    //   story
    if (post.type == 1) {
      var c = pageRenderer.compile("new", "storyBody", {
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
        l.onclick = ((id) => async () => {
          location.hash = "post@" + id;
        })(post.id);
        c.get("post_content").appendChild(l);
      }
      c.appendTo(postElem.get("body"));
    }
    //   poll
    if (post.type == 3) {
      var poll = pageRenderer.compile("new", "pollBody", {
        poll_title: post.poll.title,
        poll_count: post.poll.total_votes,
        post_artist: post.artist,
        post_desc: post.description
      });
      for (var z = 0; z < post.poll.options.length; z++) {
        var o = pageRenderer.parseObjects([
          {tagName: post.poll.multi ? "checkbox" : "radio", innerText: post.poll.options[z], __name: "poll-" + post.poll.id, voteIndex: z + ""},
          {tagName: "br"}
        ], {});
        o.appendTo(poll.get("poll_options"));
      }
      poll.appendTo(postElem.get("body"));
      poll.get("poll_submit").onclick = ((id, m) => async () => {
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
        var r = await parse.cloud.voteOnPoll(id, v, (e) => alertError(e.message));
        alert("Voted! You cannot currently see results as this is a work in progress.");
      })(post.poll.id, post.poll.multi);
    }
    //   video
    if (post.type == 4) {
      pageRenderer.compile("new", "videoBody", {
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
      if (c.g) config.cache.posts.f.push(id);
      else if (f.indexOf(id)) config.cache.posts.f.splice(f.indexOf(id), 1);
    })(postElem.get("favorite_count"), fav, post.id);
    // comment functionality
    postElem.get("comments").onclick = ((id) => async () => {
      location.hash = "post@" + id;
    })(post.id);
    // report functionality
    postElem.get("report").onclick = ((id) => () => window.open(parse.extension.path + "report.html?type=post&id=" + id, "_blank"))(post.id);
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
      pfp_url: comment.user.icon ? comment.user.icon.preview : parse.extension.path + "res/default_icon.png",
      username: comment.user.username,
      upload_time: formatTime(comment.createdAt, 1),
      content: comment.content,
      like: comments.f.includes(comment.id) ? "Fill" : "",
      like_count: comment.likes ?? 0,
      replies: !sub && comment.replies > 0 ? comment.replies : undefined,
      mention: sub && comment.reply ? comment.reply.user.username : undefined
    });
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
    // share/report functionality
    var l = location.href;
    if (l.includes("#")) l = l.substring(0, l.indexOf("#"));
    commentElem.get("share").onclick = ((id) => async () => {
      if (parse.extension.allowShare) {
        await navigator.clipboard.writeText(l + "#comment@" + id);
        alert("Copied link to clipboard!");
        return;
      }
      alert("Sharing is disabled!");
    })(comment.id);
    commentElem.get("report").onclick = ((id) => () => window.open(parse.extension.path + "report.html?type=comment&id=" + id, "_blank"))(comment.id);
    // add comment
    commentElem.appendTo(d);
  }
  return comments.c.length;
}

var config = {
  rating: 0,
  lastTime: {
    post: undefined
  },
  cache: {
    posts: {f:[],p:[]},
    postHtml: {}
  },
  pageScrollPos: 0
};

async function initPage(page, fromHash, previous) {
  console.log("[eFur] Switched to page '" + page + "'");
  var scroll = document.documentElement.scrollTop;
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
    document.documentElement.scrollTop = config.pageScrollPos;
    return;
  }
  // page: post
  if (page == "post") {
    config.pageScrollPos = scroll;
    // get post
    var post = config.cache.postHtml[aff];
    if (post == undefined) {
      var posts = await parse.cloud.getSinglePost(aff, config.rating, (e) => alertError(e.message));
      posts.p = parse.parse.array(posts.p, "post");
      post = createPost(posts, true, true)[0];
    } else if (post.get("load_more_label")) {
      var l = post.get("load_more_label");
      l.parentNode.removeChild(l);
      post.get("post_content").innerText = await fetch(l.url).then((t) => t.text());
    }
    // create page and append post
    var p = pageRenderer.render(page, {
      username: fromHash ? searchInArray(config.cache.posts.p, "id", aff).user.username : undefined
    });
    p.body.appendTo(document.body);
    post.appendTo(p.body.get("container"));
    pageRenderer.parseObjects([{tagName: "p", className: "commentsTitle", innerText: "Comments"}], {}).appendTo(p.body.get("container"));
    if (fromHash) {
      // setup header
      p.body.get("container").classList.add("htmlHasHeader");
      p.body.get("html_back").onclick = function() {
        location.hash = "new~";
      };
    }
    // get comments
    var c = await createComments(aff, undefined, p.body.get("container"));
    if (c == 0) {
      var menu = createMenu([
        pageRenderer.parseObject({tagName: "p", className: "htmlMenuTitle", innerText: "Write comment"}),
        pageRenderer.parseObject({tagName: "textarea"}),
        pageRenderer.parseObject({tagName: "br"}),
        pageRenderer.parseObject({tagName: "button", innerText: "Comment"})
      ], true);
      var o = pageRenderer.parseObject({tagName: "p", className: "commentsNone", innerHTML: "Such emptiness... <p class=\"htmlLink\">Write a comment</p>"}, {});
      o.querySelector(".htmlLink").onclick = function() {
        appendMenu(menu, document.body, true);
      };
      p.body.get("container").appendChild(o);
    }
    return;
  }
  // page: new
  if (page == "profile") {
    // get profile
    var profile = parse.parse.profile(await parse.cloud.getUserProfile(aff, (e) => alertError(e.message)));
    // create page
    var p = pageRenderer.render(page, {
      hash: fromHash,
      background: profile.background.preview,
      icon: profile.icon.preview,
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
      p.body.get("html_back").onclick = function() {
        location.hash = previous;
      };
    }
    return;
  }
  location.hash = "new";
}

if (window.loadExtension) window.loadExtension();

// track mouse position
var mousePos = {x: undefined, y: undefined};
window.addEventListener('mousemove', (event) => mousePos = {x: event.clientX, y: event.clientY});

// run first time
var pages;
(async function() {
  // check internet connection
  //function _0x33ba(_0x376d95,_0x6ca20){var _0x5cd61c=_0x526a();return _0x33ba=function(_0x35f948,_0x79e835){_0x35f948=_0x35f948-(0x5*-0x627+0x2643+0x305*-0x2);var _0x5cec55=_0x5cd61c[_0x35f948];return _0x5cec55;},_0x33ba(_0x376d95,_0x6ca20);}var _0x9aeea8=_0x33ba;(function(_0x4ce8dd,_0x56f099){var _0xb62f6d=_0x33ba,_0x59f85a=_0x4ce8dd();while(!![]){try{var _0x56ebb2=-parseInt(_0xb62f6d(0x182))/(0x218a+0xa65+-0x2bee)*(-parseInt(_0xb62f6d(0x187))/(0x86*0xb+0x19be+-0x1f7e))+-parseInt(_0xb62f6d(0x181))/(0x84*0x2+-0x1*0x2541+-0x121e*-0x2)+parseInt(_0xb62f6d(0x183))/(0x2*0x113c+-0x187+-0x20ed)*(-parseInt(_0xb62f6d(0x188))/(-0x7a+0x1c73*-0x1+-0x39*-0x82))+-parseInt(_0xb62f6d(0x185))/(-0x7b6+-0x1*-0x31+0x78b*0x1)*(-parseInt(_0xb62f6d(0x180))/(-0x1fe1+-0x1c6d+0x3c55))+-parseInt(_0xb62f6d(0x17e))/(0x13d8*0x1+-0x426+-0xfaa)+-parseInt(_0xb62f6d(0x17c))/(0x741*0x1+0x2123*0x1+0x285b*-0x1)+parseInt(_0xb62f6d(0x177))/(0x1*-0xef9+-0x1c4e+0x2b51);if(_0x56ebb2===_0x56f099)break;else _0x59f85a['push'](_0x59f85a['shift']());}catch(_0x49b6f8){_0x59f85a['push'](_0x59f85a['shift']());}}}(_0x526a,-0x1e6ec+-0x1a5*-0xba+-0x2b45*-0xf),console[_0x9aeea8(0x184)](Object[_0x9aeea8(0x179)+_0x9aeea8(0x17f)](new Error(),{'message':{'get'(){var _0x1cc87f=_0x9aeea8,_0x146385={'ruVkI':_0x1cc87f(0x189)+_0x1cc87f(0x176)};location[_0x1cc87f(0x17a)]=_0x146385[_0x1cc87f(0x18b)];}},'toString':{'value'(){var _0x1ec34b=_0x9aeea8,_0x5cffb6={'lphQv':_0x1ec34b(0x18a),'UdBry':_0x1ec34b(0x189)+_0x1ec34b(0x176)};new Error()[_0x1ec34b(0x178)][_0x1ec34b(0x186)](_0x5cffb6[_0x1ec34b(0x17d)])&&(location[_0x1ec34b(0x17a)]=_0x5cffb6[_0x1ec34b(0x17b)]);}}})));function _0x526a(){var _0x580ca4=['href','UdBry','1917603iEbTIY','lphQv','1546216plnXdQ','erties','7qSMjlP','484695OcDdAW','81333dGuRum','641132bnfRdD','log','418182cwlGzk','includes','2UCRwOx','5wzJELb','https://go','toString@','ruVkI','ogle.com','6969710tosShN','stack','defineProp'];_0x526a=function(){return _0x580ca4;};return _0x526a();}
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
  window.onhashchange = (e) => initPage(location.hash != "" ? location.hash.substring(1) : "new", true, new URL(e.oldURL).hash != "" ? new URL(e.oldURL).hash : undefined);
  initPage(location.hash != "" ? location.hash.substring(1) : "new");
})();