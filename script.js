/* Minha Vitrine Dev — JavaScript puro */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu responsivo ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("menu");

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Rolagem suave ---------- */
  // O CSS (scroll-behavior) já cuida disso; aqui só garantimos o comportamento
  // em links âncora e movemos o foco para a seção, ajudando o teclado.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") { e.preventDefault(); return; } // links provisórios dos projetos
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- Voltar ao topo ---------- */
  document.getElementById("back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Ano do rodapé ---------- */
  document.getElementById("ano").textContent = new Date().getFullYear();

  /* ---------- Animações de entrada ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Link ativo no menu ---------- */
  const links = [...nav.querySelectorAll("a")];
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
  }

  /* ---------- Validação do formulário ---------- */
  /*
   * ATENÇÃO: este formulário só VALIDA os campos no navegador.
   * Nenhuma mensagem é realmente enviada, pois não há backend.
   * Para receber mensagens, integre um serviço (ex.: Formspree, EmailJS)
   * ou um servidor próprio no ponto marcado abaixo.
   */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const rules = {
    nome: (v) => (v.trim().length < 2 ? "Informe seu nome (mínimo 2 letras)." : ""),
    email: (v) => (!emailRe.test(v.trim()) ? "Informe um e-mail válido, como nome@exemplo.com." : ""),
    mensagem: (v) => (v.trim().length < 10 ? "Escreva uma mensagem com pelo menos 10 caracteres." : ""),
  };

  const validateField = (name) => {
    const input = form.elements[name];
    const msg = rules[name](input.value);
    document.getElementById(name + "-erro").textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) input.setAttribute("aria-describedby", name + "-erro");
    return !msg;
  };

  Object.keys(rules).forEach((name) => {
    form.elements[name].addEventListener("blur", () => validateField(name));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";
    const results = Object.keys(rules).map(validateField);
    const firstInvalid = Object.keys(rules).find((n) => form.elements[n].getAttribute("aria-invalid") === "true");

    if (firstInvalid) {
      form.elements[firstInvalid].focus();
      return;
    }
    // >>> Integração real de envio entra aqui (fetch para um serviço/backend). <<<
    status.textContent = "Campos válidos! Porém, o envio real ainda não está configurado neste site.";
  });
})();