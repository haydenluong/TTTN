import { useEffect, useState } from "react";

export const fieldInputStyle = {
  background: "var(--puck-color-white)",
  border: "1px solid var(--puck-color-grey-09)",
  borderRadius: 4,
  boxSizing: "border-box",
  fontFamily: "inherit",
  fontSize: 14,
  padding: "12px 15px",
  width: "100%",
};

export const fieldSelectStyle = {
  ...fieldInputStyle,
  appearance: "none",
  cursor: "pointer",
};

export const fieldMiniLabelStyle = {
  display: "block",
  color: "var(--puck-color-grey-04)",
  fontSize: "var(--puck-font-size-xxs)",
  fontWeight: 600,
  paddingBottom: 6,
};

export function LabeledNumberInput({ label, value, onChange }) {
  // giữ chuỗi gõ tay riêng — nếu Number()-hoá ngay mỗi lần gõ, backspace hết số
  // sẽ ra "" -> Number("") === 0 -> input nhảy về "0" giữa lúc đang xoá
  const [local, setLocal] = useState(String(value));

  useEffect(() => {
    setLocal(String(value));
  }, [value]);

  return (
    <label style={{ display: "block" }}>
      <span style={fieldMiniLabelStyle}>{label}</span>
      <input
        type="number"
        value={local}
        onChange={(e) => {
          const raw = e.target.value;
          setLocal(raw);
          if (raw !== "") onChange(Number(raw));
        }}
        onBlur={() => {
          if (local === "") setLocal(String(value));
        }}
        style={fieldInputStyle}
      />
    </label>
  );
}

// override toàn cục cho field type:"number" gốc của Puck — bị lỗi y hệt
// LabeledNumberInput ở trên, thay qua prop `overrides` của <Puck> trong App.jsx
export function PuckNumberFieldOverride({ field, value, onChange, id, name, label, Label }) {
  const [local, setLocal] = useState(value != null ? String(value) : "");

  useEffect(() => {
    setLocal(value != null ? String(value) : "");
  }, [value]);

  const Wrapper = Label ?? (({ label: l, children }) => (
    <label style={{ display: "block" }}>
      <span style={fieldMiniLabelStyle}>{l}</span>
      {children}
    </label>
  ));

  return (
    <Wrapper label={label || name}>
      <input
        type="number"
        id={id}
        name={name}
        min={field.min}
        max={field.max}
        step={field.step}
        placeholder={field.placeholder}
        value={local}
        onChange={(e) => {
          const raw = e.target.value;
          setLocal(raw);
          if (raw === "") return;
          const n = Number(raw);
          if (field.min !== undefined && n < field.min) return;
          if (field.max !== undefined && n > field.max) return;
          onChange(n);
        }}
        onBlur={() => {
          if (local === "") setLocal(value != null ? String(value) : "");
        }}
        style={fieldInputStyle}
      />
    </Wrapper>
  );
}

export function LabeledSliderInput({ label, value, onChange, min = 0, max = 1, step = 0.05 }) {
  return (
    <label style={{ display: "block" }}>
      <span style={fieldMiniLabelStyle}>
        {label} ({value})
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--puck-color-azure-04)" }}
      />
    </label>
  );
}

export function LabeledTextInput({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "block" }}>
      <span style={fieldMiniLabelStyle}>{label}</span>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={fieldInputStyle}
      />
    </label>
  );
}
