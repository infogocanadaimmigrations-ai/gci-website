/* GCI light CMS: injects editable content from /site.json.
   Edited via Pages CMS (app.pagescms.org). HTML keeps current values as
   defaults, so the site still reads correctly if this file/JSON is missing. */
(function () {
  function get(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return (o && o[k] != null) ? o[k] : undefined;
    }, obj);
  }
  function apply(data) {
    document.querySelectorAll('[data-cms-text]').forEach(function (el) {
      var v = get(data, el.getAttribute('data-cms-text'));
      if (v != null && v !== '') el.textContent = v;
    });
    document.querySelectorAll('[data-cms-href]').forEach(function (el) {
      var v = get(data, el.getAttribute('data-cms-href'));
      if (v == null || v === '') return;
      var h = el.getAttribute('href') || '';
      if (h.indexOf('tel:') === 0) el.setAttribute('href', 'tel:' + String(v).replace(/\s+/g, ''));
      else if (h.indexOf('mailto:') === 0) el.setAttribute('href', 'mailto:' + v);
      else el.setAttribute('href', v);
    });
    document.querySelectorAll('[data-cms-phones]').forEach(function (el) {
      var c = data.contact || {};
      var parts = [c.phone1_display, c.phone2_display].filter(function (x) { return x; });
      if (parts.length) el.textContent = parts.join(' · ');
    });
    // animated stat counters: set the target the counter animates to
    var nums = document.querySelectorAll('[data-cms-num]');
    nums.forEach(function (el) {
      var v = get(data, el.getAttribute('data-cms-num'));
      if (v != null) el.setAttribute('data-target', v);
    });
    // safety: if a counter already finished before this loaded (e.g. above the
    // fold), force the correct final value after animations would have run.
    if (nums.length) {
      setTimeout(function () {
        nums.forEach(function (el) {
          var v = get(data, el.getAttribute('data-cms-num'));
          if (v == null) return;
          var shown = (el.textContent || '').replace(/[^\d]/g, '');
          if (shown && shown !== String(v)) el.textContent = Number(v).toLocaleString();
        });
      }, 2500);
    }
    var badge = document.querySelector('.preview-badge');
    if (badge && data.preview_badge) {
      if (data.preview_badge.show === false) badge.style.display = 'none';
      else if (data.preview_badge.text) badge.textContent = data.preview_badge.text;
    }
  }
  try {
    fetch('site.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) apply(d); })
      .catch(function () {});
  } catch (e) {}
})();


/* GCI mobile nav: hamburger toggle + in-menu CTA */
(function () {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var burger = nav.querySelector('.nav-burger');
  var links = nav.querySelector('.links');
  if (!burger || !links) return;
  /* Fix: the base site CSS hides .links with display:none on phones, which
     blocked the menu from ever showing. Force it visible so it can expand. */
  if (!document.getElementById('gci-navfix')) {
    var fix = document.createElement('style');
    fix.id = 'gci-navfix';
    fix.textContent = 'body{background-image:none!important}.light{background-image:none!important}.ic{display:flex!important;align-items:center!important;justify-content:center!important}.ic svg{width:24px;height:24px;display:block}.svc p{font-size:15px;line-height:1.72}.svc h4{margin-bottom:11px}@media(max-width:880px){#nav .links{display:flex!important;background:#FBF7EF!important;border-bottom-color:rgba(42,38,34,.14)!important;box-shadow:0 18px 40px -16px rgba(42,38,34,.3)!important}#nav .links a{color:#2A2622!important;opacity:1!important;font-weight:600;padding:15px 24px;border-bottom:1px solid rgba(42,38,34,.08)}#nav .links a.active{color:#7A1E22!important}#nav .links a::after{display:none!important}#nav .nav-menu-cta{background:#7A1E22!important;color:#fff!important;font-weight:700}.svc-grid{grid-template-columns:1fr!important}.svc h4{font-size:22px;line-height:1.3}}.uni-wall{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}.uni-wall .ucard{background:#fff;border:1px solid rgba(42,38,34,.14);border-radius:12px;height:84px;display:flex;align-items:center;justify-content:center;padding:14px;text-align:center;box-shadow:0 10px 24px -20px rgba(42,38,34,.5)}.uni-wall .ucard img{max-height:54px;max-width:100%;object-fit:contain;display:block}.uni-wall .ucard span{font-family:var(--serif);font-size:14px;color:#2A2622;line-height:1.25;font-weight:600}.strip .names .ulogo{display:inline-flex;align-items:center;justify-content:center;background:#fff;border:1px solid rgba(42,38,34,.12);border-radius:10px;padding:7px 12px;box-shadow:0 6px 16px -12px rgba(42,38,34,.5)}@media(max-width:760px){.strip .names{flex-wrap:wrap!important;justify-content:center}}.strip .names{gap:12px!important;align-items:center;flex-wrap:nowrap}.strip .names .ulogo img{height:30px;width:auto;max-width:130px;object-fit:contain;display:block}@media(max-width:600px){.uni-wall{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))}.uni-wall .ucard{height:72px}}a:focus-visible,button:focus-visible,summary:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid #7A1E22;outline-offset:2px;border-radius:3px}';
    document.head.appendChild(fix);
  }
  if (!links.querySelector('.nav-menu-cta-li')) {
    var li = document.createElement('li');
    li.className = 'nav-menu-cta-li';
    li.innerHTML = '<a class="nav-menu-cta" href="contact.html">Book free assessment</a>';
    links.appendChild(li);
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a')) {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* GCI floating WhatsApp button (all pages) */
(function () {
  if (document.getElementById('gci-wa')) return;
  var num = '918968465555';
  var msg = encodeURIComponent("Hi GCI, I'd like to know more about studying abroad.");
  var a = document.createElement('a');
  a.id = 'gci-wa';
  a.href = 'https://wa.me/' + num + '?text=' + msg;
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Chat with GCI on WhatsApp');
  a.innerHTML = '<svg width="30" height="30" viewBox="0 0 32 32" fill="#fff" aria-hidden="true"><path d="M16.04 4C9.93 4 4.98 8.95 4.98 15.06c0 1.95.51 3.85 1.48 5.53L4.9 27l6.6-1.73a11 11 0 0 0 4.54.98h.01c6.11 0 11.06-4.95 11.06-11.06C27.11 8.95 22.15 4 16.04 4Zm0 20.2h-.01a9.1 9.1 0 0 1-4.64-1.27l-.33-.2-3.92 1.03 1.05-3.82-.22-.34a9.13 9.13 0 0 1-1.4-4.87c0-5.05 4.11-9.16 9.17-9.16 2.45 0 4.75.96 6.48 2.69a9.1 9.1 0 0 1 2.68 6.48c0 5.06-4.11 9.16-9.16 9.16Zm5.03-6.86c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.6.07-.28-.14-1.16-.43-2.21-1.36-.82-.73-1.37-1.62-1.53-1.9-.16-.27-.02-.42.12-.56.13-.13.28-.32.41-.48.14-.16.18-.27.28-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.98 2.66 1.12 2.85.14.18 1.94 2.96 4.7 4.15.66.28 1.17.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.18-.53-.32Z"/></svg>';
  var s = document.createElement('style');
  s.textContent = '#gci-wa{position:fixed;right:20px;bottom:20px;z-index:90;width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px -6px rgba(0,0,0,.45);transition:transform .2s,box-shadow .2s;text-decoration:none}#gci-wa:hover{transform:scale(1.07);box-shadow:0 14px 32px -6px rgba(0,0,0,.55)}@media(max-width:880px){#gci-wa{right:16px;bottom:16px;width:52px;height:52px}}';
  (document.body || document.documentElement).appendChild(s);
  document.body.appendChild(a);
})();


/* GCI mobile destination pills (shown when the globe is skipped on phones) */
(function () {
  var pick = document.getElementById('gpick');
  if (!pick || pick.children.length) return; // not homepage, or globe already built pills (desktop)
  var dest = [['Canada','canada.html'],['UK','uk.html'],['USA','usa.html'],['Australia','australia.html'],['New Zealand','new-zealand.html'],['Europe','europe.html'],['UAE','uae.html'],['Russia','russia.html'],['Singapore','singapore.html'],['Malaysia','malaysia.html'],['Mauritius','mauritius.html']];
  dest.forEach(function (d) {
    var a = document.createElement('a');
    a.href = d[1]; a.textContent = d[0];
    pick.appendChild(a);
  });
})();


/* GCI footer social links (Facebook + Instagram) */
(function () {
  var ft = document.querySelector('footer');
  if (!ft || document.getElementById('gci-social')) return;
  var col = ft.querySelector('.wrap > div') || ft.querySelector('.wrap') || ft;
  var FB = 'https://www.facebook.com/profile.php?id=100090483048177';
  var IG = 'https://www.instagram.com/gocanadaimmigrations_2?igsh=OHg4c2szYWhvYjJx';
  var wrap = document.createElement('div');
  wrap.id = 'gci-social';
  wrap.style.cssText = 'display:flex;gap:12px;align-items:center;margin-top:16px';
  var fb = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>';
  var ig = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg>';
  wrap.innerHTML =
    '<a href="' + FB + '" target="_blank" rel="noopener" aria-label="Go Canada Immigrations on Facebook" style="display:inline-flex;width:38px;height:38px;align-items:center;justify-content:center;border:1px solid rgba(42,38,34,.18);border-radius:10px;color:#7A1E22;text-decoration:none;transition:.2s">' + fb + '</a>' +
    '<a href="' + IG + '" target="_blank" rel="noopener" aria-label="Go Canada Immigrations on Instagram" style="display:inline-flex;width:38px;height:38px;align-items:center;justify-content:center;border:1px solid rgba(42,38,34,.18);border-radius:10px;color:#7A1E22;text-decoration:none;transition:.2s">' + ig + '</a>';
  col.appendChild(wrap);
})();


/* GCI a11y + CLS polish */
(function () {
  // Skip-to-content link
  if (!document.getElementById('gci-skip')) {
    var a = document.createElement('a');
    a.id = 'gci-skip'; a.href = '#main'; a.textContent = 'Skip to content';
    a.style.cssText = 'position:absolute;left:-999px;top:0;z-index:200;background:#7A1E22;color:#fff;padding:10px 16px;border-radius:0 0 10px 0;font-weight:700;text-decoration:none';
    a.addEventListener('focus', function () { a.style.left = '0'; });
    a.addEventListener('blur', function () { a.style.left = '-999px'; });
    document.body.prepend(a);
    var main = document.querySelector('.stage section, main, section');
    if (main && !main.id) main.id = 'main';
  }
  // Reserve nav-logo space to prevent layout shift (logo-dark.png is 760x242)
  document.querySelectorAll('img.logo').forEach(function (im) {
    if (!im.getAttribute('width')) { im.setAttribute('width', '138'); im.setAttribute('height', '44'); }
  });
  // Lazy-load + sandbox offscreen iframes (e.g. the contact map)
  document.querySelectorAll('iframe').forEach(function (f) {
    if (!f.getAttribute('loading')) f.setAttribute('loading', 'lazy');
  });
})();
