let field = $("#field");
let add = $("#add-fav");
let href = parent.location.pathname + parent.location.search;

field.on("input", () => {
  let words = field.val().toLowerCase().match(/[A-Za-z0-9]+/g);

  if (!words || !words.length) {
    $("div, h1").css("display", "block");
    $("a").css("display", "inline-block");

    return;
  };

  $("a").map((e) => {
    let mywords = e.text().toLowerCase().match(/[A-Za-z0-9]+/g);

    for (let word of words) {
      if (mywords.indexOf(word) == -1) return e.css("display", "none");
    }
    
    e.css("display", "block");
  });

  $("div").map((e) => {
    if (e.children().map(e => e.style.display == "none")) e.style.display = "none";
    else e.style.display = "block";

    e.previousElementSibling.style.display = e.style.display;
  });
});

add.on("click", () => {

});