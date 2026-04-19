# Professional Minimalist Design Skill (Shadcn/UI)

This skill guides the agent in building high-end, minimalist React applications using **shadcn/ui**, following a strict "Black & White" professional aesthetic.

## Core Principles
- **Minimalist Purity**: Stick to a binary palette of pure white (#FFFFFF) and professional black (#000000 or near-black).
- **Typography First**: Prioritize clean, modern sans-serif fonts (Inter, Geist). Use negative tracking for headings (-0.025em to -0.05em).
- **Subtle Division**: Use ultra-thin borders (1px) with low opacity (e.g., `border-black/10` or `border-white/10`) or whisper-thin shadows.
- **Micro-Animations**: Implement smooth, fast transitions (150ms-200ms) for all interactive elements.

## Component Guidelines

### 1. Palette & Theming
- **Light Mode**: Background `#FFFFFF`, Foreground `#000000`. Primary buttons black with white text.
- **Dark Mode**: Background `#000000`, Foreground `#FFFFFF`. Primary buttons white with black text.
- **Accents**: Use color extremely sparingly. If needed, use a single professional accent (e.g., Notion Blue `#0075DE` or Apple Blue `#0071E3`).

### 2. Layout (Spacing)
- Use a strict 8px (0.5rem) grid.
- **Paddings**: 8px (2), 16px (4), 24px (6), 32px (8).
- **Gaps**: Use `gap-4` (16px) or `gap-8` (32px) for major sections.

### 3. Specific Shadcn Adjustments
- **Cards**: Use `rounded-lg` (8px-12px), `border-black/5`, and `shadow-none`.
- **Buttons**:
    - **Primary**: Pure black bg, white text, 6px-8px radius.
    - **Outline**: 1px solid black/10, bg-transparent.
    - **Ghost**: No border, bg-transparent, hover:bg-black/5.
- **Inputs**: 1px solid black/10, no shadow, focus:ring-2 focus:ring-black/20.

## Prompt Examples
- "Create a minimalist landing page hero section. High-contrast black text on pure white background. Headline 4xl, Geist font, tracking-tight. One primary black pill button."
- "Design a shadcn-ui data table with whisper-thin borders, no shadows, and inter-based typography. All headings in uppercase 10px bold with 0.1em tracking."
