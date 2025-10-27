# Animated Navigation - Technical Documentation

## Overview

This project implements a sophisticated letter-by-letter hover animation inspired by the [Lando Norris website](https://landonorris.com/). When hovering over navigation items, each letter individually slides up while a highlighted duplicate slides up from below, creating a cascading waterfall effect.

---

## Core Concept

The animation works by:
1. **Wrapping each letter** in its own overflow container
2. **Stacking two copies** of each letter vertically (normal + highlight)
3. **Clipping overflow** to show only one letter at a time
4. **Translating both copies** on hover with staggered delays

---

## HTML Structure

Each word is broken down into individual letter containers:

```html
<button class="nav-item">
  <span class="word">
    <span class="word-sr">CALENDAR</span> <!-- Screen reader text -->
    <span class="letters">
      <!-- Each letter gets its own clip container -->
      <span class="letter-clip" style="--char-delay: 0s">
        <span class="letter-wrapper">
          <span class="letter">C</span>           <!-- Normal version -->
          <span class="letter highlight">C</span> <!-- Highlight version -->
        </span>
      </span>
      <span class="letter-clip" style="--char-delay: 0.05s">
        <span class="letter-wrapper">
          <span class="letter">A</span>
          <span class="letter highlight">A</span>
        </span>
      </span>
      <!-- ... and so on for each letter -->
    </span>
  </span>
</button>
```

### Structure Breakdown

1. **`.word`** - Container for the entire word
2. **`.word-sr`** - Screen reader accessible text (hidden visually)
3. **`.letters`** - Flex container holding all letter clips
4. **`.letter-clip`** - Overflow container with fixed height (clips the vertical sliding)
5. **`.letter-wrapper`** - Positioning context for stacked letters
6. **`.letter`** - The actual letter span (two per clip: normal + highlight)

---

## CSS Animation Mechanism

### 1. Letter Clipping Container

```css
.letter-clip {
  position: relative;
  display: inline-block;
  overflow: hidden;              /* Key: hides letters outside bounds */
  vertical-align: top;
  height: clamp(2.5rem, 6.5vw, 4rem);  /* Fixed height for clipping */
}
```

**Why it works**: The fixed height combined with `overflow: hidden` creates a viewport that only shows the current letter position.

### 2. Letter Stacking

```css
.letter {
  display: inline-block;
  color: inherit;
  transition: transform 0.45s cubic-bezier(0.18, 0.82, 0.41, 1);
  transition-delay: var(--char-delay, 0s);  /* Staggered timing */
  transform: translateY(0);  /* Normal position */
}

.letter.highlight {
  position: absolute;  /* Overlay on top of normal letter */
  top: 0;
  left: 0;
  transform: translateY(100%);  /* Starts below, out of view */
  color: #d5f45d;  /* Lime/accent color */
}
```

**Key points**:
- Normal letter starts at `translateY(0)` (visible)
- Highlight letter starts at `translateY(100%)` (below, hidden)
- Both occupy the same space due to absolute positioning
- The clip container shows only what's in bounds

### 3. Hover State Transformation

```css
.nav-item:hover .letter:not(.highlight) {
  transform: translateY(-100%);  /* Slides up, out of view */
}

.nav-item:hover .letter.highlight {
  transform: translateY(0);  /* Slides up into view */
}
```

**Animation flow**:
1. User hovers over nav item
2. Normal letter translates up by 100% (disappears above)
3. Highlight letter translates from 100% to 0 (appears from below)
4. Clip container shows only what's in the viewport
5. Creates illusion of letter "replacement"

---

## Staggered Delay System

### Custom Property Approach

Each letter receives a CSS custom property with its delay:

```javascript
// JavaScript - setting delays
letterClip.style.setProperty('--char-delay', `${index * 0.05}s`);
// Letter 0: 0s
// Letter 1: 0.05s
// Letter 2: 0.10s
// Letter 3: 0.15s
// etc.
```

```css
/* CSS - using the delay */
.letter {
  transition-delay: var(--char-delay, 0s);
}
```

**Why custom properties?**
- Allows dynamic per-element timing without generating unique CSS rules
- Works with both `:hover` state transitions
- Applied to both normal and highlight versions automatically

### Timing Calculation

```
delay = letterIndex × delayMultiplier

Where:
- letterIndex: 0, 1, 2, 3, 4...
- delayMultiplier: 0.05s (50ms) by default
```

**Result**: 
- "CALENDAR" (8 letters) animates over 350ms (7 × 50ms)
- Creates smooth wave/cascade effect

---

## Color Swap Logic

### Default Items (HOME, ON TRACK, CALENDAR)

```css
/* Normal: white */
.letter {
  color: inherit;  /* From .nav-item { color: #f4f4f1 } */
}

/* Highlight: lime */
.letter.highlight {
  color: #d5f45d;
}
```

**On hover**: White slides out, lime slides in

### Accent Items (OFF TRACK)

```css
/* Normal: white (reversed from default) */
.nav-item.accent .letter:not(.highlight) {
  color: #f4f4f1;
}

/* Highlight: lime */
.nav-item.accent .letter.highlight {
  color: #d5f45d;
}
```

**On hover**: White slides out, lime slides in (same visual but different default)

---

## Transform & Transition Details

### Easing Function

```css
cubic-bezier(0.18, 0.82, 0.41, 1)
```

**Characteristics**:
- Slow start (ease-in)
- Fast middle
- Slight overshoot at end
- Creates natural, bouncy feel

### Transform Choice: `translateY()` vs Others

**Why `translateY()`?**
- Hardware accelerated (GPU)
- Doesn't trigger layout reflow
- Sub-pixel precision
- Smooth 60fps animation

**Not using**:
- `top/bottom`: Triggers layout
- `margin`: Triggers layout
- `position`: Triggers layout

### Will-Change Optimization

```css
.letter {
  will-change: transform;
}
```

**Purpose**: Hints to browser that transform will change, allowing GPU layer promotion before animation starts.

---

## Overflow Clipping Mechanism

### Visual Explanation

```
┌─────────────────┐  ← .letter-clip (overflow: hidden)
│                 │
│   Normal: C ←───┼─── translateY(0) → visible
│                 │
│   Highlight: C ─┼─── translateY(100%) → hidden below
│                 │
└─────────────────┘

On hover:
┌─────────────────┐
│   Normal: C ←───┼─── translateY(-100%) → hidden above
│                 │
│   Highlight: C ─┼─── translateY(0) → visible
│                 │
└─────────────────┘
```

**Key insight**: The clip container acts as a "window" showing only the 100% × 100% area. Letters slide through this window.

---

## JavaScript Implementation

### Dynamic Letter Wrapping

```javascript
function createAnimatedWord(text) {
  const characters = Array.from(text);  // Split into chars
  
  characters.forEach((char, index) => {
    // Create clip container
    const letterClip = document.createElement('span');
    letterClip.className = 'letter-clip';
    letterClip.style.setProperty('--char-delay', `${index * 0.05}s`);
    
    // Create wrapper
    const letterWrapper = document.createElement('span');
    letterWrapper.className = 'letter-wrapper';
    
    // Create both versions
    const normalLetter = document.createElement('span');
    normalLetter.className = 'letter';
    normalLetter.textContent = char;
    
    const highlightLetter = document.createElement('span');
    highlightLetter.className = 'letter highlight';
    highlightLetter.textContent = char;
    
    // Nest structure
    letterWrapper.appendChild(normalLetter);
    letterWrapper.appendChild(highlightLetter);
    letterClip.appendChild(letterWrapper);
  });
}
```

**Why JavaScript?**
- Dynamic text content
- Automatic letter wrapping
- Calculates delays programmatically
- Keeps HTML clean

---

## Performance Considerations

### Optimizations Applied

1. **GPU Acceleration**: Using `transform` and `will-change`
2. **Minimal Reflows**: No layout-triggering properties
3. **Hardware Compositing**: Each letter on own GPU layer
4. **Scoped Transitions**: Only affects hovered element

### Performance Metrics

- **60 FPS**: Smooth animation on modern devices
- **Low CPU**: GPU handles transforms
- **No jank**: Optimized for composite-only changes

### Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support
- Mobile: ✅ Works on iOS/Android

---

## Customization Guide

### Adjust Animation Speed

**Change transition duration**:
```css
.letter {
  transition: transform 0.45s cubic-bezier(0.18, 0.82, 0.41, 1);
  /*                   ↑ Change this value */
}
```

### Adjust Letter Delay

**Change stagger timing**:
```javascript
letterClip.style.setProperty('--char-delay', `${index * 0.05}s`);
//                                                    ↑ Change multiplier
```

### Change Colors

**Normal text color**:
```css
.nav-item {
  color: #f4f4f1;  /* Change this */
}
```

**Highlight color**:
```css
.letter.highlight {
  color: #d5f45d;  /* Change this */
}
```

### Adjust Easing

Try different easing functions:
- `ease-in-out`: Smooth start and end
- `ease-out`: Quick start, slow end
- `cubic-bezier(0.68, -0.55, 0.265, 1.55)`: Bounce effect
- `cubic-bezier(0.25, 0.46, 0.45, 0.94)`: Gentle ease

---

## Accessibility Features

1. **Screen Reader Text**: Hidden `.word-sr` provides full word to assistive tech
2. **Semantic HTML**: Uses proper `<nav>` and `<button>` elements
3. **Keyboard Navigation**: Full keyboard support with focus states
4. **ARIA Labels**: Proper `aria-hidden` on decorative elements
5. **Focus Indicators**: Visible outline on focus

---

## Common Issues & Solutions

### Issue: Animation feels too slow
**Solution**: Decrease delay multiplier from `0.05` to `0.03`

### Issue: Letters move together
**Solution**: Ensure `--char-delay` is set correctly per letter

### Issue: Letters cut off
**Solution**: Increase `.letter-clip` height

### Issue: Janky animation
**Solution**: Check for layout-triggering properties, ensure `will-change` is present

---

## References & Inspiration

- Original inspiration: [Lando Norris Official Website](https://landonorris.com/)
- CSS Transforms: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- Animation Performance: [Google Web Fundamentals](https://developers.google.com/web/fundamentals/performance/rendering)

---

## License

This implementation is provided as-is for educational and commercial use.

---

**Created**: 2025  
**Last Updated**: October 2025

