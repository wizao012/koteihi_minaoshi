// Set only a verified consultation number. Never use a placeholder tel: destination.
const CONTACT = { phone: '050-5292-1700', hours: '' };
const dialog = document.querySelector('#phone-pending');
if (CONTACT.phone) {
  const digits = CONTACT.phone.replace(/[^0-9+]/g, '');
  document.querySelectorAll('.call').forEach(a => a.href = 'tel:' + digits);
  document.querySelectorAll('.phone-number').forEach(el => el.textContent = CONTACT.phone);
  document.querySelector('#draft-banner').hidden = true;
} else {
  document.querySelectorAll('.call').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); dialog.showModal();
  }));
}
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
const sticky = document.querySelector('.mobile-cta');
new IntersectionObserver(([entry]) => {
  sticky.hidden = entry.boundingClientRect.bottom > 0;
}).observe(document.querySelector('.fv-cta'));
const navLinks = [...document.querySelectorAll('.rail-menu nav a')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
function updateNavigation() {
  let active = sections[0];
  sections.forEach(section => { if (section.getBoundingClientRect().top <= innerHeight * .35) active = section; });
  navLinks.forEach(a => {
    if (a.getAttribute('href') === '#' + active.id) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
}
let scheduled = false;
addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(() => { updateNavigation(); scheduled = false; }); }
}, { passive: true });
addEventListener('resize', updateNavigation);
updateNavigation();
// Fit the intact hero and primary CTA in the smallest browser viewport.
const firstViewParts = [document.querySelector('.breaking-news'), document.querySelector('#draft-banner'), document.querySelector('.lp-column header'), document.querySelector('.fv-cta'), document.querySelector('.hero-date')];
function fitFirstView() {
  const reserved = firstViewParts.reduce((sum, el) => sum + el.getBoundingClientRect().height, 0) + 8;
  document.querySelector('.lp-column').style.setProperty('--fv-reserved', reserved + 'px');
}
const firstViewObserver = new ResizeObserver(fitFirstView);
firstViewParts.forEach(el => firstViewObserver.observe(el));
fitFirstView();
addEventListener('resize', fitFirstView);
document.fonts.ready.then(fitFirstView);
