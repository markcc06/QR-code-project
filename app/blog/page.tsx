import Link from 'next/link';
import type { Metadata } from 'next';
import { posts } from '@/lib/blog/posts';

export const metadata: Metadata = {
  title: 'QR Code Scanner Blog • Guides & Tips | ScanQRly',
  description: 'Expert guides and tips for scanning QR codes online — fast, private and secure with ScanQRly. Learn best practices for a smooth QR experience.',
};

export default function BlogIndexPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Blog</h1>
        <p className="text-sm text-muted-foreground" id="blog-description">Latest guides & updates.</p>
      </header>

      <section className="space-y-10" aria-labelledby="blog-heading">
        {posts.map(post => (
          <article key={post.slug} className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-semibold" aria-label={`Article title: ${post.title}`}>
              <Link
                href={`/blog/${post.slug}`}
                className="hover:underline"
                aria-label={`Read blog post: ${post.title}`}
                title={post.title}
              >
                {post.title}
              </Link>
            </h2>
            {post.excerpt ? (
              <>
                <h3 className="mt-1 text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })}
                </h3>
                <p className="mt-3 text-base text-zinc-700" title={post.title}>{post.excerpt}</p>
                <h3 className="sr-only">Continue reading {post.title}</h3>
              </>
            ) : (
              <h3 className="mt-1 text-xs text-muted-foreground">
                {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })}
              </h3>
            )}
            <div className="mt-4">
              <Link
                href={`/blog/${post.slug}`}
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
    </main>
  );
}