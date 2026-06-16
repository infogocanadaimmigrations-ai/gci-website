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
