let $field = $("#field");
let $toggle = $("#toggle-fav");
let $favs = $("#favorites");

$field.on("input", () => {
  let words = $field
    .val()
    .toLowerCase()
    .match(/[A-Za-z0-9]+/g);

  $("div, h1").css("display", "block");
  $("a").css("display", "inline-block");

  if (words?.length) {
    $("a").forEach(($e) => {
      let mywords = $e
        .text()
        .toLowerCase()
        .match(/[A-Za-z0-9]+/g);

      if (!mywords?.length) $e.css("display", "none");
      else {
        for (let word of mywords) if (words.includes(word)) return;

        $e.css("display", "none");
      }
    });

    $("div").forEach(($e) => {
      if (
        $e
          .children()
          .forEach(($e) => $e.css("display"))
          .every((e) => e == "none")
      ) {
        $e.css("display", "none");
        $e.prev().css("display", "none");
      }
    });
  }
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
