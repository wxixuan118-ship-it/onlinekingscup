/* Android app download bar: Android only, stays dismissed for 30 days.
   Self-contained (injects its own CSS) so any page can include it. */
(function () {
  if (!/Android/i.test(navigator.userAgent)) return;

  var KEY = 'appBarDismissedAt', TTL = 30 * 864e5;
  try { if (Date.now() - Number(localStorage.getItem(KEY) || 0) < TTL) return; } catch (e) {}

  var css =
    '.app-bar{position:fixed;left:0;right:0;bottom:0;z-index:900;display:flex;align-items:center;gap:10px;padding:10px 12px calc(10px + env(safe-area-inset-bottom));background:#17152b;color:#fff;box-shadow:0 -6px 24px rgba(0,0,0,.25);font:14px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
    '.app-bar-icon{flex:none;width:40px;height:40px;border-radius:10px}' +
    '.app-bar-text{flex:1;min-width:0}' +
    '.app-bar-text strong{display:block;font-size:15px}' +
    '.app-bar-text span{color:rgba(255,255,255,.65)}' +
    '.app-bar-get{flex:none;padding:8px 14px;border-radius:99px;background:#ffd84d;color:#17152b!important;font-weight:800;text-decoration:none!important}' +
    '.app-bar-close{flex:none;width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:rgba(255,255,255,.6);font-size:21px;line-height:1;cursor:pointer}' +
    'body.has-app-bar{padding-bottom:72px}' +
    'body:has(.game-overlay.fullscreen) .app-bar{display:none}';

  function track(name) { if (window.gtag) gtag('event', name, { store: 'google_play', placement: 'android-bar' }); }

  function show() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.className = 'app-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Get the Android app');
    bar.innerHTML =
      '<img class="app-bar-icon" src="/favicon-96.png" alt="" width="40" height="40">' +
      '<div class="app-bar-text"><strong>Kings Cup for Android</strong><span>Free · plays offline · no ads</span></div>' +
      '<a class="app-bar-get" href="https://play.google.com/store/apps/details?id=com.onlinekingscup.app" target="_blank" rel="noopener">Get</a>' +
      '<button class="app-bar-close" type="button" aria-label="Dismiss">&times;</button>';
    bar.querySelector('.app-bar-get').addEventListener('click', function () { track('app_store_click'); });
    bar.querySelector('.app-bar-close').addEventListener('click', function () {
      bar.remove(); document.body.classList.remove('has-app-bar');
      try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
      track('app_bar_dismiss');
    });
    document.body.appendChild(bar);
    document.body.classList.add('has-app-bar');
  }

  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
