📌 TODO – Get Quote Form Updates
================================

1️⃣ Required Format Input – Tag-Based Multi-Select + Custom Entry
-----------------------------------------------------------------

*   Convert selected format values into **tag style UI**
    
*   Each selected format should:
    
    *   Show inside span as a **tag**
        
    *   Have an **“X” button** to remove it
        
*   If multiple formats are selected:
    
    *   The span container becomes **writable**
        
*   Allow user to:
    
    *   Type custom format
        
    *   On **space press → auto add as tag**
        
    *   If user types and:
        
        *   Clicks outside
            
        *   Moves to next field→ Auto submit that text as selected format
            
*   Prevent duplicate formats
    

2️⃣ Custom Dropdown Component (Reusable)
----------------------------------------

Create a reusable component with:

### Props:

*   placeholder
    
*   options\[ \]
    

### UI Structure:

*   Left side → **Text Input**
    
*   Right side → **Down Arrow Icon**
    
*   Clicking arrow opens dropdown
    
*   User selects one option
    
*   After selection:
    
    *   Disable typing
        
    *   Selected value shows inside input
        
*   Component returns selected value
    

3️⃣ Live Preview – Additional Notes Overflow Fix
------------------------------------------------

*   Show only **4–5 lines max**
    
*   If text exceeds:
    
    *   Show ......
        
*   Prevent text from overflowing outside box
    
*   Add proper CSS:
    
    *   overflow: hidden
        
    *   text-overflow
        
    *   line-clamp
        

4️⃣ Contact Number Country Code Fix
-----------------------------------

*   If user selects **+1 United States**
    
    *   Do NOT auto-convert to American Samoa
        
*   +1 must remain strictly **United States**
    
*   Remove states from dropdown
    
*   Show only **countries**
    
*   Avoid duplicate country codes
    
*   Ensure correct country-code mapping logic
    

If you want, I can also convert this into a proper GitHub-ready markdown file format with commit message suggestions.

---

# Get Quote Change TODO

- [x] Make `Fabric type` and `Colors name` optional.
- [x] Auto-select `Colorway` to `Default` for embroidery.
- [x] Convert `Number of colors` to custom dropdown with typing support and include `According to Logo`.
- [x] Match live preview field sequence with form sequence (notably after `Design Name` show `Turnaround` next).
- [x] Remove `Quote Preview` text above image in live preview.
- [x] Auto-hide error toast after 7 seconds and add close button.
- [x] Remove `Default` option from `Applique Required` and show placeholder on start.
# Home Page Animation + Responsive Phase

Scope: `app/page.tsx` and home-page sections only for this phase.

## Phase Goal

- Finalize the home page interaction flow, section order, animation behavior, and responsive polish before moving to inner pages.
- Reuse existing UI where possible, especially the pricing-page card direction, while simplifying content for the home page.
- Keep animation quality high but controlled so scroll performance stays smooth on desktop and mobile.

## Milestone 1: Header + Hero/Banner Direction

Files:
- `components/Header.tsx`
- `components/home/Banner.tsx`

Tasks:
- Switch the header logo to the PNG asset already in use, or keep the same asset but rebalance the header so the logo appears visually larger while the header height becomes smaller.
- Update the top white header CTA labels to `Order Now` and `Get Free Quote`.
- Keep `Get Free Quote` linked to the same-page quote destination or current quote route, depending on final anchor placement.
- Change the banner CTA labels from the current wording to `Contact` and `Login`.
- Review sticky header behavior:
- When the blue sticky nav appears, make it full width.
- Remove the extra white background layer behind the sticky blue nav.
- Reduce visual jump between default and sticky states.
- Add heading animation treatment across the hero text using an existing supported library pattern such as `framer-motion`, `gsap`, or the current `TextType` approach.

Acceptance criteria:
- Header feels smaller, cleaner, and consistent across desktop and mobile.
- Sticky nav occupies full width and does not show an unwanted white wrapper/background.
- Home hero buttons match the requested labels and routes.

## Milestone 2: Banner Scroll Reveal

Files:
- `components/home/Banner.tsx`
- First section rendered after banner in `app/page.tsx`

Tasks:
- Create the effect where the next section visually emerges from behind the banner as the page scrolls.
- Use layering, section overlap, and scroll-triggered translate/clip effects instead of a hard section break.
- Ensure the overlap effect works cleanly on tablet and mobile without content being cut off.
- Confirm the banner retains enough bottom spacing so text and CTA buttons are not covered during the transition.

Acceptance criteria:
- Scrolling down from the banner reveals the next section from behind it.
- No overlap bug, clipping bug, or z-index issue on small screens.

## Milestone 3: Home Pricing Redesign + Entry Animation

Files:
- `components/home/Pricing.tsx`
- Reference only: `components/pricing/Pricing.tsx`

Tasks:
- Replace the current home pricing cards with the visual direction already used on the pricing page.
- Keep the home-page version simplified:
- Show summary-level pricing information only.
- Do not show the full detailed feature list from the dedicated pricing page.
- Add staged entrance animation for the section:
- `Pricing` heading starts centered.
- Heading moves to the top position.
- Heading performs a short shake animation of about 1 second.
- After the heading settles, pricing cards render from below with opacity `0 -> 100`.
- Cards finish in place with a short subtle shake.
- Keep animation timing fast enough to feel premium, not slow.
- Preserve responsive layout for 1-column, 2-column, and 4-column breakpoints as appropriate.

Acceptance criteria:
- Home pricing matches the newer pricing-page design language.
- Detailed pricing-page-only features are not shown on the home page.
- Heading and card entrance sequence plays in the requested order.

## Milestone 4: Before & After Theme Polish

Files:
- `components/home/BeforeAfter.tsx`

Tasks:
- Update the card colors so they better match the site theme instead of using plain neutral surfaces everywhere.
- Choose accent/background colors that still keep the before/after images easy to read.
- Reduce popup image height so the opened image uses around 50% of viewport height.
- Add slow fade-in/fade-out motion in this section where it improves polish without reducing usability.
- Verify modal close behavior still works with overlay click and `Escape`.

Acceptance criteria:
- Cards feel on-brand.
- Popup image no longer appears oversized.
- Animations are soft and slow, not distracting.

## Milestone 5: Portfolio Directional Entrance

Files:
- `components/home/Portfolio.tsx`

Tasks:
- Animate embroidery image cards so they enter from the left.
- Animate vector image cards so they enter from the right.
- Keep the two-column visual balance intact while animating.
- Preserve hover scaling without causing layout shift.
- Ensure stacked mobile layout still feels intentional when directional animation collapses to one column.

Acceptance criteria:
- Embroidery and vector groups enter from opposite directions.
- Motion still feels clean on mobile and tablet.

## Milestone 6: Services Carousel Rework

Files:
- `components/home/Services.tsx`

Tasks:
- Remove the `Services we Offered` heading from this section.
- Replace the current simple entrance with a stronger left-to-right motion concept inspired by a train arriving from the left side.
- The motion should visually suggest connected movement from sidebar/edge to final resting position.
- Cards should complete their reveal as the train-like motion stops.
- Keep swipe/drag usability intact after animation changes.
- Check whether arrow controls need timing or positioning adjustments after the rework.

Acceptance criteria:
- Section no longer shows the current heading.
- Entrance motion reads as a train-like arrival from the left and settles cleanly.

## Milestone 7: Testimonials Move + Infinite Marquee

Files:
- `app/page.tsx`
- `components/home/Testimonials.tsx`

Tasks:
- Move the testimonials section so it renders immediately after portfolio.
- Convert the section into a continuously moving right-to-left testimonial strip or marquee.
- On hover/hold, motion should pause.
- Cursor should clearly communicate interactivity using a hand/grab style as appropriate.
- Verify testimonial cards remain readable while in motion.
- Ensure touch devices do not get a broken hover-only experience.

Acceptance criteria:
- Testimonials appear after portfolio in home-page order.
- Auto-scroll runs continuously right to left.
- Hover/hold pauses movement.

## Milestone 8: Heading Animation Pass Across Home Page

Files:
- `components/home/Banner.tsx`
- `components/home/Pricing.tsx`
- `components/home/Portfolio.tsx`
- `components/home/BeforeAfter.tsx`
- `components/home/WhyChooseUs.tsx`
- Any other home section headings that remain after layout cleanup

Tasks:
- Apply a consistent heading animation system to all major home-page section titles.
- Prefer built-in support from currently installed libraries first.
- Keep the animation family consistent across sections even if timing differs.
- Respect reduced-motion behavior if implemented later.

Acceptance criteria:
- Home page headings no longer appear statically.
- Motion style feels unified rather than random section by section.

## Milestone 9: Home Page Responsive QA

Files:
- All touched home-page sections

Breakpoints to verify:
- Mobile: `320px` to `767px`
- Tablet: `768px` to `1023px`
- Desktop: `1024px+`

Checks:
- No section overlap causes hidden content.
- Sticky header does not cover active content.
- Pricing cards stack cleanly.
- Before/after modal fits smaller screens.
- Portfolio animations do not create horizontal scroll.
- Testimonials marquee remains usable on touch devices.
- Button labels stay on one line or wrap cleanly.
- Section paddings feel consistent after reorder and animation work.

## Suggested Execution Order

- 1. Header and banner CTA/sticky adjustments
- 2. Banner overlap reveal
- 3. Pricing redesign and animation
- 4. Before & after polish
- 5. Portfolio directional entrance
- 6. Services train animation
- 7. Testimonials reorder and marquee
- 8. Global heading animation pass
- 9. Responsive QA and final polish

## Definition of Done

- Home page section order matches the approved flow.
- Requested animation concepts are implemented with smooth performance.
- Header and CTA wording are updated.
- Pricing home section reflects the pricing-page UI direction without extra detail.
- Mobile, tablet, and desktop layouts all remain stable after animation work.
