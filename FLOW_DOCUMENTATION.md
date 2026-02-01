# Valentine's Day Game - Flow & Technical Documentation

## 🎯 Application Flow

The application follows a sequential progression through challenges with a roadmap between each game:

1. **Landing Page (index.html)** → "Let's Play! 💖" button →
2. **Roadmap (roadmap.html)** → Shows Flappy Bird unlocked →
3. **Challenge 1: Flappy Bird (flappy.html)** → Score 10 points → (auto-redirect to roadmap) →
4. **Roadmap** → Flappy complete, Memory unlocked →
5. **Challenge 2: Memory Game (memory.html)** → Match all 6 pairs → (auto-redirect to roadmap) →
6. **Roadmap** → Flappy & Memory complete, Snake unlocked →
7. **Challenge 3: Love Snake (snake.html)** → Score 10 points → (auto-redirect to roadmap) →
8. **Roadmap** → All games complete, Envelope unlocked →
9. **Valentine Question (valentine.html)** → Answer "Yes" →
10. **Itinerary (itinerary.html)** - Valentine's Day plan

## ✅ Implementation Status

**COMPLETED:**
- ✅ Multi-page architecture with shared CSS and JS
- ✅ Roadmap page with progress tracking
- ✅ LocalStorage progress persistence
- ✅ Animated roadmap transitions (locked → unlocked → complete)
- ✅ Confetti on Valentine page load
- ✅ All game pages with auto-redirect on win
- ✅ Responsive design
- ✅ Fixed all known issues (extra div, duplicate text, missing memory HTML)

---

## 🎮 Game Details & Mechanics

### Challenge 1: Flappy Bird

**Objective:** Navigate through pipes to score 10 points

**Controls:**
- **Desktop:** Click on canvas OR press Spacebar
- **Mobile:** Tap on canvas

**Game Elements:**
- **Bird Character:** 🐤 (facing left, 35px font size)
- **Pipes:** Green (#98FB98 fill, #228B22 border, 60px wide)
- **Gap Size:** 200px
- **Pipe Generation:** Every 2500ms initially

**Winning Condition:** Score 10 points by passing through pipes

**Losing Condition:** 
- Hit a pipe
- Go above canvas top
- Go below canvas bottom

**Canvas Size:** 600px × 500px

**Background Animations (scrolling left):**
- ☁️ Clouds: 4 instances, 35px, opacity 0.5
- 🌸 Cherry Blossoms: 6 instances, 28px, opacity 0.7
- 🌺 Hibiscus: 8 instances, 24px, opacity 0.6
- 💕 Hearts: 10 instances, 20px, opacity 0.4
- ✨ Sparkles: 7 instances, 18px, opacity 0.35
- 🦋 Butterflies: 5 instances, 22px, opacity 0.5

**Physics:**
- Gravity: 0.15
- Jump force: -5
- Bird size: 30px
- Scroll speed: 2px per frame

---

### Challenge 2: Memory Game

**Objective:** Match all 6 pairs of cards

**Controls:** Click on cards to flip them

**Card Emojis (pairs):**
- ⭐ (Star)
- 🐕 (Dog)
- ☕ (Coffee)
- 🧋 (Bubble Tea)
- ❤️ (Heart)
- 📷 (Camera)

**Game Elements:**
- **Card Size:** 100px × 100px (85px × 85px on mobile)
- **Grid:** 4×4 (3×3 on mobile)
- **Total Cards:** 12 cards (6 pairs)
- **Initial State:** Shows "?" on all cards
- **Card Background:** Gradient (#fff0f5 to #ffb6c1)

**Card States:**
1. **Default:** Light pink gradient, shows "?"
2. **Flipped:** Pink gradient (#ff6b9d to #ff8fab), shows emoji, rotates 360°
3. **Matched:** Green gradient (#90EE90 to #98FB98), glowing animation

**Winning Condition:** Match all 6 pairs

**Animations:**
- Hover: Scale 1.08, lift 5px, enhanced shadow
- Flip: Rotate 360°, scale 1.1
- Match: Pulse animation + continuous glow

**Timeout:** 1000ms to flip back if cards don't match

---

### Challenge 3: Love Snake

**Objective:** Eat roses to reach score 10

**Controls:**
- **Desktop:** Arrow keys (Up, Down, Left, Right)
- **Mobile:** Swipe gestures

**Game Elements:**
- **Snake Body:** 💗 (Heart emojis, 18px font)
- **Food:** 🌹 (Rose emoji, 20px font)
- **Cell Size:** 20px
- **Grid Size:** 20×20 cells
- **Canvas Size:** 400px × 400px

**Initial State:**
- Snake starts with 3 segments
- Starts at center (10, 10)
- Initial direction: Right
- Speed: 150ms per move

**Scoring:** +1 point for each rose eaten

**Winning Condition:** Score 10 points

**Losing Conditions:**
- Hit wall (grid boundary)
- Hit own body

**Swipe Detection Threshold:** 30px minimum movement

**Snake Growth:** Grows by 1 segment when food is eaten

---

## 💝 Valentine Question Screen

**Elements:**
- Heading: "Will you be my Valentine? 💕" (3rem font)
- Subtext: "Please say yes... ❤️" (1.2rem font)

**Buttons:**
- **"Yes! 💖"** - Pink gradient (#ff6b9d to #ff8fab), leads to Itinerary + confetti
- **"No 💔"** - Gray gradient (#ccc to #999), does nothing

---

## 📋 Itinerary Screen

**Header:** "Yay! You passed!"
**Subheader:** "Here is the plan for Valentine's Day:"

**Timeline (with ❤️ emoji bullets):**
1. **10:00 AM (Negotiable)** - Pickup
2. **Morning** - Travel over together
3. **Lunchtime** - Lunch at Gardens by the Bay!! 🌺
4. **Afternoon** - Stroll around the gardens 🌸
5. **Late Afternoon** - Chill somewhere (Movie?) 🎬
6. **Evening** - Dinner! 🍽️
7. **Night** - Nightshow 🤩
8. **Late Night** - Home! 🏠

**Footer:** "See you then! ❤️" (1.5rem font)

---

## 🎨 Visual Design

### Color Palette

**Primary Colors:**
- Primary Pink: #ff6b9d
- Light Pink: #ff8fab
- Background Pink: #ffeef8
- Mid Pink: #ffd6e8
- Highlight Pink: #ffe0f5

**Success Colors:**
- Success Green: #90EE90 (Light Green)
- Success Green: #98FB98 (Pale Green)
- Dark Green (borders): #228B22

**Pastel Circle Colors (background):**
- #ffeef8, #fff0f5, #e6e6fa, #f0e6ff, #e6fff0, #ffe0ec, #e0f7fa, #ffecf0

**Confetti Colors:**
- #ff6b9d, #ff8fab, #ffb6c1, #ffc0cb, #fff0f5, #ff69b4

### Typography
- **Font Family:** 'Comic Sans MS', cursive, sans-serif
- **Heading 1:** 2.5rem (3rem on Valentine screen)
- **Heading 2:** 1.8rem
- **Body Text:** 1.1rem
- **Buttons:** 1.2rem - 1.3rem

### Background Elements

**Floating Hearts (💕):**
- Quantity: 20 hearts
- Animation: Float from bottom to top over 15s
- Rotation: 0° to 360°
- Opacity: 0.6
- Size: 20px

**Pastel Circles:**
- Quantity: 8 circles
- Sizes: 50px, 80px, 120px, 150px, 200px
- Position: Random (100vw × 100vh)
- Opacity: 0.3 - 0.6
- Layer: Behind content (z-index: -1)

### Button Styling

**Default Button:**
- Background: Linear gradient (135deg, #ff6b9d → #ff8fab)
- Color: White
- Padding: 15px 30px (20px 50px for larger buttons)
- Font Size: 1.2rem (1.3rem for larger buttons)
- Border Radius: 25px
- Box Shadow: 0 4px 15px rgba(255, 107, 157, 0.4)

**Button Hover:**
- Transform: Scale 1.05
- Box Shadow: 0 6px 20px rgba(255, 107, 157, 0.6)

### View Transitions
- **Opacity Transition:** 0.5s ease-in-out
- **Display:** Flex (centered content)
- **Active Class:** Controls visibility

---

## 📱 Responsive Design

### Mobile Adjustments (< 480px)

**Typography:**
- H1: 2rem (reduced from 2.5rem)

**Memory Game:**
- Grid: 3 columns (reduced from 4)
- Card Size: 85px × 85px (reduced from 100px)
- Font Size: 2rem (reduced from 2.5rem)

**Flappy Bird:**
- Canvas: 100% width, 300px height

---

## ⚠️ Known Issues & TODO

✅ **ALL ISSUES RESOLVED**

All previously known issues have been fixed in the new multi-page architecture:
- ✅ Memory Game HTML section implemented
- ✅ Extra closing div tags removed
- ✅ Duplicate text removed
- ✅ Button labels consistent

---

## 🚀 Deployment Notes

### Static Site Hosting
- Works on GitHub Pages (static HTML/CSS/JS)
- No build process required
- Multi-page architecture with shared assets

### File Structure
```
belle/
├── index.html          (Landing page)
├── roadmap.html        (Progress tracker)
├── flappy.html         (Challenge 1)
├── memory.html         (Challenge 2)
├── snake.html          (Challenge 3)
├── valentine.html      (Valentine question)
├── itinerary.html      (Final itinerary)
├── css/
│   └── style.css       (Shared styles)
└── js/
    └── script.js       (Shared logic + games)
```

### Browser Requirements
- Modern browser with ES6 support
- Canvas API support
- Touch event support (for mobile)
- CSS Grid support
- CSS Custom Properties

### Testing Locally
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

---

## 📝 Summary

**Total Games:** 3 (Flappy Bird, Memory Game, Love Snake)

**Emojis Used Throughout:**
- 🐤 (Flappy bird)
- ☁️, 🌸, 🌺, 💕, ✨, 🦋 (Flappy Bird background)
- ⭐, 🐕, ☕, 🧋, ❤️, 📷 (Memory Game cards)
- 💗 (Snake body)
- 🌹 (Snake food)
- 💕, 💖, ❤️, 💔 (UI elements)
- ✉️ (Envelope icon)
- 🌺, 🌸, 🎬, 🍽️, 🤩, 🏠 (Itinerary)

**Primary Colors:** Pink (#ff6b9d) dominant theme throughout
**Font:** Comic Sans MS for playful, romantic feel
**Background:** Pastel gradient with floating elements
**Animations:** Floating hearts, parallax scrolling, card flips, confetti, roadmap transitions

**Current Status:** ✅ ALL COMPLETE
- ✅ Flappy Bird: Working with auto-redirect
- ✅ Memory Game: Working with auto-redirect
- ✅ Love Snake: Working with auto-redirect
- ✅ Valentine Question: Working with confetti on load
- ✅ Itinerary: Working with confetti on load
- ✅ Roadmap: Working with progress tracking and animations
- ✅ Progress Persistence: LocalStorage implemented
