Promise.wait = function(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

$.later = function(cb = null) {
  if (typeof cb == "function") return setTimeout(cb, 0);
  else return Promise.resolve();
};

$.local = async function(key, value = undefined) {
  if (value !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
    
    window.dispatchEvent(new Event("storage", {key, newValue: value}));
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
  window.addEventListener("storage", ({key, newValue: value}) => {
    if (key == keyToTrack) {
      try {
        cb(JSON.parse(value), key);
      } catch {
        cb(value, key);
      }
    }
  });
};