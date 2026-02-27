import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "../../data/blogData";

type BlogCardProps = {
  post: BlogPost;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#dfe3ea] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1535px) 50vw, (max-width: 2559px) 33vw, 25vw"
        />
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-slate-900">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
          {post.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">{post.date}</span>
          <Link
            href={`/blogs/${post.slug}`}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-secondary"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
}
