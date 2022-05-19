const data = {
  titles: [...document.querySelectorAll(".site-title")].map((title) =>
    title.textContent.trim().toLowerCase()
  ),
  tags: [...document.querySelectorAll(".tag-name")].map((tag) =>
    tag.textContent.trim().toLowerCase()
  ),
};

/**
 * @param {string} val
 */
const get_suggestions = (val) => {
  let titles = data.titles.filter((title) => {
    return title.includes(val);
  });

  let tags = data.tags
    .filter((tag) => {
      return tag.includes(val.slice(1)) && val.charAt(0) === "#";
    })
    .map((tag) => `#${tag}`);

  let suggested = [...titles, tags];

  suggested = suggested.filter((item, idx, self) => {
    return self.indexOf(item) === idx;
  });
  suggested.sort();

  return suggested;
};

/**
 * @param {Event} e
 */
const search_hover = (e) => {
  if (e.type === "mouseover") {
    e.currentTarget.classList.add("active");
  }
  if (e.type === "mouseleave") {
    e.currentTarget.classList.remove("active");
  }
};

/**
 * @param {Event} e
 */
const selected = (e) => {
  const val = e.currentTarget.textContent;
  document.getElementById("search-suggestions").innerHTML = "";
  document.getElementById("search-input").value = val;
};

/**
 * @param {string} s
 * @returns {string}
 */
const title_case = (s) => {
  return s
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
};

/**
 * @param {Event} e
 */
const searching = (e) => {
  const ul = document.getElementById("search-suggestions");
  const val = e.currentTarget.value.toLowerCase();
  ul.innerHTML = "";
  if (val !== null && val.trim() !== "") {
    get_suggestions(val).forEach((s) => {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(title_case(s)));
      li.classList.add("list-group-item", "suggested", "faded-out");
      li.addEventListener("mouseover", search_hover);
      li.addEventListener("mouseleave", search_hover);
      li.addEventListener("click", selected);
      ul.appendChild(li);
      requestAnimationFrame(() => {
        li.classList.remove("faded-out");
      });
    });
  }
};
