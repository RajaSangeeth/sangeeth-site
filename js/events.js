// Loads data/events.json and renders the Events page.
// Groups are shown in the order listed in "groups"; items without a group
// (or with a group not listed) appear under "Other events".
(function () {
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function renderEvent(item) {
    var wrap = el("div", "event");
    var photos = item.photos || [];
    if (photos.length) {
      var cover = el("img");
      cover.src = photos[0];
      cover.alt = item.title || "";
      cover.loading = "lazy";
      wrap.appendChild(cover);
    }
    var text = el("div", "event-text");
    text.appendChild(el("h3", "", item.title || "Untitled"));
    if (item.date) text.appendChild(el("p", "pub-meta", item.date));
    if (item.description) text.appendChild(el("p", "", item.description));
    if (item.link) {
      var p = el("p");
      var a = el("a", "", item.link_label || "Read more \u2192");
      a.href = item.link;
      a.target = "_blank";
      a.rel = "noopener";
      p.appendChild(a);
      text.appendChild(p);
    }
    if (photos.length > 1) {
      var extra = el("div", "event-extra");
      photos.slice(1).forEach(function (src) {
        var img = el("img");
        img.src = src;
        img.alt = item.title || "";
        img.loading = "lazy";
        extra.appendChild(img);
      });
      text.appendChild(extra);
    }
    wrap.appendChild(text);
    return wrap;
  }

  function section(container, heading, items) {
    var h = el("h2", "", heading);
    container.appendChild(h);
    var list = el("div", "events");
    if (!items.length) {
      list.appendChild(el("p", "empty", "Nothing listed yet."));
    } else {
      items.forEach(function (it) { list.appendChild(renderEvent(it)); });
    }
    container.appendChild(list);
  }

  function render(container, data) {
    container.innerHTML = "";
    var groups = data.groups || [];
    var items = data.items || [];
    groups.forEach(function (g) {
      section(container, g, items.filter(function (i) { return i.group === g; }));
    });
    var others = items.filter(function (i) { return groups.indexOf(i.group) === -1; });
    if (others.length) section(container, "Other events", others);
  }

  var target = document.querySelector("[data-events]");
  if (!target) return;
  fetch("data/events.json", { cache: "no-cache" })
    .then(function (r) { return r.json(); })
    .then(function (data) { render(target, data); })
    .catch(function () { target.innerHTML = '<p class="empty">The events could not be loaded.</p>'; });
})();
