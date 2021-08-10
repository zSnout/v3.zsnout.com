let html = $(document.documentElement);
let icon = $("#nav-icon");
let nav = $("nav");

if (icon) {
  icon.on("click", async () => {
    html.toggleClass("nav");
    
    await $.local("nav", html.hasClass("nav"));
  });
}

html.on("contextmenu", ({path, preventDefaultF: prev}) => {
  path.map((element) => {
    if (element.hasAttribute("nctx")) prev();
  });
});