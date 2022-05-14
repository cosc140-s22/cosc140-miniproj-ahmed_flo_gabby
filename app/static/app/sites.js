document.getElementById("search").addEventListener("click", (e) => {
  const form = document.querySelector("form");
  const search = form.querySelector("input").value;
  if (search !== "") {
    form.submit();
  }
});
