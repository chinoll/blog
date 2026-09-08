(() => {
  const button = document.querySelector('.theme-toggle');
  if (!button) return;

  function renderTheme(theme) {
    const dark = theme === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  }

  renderTheme(document.documentElement.dataset.theme);
  button.hidden = false;
  button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    renderTheme(next);
    try { localStorage.setItem('chino-theme', next); } catch (_) {}
  });
})();
