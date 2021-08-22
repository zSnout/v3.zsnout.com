let $field = $("#field");
let $toggle = $("#toggle-fav");
let $favs = $("#favorites");

$field.on("input", () => {
  let words = $field
    .val()
    .toLowerCase()
    .match(/[A-Za-z0-9]+/g);

  if (!words || !words.length) {
    $("div, h1").css("display", "block");
    $("a").css("display", "inline-block");

    return;
  }

  $("a").map((e) => {
    let mywords = e
      .text()
      .toLowerCase()
      .match(/[A-Za-z0-9]+/g);

    for (let word of words) {
      if (mywords.indexOf(word) == -1) return e.css("display", "none");
    }

    e.css("display", "block");
  });

  $("div").map((e) => {
    if (e.children().map((e) => e.style.display == "none"))
      e.style.display = "none";
    else e.style.display = "block";

    e.previousElementSibling.style.display = e.style.display;
  });
});

function populate(data) {
  $toggle.detach();
  $favs.empty();
  $favs.append($toggle);

  data = _.sortBy(data, "title")
    .map(({ title, url }) => {
      let $el = $("<a>");
      $el.attr("href", url);
      $el.attr("target", "_parent");
      $el.text(title);

      return $el;
    })
    .map(($element) => $element.appendTo($favs));
}

$.local("favorite-pages").then(async (data) => {
  if (!data) await $.local("favorite-pages", []), (data = []);

  $toggle.on("click", async () => {
    let href = parent.location.pathname + parent.location.search;
    let title =
      parent.document.title ||
      parent.location.pathname.substr(1) ||
      "(unknown)";

    let data = await $.local("favorite-pages");

    if (data.map((e) => e.url).indexOf(href) == -1) {
      data.push({ title, url: href });

      await $.local("favorite-pages", data);
    } else {
      data = data.filter(({ url }) => url != href);

      await $.local("favorite-pages", data);
    }
  });

  populate(data);
  $.onlocal("favorite-pages", populate);
});
