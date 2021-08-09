let html = document.documentElement;
let icon = document.getElementById("nav-icon");
let nav = document.getElementById("nav");

if (icon) {
  icon.addEventListener("click", async () => {
    html.classList.toggle("nav");
    
    await $.local("nav", html.classList.contains("nav"));
  });

  icon.addEventListener("contextmenu", (event) => event.preventDefault());
}