# CSS Changes - Visual Diff

## 🎨 Color Tokens (:root)

### Before → After

```diff
:root {
- --color-bg-dark:          #000000;
+ --color-bg-dark:          #0B0B0B;

- --color-text-primary:     #FFFFFF;
+ --color-text-primary:     #F5F5F5;

- --color-text-secondary:   rgba(255,255,255,0.65);
+ --color-text-secondary:   rgba(255,255,255,0.72);

- --color-text-tertiary:    rgba(255,255,255,0.35);
+ --color-text-tertiary:    rgba(255,255,255,0.48);

- --color-ui-muted:         #333333;
+ --color-ui-muted:         #6B7280;

  --color-bg-light:         #F7F3EE;  (unchanged)

+ --color-accent-gold:      #C7A86B;  (NEW)
+ --color-accent-gold-rgb:  199, 168, 107;  (NEW)
}
```

---

## 🔤 Typography Tokens (:root)

```diff
:root {
- --font-headline: var(--font-poppins), system-ui, sans-serif;
- --font-ui: var(--font-poppins), system-ui, sans-serif;

+ --font-headline: "Playfair Display", serif;
+ --font-ui: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
```

---

## 📝 H1 / .hero-title

```diff
h1,
.hero-title {
  font-family: var(--font-headline);
- font-size: var(--font-h1);
- font-weight: 800;
- line-height: 1.05;
- letter-spacing: var(--tracking-editorial);

+ font-size: clamp(40px, 6vw, 72px);
+ font-weight: 600;
+ line-height: 1.15;
+ letter-spacing: -0.02em;
  color: var(--color-text-primary);
}
```

---

## 📄 .text-hero-editorial

```diff
.text-hero-editorial {
  font-family: var(--font-headline);
- font-size: var(--font-h1);
- font-weight: 800;
- line-height: 1.05;
- letter-spacing: var(--tracking-editorial);

+ font-size: clamp(40px, 6vw, 72px);
+ font-weight: 600;
+ line-height: 1.15;
+ letter-spacing: -0.02em;

  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8),
               0 10px 40px rgba(0, 0, 0, 0.6);
}
```

---

## 📌 .text-subheadline-editorial

```diff
.text-subheadline-editorial {
  font-family: var(--font-ui);
  font-size: clamp(15px, 2.5vw, 19px);
- font-weight: 300;
- line-height: 1.7;

+ font-weight: 400;
+ line-height: 1.6;
  letter-spacing: 0.015em;
  color: var(--color-text-secondary);
  max-width: 58ch;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}
```

---

## 📘 H2

```diff
h2 {
- font-family: var(--font-headline);
- font-size: var(--font-h2);
  font-weight: 600;
- line-height: 1.15;
- letter-spacing: var(--tracking-h2);
  margin-bottom: 3rem;

+ font-family: var(--font-ui);
+ font-size: clamp(24px, 3.5vw, 40px);
+ line-height: 1.2;
+ letter-spacing: -0.02em;
+ color: var(--color-text-primary);
}
```

---

## 📗 H3

```diff
h3 {
- font-family: var(--font-headline);
- font-size: var(--font-h3);
- font-weight: 500;
- line-height: 1.3;
  letter-spacing: -0.01em;

+ font-family: var(--font-ui);
+ font-size: clamp(20px, 2.8vw, 32px);
+ font-weight: 600;
+ line-height: 1.2;
+ color: var(--color-text-primary);
}
```

---

## 📕 body

```diff
body {
  background: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-ui);
  font-weight: 400;
- font-size: var(--font-body);
- line-height: 1.6;
- letter-spacing: var(--tracking-body);

+ font-size: 16px;
+ line-height: 1.4;
+ letter-spacing: 0.01em;

  overflow-x: hidden;
  position: relative;
  cursor: none;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern" 1, "liga" 1;
  margin: 0;
  padding: 0;
  width: 100vw;
  will-change: transform;
}
```

---

## 🔘 .btn-premium

```diff
.btn-premium {
  @apply relative overflow-hidden inline-flex items-center justify-center transition-all duration-700 font-medium uppercase tracking-[0.3em] rounded-full;
  background: transparent;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--color-text-primary);
  padding: 18px 48px;
  font-family: var(--font-ui);
  font-weight: 500;
  font-size: 16px;
- border: 1px solid rgba(255, 255, 255, 0.2);

+ border: 1px solid rgba(245, 245, 245, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
```

---

## 🏅 .btn-luxury-primary

```diff
.btn-luxury-primary {
  @apply relative overflow-hidden flex items-center justify-center transition-all duration-700 font-medium uppercase tracking-[0.25em] rounded-full;
- background: rgba(11, 11, 11, 0.6);
+ background: rgba(15, 15, 15, 0.6);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--color-text-primary);
  padding: 18px 42px;
  font-family: var(--font-ui);
  font-weight: 500;
  font-size: 16px;
- box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(var(--color-accent-gold-rgb), 0.15);

+ box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(199, 168, 107, 0.12);
  border: none;
}
```

---

## 👻 .btn-luxury-ghost

```diff
.btn-luxury-ghost {
  @apply relative overflow-hidden transition-all duration-500 font-semibold uppercase tracking-[0.2em] text-[10px] sm:text-xs rounded-full py-4 px-8 backdrop-blur-md;
  background: transparent;
- border: 1px solid rgba(245, 245, 245, 0.08);
+ border: 1px solid rgba(245, 245, 245, 0.1);

  color: var(--color-text-primary);
  font-family: var(--font-ui);
  font-weight: 500;
}
```

---

## 🏷️ .editorial-label

```diff
.editorial-label {
  display: inline-flex;
  align-items: center;
  gap: 0.8em;
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 600;
- letter-spacing: var(--tracking-luxury);
+ letter-spacing: 0.4em;

  text-transform: uppercase;
- color: var(--color-text-primary);
- opacity: 0.6;
+ color: var(--color-text-tertiary);
+ opacity: 0.8;

  margin-bottom: 3rem;
}
```

---

## 🎬 Hero Component (.hero-line-1)

```diff
.hero-line-1 {
  position: absolute;
  top: 32%;
  left: 5%;
  transform: translateY(-50%);
  text-align: left;
  opacity: 0;
- font-family: var(--font-headline);
- font-size: clamp(14px, 1.8vw, 18px);
+ font-family: var(--font-ui);
+ font-size: clamp(12px, 1.6vw, 16px);

  font-weight: 500;
- letter-spacing: 0.6em;
+ letter-spacing: 0.5em;

  text-transform: uppercase;
- color: rgba(255, 255, 255, 0.5);
+ color: var(--color-text-secondary);

  text-shadow: 0 4px 15px rgba(0,0,0,0.4);
  white-space: nowrap;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 30vw;
}
```

---

## 🎬 Hero Component (.hero-line-2 h2)

```diff
.hero-line-2 h2 {
  font-family: var(--font-headline);
  font-size: clamp(72px, 11vw, 120px);
- font-weight: 800;
- font-style: italic;
- letter-spacing: -0.03em;
- line-height: 0.85;
- color: #FFFFFF;

+ font-weight: 700;
+ font-style: normal;
+ letter-spacing: -0.02em;
+ line-height: 0.9;
+ color: var(--color-text-primary);

  filter: drop-shadow(0 15px 35px rgba(0,0,0,0.6));
  margin: 0;
  padding: 0;
  position: relative;
}
```

---

## 📊 Summary of Changes

**Total lines modified:** ~45 lines across 2 files

**Breakdown:**
- Color variables: 8 changes + 2 new
- Typography variables: 2 changes
- Global selectors: 12 changes (h1, h2, h3, body, buttons, labels)
- Hero component: 2 changes (hero-line-1, hero-line-2 h2)

**Impact:** 100% visual refinement, 0% structural change

