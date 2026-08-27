(() => {
  const systems = [
    { href: "/", label: "Centro" },
    { href: "/sistemas/maestro.html", label: "Maestro" },
    { href: "/sistemas/cultura.html", label: "Carácter" },
    { href: "/sistemas/micro-metas.html", label: "Micro metas" },
    { href: "/sistemas/camino-biblico.html", label: "Camino bíblico" },
    { href: "/sistemas/neurociencia.html", label: "Neurociencia" },
    { href: "/sistemas/neurociencia-2.html", label: "Neurociencia 2" },
  ];

  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  const links = systems
    .map(({ href, label }) => {
      const active = currentPath === href ? ' aria-current="page" class="maestro-nav__link is-active"' : ' class="maestro-nav__link"';
      return `<a href="${href}"${active}>${label}</a>`;
    })
    .join("");

  const style = document.createElement("style");
  style.textContent = `
    .maestro-nav { position: fixed; z-index: 50; right: 20px; bottom: 20px; font-family: Arial, sans-serif; }
    .maestro-nav__toggle { display: inline-flex; align-items: center; gap: 9px; padding: 12px 15px; border: 0; border-radius: 999px; color: #fff; background: #245447; box-shadow: 0 12px 28px rgba(20, 44, 38, .28); font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
    .maestro-nav__toggle::before { content: "☰"; font-size: 16px; }
    .maestro-nav__panel { position: absolute; right: 0; bottom: 54px; width: min(260px, calc(100vw - 32px)); padding: 8px; border: 1px solid #d9dfd9; border-radius: 16px; background: rgba(255, 255, 252, .98); box-shadow: 0 18px 48px rgba(23, 43, 37, .18); opacity: 0; pointer-events: none; transform: translateY(8px); transition: opacity .18s ease, transform .18s ease; }
    .maestro-nav.is-open .maestro-nav__panel { opacity: 1; pointer-events: auto; transform: translateY(0); }
    .maestro-nav__title { display: block; padding: 8px 10px 6px; color: #61706a; font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .maestro-nav__link { display: block; padding: 10px; border-radius: 10px; color: #253630; text-decoration: none; font-size: 13px; }
    .maestro-nav__link:hover, .maestro-nav__link:focus-visible, .maestro-nav__link.is-active { color: #1d5848; background: #e6f0e9; outline: none; }
    @media (max-width: 560px) { .maestro-nav { right: 12px; bottom: 12px; } .maestro-nav__panel { bottom: 52px; } }
  `;
  document.head.append(style);

  const navigation = document.createElement("nav");
  navigation.className = "maestro-nav";
  navigation.setAttribute("aria-label", "Cambiar de sistema");
  navigation.innerHTML = `
    <div class="maestro-nav__panel" id="maestro-system-menu">
      <span class="maestro-nav__title">Tus sistemas</span>
      ${links}
    </div>
    <button class="maestro-nav__toggle" type="button" aria-expanded="false" aria-controls="maestro-system-menu">Sistemas</button>
  `;
  document.body.append(navigation);

  const toggle = navigation.querySelector("button");
  const close = () => { navigation.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  document.addEventListener("click", (event) => { if (!navigation.contains(event.target)) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
})();
