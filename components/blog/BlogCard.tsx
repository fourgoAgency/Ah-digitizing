import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "../../data/blogData";
import { motion } from "framer-motion";
const headingVariants = {
  hidden: { y: 40, opacity: 0, scale: 1.02 },
  visible: {
    y: 0, opacity: 1, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type BlogCardProps = {
  post: BlogPost;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.article   initial="hidden"
  animate="visible" variants={cardVariants} className="overflow-hidden rounded-2xl border border-[#dfe3ea] bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
      <Link
            href={`/blogs/${post.slug}`}
          ><div className="relative h-44 w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1535px) 50vw, (max-width: 2559px) 33vw, 25vw"
        />
      </div>

      <div className="p-4">
        <motion.h3   initial="hidden"
  animate="visible" className="text-base font-semibold text-slate-900" variants={headingVariants}>{post.title}</motion.h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
          {post.description}
        </p>

          
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">{post.date}</span>
          <div className="cursor-pointer rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-secondary">
            Read More
          </div>
        </div>
      </div>
          </Link>
    </motion.article>
  );
}
