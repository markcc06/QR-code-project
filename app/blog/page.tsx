import Link from 'next/link';
import type { Metadata } from 'next';
import { posts } from '@/lib/blog/posts';

export const metadata: Metadata = {
  title: 'Blog • ScanQRly',
  description: 'Guides, tips and troubleshooting for scanning QR codes online — no installs, private and fast.',
};

export default function BlogIndexPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Blog</h1>
        <p className="text-sm text-muted-foreground">Latest guides & updates.</p>
      </header>

      <section className="space-y-10">
        {posts.map(post => (
          <article key={post.slug} className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-semibold">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })}
            </p>
            {post.excerpt && (
              <p className="mt-3 text-base text-zinc-700">{post.excerpt}</p>
            )}
            <div className="mt-4">
              <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline text-sm">
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}