const data = {
  titles: [],
  tags: [],
};
document.querySelectorAll(".site-title").forEach((title) => {
  data.titles.push(title.textContent.trim().toLowerCase());
});

document.querySelectorAll(".tag-name").forEach((tag) => {
  data.tags.push(tag.textContent.trim().toLowerCase());
});

const get_suggestions = (val) => {
  let suggested = [];

  let titles = data.titles.filter((title) => {
    return title.includes(val);
  });

  let tags = data.tags
    .filter((tag) => {
      return tag.includes(val.slice(1)) && val[0] === "#";
    })
    .map((tag) => `#${tag}`);

  suggested = titles.concat(tags);
  suggested = suggested.filter((item, idx, self) => {
    return self.indexOf(item) === idx;
  });
  suggested.sort();

  return suggested;
};

const search_hover = (e) => {
  if (e.type === "mouseover") {
    e.currentTarget.classList.add("active");
  }
  if (e.type === "mouseleave") {
    e.currentTarget.classList.remove("active");
  }
};

const selected = (e) => {
  const val = e.currentTarget.textContent;
  document.getElementById("search-suggestions").innerHTML = "";
  document.getElementById("search-input").value = val;
};

const searching = (e) => {
  const ul = document.getElementById("search-suggestions");
  const val = e.currentTarget.value.toLowerCase();
  ul.innerHTML = "";
  if (val !== null && val.trim() !== "") {
    get_suggestions(val).forEach((s) => {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(s));
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
