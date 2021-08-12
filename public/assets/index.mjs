let $html = $(document.documentElement);
let $icon = $("#nav-icon");
let $nav = $("nav");
let locs = "l tl t tr r br b bl".split(" ");

$icon.on("click", async () => {
  $html.toggleClass("nav");
});

$.local("nav-icon-loc").then(async (loc) => {
  if (locs.indexOf(loc) > -1) {
    $icon.attr("loc", loc);
  } else await $.local("nav-icon-loc", "bl"), $icon.attr("loc", loc = "bl");

  $icon.on("contextmenu", async ({shiftKey, ctrlKey, altKey}) => {
    let loc = await $.local("nav-icon-loc");
    if (locs.indexOf(loc) == -1) loc = "bl";

    let diff = altKey ? 1 : ctrlKey ? 4 : 2;
    if (shiftKey) diff = locs.length - diff;
    console.log(diff);

    loc = locs[(locs.indexOf(loc) + diff) % locs.length];

    await $.local("nav-icon-loc", loc);
  });

  $.onlocal("nav-icon-loc", (loc) => $icon.attr("loc", loc));
  
  $icon.css("display", "block");
});

$html.on("contextmenu", (event) => {
  let prevent = false;

  event.path.reverse().map((element) => {
    if (element.hasAttribute && element.hasAttribute("nctx")) prevent = true;
    else if (element.hasAttribute && element.hasAttribute("ctx")) prevent = false;
  });

  if (prevent) event.preventDefault();
});