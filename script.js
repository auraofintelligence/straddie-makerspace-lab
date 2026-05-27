const pages = [
  { id: "home", label: "Home", href: "index.html" },
  { id: "proposal", label: "Proposal", href: "proposal.html" },
  { id: "experiments", label: "Experiments", href: "experiments.html" },
  { id: "tools", label: "Tools", href: "tools.html" },
  { id: "tip", label: "Tip Loop", href: "tip-loop.html" },
  { id: "forms", label: "Forms", href: "forms.html" },
  { id: "sand", label: "Sand", href: "sand.html" },
  { id: "concrete", label: "Concrete", href: "concrete.html" },
  { id: "future", label: "Future", href: "future.html" },
  { id: "network", label: "Network", href: "network.html" },
  { id: "sources", label: "Sources", href: "sources.html" }
];

const pageId = document.body.dataset.page || "home";

function icon(kind) {
  const icons = {
    flask: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v5l-5.5 9.5A2.5 2.5 0 0 0 6.7 21h10.6a2.5 2.5 0 0 0 2.2-3.5L14 8V3"/><path d="M7.5 16h9"/><path d="M10 12h4"/></svg>',
    wrench: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.3 5.3L3.7 17.3a2.1 2.1 0 1 0 3 3l5.7-5.7a4 4 0 0 0 5.3-5.3l-2.8 2.8-3-3z"/></svg>',
    recycle: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m7 19 2-3H5.5a2.5 2.5 0 0 1-2.1-3.9L5 9.5"/><path d="m13 5-2 3h3.6a2.5 2.5 0 0 1 2.1 3.9L15 14.5"/><path d="m16 19-4.2.1 1.9-3.7"/><path d="m8 5 4.2-.1-1.9 3.7"/></svg>',
    sand: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16"/><path d="M6 17 12 5l6 12"/><path d="M9 15h6"/><path d="M11 11h2"/></svg>',
    shed: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-6 9 6v12"/><path d="M7 21v-8h10v8"/><path d="M9 16h6"/></svg>',
    network: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="m8.6 10.6 6.8-3.2"/><path d="m8.6 13.4 6.8 3.2"/></svg>',
    clipboard: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4h6a2 2 0 0 1 2 2v1H7V6a2 2 0 0 1 2-2z"/><path d="M7 6H5v15h14V6h-2"/><path d="M8 12h8"/><path d="M8 16h6"/></svg>',
    concrete: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M5 16h14v4H5z"/><path d="M7 12h10v4H7z"/><path d="M9 8h6v4H9z"/><path d="M11 4h2v4h-2z"/></svg>'
  };
  return icons[kind] || icons.flask;
}

function renderHeader() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;
  header.className = "site-header";
  header.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <nav class="nav" aria-label="Main navigation">
      <a class="brand-mark" href="index.html" aria-label="Straddie Maker-Space Lab home">
        <span>Straddie</span>
        <span>Maker-Space Lab</span>
      </a>
      <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-links">
        ${pages.map((page) => `<a href="${page.href}" ${page.id === pageId ? 'aria-current="page"' : ""}>${page.label}</a>`).join("")}
      </div>
    </nav>
  `;

  const toggle = header.querySelector(".nav-toggle");
  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
}

function renderFooter() {
  const footer = document.querySelector("[data-site-footer]");
  if (!footer) return;
  const index = pages.findIndex((page) => page.id === pageId);
  const previous = pages[(index - 1 + pages.length) % pages.length];
  const next = pages[(index + 1) % pages.length];

  footer.className = "site-footer";
  footer.innerHTML = `
    <nav class="sequence-nav" aria-label="Previous and next pages">
      <a href="${previous.href}"><span>Previous</span><strong>${previous.label}</strong></a>
      <a href="${next.href}"><span>Next</span><strong>${next.label}</strong></a>
    </nav>
    <div class="footer-inner">
      <p>Straddie Maker-Space Lab is a public Strange But True family prototype. It is a proposal and learning map, not an approval claim.</p>
      <div class="footer-links">
        <a href="https://auraofintelligence.github.io/straddie-makerspace-lab/">Live site</a>
        <a href="https://github.com/auraofintelligence/straddie-makerspace-lab">Source repo</a>
        <a href="https://auraofintelligence.github.io/strange-but-true/">Strange But True</a>
        <a href="LICENCE.md">Licence</a>
      </div>
    </div>
  `;
}

function setupBackToTop() {
  const button = document.createElement("button");
  button.className = "back-to-top";
  button.type = "button";
  button.setAttribute("aria-label", "Back to top");
  button.title = "Back to top";
  button.textContent = "↑";
  document.body.append(button);

  button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  const update = () => button.classList.toggle("is-visible", window.scrollY > 500);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupExternalLinks() {
  document.querySelectorAll('a[href^="http://"], a[href^="https://"]').forEach((link) => {
    link.target = "_blank";
    const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    rel.add("noopener");
    rel.add("noreferrer");
    link.setAttribute("rel", [...rel].join(" "));
  });
}

renderHeader();
renderFooter();
setupBackToTop();
setupExternalLinks();

window.StraddieMakerSpace = { icon };

document.querySelectorAll("[data-icon]").forEach((node) => {
  node.innerHTML = icon(node.dataset.icon);
});
