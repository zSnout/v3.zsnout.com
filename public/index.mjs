icon.addEventListener("click", async () => {
  html.classList.toggle("nav");
  
  await $.local("nav", html.classList.contains("nav"));
});