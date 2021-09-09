$.root.on("contextmenu", (event) => {
  let prevent = true;

  for (let el of event.composedPath().reverse()) {
    let elt = el as Element;
    let eli = el as HTMLInputElement;

    if (elt.hasAttribute?.("ctx")) prevent = false;
    else if (elt.hasAttribute?.("nctx")) prevent = true;
    else if (
      elt.tagName == "INPUT" &&
      eli.type != "submit" &&
      eli.type != "button"
    )
      prevent = false;
    else if (elt.tagName == "TEXTAREA") prevent = false;
  }

  if (prevent) event.preventDefault();
});
