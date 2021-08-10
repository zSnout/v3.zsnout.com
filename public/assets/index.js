Promise.wait = function(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

$.fn.on = function(name, cb) {
  $(this).map(e => e.addEventListener(name, cb));

  return $(this);
};

$.fn.off = function(name, cb) {
  $(this).map(e => e.removeEventListener(name, cb));

  return $(this);
};

$.fn.dispatch = function(event) {
  $(this).map(e => e.dispatchEvent(event));

  return $(this);
};

$.later = function(cb = null) {
  if (typeof cb == "function") return setTimeout(cb, 0);
  else return Promise.resolve();
};

$.nslocal = function(key) {
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

$.local = async function(key, value = undefined) {
  key = $.nslocal(key);
  
  if (value !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
    
    $(window).dispatch("storage", {key, newValue: JSON.stringify(value)});
  } else {
    let item = localStorage.getItem(key);
    
    try {
      return JSON.parse(item);
    } catch (error) {
      return item;
    }
  }
};

$.onlocal = function(keyToTrack, cb) {
  keyToTrack = $.nslocal(keyToTrack);

  $(window).on("storage", ({key, newValue}) => {
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