 "use client";

import { useMemo, useState, useEffect } from "react";
import BlogGrid from "./BlogGrid";
import BlogPagination from "./BlogPagination";
import BlogToolbar from "./BlogToolbar";
import { motion } from "framer-motion";
import type { BlogPost } from "../../data/blogData";
import { getDocuments } from "../../lib/firebase";
import { blogPosts as fallbackBlogPosts } from "../../data/blogData";
const POSTS_PER_PAGE = 8;

function toTimestamp(dateText: string) {
  const value = new Date(dateText).getTime();
  return Number.isNaN(value) ? 0 : value;
}
const headingVariants = {
  hidden: { y: 40, opacity: 0, scale: 1.02 },
  visible: {
    y: 0, opacity: 1, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};
export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchBlogPosts() {
      try {
        setIsLoading(true);
        const fetchedPosts = await getDocuments<BlogPost>("blogs");
        if (!isMounted) return;
        setPosts(
          fetchedPosts
            .map((post) => ({
              ...post,
              id: String(post.id),
            }))
            .filter((post) => post.isPublished !== false)
        );
      } catch (fetchError) {
        if (!isMounted) return;
        console.error("Failed to fetch blog posts from Firestore:", fetchError);
        setError("Unable to load posts right now. Showing default content.");
        setPosts(fallbackBlogPosts);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    fetchBlogPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAndSortedPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        query.length === 0 ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "oldest") {
        return toTimestamp(a.date) - toTimestamp(b.date);
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return toTimestamp(b.date) - toTimestamp(a.date);
    });
  }, [searchTerm, selectedCategory, sortBy, posts]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * POSTS_PER_PAGE;
  const visiblePosts = filteredAndSortedPosts.slice(start, start + POSTS_PER_PAGE);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const toggleSortDirection = () => {
    setSortBy((prev) => (prev === "newest" ? "oldest" : "newest"));
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <section className="bg-[#f3f4f6] py-10 sm:py-12 2xl:py-16 4k:py-24">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6 lg:px-8 2xl:max-w-420 2xl:px-10 4k:max-w-[2200px] 4k:px-16">
        <motion.h1   initial="hidden"
  animate="visible" variants={headingVariants} className="text-2xl font-bold text-slate-900 sm:text-3xl 2xl:text-[34px] 4k:text-4xl">
          Latest Articles
        </motion.h1>
        <div className="mt-5">
          <BlogToolbar
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onReset={handleReset}
            onToggleSortDirection={toggleSortDirection}
          />
        </div>
        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-rose-700">
            {error}
          </div>
        ) : null}
        {isLoading ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#dfe3ea] bg-white p-8 text-center text-slate-500">
            Loading posts...
          </div>
        ) : visiblePosts.length > 0 ? (
          <BlogGrid posts={visiblePosts} />
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-[#dfe3ea] bg-white p-8 text-center text-slate-500">
            No posts found for your current filters.
          </div>
        )}
        <BlogPagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}
