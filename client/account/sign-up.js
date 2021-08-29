$("#form").on("submit", async (event) => {
  event.preventDefault();

  let resp;
  try {
    resp = await $.server("POST", "/account/sign-up/", {
      username: $("#username").val(),
      password: $("#password").val(),
      email: $("#email").val(),
    });

    $.alert(JSON.stringify(resp));
  } catch (err) {
    await $.alert("Error: " + err?.message);
  }
});
