// Loads data/publications.json and renders it.
// Attributes on a container:
//   data-list="Type A,Type B"  types to show (omit for all)
//   data-limit="3"             optional maximum number of items
//   data-topic="Topic name"    optional research topic (matches item.topic)
// Items are shown newest first.
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

  function select(items, typesAttr, limitAttr, topic) {
    var types = typesAttr
      ? typesAttr.split(",").map(function (t) { return t.trim(); })
      : null;
    var chosen = items.filter(function (i) {
      return (!types || types.indexOf(i.type) !== -1) &&
             (!topic || i.topic === topic);
    });
    chosen.sort(function (a, b) {
      return (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
    });
    var limit = parseInt(limitAttr, 10);
    return limit ? chosen.slice(0, limit) : chosen;
  }

  function render(container, items) {
    container.innerHTML = "";
    var chosen = select(items, container.getAttribute("data-list"), container.getAttribute("data-limit"), container.getAttribute("data-topic"));
    if (!chosen.length) {
      container.innerHTML = '<p class="empty">Nothing listed yet.</p>';
      return;
    }
    var list = document.createElement("ul");
    list.className = "pub-list";
    chosen.forEach(function (item) { list.appendChild(renderItem(item)); });
    container.appendChild(list);
  }

  fetch("data/publications.json", { cache: "no-cache" })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var items = (data && data.items) || [];
      document.querySelectorAll("[data-list]").forEach(function (el) {
        render(el, items);
      });
    })
    .catch(function () {
      document.querySelectorAll("[data-list]").forEach(function (el) {
        el.innerHTML = '<p class="empty">The list could not be loaded.</p>';
      });
    });
})();
