import React from 'react';

const AdminBanChuyenMon = ({
//   title 
    heading = {},

// số lượng thẻ 
  cards = [],

// style chung cho các thẻ 
  cardStyle = {},
}) => {

    // mặc định
  const defaultCards = [
    { imageUrl: '', title: 'Ban Kinh tế – Đầu tư', buttonText: 'Xem hoạt động →' },
    { imageUrl: '', title: 'Ban Văn hóa – Thể thao', buttonText: 'Xem hoạt động →' },
    { imageUrl: '', title: 'Ban Xã hội – Cộng đồng', buttonText: 'Xem hoạt động →' },
    { imageUrl: '', title: 'Ban Khởi nghiệp', buttonText: 'Xem hoạt động →' },
    { imageUrl: '', title: 'Ban Giao thương quốc tế', buttonText: 'Xem hoạt động →' },
  ];

  const displayCards = cards.length > 0 ? cards : defaultCards;

  return (
    <div className="w-full py-16 px-8" style={{ background: 'linear-gradient(135deg, #e8eaf6, #c5cae9)' }}>

      <div className="text-center mb-12">
        <h2 className="font-bold mb-2 text-2xl" style={{ color: '#3f51b5' }}>
          {heading.title || 'CÁC BAN CHUYÊN MÔN'}
        </h2>
        <p className="text-[15px] text-blue-600">
          {heading.subtitle || 'CLB DOANH NHÂN ĐỒNG THÁP TẠI TP. HỒ CHÍ MINH'}
        </p>
      </div>

      <div className="justify-center gap-6 max-w-5xl mx-auto flex flex-wrap">
        {displayCards.map((card, idx) => (
          <div key={idx}
            className="flex flex-col items-center justify-between p-8 text-white w-[280px] min-h-[220px] rounded-3xl bg-gradient-to-br from-[#2196f3] to-[#1565c0]"
          >
            {card.imageUrl && <img src={card.imageUrl} alt={card.title} className="w-16 h-16 object-contain mb-4" />}

            <p className="font-bold text-center mb-4" style={{ fontSize: cardStyle.titleSize || '16px' }}>
              {card.title || 'Tên ban'}
            </p>

            <button className="px-5 py-1.5 bg-transparent cursor-pointer"
              style={{
                border: `1px solid ${cardStyle.buttonBorderColor || 'white'}`,
                borderRadius: card.buttonBorderRadius || '20px',
                color: cardStyle.buttonTextColor || 'white',
                fontSize: cardStyle.buttonFontSize || '14px',
              }}>
              {card.buttonText || 'Xem hoạt động →'}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminBanChuyenMon;
