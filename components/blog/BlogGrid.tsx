import { useRef, useEffect, useState, Key } from "react";
import { motion, useInView } from "framer-motion";
import { BlogPost } from "@/data/blogData";
import BlogCard from "./BlogCard";

type BlogGridProps = {
  posts: BlogPost[];
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (row: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: row * 0.15, duration: 0.4, ease: "easeOut" as const },
  }),
};


  export default function BlogGrid({ posts }: BlogGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowMap, setRowMap] = useState<number[]>([]);
const chunk = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.children) as HTMLElement[];
    const tops = cards.map((c) => c.getBoundingClientRect().top);

    // Assign row index by grouping equal top values
    const uniqueTops = [...new Set(tops)];
    setRowMap(tops.map((t) => uniqueTops.indexOf(t)));
  }, [posts]);

  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const cols = 2; // match your grid cols, or detect dynamically
  const rows = chunk(posts, cols); // lodash or write your own

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
      {rows.map((rowPosts: BlogPost[], rowIndex:number) => (
        <AnimatedRow key={rowIndex} cards={rowPosts} rowIndex={rowIndex} />
      ))}
    </div>
  );
};
function AnimatedRow({ cards, rowIndex }: { cards: BlogPost[]; rowIndex: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      {cards.map((post, i) => (
        <motion.div
          key={post.id}
          ref={i === 0 ? ref : undefined} // attach to first card in row
          variants={cardVariants}
          custom={rowIndex}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <BlogCard post={post} />
        </motion.div>
      ))}
    </>
  );
}