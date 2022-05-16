document.querySelectorAll("img").forEach((img) => {
  if (img.naturalHeight > img.naturalWidth) {
    img.classList.add("portrait");
  } else {
    img.classList.add("landscape");
  }
});
const hide_caption = (id) => {
  document.getElementById(id).style.opacity = 0;
};
const show_caption = (id) => {
  document.getElementById(id).style.opacity = 1;
};
