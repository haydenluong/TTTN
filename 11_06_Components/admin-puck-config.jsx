import React from 'react';
import AdminHeading from './components/admin-heading';
import AdminText from './components/admin-text';
import AdminImage from './components/admin-image';
import AdminSection from './components/admin-section';
import AdminHero from './components/admin-hero';
import AdminSenHong from './components/admin-senHong';
import AdminBanChuyenMon from './components/admin-banChuyenMon';
import AdminCauLacBo from './components/admin-cauLacBo';

//Config — đăng ký 5 components với fields + defaultProps + render.

export const puckConfig = {
  components: {
    Heading: {
      label: 'Tiêu đề',
      fields: {
        content: { type: 'text', label: 'Nội dung', contentEditable: true },
        level: {
          type: 'select', label: 'Cấp độ',
          options: [
            { label: 'H1', value: 1 }, { label: 'H2', value: 2 },
            { label: 'H3', value: 3 }, { label: 'H4', value: 4 },
            { label: 'H5', value: 5 }, { label: 'H6', value: 6 }
          ]
        },
        align: {
          type: 'select', label: 'Căn lề',
          options: [
            { label: 'Trái', value: 'left' },
            { label: 'Giữa', value: 'center' },
            { label: 'Phải', value: 'right' }
          ]
        }
      },
      defaultProps: { content: 'Tiêu đề', level: 2, align: 'left' },
      render: (props) => <AdminHeading {...props} />
    },

    Text: {
      label: 'Văn bản',
      fields: {
        content: { type: 'textarea', label: 'Nội dung', contentEditable: true },
        align: {
          type: 'select', label: 'Căn lề',
          options: [
            { label: 'Trái', value: 'left' },
            { label: 'Giữa', value: 'center' },
            { label: 'Phải', value: 'right' },
            { label: 'Đều', value: 'justify' }
          ]
        }
      },
      defaultProps: { content: 'Nhập văn bản ở đây...', align: 'left' },
      render: (props) => <AdminText {...props} />
    },

    Image: {
      label: 'Ảnh',
      fields: {
        src: { type: 'text', label: 'URL ảnh' },
        alt: { type: 'text', label: 'Alt text' },
        width: { type: 'text', label: 'Chiều rộng', default: '100%' },
        height: { type: 'text', label: 'Chiều cao', default: 'auto' },
        borderRadius: { type: 'text', label: 'Bo góc', default: '0' },
        align: {
          type: 'select', label: 'Căn lề',
          options: [
            { label: 'Trái', value: 'left' },
            { label: 'Giữa', value: 'center' },
            { label: 'Phải', value: 'right' }
          ]
        }
      },
      defaultProps: {
        src: 'https://via.placeholder.com/800x400',
        alt: 'Ảnh minh họa',
        width: '100%', height: 'auto', borderRadius: '0', align: 'center'
      },
      render: (props) => <AdminImage {...props} />
    },

    Section: {
      label: 'Khoảng (Section)',
      fields: {
        container: {
          type: 'select', label: 'Chiều rộng',
          options: [
            { label: 'Small (640px)', value: 'sm' },
            { label: 'Medium (768px)', value: 'md' },
            { label: 'Large (1024px)', value: 'lg' },
            { label: 'XL (1280px)', value: 'xl' }
          ]
        },
        background: {
          type: 'object', label: 'Background',
          objectFields: {
            type: {
              type: 'select', label: 'Loại',
              options: [
                { label: 'Màu', value: 'color' },
                { label: 'Gradient', value: 'gradient' },
                { label: 'Ảnh', value: 'image' }
              ]
            },
            color: { type: 'text', label: 'Màu nền', default: '#ffffff' },
            fromColor: { type: 'text', label: 'Gradient từ', default: '#667eea' },
            toColor: { type: 'text', label: 'Gradient đến', default: '#764ba2' },
            direction: { type: 'text', label: 'Hướng gradient', default: 'to right' },
            bg_image: { type: 'text', label: 'URL ảnh nền' },
            opacity: { type: 'number', label: 'Độ mờ', min: 0, max: 1, step: 0.1, default: 1 }
          }
        },
        padding_x: { type: 'number', label: 'Padding ngang', min: 0, max: 16, default: 4 },
        padding_y: { type: 'number', label: 'Padding dọc', min: 0, max: 16, default: 4 },
        content: { type: 'slot' } // Cho phép nested components
      },
      defaultProps: {
        container: 'lg',
        background: { type: 'color', color: '#ffffff' },
        padding_x: 4, padding_y: 4,
        content: []
      },
      render: (props) => <AdminSection {...props} />
    },

    Hero: {
      label: 'Hero Banner',
      fields: {
        title: { type: 'text', label: 'Tiêu đề', contentEditable: true },
        subtitle: { type: 'textarea', label: 'Mô tả ngắn', contentEditable: true },
        buttons: {
          type: 'array', label: 'Danh sách nút',
          arrayFields: {
            text: { type: 'text', label: 'Text nút', contentEditable: true },
            url: { type: 'text', label: 'URL' },
            style: {
              type: 'select', label: 'Style',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Outline', value: 'outline' }
              ]
            }
          },
          getItemSummary: (item) => item.text
        },
        background: {
          type: 'object', label: 'Background',
          objectFields: {
            type: {
              type: 'select', label: 'Loại',
              options: [
                { label: 'Màu', value: 'color' },
                { label: 'Gradient', value: 'gradient' },
                { label: 'Ảnh', value: 'image' }
              ]
            },
            color: { type: 'text', label: 'Màu nền', default: '#ffffff' },
            gradientFrom: { type: 'text', label: 'Gradient từ', default: '#667eea' },
            gradientTo: { type: 'text', label: 'Gradient đến', default: '#764ba2' },
            gradientDirection: { type: 'text', label: 'Hướng', default: 'to bottom right' },
            imageUrl: { type: 'text', label: 'URL ảnh nền' }
          }
        },
        layout: {
          type: 'object', label: 'Bố cục',
          objectFields: {
            align: {
              type: 'select', label: 'Căn lề',
              options: [
                { label: 'Trái', value: 'left' },
                { label: 'Giữa', value: 'center' },
                { label: 'Phải', value: 'right' }
              ]
            }
          }
        }
      },
      defaultProps: {
        title: 'Chào mừng đến với website',
        subtitle: 'Chúng tôi cung cấp những sản phẩm và dịch vụ tốt nhất',
        buttons: [
          { text: 'Tìm hiểu thêm', url: '#', style: 'primary' },
          { text: 'Liên hệ', url: '#contact', style: 'outline' }
        ],
        background: {
          type: 'gradient',
          gradientFrom: '#667eea', gradientTo: '#764ba2',
          gradientDirection: 'to bottom right'
        },
        layout: { align: 'center' }
      },
      render: (props) => <AdminHero {...props} />
    },

    SenHong: {
      label: 'Sen Hồng',
      fields: {
        background: {
          type: 'object', label: 'Nền',
          objectFields: {
            type: {
              type: 'select', label: 'Loại nền',
              options: [
                { label: 'Màu', value: 'color' },
                { label: 'Hình ảnh', value: 'image' },
                { label: 'GIF', value: 'gif' }
              ]
            },
            color: { type: 'text', label: 'Màu nền' },
            imageUrl: { type: 'text', label: 'URL ảnh nền' },
            gifUrl: { type: 'text', label: 'URL GIF nền' }
          }
        },
        card: {
          type: 'object', label: 'Thẻ nội dung',
          objectFields: {
            label: { type: 'text', label: 'Nhãn phụ' },
            title: { type: 'text', label: 'Tiêu đề' },
            description: { type: 'textarea', label: 'Mô tả' },
            borderRadius: { type: 'text', label: 'Bo góc thẻ' },
            textColor: { type: 'text', label: 'Màu chữ' },
            fontSize: { type: 'text', label: 'Cỡ chữ' }
          }
        },
        button: {
          type: 'object', label: 'Nút',
          objectFields: {
            text: { type: 'text', label: 'Chữ trong nút' },
            bgColor: { type: 'text', label: 'Màu nền nút' },
            textColor: { type: 'text', label: 'Màu chữ nút' },
            borderRadius: { type: 'text', label: 'Bo góc nút' },
            fontSize: { type: 'text', label: 'Cỡ chữ nút' }
          }
        },
        position: {
          type: 'select', label: 'Vị trí thẻ',
          options: [
            { label: 'Trái', value: 'left' },
            { label: 'Giữa', value: 'center' },
            { label: 'Phải', value: 'right' }
          ]
        }
      },
      defaultProps: {
        background: { type: 'color', color: '#1a6fc4' },
        card: {
          label: 'LAN TỎA GIÁ TRỊ ĐẤT',
          title: 'Sen Hồng',
          description: 'CLB Doanh nhân Đồng Tháp tại TPHCM quy tụ những người con quê hương Đất Sen Hồng.',
          borderRadius: '16px',
          textColor: '#ffffff',
          fontSize: '16px'
        },
        button: {
          text: 'Tham gia cộng đồng',
          bgColor: '#2563eb',
          textColor: '#ffffff',
          borderRadius: '8px',
          fontSize: '16px'
        },
        position: 'left'
      },
      render: (props) => <AdminSenHong {...props} />
    },

    BanChuyenMon: {
      label: 'Các Ban Chuyên Môn',
      fields: {
        heading: {
          type: 'object', label: 'Tiêu đề',
          objectFields: {
            title: { type: 'text', label: 'Tiêu đề chính' },
            subtitle: { type: 'text', label: 'Tiêu đề phụ' }
          }
        },
        cards: {
          type: 'array', label: 'Danh sách ban',
          arrayFields: {
            imageUrl: { type: 'text', label: 'URL ảnh' },
            title: { type: 'text', label: 'Tên ban' },
            buttonText: { type: 'text', label: 'Chữ trong nút' },
            buttonBorderRadius: { type: 'text', label: 'Bo góc nút' }
          },
          getItemSummary: (item) => item.title
        },
        cardStyle: {
          type: 'object', label: 'Style chung thẻ',
          objectFields: {
            titleSize: { type: 'text', label: 'Cỡ chữ tên ban' },
            buttonBorderColor: { type: 'text', label: 'Màu viền nút' },
            buttonBorderRadius: { type: 'text', label: 'Bo góc nút (chung)' },
            buttonTextColor: { type: 'text', label: 'Màu chữ nút' },
            buttonFontSize: { type: 'text', label: 'Cỡ chữ nút' }
          }
        }
      },
      defaultProps: {
        heading: {
          title: 'CÁC BAN CHUYÊN MÔN',
          subtitle: 'CLB DOANH NHÂN ĐỒNG THÁP TẠI TP. HỒ CHÍ MINH'
        },
        cards: [
          { imageUrl: '', title: 'Ban Kinh tế – Đầu tư', buttonText: 'Xem hoạt động →' },
          { imageUrl: '', title: 'Ban Văn hóa – Thể thao', buttonText: 'Xem hoạt động →' },
          { imageUrl: '', title: 'Ban Xã hội – Cộng đồng', buttonText: 'Xem hoạt động →' },
          { imageUrl: '', title: 'Ban Khởi nghiệp', buttonText: 'Xem hoạt động →' },
          { imageUrl: '', title: 'Ban Giao thương quốc tế', buttonText: 'Xem hoạt động →' }
        ],
        cardStyle: {
          titleSize: '16px',
          buttonBorderColor: 'white',
          buttonBorderRadius: '20px',
          buttonTextColor: 'white',
          buttonFontSize: '14px'
        }
      },
      render: (props) => <AdminBanChuyenMon {...props} />
    },

    CauLacBo: {
      label: 'Câu Lạc Bộ',
      fields: {
        sections: {
          type: 'array', label: 'Danh sách khu vực',
          arrayFields: {
            title: { type: 'text', label: 'Tiêu đề' },
            text: { type: 'textarea', label: 'Nội dung' },
            imageUrl: { type: 'text', label: 'URL ảnh' },
            members: {
              type: 'array', label: 'Thành viên',
              arrayFields: {
                avatar: { type: 'text', label: 'URL ảnh đại diện' },
                name: { type: 'text', label: 'Họ tên' },
                clbRole: { type: 'text', label: 'Chức vụ CLB' },
                companyRole: { type: 'text', label: 'Chức vụ doanh nghiệp' },
                company: { type: 'text', label: 'Doanh nghiệp' }
              },
              getItemSummary: (item) => item.name
            }
          },
          getItemSummary: (item) => item.title
        }
      },
      defaultProps: {
        sections: [
          {
            title: 'VỀ CÂU LẠC BỘ',
            text: 'CLB Doanh nhân Đồng Tháp tại TP.HCM là nơi hội tụ các doanh nghiệp, nhà quản lý và cá nhân khởi nghiệp trên địa bàn tỉnh.',
            imageUrl: '',
            members: []
          },
          {
            title: 'CƠ CẤU TỔ CHỨC',
            text: '',
            imageUrl: '',
            members: [
              { avatar: '', name: 'Trần Văn Khang', clbRole: 'Ủy viên BCH', companyRole: 'Tổng Giám đốc', company: 'Công ty CP Logistics Đồng Tháp' }
            ]
          }
        ]
      },
      render: (props) => <AdminCauLacBo {...props} />
    }
  },

  // Sidebar categories
  categoryGroups: [
    { title: 'Cơ bản', components: ['Heading', 'Text', 'Image'] },
    { title: 'Layout', components: ['Section'] },
    { title: 'Nâng cao', components: ['Hero'] },
    { title: 'Bài tập', components: ['SenHong', 'BanChuyenMon', 'CauLacBo'] }
  ],

  // Root config
  root: {
    render: ({ children }) => (
      <div className="min-h-screen">{children}</div>
    )
  }
};

export default puckConfig;
