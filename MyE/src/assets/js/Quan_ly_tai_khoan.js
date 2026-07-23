const linkedAccount = { provider: 'google', name: 'Nguyễn Văn A', id: 'gg.01020' };

const providerIcons = {
  facebook: '<i class="bi bi-facebook"></i>',
  google: `<svg viewBox="0 0 48 48" width="20" height="20">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.5 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.5 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 34.9 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.8l6.6 5.6C39.4 37.9 44 32.5 44 24c0-1.3-.1-2.7-.4-3.5z"/>
  </svg>`,
};

const providerIds = {
  facebook: 'fb.01020',
  google: 'gg.01020',
  mye: 'myepro1123',
};

function renderLinkedAccount() {
  if (providerIcons[linkedAccount.provider]) {
    document.querySelectorAll('.linked-provider-icon').forEach((el) => {
      el.classList.remove('provider-facebook', 'provider-google');
      el.classList.add(`provider-${linkedAccount.provider}`);
      el.innerHTML = providerIcons[linkedAccount.provider];
    });
    document.querySelectorAll('.linked-provider-name').forEach((el) => {
      el.textContent = linkedAccount.name;
    });
    document.querySelectorAll('.linked-provider-id').forEach((el) => {
      el.textContent = linkedAccount.id;
    });
  }
  document.querySelectorAll('.provider-switch-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.provider === linkedAccount.provider);
  });
}
document.addEventListener('DOMContentLoaded', renderLinkedAccount);

document.querySelectorAll('.provider-switch-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    linkedAccount.provider = btn.dataset.provider;
    linkedAccount.id = providerIds[linkedAccount.provider];
    renderLinkedAccount();
  });
});

const syncToggle = document.getElementById('sync-toggle');
const syncSummary = document.getElementById('sync-summary');
const syncForm = document.getElementById('sync-form');
const syncSuccess = document.getElementById('sync-success');
const syncCompactSynced = document.getElementById('sync-compact-synced');
const syncNativeCollapsed = document.getElementById('sync-native-collapsed');
const syncNativeExpanded = document.getElementById('sync-native-expanded');
const syncConfirm = document.getElementById('sync-confirm');
const syncUsernameInput = document.getElementById('sync-username');
const syncMyeUsername = document.getElementById('sync-mye-username');
const syncMyeUsernameCompact = document.getElementById('sync-mye-username-compact');

const syncAllBlocks = [syncSummary, syncForm, syncSuccess, syncCompactSynced, syncNativeCollapsed, syncNativeExpanded];

let syncState = 'idle';
let isSynced = false;

function isNative() {
  return linkedAccount.provider === 'mye';
}

function renderSyncState() {
  let block;
  if (syncState === 'success') {
    block = syncSuccess;
  } else if (syncState === 'form') {
    block = isNative() ? syncNativeExpanded : syncForm;
  } else {
    block = isNative() ? syncNativeCollapsed : isSynced ? syncCompactSynced : syncSummary;
  }
  syncAllBlocks.forEach((b) => b.classList.toggle('d-none', b !== block));
  syncToggle.classList.toggle('open', syncState === 'form');
}

if (syncToggle) {
  syncToggle.addEventListener('click', () => {
    syncState = syncState === 'idle' ? 'form' : 'idle';
    renderSyncState();
  });
}

if (syncConfirm) {
  syncConfirm.addEventListener('click', () => {
    isSynced = true;
    const username = syncUsernameInput.value.trim() || 'myepro456';
    syncMyeUsername.textContent = username;
    syncMyeUsernameCompact.textContent = username;
    syncState = 'success';
    renderSyncState();
  });
}

document.addEventListener('DOMContentLoaded', renderSyncState);

document.querySelectorAll('.provider-switch-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    syncState = 'idle';
    renderSyncState();
  });
});

const personalInfoViewActions = document.getElementById('personal-info-view-actions');
const personalInfoEditActions = document.getElementById('personal-info-edit-actions');
const personalInfoEditBtn = document.getElementById('personal-info-edit-btn');
const personalInfoCancelBtn = document.getElementById('personal-info-cancel-btn');
const personalInfoSaveBtn = document.getElementById('personal-info-save-btn');
const personalInfoViewEls = document.querySelectorAll('.personal-info-view');
const personalInfoEditEls = document.querySelectorAll('.personal-info-edit');

function formatDateVi(isoDate) {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function setPersonalInfoEditMode(isEditing) {
  personalInfoViewActions.classList.toggle('d-none', isEditing);
  personalInfoEditActions.classList.toggle('d-none', !isEditing);
  personalInfoEditActions.classList.toggle('d-flex', isEditing);
  personalInfoViewEls.forEach((el) => el.classList.toggle('d-none', isEditing));
  personalInfoEditEls.forEach((el) => el.classList.toggle('d-none', !isEditing));
}

if (personalInfoEditBtn) {
  personalInfoEditBtn.addEventListener('click', () => setPersonalInfoEditMode(true));
}

if (personalInfoCancelBtn) {
  personalInfoCancelBtn.addEventListener('click', () => {
    document.getElementById('edit-fullname').value = document.getElementById('view-fullname').textContent;
    document.getElementById('edit-gender').value = document.getElementById('view-gender').textContent;
    document.getElementById('edit-address').value = document.getElementById('view-address').textContent;
    setPersonalInfoEditMode(false);
  });
}

if (personalInfoSaveBtn) {
  personalInfoSaveBtn.addEventListener('click', () => {
    document.getElementById('view-fullname').textContent = document.getElementById('edit-fullname').value;
    document.getElementById('view-gender').textContent = document.getElementById('edit-gender').value;
    document.getElementById('view-birthdate').textContent = formatDateVi(document.getElementById('edit-birthdate').value);
    document.getElementById('view-address').textContent = document.getElementById('edit-address').value;
    setPersonalInfoEditMode(false);
  });
}

const activityToggle = document.getElementById('activity-toggle');
const activityPanel = document.getElementById('activity-panel');

if (activityToggle) {
  activityToggle.addEventListener('click', () => {
    const isOpen = activityToggle.classList.toggle('open');
    activityPanel.classList.toggle('d-none', !isOpen);
    activityToggle.querySelector('i').className = isOpen ? 'bi bi-chevron-down' : 'bi bi-chevron-right';
  });
}
