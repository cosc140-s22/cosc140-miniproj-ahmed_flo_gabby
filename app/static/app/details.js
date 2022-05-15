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
document.querySelector(".carousel-image").addEventListener("mouseover", (e) => {
  document.querySelector(".carousel-caption").style.opacity = "0.1";
});
document.querySelector(".carousel-image").addEventListener("mouseout", (e) => {
  document.querySelector(".carousel-caption").style.opacity = "1";
});
