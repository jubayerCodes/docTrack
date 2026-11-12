# DocTrack Design System

Use this document as the design and implementation reference for the DocTrack healthcare administration interface.

---

## 1. Design Direction

DocTrack should feel:

- Professional and trustworthy
- Calm and approachable
- Modern without appearing experimental
- Information-dense but easy to scan
- Appropriate for healthcare administration
- Consistent across desktop, tablet, and mobile

### Core principles

1. **Clarity first** — important information must be immediately understandable.
2. **Comfortable density** — support data-heavy workflows without crowding.
3. **Predictable behavior** — filters, tables, dialogs, and navigation should follow familiar patterns.
4. **Status through color and text** — never communicate status through color alone.
5. **Progressive disclosure** — show summaries first and details in drawers or dialogs.
6. **Accessible interaction** — all controls need visible labels, focus states, and adequate touch targets.

---

## 2. Brand

### Product name

**DocTrack**

### Logo construction

The brand mark consists of two rounded vertical shapes:

- Left shape: primary purple (`#6559cc`)
- Right shape: medical teal (`#2c9a8b`)
- Slight counterclockwise rotation
- Paired with the “DocTrack” wordmark

### Wordmark

- Typeface: Manrope
- Weight: 700
- Desktop size: 24px
- Tracking: `-0.04em`
- Color:
  - White on the sidebar
  - Ink on light backgrounds

---

## 3. Color System

### Core colors

```css
:root {
  --color-primary: #6559cc;
  --color-primary-hover: #5548ba;
  --color-primary-soft: #f0eefb;

  --color-ink: #202337;
  --color-text-secondary: #626574;
  --color-text-muted: #777b8d;
  --color-text-subtle: #999ba8;

  --color-background: #f6f7fb;
  --color-surface: #ffffff;
  --color-surface-subtle: #fafafd;
  --color-border: #e8e9f0;

  --color-sidebar: #202138;
  --color-sidebar-active: #32334e;
  --color-sidebar-hover: #292a44;
}
```

### Semantic colors

```css
:root {
  --color-success: #288874;
  --color-success-dot: #36a890;
  --color-success-bg: #eaf7f3;

  --color-warning: #c77948;
  --color-warning-dot: #df915e;
  --color-warning-bg: #fff3e8;

  --color-danger: #c76060;
  --color-danger-dot: #dc6e6e;
  --color-danger-bg: #fff0f0;

  --color-info: #3b7eb8;
  --color-info-bg: #e8f1fa;
}
```

### Analytics colors

```css
--chart-purple: #6559cc;
--chart-purple-light: #e5e2f9;
--chart-teal: #2c9a8b;
--chart-orange: #eea268;
--chart-red: #de6c6c;
--chart-blue: #3c82c4;
```

---

## 4. Typography

### Font families

```css
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700&display=swap");

--font-body: "DM Sans", sans-serif;
--font-heading: "Manrope", sans-serif;
```

### Eyebrow labels

- Uppercase, 9px, Weight 700, Tracking `0.17em`, Primary purple (`#6559cc`), 8px bottom spacing.

---

## 5. Spacing & Dimensions

- 4px-based spacing system
- Desktop page padding: `34px`
- Card padding: `19–21px`
- Modal padding: `27px`
- Table cell padding: `13px 17px`
- Form field gap: `16px`

---

## 6. Radius & Shadows

- Inputs: 9px
- Buttons: 10px
- Cards/Panels: 15px
- Modals: 18px
- Status Pills: fully rounded (999px)
- Shadows:
  - `--shadow-card: 0 3px 14px rgba(33, 35, 55, 0.025);`
  - `--shadow-primary: 0 4px 12px rgba(101, 89, 204, 0.18);`
  - `--shadow-modal: 0 20px 70px rgba(29, 30, 49, 0.25);`

---

## 7. Layout & Navigation

- Sidebar: `#202138`, 246px wide.
- Top bar: `#ffffff`, 82px high, bottom border `#e8e9f0`.
- Page background: `#f6f7fb`.
- Cards: `#ffffff` with `#e8e9f0` borders.
