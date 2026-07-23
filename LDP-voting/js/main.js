document.querySelectorAll('.candidate-card').forEach(function(card) {
  card.addEventListener('click', function() {
    document.getElementById('pp-success').style.display = 'none';
    new bootstrap.Modal(document.getElementById('modal-profile')).show();
  });
});

document.querySelector('.pp-btn-tang').addEventListener('click', function() {
  document.getElementById('pp-success').style.display = 'flex';
});

document.getElementById('pp-success-close').addEventListener('click', function() {
  document.getElementById('pp-success').style.display = 'none';
});

document.querySelector('.pp-btn-ls').addEventListener('click', function() {
  document.getElementById('pp-success').style.display = 'none';
  var profileModal = bootstrap.Modal.getInstance(document.getElementById('modal-profile'));
  if (profileModal) {
    document.getElementById('modal-profile').addEventListener('hidden.bs.modal', function() {
      new bootstrap.Modal(document.getElementById('modal-ls')).show();
    }, { once: true });
    profileModal.hide();
  } else {
    new bootstrap.Modal(document.getElementById('modal-ls')).show();
  }
});

document.getElementById('pn-copy-btn').addEventListener('click', function() {
  var code = document.getElementById('pn-code-text').textContent.trim();
  navigator.clipboard.writeText(code).catch(function() {});
});
