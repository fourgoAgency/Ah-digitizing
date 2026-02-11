export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string[];
  date: string;
  image: string;
  category: "Embroidery" | "Vector" | "Reviews";
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "prepare-artwork-for-embroidery-digitizing",
    title: "How to Prepare Artwork for Clean Embroidery Digitizing",
    description:
      "Learn the exact file setup, size notes, and stitch direction cues that help digitizers deliver cleaner details, fewer trims, and faster approvals on first sample.",
    content: [
      "Great embroidery starts before digitizing. The quality of your source artwork, the final size you need, and the fabric type all directly affect stitch clarity. When those details are shared early, the file can be built with better underlay, safer density, and cleaner sequencing.",
      "Always provide the intended logo width and use-case, such as left chest, cap front, or jacket back. The same logo needs a different stitch strategy at each size. Small text and thin lines may require simplification to keep readability after thread pull and fabric movement.",
      "If your design includes gradients or very fine effects, send a marked version showing priority elements. This helps digitizers protect key brand details while adjusting what cannot be stitched reliably. A strong prep process reduces revisions and improves first-run quality.",
    ],
    date: "January 15, 2025",
    image: "/home-page/portfolio-embroidery/3rd.jpg",
    category: "Embroidery",
  },
  {
    id: 2,
    slug: "common-thread-break-issues",
    title: "3 Common Thread-Break Issues and How We Prevent Them",
    description:
      "From tiny lettering to dense fills, these are the most common causes of thread breaks and the digitizing adjustments we apply to reduce production downtime.",
    content: [
      "Thread breaks often come from avoidable design decisions. Overly dense areas, abrupt direction changes, and tiny satin columns are common causes. Even with a good machine setup, difficult pathing can create frequent stops during production.",
      "To prevent this, we balance density based on fabric and thread type, then split large fills into manageable sections with proper underlay support. For small details, we switch to safer structures that reduce friction and needle heat.",
      "Sequence planning matters too. We aim for smoother run paths and fewer hard jumps, which lowers stress on thread tension. The result is a file that runs cleaner, saves operator time, and improves final consistency across batch jobs.",
    ],
    date: "February 22, 2025",
    image: "/home-page/portfolio-embroidery/2nd.png",
    category: "Embroidery",
  },
  {
    id: 3,
    slug: "raster-vs-vector-file-format-guide",
    title: "Raster vs Vector: Which File Format Should You Send?",
    description:
      "Not sure whether PNG, JPG, AI, or PDF is best? This guide breaks down when each format works, what quality we need, and how to avoid redraw charges.",
    content: [
      "Raster files like JPG and PNG are pixel-based. They can work for reference, but low-resolution files become blurry when enlarged. Vector files like AI, EPS, SVG, and editable PDF keep crisp edges at any size and are usually better for production workflows.",
      "If you only have raster art, send the largest original file available. Avoid screenshots or compressed social media images. Better source quality means faster and more accurate tracing, especially for logos with sharp geometry or small text.",
      "When possible, include brand color codes and font names. This helps maintain consistency during conversion. Choosing the right source format reduces correction cycles and ensures your final print or cut file behaves correctly in downstream software.",
    ],
    date: "March 8, 2025",
    image: "/home-page/portfolio-vector/4th.jpg",
    category: "Vector",
  },
  {
    id: 4,
    slug: "vector-artwork-checklist-for-printing",
    title: "Vector Artwork Checklist for Screen Printing and DTF",
    description:
      "Before sending artwork to press, use this checklist for line weight, color separation, and outline cleanup so your print results stay sharp at any size.",
    content: [
      "A print-ready vector should have clean paths, consistent stroke handling, and intentional layers. Hidden objects, stray points, and accidental overlaps can cause output errors when separating colors or preparing film.",
      "Keep line weights realistic for your print method. Very thin strokes may break up on textured garments, while over-complicated details can lose clarity at smaller print sizes. Expand or outline text when needed to avoid missing fonts in production.",
      "Before delivery, confirm color modes and naming conventions requested by your print provider. A simple final preflight on layers, path direction, and color count can prevent costly reruns and approval delays.",
    ],
    date: "April 12, 2025",
    image: "/services/outline.png",
    category: "Vector",
  },
  {
    id: 5,
    slug: "client-review-48-cap-logos-in-24-hours",
    title: "Client Review: 48 Cap Logos Delivered in 24 Hours",
    description:
      "A U.S. apparel brand needed rush-ready cap files for multiple branches. Here is how we handled revisions, approvals, and final machine-ready delivery.",
    content: [
      "This project involved multiple logo variants and strict time pressure. The client needed cap-ready embroidery files in a single day, with each branch requiring small text adjustments and custom placements.",
      "We organized the work in priority batches, shared progressive previews, and locked approval checkpoints every few hours. This prevented late-stage surprises and kept communication clear across the client team.",
      "By the end of the cycle, all final files were delivered with documented size notes and thread recommendations. The client reported smoother machine runs and significantly fewer production pauses than their previous vendor workflow.",
    ],
    date: "May 4, 2025",
    image: "/contact_us.jpeg",
    category: "Reviews",
  },
  {
    id: 6,
    slug: "clean-pathing-in-vector-tracing",
    title: "Why Clean Pathing Matters in Professional Vector Tracing",
    description:
      "Good vectors are not just smooth shapes. We explain anchor point control, curve consistency, and layered structure for faster edits and print reliability.",
    content: [
      "A high-quality vector is defined by structure, not just appearance. Too many anchor points, uneven curves, and broken joins can make edits difficult and create issues in cutting or printing workflows.",
      "We focus on controlled point placement and logical shape building so files stay lightweight and easy to modify. Better geometry improves compatibility across design, RIP, and production software.",
      "Clean pathing also helps teams scale design libraries. When every asset follows predictable standards, updates are faster, handoffs are cleaner, and outputs remain consistent across different products and print processes.",
    ],
    date: "June 17, 2025",
    image: "/home-page/portfolio-vector/3rd.jpg",
    category: "Vector",
  },
  {
    id: 7,
    slug: "customer-feedback-better-stitch-quality",
    title: "Customer Feedback: Better Stitch Quality, Fewer Revisions",
    description:
      "See what customers highlight most after switching to our team, including turnaround consistency, cleaner small text, and improved underlay decisions.",
    content: [
      "Many customers come to us after repeated revision loops with previous vendors. Their most common concerns are inconsistent stitch quality, unclear communication, and missed turnaround expectations during peak order cycles.",
      "The biggest improvements they report are predictable delivery windows and stronger first-sample performance. Clear pre-production notes and practical stitch planning reduce back-and-forth and protect launch timelines.",
      "Over time, this reliability helps shops plan capacity better and accept more orders confidently. Good digitizing is not only about visual quality; it directly supports operational stability and customer trust.",
    ],
    date: "July 20, 2025",
    image: "/write-a-review.jpeg",
    category: "Reviews",
  },
  {
    id: 8,
    slug: "small-text-embroidery-readability-rules",
    title: "Small Text Embroidery: The Rules That Protect Readability",
    description:
      "When logos include tiny text, sizing and stitch planning become critical. This post covers minimum heights, pull compensation, and safer font choices.",
    content: [
      "Small text is one of the hardest parts of embroidery. At reduced sizes, tiny counters close, edges distort, and letter spacing collapses. Without the right stitch strategy, readability drops quickly.",
      "We recommend minimum height thresholds by font style and fabric behavior. Pull compensation, stitch angle, and underlay choices must be tuned to preserve open shapes and prevent text from filling in after wash and wear.",
      "When text is too small for safe stitching, we advise simplified alternatives that keep brand intent while improving legibility. The goal is a design that looks good on screen and performs reliably on the machine.",
    ],
    date: "August 1, 2025",
    image: "/home-page/portfolio-embroidery/3rd.jpg",
    category: "Embroidery",
  },
];
