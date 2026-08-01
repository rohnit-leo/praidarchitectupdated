import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/blog';
import { BlogPost } from '../types';
import { FileText, ArrowUpRight, X, Clock, Calendar, User, Tag } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  return (
    <section className="py-24 bg-slate-50 text-slate-900 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-blue-900 font-mono-tech text-xs tracking-[0.3em] uppercase font-bold">Architectural Knowledge Center</span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-slate-900 mt-2">Journal & Engineering Whitepapers</h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md font-sans-body mt-4 md:mt-0 leading-relaxed">
            Insights on post-tensioned concrete cantilevers, biophilic microclimates, and luxury interior materiality.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              onClick={() => setActiveArticle(post)}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-blue-900/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-[10px] font-mono-tech text-blue-900 font-bold shadow-sm">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-mono-tech text-slate-500 font-semibold">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="font-serif-display text-xl text-slate-900 group-hover:text-blue-900 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-sans-body leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-mono-tech text-blue-900 font-bold group-hover:text-blue-700">
                <span>Read Full Article</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="max-w-3xl w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 relative my-8 max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pr-12">
              <span className="text-blue-900 font-mono-tech text-xs tracking-widest font-bold uppercase block mb-2">
                {activeArticle.category} • {activeArticle.readTime}
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl text-slate-900 mb-3">{activeArticle.title}</h2>
              <div className="text-xs font-mono-tech text-slate-500 flex items-center gap-4">
                <span>By {activeArticle.author}</span>
                <span>Published {activeArticle.date}</span>
              </div>
            </div>

            <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 mb-8 shadow-sm">
              <img src={activeArticle.featuredImage} alt={activeArticle.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            <div className="prose max-w-none text-xs sm:text-sm font-sans-body text-slate-700 leading-relaxed whitespace-pre-line">
              {activeArticle.content}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
