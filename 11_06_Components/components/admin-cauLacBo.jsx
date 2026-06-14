import React from 'react';

const AdminCauLacBo = ({
  sections = [],
}) => {

  const defaultSections = [
    {
      title: 'VỀ CÂU LẠC BỘ',
      text: 'CLB Doanh nhân Đồng Tháp tại TP.HCM là nơi hội tụ các doanh nghiệp, nhà quản lý và cá nhân khởi nghiệp trên địa bàn tỉnh. Với tinh thần kết nối – đồng hành – sẻ chia, CLB đóng vai trò thúc đẩy giá trị kinh doanh trong bối cảnh hội nhập và chuyển đổi số.',
      imageUrl: '',
      members: [],
    },
    {
      title: 'CƠ CẤU TỔ CHỨC',
      text: '',
      imageUrl: '',
      members: [
        { avatar: '', name: 'Trần Văn Khang', clbRole: 'Ủy viên BCH', companyRole: 'Tổng Giám đốc', company: 'Công ty CP Logistics Đồng Tháp' },
        { avatar: '', name: 'Đỗ Thu Trang', clbRole: 'Thủ quỹ CLB', companyRole: 'Giám đốc Tài chính', company: 'Công ty TNHH Sen Việt' },
        { avatar: '', name: 'Vũ Hoàng Long', clbRole: 'Ủy viên BCH', companyRole: 'Giám đốc Điều hành', company: 'Công ty Công nghệ số Mekong' },
      ],
    },
  ];

  const displaySections = sections.length > 0 ? sections : defaultSections;

  return (
    <div className="w-full py-16 px-8" style={{ background: 'linear-gradient(to bottom, #e8eaf6, #c5cae9)' }}>
      <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
        {displaySections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-8 flex-1 min-w-[300px] max-w-[480px] shadow-sm">

            <h2 className="font-bold text-xl mb-4 tracking-wide" style={{ color: 'black' }}>
              {section.title || 'Tiêu đề'}
            </h2>

            {section.text && (
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {section.text}
              </p>
            )}

            {section.members && section.members.length > 0 && (
              <div className="flex flex-col gap-4">
                {section.members.map((member, mIdx) => (
                  <div key={mIdx} className="flex items-start gap-4">
                    {member.avatar
                      ? <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full object-cover shrink-0" />
                      : <div className="w-16 h-16 rounded-full bg-gray-200" />
                    }
                    <div className="text-sm text-gray-700">
                      <p><span className="font-semibold">Họ tên:</span> {member.name}</p>
                      <p><span className="font-semibold">Chức vụ CLB:</span> {member.clbRole}</p>
                      <p><span className="font-semibold">Chức vụ Doanh nghiệp:</span> {member.companyRole}</p>
                      <p><span className="font-semibold">Doanh nghiệp:</span> {member.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.imageUrl && (
              <img src={section.imageUrl} alt="" className="w-full mt-4 rounded-xl object-cover max-h-48" />
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCauLacBo;
