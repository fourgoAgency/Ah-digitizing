import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFirestore } from "@/lib/firebaseAdmin";
import { ArrowLeft } from "lucide-react";

type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  content: string[];
  date: string;
  image: string;
  category: "Embroidery" | "Vector" | "Reviews";
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    if (adminFirestore) {
      const snapshot = await adminFirestore.collection("blogs").get();
      return snapshot.docs
        .map((d) => d.get("slug"))
        .filter((slug): slug is string => typeof slug === "string")
        .map((slug) => ({ slug }));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("generateStaticParams Firestore error:", err);
  }

  return [];
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug?: string }> }) {
  const { slug } = await params;

  if (typeof slug !== "string" || !slug) {
    notFound();
  }

  let post: BlogPost | undefined;
  let allPosts: BlogPost[] = [];

  try {
    if (adminFirestore) {
      const postQuery = await adminFirestore
        .collection("blogs")
        .where("slug", "==", slug)
        .limit(1)
        .get();

      if (!postQuery.empty) {
        const doc = postQuery.docs[0];
        const data = doc.data() as Omit<BlogPost, "id">;
        post = { ...data, id: doc.id };
      }

      const snapshot = await adminFirestore.collection("blogs").get();
      allPosts = snapshot.docs.map((d) => {
        const data = d.data() as Omit<BlogPost, "id">;
        return { ...data, id: d.id };
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error fetching blog post from Firestore:", err);
  }

  if (!post) {
    notFound();
  }

  const currentIndex = allPosts.findIndex((item) => item.slug === slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <main className="bg-[#f3f4f6] py-10 sm:py-12 2xl:py-16 4k:py-24">
      <article className="mx-auto w-full max-w-245 px-4 sm:px-6 lg:px-8 2xl:max-w-300 4k:max-w-[1500px]">
        <Link
          href="/blogs"
          className="inline-flex rounded-md border cursor-pointer border-[#dfe3ea] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-primary"
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
                  className="inline-flex items-center rounded-md border cursor-pointer border-[#dfe3ea] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-primary"
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
                  className="inline-flex items-center rounded-md border cursor-pointer border-[#dfe3ea] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-primary"
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
