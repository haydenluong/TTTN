function initHeaderActive() {
  const fileName = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
  document.querySelectorAll('header nav a').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === fileName);
  });
}

async function loadComponents() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    const res = await fetch('Header.html');
    headerPlaceholder.innerHTML = await res.text();
    initHeaderActive();
  }

  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    const res = await fetch('Footer.html');
    footerPlaceholder.innerHTML = await res.text();
  }
}

document.addEventListener('DOMContentLoaded', loadComponents);
