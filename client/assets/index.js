let $html = $("html");
let $icon = $("#nav-icon");
let $nav = $("nav");

$icon.on("click", async () => {
  $html.toggleClass("nav");
});

$html.on("contextmenu", (event) => {
  let prevent = false;

  event.path.reverse().map((element) => {
    if (element.hasAttribute && element.hasAttribute("nctx")) prevent = true;
    else if (element.hasAttribute && element.hasAttribute("ctx"))
      prevent = false;
  });

  if (prevent) event.preventDefault();
});
