let icon = document.getElementsByTagName("nav-icon")[0];
let nav = document.getElementsByTagName("nav")[0];

icon.addEventListener("click", () => {
  nav.classList.toggle("open");
  
  icon.classList.toggle("open", nav.classList.contains("open"));
});