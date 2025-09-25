import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { posts } from '@/lib/blog/posts';

export const revalidate = 3600;

export function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}

/** 工具：规范化 meta */
function clampTitle(t: string) {
  let full = `${t} | ScanQRly`;
  return full.length <= 60 ? full : (t.slice(0, 57) + '…');
}
function clampDesc(s: string) {
  const clean = s.replace(/\s+/g, ' ').trim();
  if (clean.length >= 140 && clean.length <= 160) return clean;
  const pad = ' Scan QR codes online from camera or image — no app, privacy-first.';
  const merged = (clean + (clean.length < 140 ? pad : '')).replace(/\s+/g, ' ').trim();
  return merged.length > 160 ? (merged.slice(0, 157) + '…') : merged;
}

/** 极简 Markdown→HTML（支持 ##/###/列表/分段/链接）+ 内链 */
function mdLiteToHtml(src: string) {
  const esc = (s: string) =>
    s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const slug = (s: string) => s.toLowerCase().replace(/[^\w]+/g,'-').replace(/(^-|-$)/g,'');

  const linkify = (txt: string) => {
    // 1) Markdown links [text](https://...)
    let s = txt.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_m, label, url) => `<a href="${url}" title="${label}" target="_blank" rel="noopener">${label}</a>`
    );

    // Helpers
    const toRelative = (url: string) =>
      url.replace(/^https?:\/\/(www\.)?scanqrly\.xyz(\/[^\s)]*)?/i, (_m, _w, path) => path || '/');

    // Only replace outside existing <a>...</a>
    const replaceOutsideAnchors = (input: string, replacer: (chunk: string) => string) =>
      input
        .split(/(<a\b[^>]*>.*?<\/a>)/gi)
        .map((part, i) => (i % 2 ? part : replacer(part)))
        .join('');

    // 2) Internal relative links like /scan /faq /blog (outside anchors only)
    s = replaceOutsideAnchors(s, (chunk) =>
      chunk.replace(/(^|[\s(])((?:\/(?:scan|faq|blog)[^\s)]*))/g, (_m, pre, url) => `${pre}<a href="${url}" title="Go to ${url}">${url}</a>`)
    );

    // 3) Bare http(s) links → make anchors; normalize scanqrly domain to relative (outside anchors only)
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
      <h1 className="text-3xl font-bold mb-3" title={post.title}>{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-8" title={new Date(post.date).toDateString()}>
        {new Date(post.date).toLocaleDateString()}
      </p>
      <article
        className="prose prose-lg lg:prose-xl leading-relaxed max-w-none prose-headings:mt-10 prose-headings:mb-4 prose-p:mb-6 prose-li:mb-2 prose-hr:my-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <footer className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Try Our Free QR Scanner Tools</h2>
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