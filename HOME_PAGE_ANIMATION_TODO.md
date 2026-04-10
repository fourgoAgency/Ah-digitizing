# Home Page Animation + Responsive Phase

Scope: home page only in this phase.

Files involved:
- `app/page.tsx`
- `components/Header.tsx`
- `components/home/Banner.tsx`
- `components/home/Services.tsx`
- `components/home/BeforeAfter.tsx`
- `components/home/Pricing.tsx`
- `components/home/Portfolio.tsx`
- `components/home/Testimonials.tsx`

## Milestone 1: Header + Banner Controls

Tasks:
- Use the PNG logo in the header, or rebalance the header so its height is smaller and the logo appears larger.
- Change the white header buttons to `Order Now` and `Get Free Quote`.
- Keep `Get Free Quote` linked to the same page target or current quote route, depending on final anchor usage.
- Change banner buttons to `Contact` and `Login`.
- Make the sticky blue header full width on scroll.
- Remove the extra white background behind the sticky blue header.
- Reduce layout jump between normal and sticky states.

Done when:
- Header feels compact and polished.
- Sticky nav is full width and clean.
- CTA labels match the requested wording.

## Milestone 2: Banner Scroll Transition

Tasks:
- Make the next section reveal from behind the banner while scrolling.
- Use overlap/layering and scroll-triggered motion instead of a hard section break.
- Keep the effect stable on mobile and tablet.
- Prevent clipping or hidden content during the reveal.

Done when:
- The section after banner visibly comes from behind the banner.
- No z-index or overlap bugs appear on smaller screens.

## Milestone 3: Home Pricing Redesign

Reference:
- `components/pricing/Pricing.tsx`

Tasks:
- Replace the current home pricing UI with the pricing-page style.
- Keep the home version simplified and do not show full detailed features.
- Animate the pricing heading so it starts centered, moves to the top, and shakes for about 1 second.
- After the heading settles, reveal pricing cards from bottom to center with opacity from `0` to `100`.
- Add a short final shake to the cards.
- Preserve responsive stacking across mobile, tablet, and desktop.

Done when:
- Home pricing matches the newer pricing style.
- Cards are simplified for home page use.
- Heading and card animation sequence works in the requested order.

## Milestone 4: Before & After Polish

Tasks:
- Re-theme the cards with stronger site-aligned colors.
- Keep image readability high while updating the card palette.
- Reduce popup image height to around `50vh`.
- Add slow fade in/out motion where it improves the section.
- Keep overlay click and `Escape` close behavior working.

Done when:
- Cards feel on-brand.
- Popup image is smaller and better balanced.
- Animation is subtle and smooth.

## Milestone 5: Portfolio Entrance Animation

Tasks:
- Animate embroidery items from the left.
- Animate vector items from the right.
- Preserve hover interaction and avoid layout shift.
- Make sure the one-column mobile layout still feels intentional.

Done when:
- Both portfolio groups enter from opposite directions.
- No horizontal scroll is introduced.

## Milestone 6: Services Section Rework

Tasks:
- Remove the `Services we Offered` heading.
- Create a train-like entrance from the left side.
- Make the motion feel like the section arrives and stops once cards are out.
- Keep drag/swipe behavior usable after animation changes.
- Recheck arrow placement and timing after the redesign.

Done when:
- Section no longer shows the old heading.
- The new entrance clearly reads as left-to-right train motion.

## Milestone 7: Testimonials Reorder + Marquee

Tasks:
- Move testimonials to immediately after portfolio in `app/page.tsx`.
- Convert testimonials into a constant right-to-left moving strip.
- Pause motion on hover/hold.
- Use a hand/grab cursor to communicate interaction.
- Keep cards readable while moving.
- Make sure touch devices still have a usable experience.

Done when:
- Testimonials appear after portfolio.
- Auto-motion pauses correctly on interaction.

## Milestone 8: Heading Animation Pass

Tasks:
- Apply heading animation to all major home-page section titles.
- Prefer current packages already installed such as `framer-motion` or `gsap`.
- Keep animation style consistent across sections.

Done when:
- Section titles no longer appear statically.
- Animation feels unified across the page.

## Milestone 9: Responsive QA

Check on:
- `320px` to `767px`
- `768px` to `1023px`
- `1024px+`

Validate:
- No hidden content from overlap effects.
- Sticky header does not cover important content.
- Pricing cards stack cleanly.
- Before/after modal fits smaller screens.
- Portfolio motion does not create sideways scrolling.
- Testimonials remain usable on touch devices.
- Buttons stay readable and balanced.

## Suggested Implementation Order

1. Header and banner CTA/sticky updates
2. Banner overlap reveal
3. Pricing redesign and animation
4. Before & after polish
5. Portfolio directional entrance
6. Services train animation
7. Testimonials reorder and marquee
8. Heading animation pass
9. Responsive QA and final polish
