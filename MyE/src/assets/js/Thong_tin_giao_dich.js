function formatVnd(n) {
  return n.toLocaleString('vi-VN') + ' VNĐ';
}

const params = new URLSearchParams(location.search);
const selectedCoin = Number(params.get('coin')) || 500;
const selectedPrice = Number(params.get('price')) || 500000;

document.getElementById('field-coin').textContent = selectedCoin;
document.getElementById('field-total').textContent = formatVnd(selectedPrice);

const packageData = [
  { coin: 20, price: 20000, image: '../assets/images/thong_tin_giao_dich/Chon_goi_nap/20_MYE_COIN.png' },
  { coin: 50, price: 50000, image: '../assets/images/thong_tin_giao_dich/Chon_goi_nap/50_MYE_COIN.png' },
  { coin: 100, price: 100000, image: '../assets/images/thong_tin_giao_dich/Chon_goi_nap/100_MYE_COIN.png' },
  { coin: 500, price: 500000, image: '../assets/images/thong_tin_giao_dich/Chon_goi_nap/500_MYE_COIN.png' },
  { coin: 1000, price: 1000000, image: '../assets/images/thong_tin_giao_dich/Chon_goi_nap/1000_MYE_COIN.png' },
  { coin: 2000, price: 2000000, image: '../assets/images/thong_tin_giao_dich/Chon_goi_nap/2000_MYE_COIN.png' },
  { coin: 5000, price: 5000000, image: '../assets/images/thong_tin_giao_dich/Chon_goi_nap/5000_MYE_COIN.png' },
  { coin: 10000, price: 10000000, image: '../assets/images/thong_tin_giao_dich/Chon_goi_nap/10000_MYE_COIN.png' },
];

function renderPackages() {
  const container = document.getElementById('package-grid-container');
  if (!container) return;
  container.innerHTML = packageData
    .map(
      (pkg) => `<div class="col-6 col-md-3"><a class="text-decoration-none" href="Thong_tin_giao_dich.html?coin=${pkg.coin}&price=${pkg.price}"><div class="package-card h-100">
        <img src="${pkg.image}" alt="${pkg.coin} Mye Coin">
        <div class="d-flex justify-content-between align-items-center px-3 py-2">
          <div>
            <p class="mb-0 fw-semibold small text-dark">${pkg.coin} Mye Coin</p>
            <p class="mb-0 package-price small">${formatVnd(pkg.price)}</p>
          </div>
          <button type="button" class="btn btn-sm btn-warning text-white">Mua</button>
        </div>
      </div></a></div>`
    )
    .join('');
}

renderPackages();
