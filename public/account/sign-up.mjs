let $form = $("#form");
let $username = $("#username");
let $email = $("#email");

$username.on("keydown", ({key}) => {
  if (key.toLowerCase() == "enter") $email.focus();
  return false;
});

$username.on("input", () => {
  
});

$email.on("keydown", ({key}) => {
  if (key.toLowerCase() == "enter") $email.blur(), $form.submit();
  return false;
});

$form.on("submit", (event) => {
  event.preventDefault();
});