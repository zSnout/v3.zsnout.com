let html = $(document.documentElement);
let icon = $("#nav-icon");
let nav = $("nav");

if (icon) {
  icon.on("click", async () => {
    html.toggleClass("nav");
    
    await $.local("nav", html.hasClass("nav"));
  });
}

html.on("contextmenu", ({originalEvent: event}) => {
  event.path.map((element) => {
    if (element.hasAttribute && element.hasAttribute("nctx"))
      event.preventDefault();
  });
});