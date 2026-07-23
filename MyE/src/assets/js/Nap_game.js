// ===== danh sach game =====
const categoriesData = [
  { id: 'all', name: 'TẤT CẢ', quantity: 60 },
  { id: 'simulation', name: 'SIMULATION', quantity: 4 },
  { id: 'action', name: 'ACTION', quantity: 11 },
  { id: 'rpg', name: 'RPG', quantity: 37 },
  { id: 'shooting', name: 'SHOOTING', quantity: 5 },
  { id: 'racing', name: 'RACING', quantity: 1 },
];

let currentActiveTab = 'all';

function renderCategoryTabs() {
  const tabsContainer = document.querySelector('.category-tabs');
  if (!tabsContainer) return;
  tabsContainer.innerHTML = categoriesData
    .map((category) => {
      const isActive = category.id === currentActiveTab ? 'active' : '';
      return `<button type="button" class="tab-btn btn flex-fill d-flex justify-content-center align-items-center gap-2 py-2 ${isActive}" onclick="handleChangeTab('${category.id}')">${category.name} <span class="badge rounded-pill">${category.quantity}</span></button>`;
    })
    .join('');
}

function handleChangeTab(clickedTabId) {
  currentActiveTab = clickedTabId;
  renderCategoryTabs();
}

const gameData = [
  { id: 'mye', name: 'MYE COIN', image: '../assets/images/Nap_Game/DS-game_nap/MYECOIN.png' },
  { id: 1, name: 'HÀO KHÍ CHIẾN HỒN', image: '../assets/images/Nap_Game/DS-game_nap/CARD(1).png' },
  { id: 2, name: 'HÀO KHÍ DU HIỆP', image: '../assets/images/Nap_Game/DS-game_nap/CARD(2).png' },
  { id: 3, name: 'BOOM TANK', image: '../assets/images/Nap_Game/DS-game_nap/CARD(3).png' },
  { id: 4, name: 'CHÂN VƯƠNG', image: '../assets/images/Nap_Game/DS-game_nap/CARD(4).png' },
  { id: 5, name: 'BOOM TANK', image: '../assets/images/Nap_Game/DS-game_nap/CARD(1).png' },
  { id: 6, name: 'HÀO KHÍ CHIẾN HỒN', image: '../assets/images/Nap_Game/DS-game_nap/CARD(3).png' },
  { id: 7, name: 'HÀO KHÍ DU HIỆP', image: '../assets/images/Nap_Game/DS-game_nap/CARD(2).png' },
  { id: 8, name: 'BOOM TANK', image: '../assets/images/Nap_Game/DS-game_nap/CARD(4).png' },
  { id: 9, name: 'CHÂN VƯƠNG', image: '../assets/images/Nap_Game/DS-game_nap/CARD(3).png' },
];

function renderGameGrid() {
  const gridContainer = document.getElementById('game-grid-container');
  if (!gridContainer) return;
  gridContainer.innerHTML = gameData
    .map((game) => {
      const specialClass = game.id === 'mye' ? 'mye-coin-card' : '';
      return `<div class="col-6 col-md-3 col-lg-2"><div class="game-card ${specialClass}" onclick="selectGame('${game.id}')"><div class="game-image-wrapper"><img src="${game.image}" alt="${game.name}" class="game-img"></div><h3 class="game-title">${game.name}</h3></div></div>`;
    })
    .join('');
}

function selectGame(id) {
  // Nếu chọn MYE COIN thì chuyển đến trang MyE_Coin
  if (id === 'mye') {
    window.location.href = 'MyE_Coin.html';
    return;
  }
  console.log('Đang chuyển đến trang nạp của game ID:', id);
}

renderCategoryTabs();
renderGameGrid();
