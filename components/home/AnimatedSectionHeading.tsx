"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type AnimatedSectionHeadingProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
};

export default function AnimatedSectionHeading<T extends ElementType = "h2">({
  as,
  children,
  className,
}: AnimatedSectionHeadingProps<T>) {
  const Component = (as ?? "h2") as ElementType;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <Component className={className}>{children}</Component>
    </motion.div>
  );
}
