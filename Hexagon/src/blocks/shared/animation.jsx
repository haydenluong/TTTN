// animate:false không tắt hẳn hiệu ứng — useScrollReveal (xem useScrollReveal.js)
// vẫn thêm class "reveal-visible" ngay lập tức, chỉ bỏ qua observer/delay, nên
// trạng thái cuối cùng của component luôn giống nhau dù animate bật hay tắt.
export const animateField = {
  type: "radio",
  label: "Hiệu ứng xuất hiện khi cuộn tới",
  options: [
    { label: "Có", value: true },
    { label: "Không", value: false },
  ],
};
