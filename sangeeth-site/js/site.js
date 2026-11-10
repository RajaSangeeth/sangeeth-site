// Loads data/publications.json and renders it into any element marked
// data-publications (full list) or data-latest (short teaser on the home page).
(function () {
  function renderItem(item) {
    var li = document.createElement("li");

    var title = document.createElement("div");
    title.className = "pub-title";
    title.textContent = item.title || "Untitled";
    if (item.status && item.status !== "Published") {
      var badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = item.status;
      title.appendChild(badge);
    }
    li.appendChild(title);

    var meta = document.createElement("div");
    meta.className = "pub-meta";
    meta.textContent = [item.venue, item.year].filter(Boolean).join(", ");
    li.appendChild(meta);

    var actions = document.createElement("div");
    actions.className = "pub-actions";
    if (item.link) {
      var a = document.createElement("a");
      a.href = item.link;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Read online";
      actions.appendChild(a);
    }
    if (item.pdf) {
      var p = document.createElement("a");
      p.href = item.pdf;
      p.target = "_blank";
      p.rel = "noopener";
      p.textContent = "Download PDF";
      actions.appendChild(p);
    }
    if (actions.childNodes.length) li.appendChild(actions);

    return li;
  }

  function render(container, items, limit) {
    var list = document.createElement("ul");
    list.className = "pub-list";
    var shown = limit ? items.slice(0, limit) : items;
    shown.forEach(function (item) { list.appendChild(renderItem(item)); });
    container.innerHTML = "";
    if (shown.length) {
      container.appendChild(list);
    } else {
      container.innerHTML = '<p class="empty">No publications listed yet.</p>';
    }
  }

  fetch("data/publications.json", { cache: "no-cache" })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var items = (data && data.items) || [];
      document.querySelectorAll("[data-publications]").forEach(function (el) {
        render(el, items);
      });
      document.querySelectorAll("[data-latest]").forEach(function (el) {
        render(el, items, 3);
      });
    })
    .catch(function () {
      document.querySelectorAll("[data-publications],[data-latest]").forEach(function (el) {
        el.innerHTML = '<p class="empty">Publications could not be loaded.</p>';
      });
    });
})();
