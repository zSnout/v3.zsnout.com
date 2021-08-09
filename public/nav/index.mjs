let field = document.getElementById("nav-input");
let nav = document.getElementsByTagName("nav")[0];
let icon = document.getElementsByTagName("nav-icon")[0];
let html = document.documentElement;

field.addEventListener("input", () => {
  let words = field.value.toLowerCase().match(/[A-Za-z0-9]+/g);

  if (!words || !words.length)
    return [...document.querySelectorAll("nav a, nav-div, nav-name")]
      .map(e => e.style.display = "block");

  [...nav.getElementsByTagName("a")].map(e => {
    let mywords = e.textContent.toLowerCase().match(/[A-Za-z0-9]+/g);

    for (let word of words) {
      if (mywords.indexOf(word) == -1) return e.style.display = "none";
    }
    
    e.style.display = "block";
  });

  [...document.getElementsByTagName("nav-div")].map(e => {
    if ([...e.children].every(e => e.style.display == "none")) e.style.display = "none";
    else e.style.display = "block";

    e.previousElementSibling.style.display = e.style.display;
  });
});