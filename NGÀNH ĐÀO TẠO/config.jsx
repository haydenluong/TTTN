TrainingPrograms: {
    fields: {
        title: { type: 'text', label: 'Tiêu đề', default: 'Ngành đào tạo', contentEditable: true },
        backgroundColor: { type: 'text', label: 'Màu nền section', default: '#ffffff' },

        titleStyle: {
            type: 'object',
                label: 'Style tiêu đề',
                    objectFields: {
                fontSize: {
                    type: 'custom',
                        label: 'Cỡ chữ (rem)',
                            render: ({ value, onChange }) => (
                                <div>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4, color: '#374151' }}>Cỡ chữ (rem)</label>
                                    <input
                                        type="number"
                                        step="0.125"
                                        min="0"
                                        value={parseFloat(value) || ''}
                                        onChange={(e) => onChange(e.target.value ? `${e.target.value}rem` : '')}
                                        style={{ padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15, width: '100%', boxSizing: 'border-box' }}
                                    />
                                </div>
                            ),
                    },
                color: { type: 'text', label: 'Màu chữ', default: '#1f2937' },
                fontWeight: {
                    type: 'select',
                        label: 'Đậm nhạt',
                            options: [
                                { label: 'Normal', value: 'normal' },
                                { label: 'Medium (500)', value: '500' },
                                { label: 'Semi Bold (600)', value: '600' },
                                { label: 'Bold (700)', value: 'bold' },
                                { label: 'Extra Bold (800)', value: '800' },
                            ],
                    },
                textAlign: {
                    type: 'select',
                        label: 'Căn chữ',
                            options: [
                                { label: 'Trái', value: 'left' },
                                { label: 'Giữa', value: 'center' },
                                { label: 'Phải', value: 'right' },
                            ],
                    },
            },
        },

        menuStyle: {
            type: 'object',
                label: 'Style menu tabs',
                    objectFields: {
                backgroundColor: { type: 'text', label: 'Màu nền', default: '#3b82f6' },
                color: { type: 'text', label: 'Màu chữ', default: '#ffffff' },
                fontSize: {
                    type: 'custom',
                        label: 'Cỡ chữ (rem)',
                            render: ({ value, onChange }) => (
                                <div>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4, color: '#374151' }}>Cỡ chữ (rem)</label>
                                    <input
                                        type="number"
                                        step="0.125"
                                        min="0"
                                        value={parseFloat(value) || ''}
                                        onChange={(e) => onChange(e.target.value ? `${e.target.value}rem` : '')}
                                        style={{ padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15, width: '100%', boxSizing: 'border-box' }}
                                    />
                                </div>
                            ),
                    },
                fontWeight: {
                    type: 'select',
                        label: 'Đậm nhạt',
                            options: [
                                { label: 'Normal', value: 'normal' },
                                { label: 'Medium (500)', value: '500' },
                                { label: 'Bold (700)', value: 'bold' },
                            ],
                    },
                textAlign: {
                    type: 'select',
                        label: 'Căn chữ',
                            options: [
                                { label: 'Trái', value: 'left' },
                                { label: 'Giữa', value: 'center' },
                                { label: 'Phải', value: 'right' },
                            ],
                    },
                borderRadius: {
                    type: 'custom',
                        label: 'Bo góc (px)',
                            render: ({ value, onChange }) => (
                                <div>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4, color: '#374151' }}>Bo góc (px)</label>
                                    <input
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={parseInt(value, 10) || ''}
                                        onChange={(e) => onChange(e.target.value ? `${e.target.value}px` : '')}
                                        style={{ padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15, width: '100%', boxSizing: 'border-box' }}
                                    />
                                </div>
                            ),
                    },
            },
        },
        menus: {
            type: 'array',
                label: 'Menu tabs',
                    arrayFields: {
                name: { type: 'text', label: 'Tên menu', contentEditable: true },
                items: {
                    type: 'array',
                        label: 'Danh sách ngành',
                            arrayFields: {
                        title: { type: 'text', label: 'Tên ngành' },
                        icon: {
                            type: 'custom',
                                label: 'Icon URL (ảnh)',
                                    render: ({ value, onChange }) => {
                                        // regex 
                                        const isAllowedImage = (url) => /\.(jpe?g|png|gif|webp)$/i.test(url); 
                                        const [error, setError] = useState('');

                                        const IconPicker = () => {
                                            const [showPicker, setShowPicker] = useState(false);
                                            const handleSelect = (img) => {
                                                const raw = img.url || img.path || '';
                                                let p = raw.startsWith('/medias/') ? raw : raw.replace(/^\//, '');
                                                if (!p.startsWith('http') && !p.startsWith('/medias/')) {
                                                    p = `/medias/${p}`;
                                                }
                                                if (!isAllowedImage(p)) {
                                                    setError("Chỉ nhận file: jpg, jpeg, png, gif hoặc webp");
                                                    return;
                                                }
                                                onChange(p);
                                                setShowPicker(false);
                                            };
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                    <button type="button" onClick={() => setShowPicker(true)} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', width: 'fit-content' }}>
                                                        Chọn ảnh từ Media
                                                    </button>
                                                    <input type="text" value={value || ''} onChange={(e) =>
                                                    { 
                                                        const nextUrl = e.target.value;
                                                        if (nextUrl.includes(".") && !isAllowedImage(nextUrl)) {
                                                            setError("Chỉ nhận file: jpg, jpeg, png, gif hoặc webp");
                                                        } else {
                                                            setError("");
                                                            onChange(nextUrl);
                                                        }
                                                    }} 
                                                    
                                                    placeholder="URL ảnh..." style={{ padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, width: '100%', boxSizing: 'border-box' }} />
                                                    {error && <span style={{ color: '#dc2626', fontSize: 12 }}>{error}</span>}
                                                    {value && <img src={value} alt="preview" style={{ height: 48, objectFit: 'contain', borderRadius: 4, border: '1px solid #e5e7eb', alignSelf: 'flex-start' }} />}
                                                    {showPicker && <MediaPickerModal isOpen={showPicker} onClose={() => setShowPicker(false)} onSelect={handleSelect} />}
                                                </div>
                                            );
                                        };
                                        return <IconPicker />;
                                    },
                            },
                        iconCornerRadius: {
                            type: 'custom',
                            label: 'Kiểu bo góc quanh icon',
                            render: ({ value, onChange }) => {
                                const mode = value?.mode || 'round';

                                const inputStyle = { padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, width: '100%', boxSizing: 'border-box' };
                                const labelStyle = { display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 2 };

                                const handleModeChange = (e) => {
                                    onChange({ mode: e.target.value });
                                };

                                const handleAllChange = (e) => {
                                    onChange({ mode: 'all', radius: Number(e.target.value) || 0 });
                                };

                                const handleEachChange = (corner) => (e) => {
                                    onChange({ ...value, mode: 'each', [corner]: Number(e.target.value) || 0 });
                                };

                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <select
                                            value={mode}
                                            onChange={handleModeChange}
                                            style={{ padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, width: '100%', boxSizing: 'border-box' }}
                                        >
                                            <option value="each">Bo từng góc</option>
                                            <option value="all">Bo 4 góc</option>
                                            <option value="round">Bo tròn</option>
                                        </select>

                                        {mode === 'all' && (
                                            <div>
                                                <label style={labelStyle}>Bán kính (px)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={value?.radius ?? ''}
                                                    onChange={handleAllChange}
                                                    style={inputStyle}
                                                />
                                            </div>
                                        )}

                                        {mode === 'each' && (
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                                <div>
                                                    <label style={labelStyle}>Trên trái (px)</label>
                                                    <input type="number" min="0" step="1" value={value?.tl ?? ''} onChange={handleEachChange('tl')} style={inputStyle} />
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>Trên phải (px)</label>
                                                    <input type="number" min="0" step="1" value={value?.tr ?? ''} onChange={handleEachChange('tr')} style={inputStyle} />
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>Dưới trái (px)</label>
                                                    <input type="number" min="0" step="1" value={value?.bl ?? ''} onChange={handleEachChange('bl')} style={inputStyle} />
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>Dưới phải (px)</label>
                                                    <input type="number" min="0" step="1" value={value?.br ?? ''} onChange={handleEachChange('br')} style={inputStyle} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            },
                        },
                        link: { type: 'text', label: 'Link (mở tab mới)' },
                    },
                    getItemSummary: (item) => item.title || 'Item',
                    },
            },
            getItemSummary: (item) => item.name || 'Menu',
            },
    },
    defaultProps: {
        title: 'Ngành đào tạo',
            backgroundColor: '#ffffff',
                titleStyle: {
            fontSize: '2rem',
                color: '#1f2937',
                    fontWeight: 'bold',
                        textAlign: 'center',
            },
        menuStyle: {
            backgroundColor: '#3b82f6',
                color: '#ffffff',
                    fontSize: '0.875rem',
                        fontWeight: '500',
                            textAlign: 'center',
                                borderRadius: '30px',
            },
        menus: [
            {
                name: 'Trung cấp',
                items: [
                    { title: 'Du lịch lữ hành', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Hướng dẫn du lịch', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Thiết kế đồ họa', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Tin học ứng dụng', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Tài chính ngân hàng', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Thư ký văn phòng', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Thiết kế và quản lý Website', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Kinh doanh xuất nhập khẩu', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Kế toán doanh nghiệp', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Dược', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Điều dưỡng', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Công nghệ kỹ thuật chế biến và bảo quản thực phẩm', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Lập trình máy tính', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Quản trị mạng máy tính', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Kỹ thuật chế biến món ăn (Dự kiến mở)', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Marketing (Dự kiến mở)', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Quản trị khách sạn (Dự kiến mở)', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                ],
            },
            {
                name: 'Liên thông',
                items: [
                    { title: 'Công nghệ thông tin', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Kỹ thuật điện tử viễn thông', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Quản trị kinh doanh', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Quản trị dịch vụ du lịch và lữ hành', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                ],
            },
            {
                name: 'Văn bằng 2',
                items: [
                    { title: 'Ngôn ngữ Anh', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                ],
            },
            {
                name: 'Đại học hệ từ xa',
                items: [
                    { title: 'Công nghệ thông tin', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Kế toán', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Luật', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Kinh tế luật', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Ngôn ngữ Anh', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Quản trị dịch vụ du lịch và lữ hành', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Quản trị kinh doanh', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Tài chính ngân hàng', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                ],
            },
            {
                name: 'Sơ cấp',
                items: [
                    { title: 'Nghiệp vụ lễ tân', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                    { title: 'Tin học văn phòng', icon: '', iconCornerRadius: { mode: 'round' }, link: '' },
                ],
            },
        ],
        },
    render: (props) => <TrainingProgramsComponent {...props} />,
    },
