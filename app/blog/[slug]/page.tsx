import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { posts } from '@/lib/blog/posts';

export const revalidate = 3600;

// 预生成所有已知 slug（可选但推荐）
export function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}

// v15: params 是 Promise，要解构前 await
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  if (!post) return {};

  const desc =
    post.excerpt ??
    (typeof post.content === 'string'
      ? post.content.slice(0, 140) + '…'
      : '');

  return {
    title: `${post.title} • ScanQRly`,
    description: desc,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: desc,
      url: `/blog/${slug}`,
      type: 'article',
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;               // 这里也要 await
  const post = posts.find(p => p.slug === slug);
  if (!post) return notFound();

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {new Date(post.date).toLocaleDateString()}
      </p>

      {'html' in post
        ? <article dangerouslySetInnerHTML={{ __html: (post as any).html }} />
        : <article className="prose max-w-none whitespace-pre-wrap">
            {post.content}
          </article>}
    </main>
  );
}