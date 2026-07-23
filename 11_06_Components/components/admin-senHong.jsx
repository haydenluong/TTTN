import React from 'react';


const AdminSenHong = ({

    // nền 
    background = {},

    // thẻ card 
    card = {},

    // vị trí card 
    position = 'left',

    // nút 
    button = {},
}) => {

    const backgroundStyle = {};
    if (background.type === 'color') {
        backgroundStyle.backgroundColor = background.color || '#1a6fc4';
    }
    if (background.type === 'image' && background.imageUrl) {
        backgroundStyle.backgroundImage = `url(${background.imageUrl})`;
        backgroundStyle.backgroundSize = 'cover';
        backgroundStyle.backgroundPosition = 'center';
    }
    if (background.type === 'gif' && background.gifUrl) {
        backgroundStyle.backgroundImage = `url(${background.gifUrl})`;
        backgroundStyle.backgroundSize = 'cover';
        backgroundStyle.backgroundPosition = 'center';
    }

    const cardStyle = {
        borderRadius: card.borderRadius || "8px",
        color: card.textColor || "white",
        fontSize: card.fontSize || "16px",
    }

    const cardPositionStyle =
    position === 'right'  ? { marginLeft: 'auto' } :
    position === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } :
    position === 'left'   ? { marginRight: 'auto' } :
                            { marginRight: 'auto' };
    
    const buttonStyle = {
        backgroundColor: button.bgColor || '#2563eb',
        color: button.textColor || '#ffffff',
        borderRadius: button.borderRadius || '8px',
        fontSize: button.fontSize || '16px',
  };

    return (
    <div className="w-full min-h-[500px] p-10" style={backgroundStyle}>
      <div
        className="p-10 bg-white/20 max-w-2xl"
        style={{ ...cardStyle, ...cardPositionStyle }}
      >
        <p className="text-[14px] mb-2">
          {card.label || 'LAN TỎA GIÁ TRỊ ĐẤT'}
        </p>

        <h1 className="font-bold mb-4 text-5xl" style={{ color: '#f5c842' }}>
          {card.title || 'Sen Hồng'}
        </h1>

        <p className="mb-6" style={{ fontSize: card.fontSize || '16px' }}>
          {card.description || 'CLB Doanh nhân Đồng Tháp tại TPHCM quy tụ những người con quê hương Đất Sen Hồng. Với tinh thần Hợp tác – Đổi mới – Phát triển, CLB đóng vai trò là cầu nối chiến lược, hợp tác, thúc đẩy giá trị kinh doanh và lan toả sẻ chia nghĩa tình quê hương.'}
        </p>

        <button className="mt-4 px-6 py-3 cursor-pointer" style={buttonStyle}>
          {button.text || 'Tham gia cộng đồng'}
        </button>
      </div>
    </div>
  );
};

export default AdminSenHong;