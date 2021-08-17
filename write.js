let now = Date.now();

console.write = (name, message) => {
  let diff = Date.now() - now;

  if (diff < 1000) {
    diff = ("00" + diff).substr(-3) + "m";
  } else if (diff < 1000000) {
    if (diff < 10000) diff = Math.round(diff / 100) / 10;
    else if (diff < 100000) diff = Math.round(diff / 100) / 10;
    else diff = Math.round(diff / 1000);

    if (diff < 1000) {
      diff = String(diff);
      let hasDot = diff.indexOf(".") > -1;

      if (diff.length == 1) diff = diff + ".00";
      else if (diff.length == 2 && hasDot) diff = diff + "00";
      else if (diff.length == 2) diff = diff + ".0";
      else if (diff.length == 3 && hasDot) diff = diff + "0";
      else if (diff.length == 3) diff = "0" + diff;
    }
  } else {
    diff = Math.floor(diff / 1000);
  }

  console.log(`<${name}> at ${diff}s: ${message}`);
}