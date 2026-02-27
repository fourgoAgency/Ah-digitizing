import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogData";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentIndex = blogPosts.findIndex((item) => item.slug === slug);
  const post = currentIndex >= 0 ? blogPosts[currentIndex] : undefined;

  if (!post) {
    notFound();
  }

  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <main className="bg-[#f3f4f6] py-10 sm:py-12 2xl:py-16 4k:py-24">
      <article className="mx-auto w-full max-w-245 px-4 sm:px-6 lg:px-8 2xl:max-w-300 4k:max-w-[1500px]">
        <Link
          href="/blogs"
          className="inline-flex rounded-md border border-[#dfe3ea] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#dfe3ea] bg-white shadow-sm">
          <div className="relative h-56 w-full sm:h-72 lg:h-96 2xl:h-112 4k:h-[34rem]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 1100px"
              priority
            />
          </div>

          <div className="p-5 sm:p-8 2xl:p-10 4k:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {post.category}
            </p>
            <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl 2xl:text-[38px] 4k:text-5xl">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-slate-500">{post.date}</p>

            <p className="mt-5 text-base leading-7 text-slate-700 2xl:text-lg 2xl:leading-8">
              {post.description}
            </p>

            <div className="mt-6 space-y-5">
              {post.content.map((paragraph, index) => (
                <p
                  key={`${post.id}-paragraph-${index + 1}`}
                  className="text-[15px] leading-7 text-slate-700 2xl:text-lg 2xl:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-[#e7ebf0] pt-6 sm:flex-row sm:items-center sm:justify-between">
              {previousPost ? (
                <Link
                  href={`/blogs/${previousPost.slug}`}
                  className="inline-flex items-center rounded-md border border-[#dfe3ea] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-primary"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Link>
              ) : (
                <span className="inline-flex items-center rounded-md border border-[#eef2f6] bg-[#f8fafc] px-4 py-2 text-sm font-medium text-slate-400">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </span>
              )}

              {nextPost ? (
                <Link
                  href={`/blogs/${nextPost.slug}`}
                  className="inline-flex items-center rounded-md border border-[#dfe3ea] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-primary"
                >
                  Next
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Link>
              ) : (
                <span className="inline-flex items-center rounded-md border border-[#eef2f6] bg-[#f8fafc] px-4 py-2 text-sm font-medium text-slate-400">
                  Next
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
