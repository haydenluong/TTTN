import { useEffect, useState, type CSSProperties } from "react";

// Mượn lại biến CSS theme của Puck (--puck-color-*, --puck-font-size-*) để input/select
// tự chế trong các custom field nhìn giống input có sẵn của Puck, không cần đoán màu/size riêng.
export const fieldInputStyle: CSSProperties = {
  background: "var(--puck-color-white)",
  border: "1px solid var(--puck-color-grey-09)",
  borderRadius: 4,
  boxSizing: "border-box",
  fontFamily: "inherit",
  fontSize: 14,
  padding: "12px 15px",
  width: "100%",
};

export const fieldSelectStyle: CSSProperties = {
  ...fieldInputStyle,
  appearance: "none",
  cursor: "pointer",
};

export const fieldMiniLabelStyle: CSSProperties = {
  display: "block",
  color: "var(--puck-color-grey-04)",
  fontSize: "var(--puck-font-size-xxs)",
  fontWeight: 600,
  paddingBottom: 6,
};

export function LabeledNumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  // Giữ chuỗi gõ tay riêng (local) — nếu convert sang Number() ngay mỗi lần gõ thì
  // backspace hết chữ số sẽ ra "" → Number("") === 0 → input nhảy về "0" giữa lúc đang xoá.
  // Chỉ Number()-hoá khi còn ký tự, và chốt lại giá trị thật khi rời input (onBlur).
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

// Override toàn cục cho field type:"number" GỐC của Puck (dùng bởi cardStyle.fontSize,
// buttonStyle.fontSize, titleStyle.fontSize, spacingField.paddingY, Header height/blur/menuFontSize...).
// Puck tự build-in field number cũng bị lỗi y hệt LabeledNumberInput ở trên (Number("") === 0
// làm input nhảy về "0" khi xoá hết) — không sửa được code của Puck nên thay nguyên field type
// "number" của họ bằng field tự chế này qua prop `overrides` của <Puck>, xem App.tsx.
export function PuckNumberFieldOverride({
  field,
  value,
  onChange,
  id,
  name,
  label,
  Label,
}: {
  field: { min?: number; max?: number; step?: number; placeholder?: string };
  value: number | undefined;
  onChange: (v: number) => void;
  id?: string;
  name: string;
  label?: string;
  Label?: React.ComponentType<{ label: string; children: React.ReactNode }>;
}) {
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

export function LabeledSliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
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

export function LabeledTextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
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
