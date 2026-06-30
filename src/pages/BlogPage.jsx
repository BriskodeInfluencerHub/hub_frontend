import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const BlogPage = () => {
  const posts = [
    {
      slug: 'negotiating-creator-rates-escrow',
      title: 'How to negotiate fair creator rates using locked escrow agreements',
      excerpt: 'Brands and influencers often spend weeks debating contract terms. Learn how locking milestones in secure wallets speeds up matching.',
      category: 'Guides',
      date: 'June 18, 2026',
      readTime: '5 min read'
    },
    {
      slug: 'combatting-follower-inflation-engagement-stats',
      title: 'Beyond follower counts: How to measure real conversion rates',
      excerpt: 'Follower counts are a legacy metric. Here is how leading brand managers calculate conversion and engagement from raw API metrics.',
      category: 'Analytics',
      date: 'June 10, 2026',
      readTime: '7 min read'
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
        <div className="mb-12 border-b border-neutral-200 pb-6">
          <span className="font-utility text-xs text-brand-500 uppercase tracking-wider font-bold">Resources & Insights</span>
          <h1 className="text-4xl font-extrabold font-display tracking-tight text-neutral-900 mt-2">
            The Odisha Influencer Market Bulletin
          </h1>
        </div>

        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.slug} className="group border-b border-neutral-100 pb-8 last:border-0">
              <div className="flex items-center space-x-3 text-xs text-neutral-450 mb-2.5">
                <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-bold text-brand-650">{post.category}</span>
                <span className="flex items-center"><Calendar size={12} className="mr-1" /> {post.date}</span>
                <span className="flex items-center"><Clock size={12} className="mr-1" /> {post.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold font-display text-neutral-900 group-hover:text-brand-500 transition-colors">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-3 text-sm text-neutral-500 leading-relaxed">{post.excerpt}</p>
              <div className="mt-4">
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
