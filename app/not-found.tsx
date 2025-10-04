import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-gray-800">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="mb-6">
        Sorry, we couldn&rsquo;t find the page you&rsquo;re looking for.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </main>
  );
}