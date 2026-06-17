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
    fix.textContent = '@media(max-width:880px){#nav .links{display:flex!important}.svc-grid{grid-template-columns:1fr!important}.svc h4{font-size:22px;line-height:1.3}}';
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
