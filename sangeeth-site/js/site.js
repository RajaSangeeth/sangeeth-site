// Loads data/publications.json and renders it.
// [data-publications] shows every item grouped by type.
// [data-latest] shows the first few items as a short teaser on the home page.
(function () {
  function renderItem(item) {
    var li = document.createElement("li");

    var title = document.createElement("div");
    title.className = "pub-title";
    title.textContent = item.title || "Untitled";
    li.appendChild(title);

    if (item.authors) {
      var authors = document.createElement("div");
      authors.className = "pub-authors";
      authors.textContent = item.authors;
      li.appendChild(authors);
    }

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

  function renderGrouped(container, items) {
    container.innerHTML = "";
    if (!items.length) {
      container.innerHTML = '<p class="empty">No publications listed yet.</p>';
      return;
    }
    var groups = [];
    var byType = {};
    items.forEach(function (item) {
      var t = item.type || "Other";
      if (!byType[t]) {
        byType[t] = [];
        groups.push(t);
      }
      byType[t].push(item);
    });
    groups.forEach(function (t) {
      var h = document.createElement("h2");
      h.textContent = t;
      container.appendChild(h);
      var list = document.createElement("ul");
      list.className = "pub-list";
      byType[t].forEach(function (item) { list.appendChild(renderItem(item)); });
      container.appendChild(list);
    });
  }

  function renderLatest(container, items, limit) {
    container.innerHTML = "";
    var shown = items.slice(0, limit);
    if (!shown.length) {
      container.innerHTML = '<p class="empty">No publications listed yet.</p>';
      return;
    }
    var list = document.createElement("ul");
    list.className = "pub-list";
    shown.forEach(function (item) { list.appendChild(renderItem(item)); });
    container.appendChild(list);
  }

  fetch("data/publications.json", { cache: "no-cache" })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var items = (data && data.items) || [];
      document.querySelectorAll("[data-publications]").forEach(function (el) {
        renderGrouped(el, items);
      });
      document.querySelectorAll("[data-latest]").forEach(function (el) {
        renderLatest(el, items, 3);
      });
    })
    .catch(function () {
      document.querySelectorAll("[data-publications],[data-latest]").forEach(function (el) {
        el.innerHTML = '<p class="empty">Publications could not be loaded.</p>';
      });
    });
})();
