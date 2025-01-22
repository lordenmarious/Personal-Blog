import Head from 'next/head';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Web Development",
    excerpt: "My journey into the world of web development and what I've learned so far.",
    date: "2024-03-20"
  },
  {
    id: 2,
    title: "The Power of React",
    excerpt: "Why React has become my favorite frontend framework.",
    date: "2024-03-18"
  },
  {
    id: 3,
    title: "Building Your First Website",
    excerpt: "A step-by-step guide to creating your first website from scratch.",
    date: "2024-03-15"
  }
];

export default function Blog() {
  return (
    <div className="container">
      <Head>
        <title>Blog Posts | Personal Blog</title>
        <meta name="description" content="Read my latest blog posts" />
      </Head>

      <main className="main">
        <h1 className="title">Blog Posts</h1>
        
        <div className="posts">
          {blogPosts.map((post) => (
            <article key={post.id} className="post-card">
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className="post-meta">
                <span>{post.date}</span>
                <Link href={`/blog/${post.id}`}>Read more &rarr;</Link>
              </div>
            </article>
          ))}
        </div>

        <Link href="/" className="back-link">
          &larr; Back to Home
        </Link>
      </main>
    </div>
  );
} 