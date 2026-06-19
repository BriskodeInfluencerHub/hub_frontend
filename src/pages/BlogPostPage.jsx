import React from 'react';
import Navbar from '../components/Navbar';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

const BlogPostPage = () => {
  const { slug } = useParams();

  const post = {
    title: 'How to negotiate creator rates using escrow agreements',
    category: 'Guides',
    date: 'June 18, 2026',
    readTime: '5 min read',
    content: `
      In the influencer marketing landscape, negotiations can drag on for weeks. Content creators are hesitant to start work without deposits, while brands are reluctant to pay before seeing final assets.

      This is where escrow agreements enter. By utilizing smart platform holds, the campaign budget is locked safely before content creation begins.

      Milestone structures allow both creators and brands to align on terms, timelines, and payouts without stress.
    `
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
        <Link to="/blog" className="inline-flex items-center text-xs font-bold text-neutral-500 hover:text-brand-500 mb-8">
          <ArrowLeft size={14} className="mr-1.5" />
          <span>Back to Bulletin</span>
        </Link>

        <article className="space-y-6">
          <div className="flex items-center space-x-3 text-xs text-neutral-400">
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-bold text-brand-600">{post.category}</span>
            <span className="flex items-center"><Calendar size={12} className="mr-1" /> {post.date}</span>
            <span className="flex items-center"><Clock size={12} className="mr-1" /> {post.readTime}</span>
          </div>

          <h1 className="text-3xl font-extrabold font-display tracking-tight text-neutral-950 leading-tight">
            {post.title}
          </h1>

          <div className="text-sm text-neutral-600 leading-relaxed space-y-6 border-t border-neutral-200 pt-6">
            {post.content.split('\n\n').map((para, idx) => (
              <p key={idx}>{para.trim()}</p>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogPostPage;
