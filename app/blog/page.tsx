'use client';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
// If getSortedPosts is a default export, use:
import { getSortedPosts } from '@/lib/blog/posts';
// If not, ensure '@/lib/blog/posts' exports getSortedPosts as a named export.


const PAGE_SIZE = 3; // 每页文章数

/** Stable UTC date formatter (SSR/CSR identical) */
function formatDateYMD(dateStr: string) {
  const d = new Date(dateStr.replace(/\//g, '-'));
  if (isNaN(d.getTime())) return 'Date unavailable';
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function BlogIndexPage() {
  return (
    <Suspense fallback={null}>
      <BlogIndexInner />
    </Suspense>
  );
}

function BlogIndexInner() {
  const searchParams = useSearchParams();
  const rawPage = searchParams.get('page') || '1';
  const requestedPage = Number.isNaN(Number(rawPage)) ? 1 : Math.max(1, parseInt(rawPage, 10));

  const sorted = useMemo(() => {
    try {
      const posts = getSortedPosts();
      return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
      console.error('[blog] getSortedPosts failed:', e);
      return [];
    }
  }, []);
  // Derive the Post item type from the getter to satisfy TS without importing a type.
  type PostItem = ReturnType<typeof getSortedPosts>[number];


  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pagePosts: PostItem[] = sorted.slice(start, start + PAGE_SIZE);

  return (
    <main key={page} className="container mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2 text-center text-gray-900">Blog</h1>
        <div className="mx-auto mb-6 h-1 w-24 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <p className="text-sm text-gray-500 text-center max-w-2xl mx-auto" id="blog-description">
          Read the latest guides, updates, and insights from ScanQRly.
        </p>
      </header>

      {pagePosts.length === 0 ? (
        <p className="text-gray-500 text-center py-10" aria-live="polite">No blog posts found.</p>
      ) : (
        <section
          className="space-y-10 border-t border-gray-100 pt-10 rounded-xl p-8 shadow-sm bg-gray-50"
          aria-labelledby="blog-heading"
        >
          {pagePosts.map((post: PostItem) => (
            <article key={post.slug} className="border-b border-gray-200 pb-8" aria-labelledby={`post-${post.slug}`}>
              <h2 id={`post-${post.slug}`} className="text-2xl font-semibold">
                <Link
                  href={`/blog/${post.slug}`}
                  rel="bookmark"
                  className="hover:underline"
                  aria-label={`Read blog post: ${post.title}`}
                  title={post.title}
                >
                  {post.title}
                </Link>
              </h2>
              <time
                dateTime={post.date}
                suppressHydrationWarning
                className="block mt-1 text-xs text-muted-foreground"
              >
                {formatDateYMD(post.date)}
              </time>
              {post.excerpt && <p className="mt-3 text-base text-zinc-700 line-clamp-3">{post.excerpt}</p>}
              <div className="mt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  rel="bookmark"
                  className="text-blue-600 hover:underline text-sm"
                  aria-label={`Continue reading: ${post.title}`}
                  title={`Read full article: ${post.title} | ScanQRly Blog`}
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* 分页导航 */}
      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-between" aria-label="Pagination">
          <Link
            href={`/blog?page=${Math.max(1, page - 1)}`}
            aria-disabled={page === 1}
            className={`px-3 py-2 rounded border text-sm ${
              page === 1 ? 'pointer-events-none opacity-40' : 'hover:bg-gray-100'
            }`}
          >
            ← Prev
          </Link>

          <ul className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              const active = n === page;
              return (
                <li key={n}>
                  <Link
                    href={`/blog?page=${n}`}
                    aria-current={active ? 'page' : undefined}
                    className={`px-3 py-2 rounded border text-sm ${
                      active ? 'bg-gray-900 text-white border-gray-900' : 'hover:bg-gray-100'
                    }`}
                  >
                    {n}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href={`/blog?page=${Math.min(totalPages, page + 1)}`}
            aria-disabled={page === totalPages}
            className={`px-3 py-2 rounded border text-sm ${
              page === totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-gray-100'
            }`}
          >
            Next →
          </Link>
        </nav>
      )}
    </main>
  );
}