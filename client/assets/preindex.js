Promise.wait = function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

$.fn.forEach = function (cb) {
  return [...this.map((k, e) => cb($(e)))];
};

$.fn.on = function (name, cb) {
  this.map((k, e) => e.addEventListener(name, cb));

  return this;
};

$.fn.off = function (name, cb) {
  this.map((k, e) => e.removeEventListener(name, cb));

  return this;
};

$.fn.dispatch = function (event) {
  this.map((k, e) => e.dispatchEvent(event));

  return this;
};

$.fn.verify = function (label) {
  this.attr("status", label);

  return this;
};

$.later = function (cb = null) {
  if (typeof cb == "function") return setTimeout(cb, 0);
  else return Promise.resolve();
};

$.nslocal = function (key) {
  let ns = "zsnout-v3";

  if (typeof key == "object") {
    if ("ns" in key) {
      ns = `${ns}#${key.ns.replace(/[#:]/g, "")}`;

      if ("key" in key) key == key.key;
    }
  }

  key = key.replace(/[#:]/g, "");

  return `${ns}:${key}`;
};

$.local = async function (key, value = undefined) {
  key = $.nslocal(key);

  if (value !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));

    $(window).dispatch(
      new StorageEvent("storage", { key, newValue: JSON.stringify(value) })
    );
  } else {
    let item = localStorage.getItem(key);

    try {
      return JSON.parse(item);
    } catch (error) {
      return item;
    }
  }
};

$.onlocal = function (keyToTrack, cb) {
  keyToTrack = $.nslocal(keyToTrack);

  $(window).on("storage", ({ key, newValue }) => {
    if (key == keyToTrack) {
      try {
        cb(JSON.parse(newValue), key);
      } catch {
        cb(newValue, key);
      }
    }
  });
};

$.escape = (text) => {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&apos;")
    .replace(/"/g, "&quot;");
};

$.fetch = async (url, options = undefined) => {
  let body = await fetch(url, {
    ...options,
    credentials: "omit",
  });

  return await body.text();
};

$.server = async (method, url, body = null) => {
  let info = {
    method,
    headers: {
      "x-zsnout-session": await $.local("session"),
    },
  };

  if (method != "GET" && method != "HEAD" && body) {
    info.headers["content-type"] = "application/json";
    info.body = JSON.stringify(body);
  }

  let fetched;
  try {
    fetched = await fetch(url, info);
  } catch (err) {
    let error = new Error(`Failed to ${method} ${url}`);
    error.type = "fetch";
    error.cause = err;

    throw error;
  }

  if (fetched.headers.has("x-zsnout-session")) {
    let token = fetched.headers.get("x-zsnout-session");

    await $.local("session", token);
  }

  let json = await fetched.text();
  try {
    json = JSON.parse(json);
  } catch (err) {
    let error = new Error("Failed to parse JSON");
    error.type = "json";
    error.cause = err;

    throw error;
  }

  if (fetched.status != 200) {
    let error = new Error(json?.message || "unknown error");
    error.type = "fetch";
    error.original = json;

    throw error;
  }

  return json;
};

let html = document.documentElement;
let mql = window.matchMedia("(hover: hover) and (pointer: fine)");

html.classList.toggle("hover", mql.matches);
mql.onchange = () => {
  html.classList.toggle("hover", mql.matches);
};
