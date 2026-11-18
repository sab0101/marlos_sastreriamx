// EDITA: WhatsApp con lada de país, sin + ni espacios (México: 52 + 10 dígitos)
const WHATSAPP = "525500000000";

// FOTOS: agrega aquí los nombres de tus fotos de cada prenda (guárdalas en la carpeta img/)
// Ejemplo: hombre: ["img/hombre-1.jpg", "img/hombre-2.jpg"]
const FOTOS = {
  lookbook: ["img/hombre-2.jpg", "img/taller.jpg", "img/saco-1.jpg", "img/hombre-1.jpg", "img/chaleco-1.jpg", "img/saco-3.jpg", "img/camisa-3.jpg", "img/saco-5.jpg", "img/hombre-3.jpg"], // tira "Trabajos recientes"
  traje: ["img/hombre-1.jpg", "img/hombre-2.jpg", "img/hombre-3.jpg", "img/hombre-4.jpg"],
  saco: ["img/saco-1.jpg", "img/saco-2.jpg", "img/saco-3.jpg", "img/saco-4.jpg", "img/saco-5.jpg", "img/saco-6.jpg", "img/saco-7.jpg"],
  chaleco: ["img/chaleco-1.jpg", "img/chaleco-2.jpg"],
  camisas: ["img/camisa-1.jpg", "img/camisa-2.jpg", "img/camisa-3.jpg", "img/camisa-4.jpg", "img/camisa-5.jpg", "img/camisa-6.jpg"],
  falda: [],
  estudiantes: ["img/camisa-5.jpg", "img/camisa-6.jpg"]
};

// Menú: transparente arriba, sólido al hacer scroll
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("solid", window.scrollY > 60);
onScroll(); addEventListener("scroll", onScroll, { passive: true });

// Menú móvil
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");
toggle.addEventListener("click", () => toggle.setAttribute("aria-expanded", menu.classList.toggle("open")));
menu.addEventListener("click", () => { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", false); });

// Aparición al hacer scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".rv").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 0.08 + "s"; io.observe(el); });

// Trabajos recientes (solo si agregaste fotos a FOTOS.lookbook)
if (FOTOS.lookbook.length) {
  const s = document.getElementById("lookbook"); s.hidden = false;
  FOTOS.lookbook.forEach((src) => {
    const im = new Image(); im.src = src; im.alt = "Trabajo de Marlo's Sastrería"; im.loading = "lazy";
    im.onerror = () => im.remove(); s.querySelector(".rail").appendChild(im);
  });
}

// Prendas según el sexo elegido
const PRENDAS = {
  Hombre: ["Traje", "Saco", "Chaleco", "Camisa", "Para estudiantes (primer trabajo)", "Otro"],
  Mujer: ["Traje", "Saco", "Falda", "Chaleco", "Camisa", "Para estudiantes (primer trabajo)", "Otro"]
};
const sexoSel = document.getElementById("sexo");
const prendaSel = document.getElementById("prenda");
sexoSel.addEventListener("change", () => {
  const lista = PRENDAS[sexoSel.value] || [];
  prendaSel.innerHTML = lista.length
    ? '<option value="">Selecciona</option>' + lista.map((p) => `<option>${p}</option>`).join("")
    : '<option value="">Primero elige el sexo</option>';
  prendaSel.disabled = !lista.length;
});

// Cita por WhatsApp
document.getElementById("cita").addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(e.target);
  const msg = `Hola, soy ${d.get("nombre")} (${d.get("sexo")}). Me interesa: ${d.get("traje")}` +
    (d.get("fecha") ? `. La necesito para el ${d.get("fecha")}` : "") +
    ". ¿Podemos agendar una cita?";
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

document.getElementById("y").textContent = new Date().getFullYear();

// Galería de ejemplos al hacer clic en una prenda
const dlg = document.getElementById("gal");
const openGal = (card) => {
  document.getElementById("gal-t").textContent = card.querySelector("h3").textContent;
  const box = document.getElementById("gal-g");
  const fotos = FOTOS[card.dataset.k] || [];
  box.innerHTML = fotos.length ? "" : "<p>Muy pronto: fotos de nuestros trabajos. Escríbenos y te las enviamos.</p>";
  fotos.forEach((src) => {
    const im = new Image(); im.src = src; im.alt = card.querySelector("h3").textContent; im.loading = "lazy";
    im.onerror = () => im.remove(); box.appendChild(im);
  });
  dlg.showModal();
};
document.querySelectorAll(".grid article").forEach((a) => {
  a.addEventListener("click", () => openGal(a));
  a.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGal(a); } });
});
dlg.querySelector(".x").addEventListener("click", () => dlg.close());
document.getElementById("gal-cta").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

// Foto de portada en cada tarjeta: usa la primera foto de FOTOS[prenda] (si existe)
document.querySelectorAll(".grid article").forEach((a) => {
  const f = (FOTOS[a.dataset.k] || [])[0]; if (!f) return;
  const im = new Image(); im.src = f; im.alt = ""; im.className = "cover";
  im.onload = () => { a.querySelector(".ico").style.display = "none"; a.prepend(im); };
});