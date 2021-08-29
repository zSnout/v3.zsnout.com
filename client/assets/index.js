let $html = $("html");

$html.on("contextmenu", (event) => {
  let prevent = false;

  event.path.reverse().map((element) => {
    if (element?.hasAttribute?.("nctx")) prevent = true;
    else if (element?.hasAttribute?.("ctx")) prevent = false;
    else if (element.type == "submit" || element.type == "button");
    else if (element.tagName == "INPUT") prevent = false;
    else if (element.tagName == "TEXTAREA") prevent = false;
  });

  if (prevent) event.preventDefault();
});

let $icon = $("#nav-icon");
$icon.on("click", async () => {
  $html.toggleClass("nav");
});

let $bg = $("#modal-bg");
let $modal = $("#modal");
let $info = $("#modal-info");
let $field = $("#modal-input");
let $buttons = $("#modal-buttons");

let $ok = $("<button>");
let $cancel = $("<button>");

$.alert = function (message) {
  return new Promise(async (resolve) => {
    if ($html.hasClass("modal")) {
      $html.removeClass("modal");
      await Promise.wait(500);
    }

    $info.text(message);
    $field.css("display", "none");

    $ok.text("OK")[0].onclick = () => {
      $html.removeClass("modal");
      resolve();
    };

    $modal[0].onclick = (e) => e.stopPropagation();
    $bg[0].onclick = () => {
      $html.removeClass("modal");
      resolve();
    };

    $buttons.empty();
    $buttons.append($ok);

    $html.addClass("modal");
    $ok.focus();
  });
};

$.confirm = function (message, { ok = "OK", cancel = "Cancel" }) {
  return new Promise(async (resolve) => {
    if ($html.hasClass("modal")) {
      $html.removeClass("modal");
      await Promise.wait(500);
    }

    $info.text(message);
    $field.css("display", "none");

    $ok.text(ok)[0].onclick = () => {
      $html.removeClass("modal");
      resolve(true);
    };

    $cancel.text(cancel)[0].onclick = () => {
      $html.removeClass("modal");
      resolve(false);
    };

    $modal[0].onclick = (e) => e.stopPropagation();
    $bg[0].onclick = () => {
      $html.removeClass("modal");
      resolve(false);
    };

    $buttons.empty();
    $buttons.append($cancel, $ok);

    $html.addClass("modal");
    $cancel.focus();
  });
};

$.prompt = function (message, { initial = "", blank = false, ok = "Submit" }) {
  return new Promise(async (resolve) => {
    if ($html.hasClass("modal")) {
      $html.removeClass("modal");
      await Promise.wait(500);
    }

    $info.text(message);
    $field.css("display", "block");

    if (typeof blank == "string") [ok, blank] = [blank, false];

    $ok.text(ok)[0].onclick = () => {
      if (blank || $field.val()) {
        $html.removeClass("modal");
        resolve($field.val());
      }
    };

    $modal[0].onclick = (e) => e.stopPropagation();
    $bg[0].onclick = () => {
      if (blank) {
        $html.removeClass("modal");
        resolve(null);
      }
    };

    $buttons.empty();
    $buttons.append($ok);

    $html.addClass("modal");
    await Promise.wait(250);
    $field.focus();
  });
};
