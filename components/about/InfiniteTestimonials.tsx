import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useState } from "react";
import TestimonialCard from "./TestimonialCard";

type Testimonial = {
  name: string;
  role: string;
  text: string;
};

export default function InfiniteTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);


  const tripleTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials,...testimonials];


  useAnimationFrame(() => {
    if (!isDragging) {
      const currentX = x.get();
      const cardWidth = 344; 
      const singleSetWidth = cardWidth * testimonials.length;

      
      let newX = currentX - 0.4;


      if (Math.abs(newX) >= singleSetWidth) {
        newX = newX + singleSetWidth;
      }

      x.set(newX);
    }
  });

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-6 w-max cursor-grab"
        style={{ x }}
        drag="x"
        dragMomentum={false}
        whileTap={{ cursor: "grabbing" }}
        dragConstraints={{ left: -344 * testimonials.length, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      >
        {tripleTestimonials.map((t, i) => (
          <TestimonialCard key={`testimonial-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );

}
