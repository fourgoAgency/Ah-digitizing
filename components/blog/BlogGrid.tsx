import BlogCard from "./BlogCard";
import type { BlogPost } from "../../data/blogData";

type BlogGridProps = {
  posts: BlogPost[];
};

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3 4k:grid-cols-4 4k:gap-7">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
