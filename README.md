# Animated Navigation

A sophisticated letter-by-letter hover animation for navigation menus, inspired by the [Lando Norris website](https://landonorris.com/). Each letter slides up individually while a highlighted duplicate slides in from below, creating a smooth cascading effect.

![Demo](https://img.shields.io/badge/status-production--ready-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Letter-by-letter animation** with staggered timing
- **GPU-accelerated** transforms for 60fps performance
- **Fully accessible** with screen reader support
- **Responsive design** adapts to all screen sizes
- **Zero dependencies** - vanilla CSS and JavaScript
- **TypeScript/Next.js** implementation included
- **Standalone HTML** version for easy integration

## How It Works

The animation uses a clever stacking technique:

1. Each letter is wrapped in an overflow container
2. Two copies of each letter are stacked vertically (normal + highlight)
3. The container clips overflow to show only one letter at a time
4. On hover, both copies translate with staggered delays:
   - Normal letter slides up (`translateY(-100%)`)
   - Highlight letter slides in (`translateY(0)`)

```
Normal State:        Hover State:
┌───────┐           ┌───────┐
│   A   │ visible   │       │ hidden (moved up)
└───────┘           │   A   │ visible (moved up)
    A   (hidden)    └───────┘
```

## Quick Start

### Standalone HTML

Open `animated-nav-standalone.html` directly in your browser. No build tools required.

```html
<!-- Customize the delay between letters (line ~307) -->
letterClip.style.setProperty('--char-delay', `${index * 0.05}s`);
//                                                    ↑ 50ms default
```

### Next.js Implementation

```bash
npm install
npm run dev
```

The Next.js version is located in:
- Component: `src/components/AnimatedNav.tsx`
- Styles: `src/styles/AnimatedNav.module.css`
- Page: `app/page.tsx`

## Customization

### Animation Speed

**CSS** - Change transition duration:
```css
.letter {
  transition: transform 0.45s cubic-bezier(0.18, 0.82, 0.41, 1);
  /*                   ↑ Adjust duration */
}
```

### Letter Stagger Delay

**JavaScript** - Adjust the multiplier:
```javascript
`${index * 0.05}s`  // 50ms between letters (default)
`${index * 0.03}s`  // 30ms - faster cascade
`${index * 0.08}s`  // 80ms - slower cascade
```

### Colors

```css
/* Normal text color */
.nav-item {
  color: #f4f4f1;  /* White */
}

/* Highlight color */
.letter.highlight {
  color: #d5f45d;  /* Lime accent */
}
```

### Easing Function

Try different curves for varied feel:
```css
/* Default: Smooth with slight bounce */
cubic-bezier(0.18, 0.82, 0.41, 1)

/* Sharp bounce */
cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* Gentle ease */
cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

## Technical Architecture

### HTML Structure
```html
<button class="nav-item">
  <span class="word">
    <span class="letters">
      <span class="letter-clip" style="--char-delay: 0s">
        <span class="letter-wrapper">
          <span class="letter">C</span>           <!-- Normal -->
          <span class="letter highlight">C</span> <!-- Highlight -->
        </span>
      </span>
      <!-- Repeated for each letter -->
    </span>
  </span>
</button>
```

### Key CSS Properties

```css
.letter-clip {
  overflow: hidden;              /* Clips sliding letters */
  height: clamp(2.5rem, 6.5vw, 4rem);  /* Fixed viewport */
}

.letter {
  transition-delay: var(--char-delay);  /* Staggered timing */
  transform: translateY(0);             /* Start position */
}

.letter.highlight {
  position: absolute;
  transform: translateY(100%);  /* Starts below */
}
```

### Performance Optimizations

- GPU-accelerated transforms
- `will-change` hints for browser optimization
- No layout-triggering properties
- Hardware compositing enabled
- Sub-pixel rendering


## Accessibility

- **Semantic HTML**: Proper `<nav>` and `<button>` elements
- **Screen readers**: Hidden text provides full context
- **Keyboard navigation**: Full keyboard support with visible focus states
- **ARIA labels**: Decorative elements properly marked with `aria-hidden`
- **Focus indicators**: Clear outlines on keyboard focus

## Files

```
.
├── animated-nav-standalone.html    # Standalone version (no dependencies)
├── README.md                       # This file
├── README-ANIMATION.md            # Detailed technical documentation
├── app/
│   ├── page.tsx                   # Next.js page
│   └── layout.tsx                 # Root layout
└── src/
    ├── components/
    │   └── AnimatedNav.tsx        # Main component
    └── styles/
        └── AnimatedNav.module.css # Component styles
```

## Common Adjustments

**Make animation faster:**
```javascript
// Change from 0.05 to 0.03
letterClip.style.setProperty('--char-delay', `${index * 0.03}s`);
```

**Change colors:**
```css
/* In your CSS file */
.letter.highlight {
  color: #your-color;
}
```

**Adjust letter height:**
```css
.letter-clip {
  height: 3rem;  /* Fixed height */
}
```

## Tips

- Keep delay multiplier between `0.03s` - `0.1s` for best effect
- Use `cubic-bezier` for custom easing curves
- Test on mobile devices for touch interaction
- Ensure sufficient color contrast for accessibility

## Further Reading

For a deep dive into the implementation details, animation mechanics, and performance optimizations, see [README-ANIMATION.md](./README-ANIMATION.md).

## License

MIT License - feel free to use in personal and commercial projects.

## Credits

Animation inspired by the [Lando Norris Official Website](https://landonorris.com/).

---

**Created**: 2025  
**Technologies**: TypeScript, Next.js, React, CSS Modules, Vanilla JS
