// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { posts, type Post } from '@/lib/blog/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.scanqrly.xyz'

  const staticEntries = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${base}/scan`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  const postEntries = posts.map((post: Post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...postEntries]
}
