const params = new URLSearchParams(window.location.search);
if (params.has("tag")) {
  document.querySelectorAll(".tag__item").forEach((tag_item) => {
    if (params.get("tag") === tag_item.id) {
      tag_item.classList.add("selected");
      tag_item.querySelector("a").href =
        window.location.origin + window.location.pathname;
    }
  });
}

document.getElementById("search").addEventListener("click", (e) => {
  const form = document.querySelector("form");
  const search = form.querySelector("input").value;
  if (search !== "") {
    form.submit();
  }
});
