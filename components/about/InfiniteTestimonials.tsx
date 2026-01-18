import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import TestimonialCard from "./TestimonialCard";

type Testimonial = {
  name: string;
  role: string;
  text: string;
};

export default function InfiniteTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [isDragging, setIsDragging] = useState(false);
  const [measuredWidth, setMeasuredWidth] = useState(360); // Default width based on w-90 (360px)
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Measure the actual card width after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        // Create a temporary element to measure the card width
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.visibility = 'hidden';
        tempContainer.className = 'relative w-90';
        document.body.appendChild(tempContainer);

        const width = tempContainer.offsetWidth || 360;
        setMeasuredWidth(width);

        document.body.removeChild(tempContainer);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Create 4 sets of testimonials for seamless infinite loop
  const quadrupleTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  useAnimationFrame((time, delta) => {
    if (!isDragging) {
      const currentX = x.get();
      // Total width of one complete set (including gaps between cards)
      const singleSetWidth = (measuredWidth + 24) * testimonials.length; // 24px for gap-6

      // Calculate new position with frame-rate independent speed
      let newX = currentX - (0.5 * delta / 16);

      // Handle wrapping when we've scrolled through one complete set
      // Only wrap when we're beyond the first complete set
      if (currentX <= -singleSetWidth) {
        // To make the transition smoother, calculate where we should be in the next set
        // Use modulo to wrap to the corresponding position in the next set
        newX = currentX % singleSetWidth;
        // If the result is positive, subtract the full set width to maintain the negative direction
        if (newX > 0) {
          newX = newX - singleSetWidth;
        }
      }

      x.set(newX);
    }
  });

  return (
    <div className="overflow-hidden">
      <motion.div
        ref={containerRef}
        className="flex gap-6 w-max cursor-grab"
        style={{ x }}
        drag="x"
        dragMomentum={false}
        whileTap={{ cursor: "grabbing" }}
        dragConstraints={{ left: -(measuredWidth + 24) * testimonials.length, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        dragElastic={0}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      >
        {quadrupleTestimonials.map((t, i) => (
          <TestimonialCard key={`${t.name}-${t.text.substring(0, 10)}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
}