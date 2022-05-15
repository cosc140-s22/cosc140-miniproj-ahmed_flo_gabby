document.querySelectorAll("img").forEach((img) => {
  console.log({
    w: img.naturalWidth,
    h: img.naturalHeight,
  });
  if (img.naturalHeight > img.naturalWidth) {
    img.classList.add("h-dom");
  } else {
    img.classList.add("w-dom");
  }
});
const hide = (id) => {
  document.getElementById(id).style.opacity = 0;
};
const unhide = (id) => {
  document.getElementById(id).style.opacity = 1;
};
