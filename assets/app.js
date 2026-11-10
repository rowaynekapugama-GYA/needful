// Medeful website draft: interactions
(function () {
  var doc = document.documentElement;

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Liquid glass highlight follows the pointer
  document.querySelectorAll('.glass').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Mobile menu
  var burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = doc.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Hide nav on scroll down, show on scroll up
  var nav = document.querySelector('.nav'), last = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (nav && !doc.classList.contains('menu-open')) {
      nav.style.transform = (y > last && y > 400) ? 'translateY(-120%)' : '';
    }
    last = y;
  }, { passive: true });

  // Journey: auto-cycling steps, click to select
  var steps = Array.prototype.slice.call(document.querySelectorAll('.journey .step'));
  if (steps.length) {
    var i = 0, timer;
    var set = function (n) { i = n; steps.forEach(function (s, k) { s.classList.toggle('active', k === n); }); };
    var run = function () { timer = setInterval(function () { set((i + 1) % steps.length); }, 2800); };
    steps.forEach(function (s, k) {
      s.addEventListener('click', function () { clearInterval(timer); set(k); run(); });
      s.addEventListener('mouseenter', function () { clearInterval(timer); set(k); });
      s.addEventListener('mouseleave', function () { clearInterval(timer); run(); });
    });
    set(0); run();
  }

  // Subtle parallax on the ecosystem diagram
  var eco = document.querySelector('.hero .eco');
  if (eco && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 14, y = (e.clientY / window.innerHeight - 0.5) * 14;
      eco.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
  }

  // Contact form: preselect interest from ?interest=
  var params = new URLSearchParams(window.location.search);
  var interest = params.get('interest');
  if (interest) {
    var sel = document.querySelector('select[name="interest"]');
    if (sel) { Array.prototype.forEach.call(sel.options, function (o) { if (o.value === interest) sel.value = interest; }); }
  }

  // Draft forms: show the confirmation state. In production these post to SmileOX.
  document.querySelectorAll('form[data-draft]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      f.classList.add('sent');
      f.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
})();
