import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { posts } from '@/lib/blog/posts';
// If Post type is imported, extend it here. Otherwise, define it locally:
type Post = {
  slug: string;
  title: string;
  content?: string;
  excerpt?: string;
  date?: string;
  image?: string;
  [key: string]: any;
};

export const revalidate = 3600;

export function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}

function clampTitle(t: string) {
  let full = `${t} | ScanQRly`;
  // Clamp to 60 chars total (including " | ScanQRly"), but trim at a word break for readability.
  // The main title should be clamped to 55 chars, then add ellipsis and suffix.
  return full.length <= 60 ? full : (t.slice(0, 55).trimEnd() + '…');
}
function clampDesc(s: string) {
  const clean = s.replace(/\s+/g, ' ').trim();
  if (clean.length >= 140 && clean.length <= 160) return clean;
  const pad = ' Scan QR codes online from camera or image — no app, privacy-first.';
  const merged = (clean + (clean.length < 140 ? pad : '')).replace(/\s+/g, ' ').trim();
  return merged.length > 160 ? (merged.slice(0, 157) + '…') : merged;
}

function mdLiteToHtml(src: string) {
  const esc = (s: string) =>
    s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const slug = (s: string) => s.toLowerCase().replace(/[^\w]+/g,'-').replace(/(^-|-$)/g,'');

  const linkify = (txt: string) => {
    let s = txt.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_m, label, url) => `<a href="${url}" title="${label}" target="_blank" rel="noopener">${label}</a>`
    );

    const toRelative = (url: string) =>
      url.replace(/^https?:\/\/(www\.)?scanqrly\.xyz(\/[^\s)]*)?/i, (_m, _w, path) => path || '/');

    const replaceOutsideAnchors = (input: string, replacer: (chunk: string) => string) =>
      input
        .split(/(<a\b[^>]*>.*?<\/a>)/gi)
        .map((part, i) => (i % 2 ? part : replacer(part)))
        .join('');

    s = replaceOutsideAnchors(s, (chunk) =>
      chunk.replace(/(^|[\s(])((?:\/(?:scan|faq|blog)[^\s)]*))/g, (_m, pre, url) => `${pre}<a href="${url}" title="Go to ${url}">${url}</a>`)
    );

    s = replaceOutsideAnchors(s, (chunk) =>
      chunk.replace(/(https?:\/\/[^\s)]+)/g, (_m, url) => {
        const href = toRelative(url);
        const isInternal = href.startsWith('/');
        const title = isInternal ? `Go to ${href}` : `External link to ${url}`;
        return `<a href="${href}" title="${title}"${isInternal ? '' : ' target="_blank" rel="noopener"'}>${url}</a>`;
      })
    );

    return s;
  };

  const lines = src.split(/\r?\n/);
  const out: string[] = [];
  let list: null | 'ul' | 'ol' = null;

  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line) { closeList(); continue; }
    if (/^---+$/.test(line)) { closeList(); out.push('<hr/>'); continue; }

    let m: RegExpMatchArray | null;
    if ((m = line.match(/^###\s+(.+)/))) {
      closeList();
      out.push(`<h3 id="${slug(m[1])}">${esc(m[1])}</h3>`);
      continue;
    }
    if ((m = line.match(/^##\s+(.+)/))) {
      closeList();
      out.push(`<h2 id="${slug(m[1])}">${esc(m[1])}</h2>`);
      continue;
    }
    if ((m = line.match(/^\d+\.\s+(.+)/))) {
      if (list !== 'ol') { closeList(); list = 'ol'; out.push('<ol>'); }
      out.push(`<li>${esc(m[1])}</li>`);
      continue;
    }
    if ((m = line.match(/^-\s+(.+)/))) {
      if (list !== 'ul') { closeList(); list = 'ul'; out.push('<ul>'); }
      out.push(`<li>${esc(m[1])}</li>`);
      continue;
    }
    closeList();
    out.push(`<p>${esc(line)}</p>`);
  }
  closeList();
  return out.join('\n');
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = posts.find(p => p.slug === slug);
  if (!post) return {};

  const rawDesc =
    post?.excerpt && typeof post.excerpt === 'string'
      ? post.excerpt
      : (typeof post?.content === 'string' ? post.content.slice(0, 200) : 'Default description for QR code blog post.');

  return {
    title: clampTitle(post.title),
    description: clampDesc(rawDesc),
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: clampTitle(post.title),
      description: clampDesc(rawDesc),
      url: `/blog/${slug}`,
      type: 'article',
    },
  };
}

export default async function BlogPostPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const post = posts.find(p => p.slug === slug);
  if (!post) return notFound();

  const html =
    'html' in (post as any)
      ? (post as any).html
      : mdLiteToHtml(String(post.content || ''));

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-6" title={post.title}>{post.title}</h1>
      <div className="h-1 w-24 mx-auto mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
      <p className="text-center text-gray-500 text-sm mb-10" title={post.date && !isNaN(new Date(post.date).getTime()) ? new Date(post.date).toDateString() : undefined}>
        {post.date && !isNaN(new Date(post.date).getTime()) ? new Date(post.date).toLocaleDateString() : 'Date unavailable'}
      </p>
      <article
        className="prose prose-lg lg:prose-xl leading-relaxed max-w-none bg-gray-50 p-8 rounded-xl shadow-sm prose-headings:mt-10 prose-headings:mb-4 prose-p:mb-6 prose-li:mb-2 prose-hr:my-10"
        dangerouslySetInnerHTML={{ __html: html || '<p>No content available.</p>' }}
      />
      <footer className="mt-16 border-t pt-10 bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-4">Explore More Free QR Tools</h2>
        <ul className="space-y-2">
          <li>
            <a href="/scan#camera" title="Camera QR Scanner — scan with your webcam" className="underline underline-offset-2">Camera QR Scanner</a>
          </li>
          <li>
            <a href="/scan#upload" title="Upload QR Code — decode images and screenshots" className="underline underline-offset-2">Upload QR Code Tool</a>
          </li>
          <li>
            <a href="/scan" title="Main Scan Page — all features" className="underline underline-offset-2">Main Scan Page</a>
          </li>
        </ul>
      </footer>
    </main>
  );
}

export const dynamicParams = false;