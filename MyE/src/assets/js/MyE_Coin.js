// header active nav
function initHeaderActive() {
  const fileName = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
  document.querySelectorAll('header nav a').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === fileName);
  });
}
document.addEventListener('DOMContentLoaded', initHeaderActive);
