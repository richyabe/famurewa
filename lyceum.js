/* ---- State ---- */
let currentRating = 0;
const comments = [
  { name:'Mrs. Adaeze Mba', role:'Parent', country:'🇳🇬 Nigeria', stars:5, date:'2 days ago', body:"Mr. Famurewa's teaching style is unlike any other. My daughter finally understands organic chemistry — something three previous tutors failed to achieve. Highly recommend Lyceum Academy to every parent.", likes:12, liked:false },
  { name:'Mr. David Kolade', role:'Parent', country:'🇨🇦 Canada', stars:5, date:'1 week ago', body:"Exceptional tutor. My daughter moved between the IGCSE and Canadian curricula without missing a step, and her confidence has completely transformed. The psychology-informed approach was something we didn't expect but desperately needed. Thank you!", likes:8, liked:false },
  { name:'Ethan Mitchell', role:'Student', country:'🇦🇺 Australia', stars:5, date:'2 weeks ago', body:"Best tutor I've ever had. Mr. Famurewa makes Chemistry actually interesting. His memory techniques are genuinely game-changing — I used them in my HSC and scored 94/100.", likes:15, liked:false }
];

/* ---- Page navigation ---- */
function nav(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
  const nl = document.getElementById('nl-' + page);
  if (nl) nl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(initAOS, 120);
}

function scrollTo(id) {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 320);
}

/* ---- Hamburger ---- */
const hbg = document.getElementById('hbg');
const mnav = document.getElementById('mnav');

hbg.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = mnav.classList.contains('open');
  if (isOpen) {
    closeNav();
  } else {
    openNav();
  }
});

function openNav() {
  hbg.classList.add('open');
  mnav.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  hbg.classList.remove('open');
  mnav.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mnav.classList.contains('open')) closeNav();
});

// Close when clicking backdrop (outside menu items)
mnav.addEventListener('click', (e) => {
  if (e.target === mnav) closeNav();
});

/* ---- Dark / Light theme ---- */
const themeBtn = document.getElementById('theme-btn');
const html = document.documentElement;
const saved = localStorage.getItem('la-theme');
if (saved === 'dark') { html.setAttribute('data-theme','dark'); themeBtn.innerHTML='<i class="fas fa-sun"></i>'; }
themeBtn.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  localStorage.setItem('la-theme', isDark ? 'light' : 'dark');
});

/* ---- Sticky navbar & back to top ---- */
const nb = document.getElementById('navbar');
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  nb.classList.toggle('scrolled', window.scrollY > 50);
  btt.classList.toggle('show', window.scrollY > 300);
});

/* ---- AOS ---- */
function initAOS() {
  const els = document.querySelectorAll('#page-' + getCurrentPage() + ' [data-aos]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
}
function getCurrentPage() {
  const active = document.querySelector('.page.active');
  return active ? active.id.replace('page-','') : 'home';
}
initAOS();

/* ---- Counters ---- */
function initCounters() {
  document.querySelectorAll('.ctr').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = +el.dataset.t;
    let cur = 0;
    const step = target / (1800 / 16);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur).toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 16);
  });
}
const ctrObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) initCounters(); });
}, { threshold: 0.3 });
document.querySelectorAll('.stats-bar').forEach(el => ctrObs.observe(el));

/* ---- Progress bar ---- */
setTimeout(() => {
  const pf = document.getElementById('prog-fill');
  if (pf) pf.style.width = '78%';
}, 700);

/* ---- Testimonial slider (home) ---- */
(function () {
  const track = document.getElementById('htt');
  const ctrl = document.getElementById('htd');
  if (!track || !ctrl) return;
  const cards = track.querySelectorAll('.t-card');
  let perView = window.innerWidth < 768 ? 1 : 3;
  let cur = 0;
  const total = Math.ceil(cards.length / perView);
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 't-dot' + (i === 0 ? ' on' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => go(i));
    ctrl.appendChild(d);
  }
  function go(idx) {
    cur = (idx + total) % total;
    const w = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${cur * perView * w}px)`;
    ctrl.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('on', i === cur));
  }
  let auto = setInterval(() => go(cur + 1), 5200);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
  track.parentElement.addEventListener('mouseleave', () => { auto = setInterval(() => go(cur + 1), 5200); });
  window.addEventListener('resize', () => { perView = window.innerWidth < 768 ? 1 : 3; go(0); });
})();

/* ---- FAQ ---- */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ---- Comments / Reviews ---- */
function renderComments() {
  const list = document.getElementById('comments-list');
  if (!list) return;
  if (comments.length === 0) {
    list.innerHTML = '<div class="no-comments"><i class="fas fa-comment" style="font-size:2rem;color:var(--gray-lt);margin-bottom:.75rem;display:block"></i>No reviews yet. Be the first to share your experience!</div>';
    return;
  }
  list.innerHTML = comments.map((c, idx) => `
    <div class="cmt-card" id="cmt-${idx}">
      <div class="cmt-header">
        <div class="cmt-av">${c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
        <div>
          <div class="cmt-nm">${escHtml(c.name)}</div>
          <div class="cmt-role">${escHtml(c.role)} · ${escHtml(c.country)}</div>
        </div>
        <div class="cmt-stars">${'★'.repeat(c.stars)}${'☆'.repeat(5-c.stars)}</div>
        <span class="cmt-date">${escHtml(c.date)}</span>
      </div>
      <div class="cmt-body">${escHtml(c.body)}</div>
      <button class="cmt-like ${c.liked?'liked':''}" onclick="toggleLike(${idx})">
        <i class="fas fa-thumbs-up"></i> Helpful (${c.likes})
      </button>
    </div>
  `).join('');
}
function toggleLike(idx) {
  comments[idx].liked = !comments[idx].liked;
  comments[idx].likes += comments[idx].liked ? 1 : -1;
  renderComments();
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function setRating(val) {
  currentRating = val;
  document.querySelectorAll('.star-btn').forEach((b,i) => b.classList.toggle('active', i < val));
}
function submitComment() {
  const name = document.getElementById('cmt-name').value.trim();
  const role = document.getElementById('cmt-role').value;
  const country = document.getElementById('cmt-country').value.trim() || 'Worldwide';
  const body = document.getElementById('cmt-body').value.trim();
  if (!name) { showToast('Please enter your name.'); return; }
  if (!body) { showToast('Please write your review.'); return; }
  if (!currentRating) { showToast('Please select a star rating.'); return; }
  comments.unshift({ name, role: role || 'Visitor', country, stars: currentRating, date: 'Just now', body, likes: 0, liked: false });
  renderComments();
  document.getElementById('cmt-name').value = '';
  document.getElementById('cmt-role').value = '';
  document.getElementById('cmt-country').value = '';
  document.getElementById('cmt-body').value = '';
  setRating(0);
  currentRating = 0;
  showToast('Thank you! Your review has been posted.');
  document.getElementById('comments-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
renderComments();

/* ---- Contact form ---- */
function handleContactForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Sent! We\'ll be in touch within 24 hours.';
    btn.style.background = 'linear-gradient(135deg,#25D366,#128C7E)';
    btn.style.color = '#fff';
    btn.disabled = false;
    e.target.reset();
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.style.color = '';
    }, 5000);
  }, 1400);
}

/* ---- Toast ---- */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}
(function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const removeLoader = () => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 650);
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(removeLoader, 1400);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(removeLoader, 1400));
  }
})();
