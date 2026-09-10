import React, { useState, useEffect } from "react";
import { Search, Calendar, User, Clock, ArrowRight, Heart, Share2, BookOpen } from "lucide-react";
import { getBlogs } from "../../api/blogApi";

export default function PatientBlog() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [searchTerm, blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getBlogs();
      if (response.status === 1 || response.blogs) {
        const patientBlogs = (response.blogs || []).filter(blog => blog.type === "Patient");
        setBlogs(patientBlogs);
        setFilteredBlogs(patientBlogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (description) => {
    const wordsPerMinute = 200;
    const text = description?.replace(/<[^>]*>?/gm, '') || '';
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-primary to-brand-hover rounded-2xl p-8 text-white shadow-lg shadow-brand-primary/20">
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-white/10 blur-3xl translate-x-12 -translate-y-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={24} className="text-green-200" />
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest bg-white/10 text-green-200 border border-green-200/30 px-3 py-1.5 rounded-full">
              Health & Wellness
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold max-w-xl leading-tight tracking-tight mb-3">
            Your Path to <span className="text-green-200 font-black">Natural Healing</span>
          </h1>
          
          <p className="text-white/80 text-sm max-w-xl leading-relaxed mb-6">
            Discover expert insights on homeopathy, wellness tips, and natural health solutions tailored for your journey to better health.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search health articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Blog Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-light rounded-xl">
              <BookOpen size={20} className="text-brand-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredBlogs.length}</p>
              <p className="text-xs text-gray-500">Total Articles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredBlogs.reduce((acc, blog) => acc + getReadingTime(blog.description), 0)} min
              </p>
              <p className="text-xs text-gray-500">Total Reading Time</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-xl">
              <BookOpen size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredBlogs.length}</p>
              <p className="text-xs text-gray-500">Available Articles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading articles...</p>
          </div>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-100 shadow-sm text-center">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => handleBlogClick(blog)}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-brand-primary/10 hover:border-brand-primary/30 transition-all duration-300 cursor-pointer"
            >
              {/* Blog Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-light to-brand-primary/20">
                {blog.Image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${blog.Image}`}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={48} className="text-brand-primary/30" />
                  </div>
                )}

              </div>

              {/* Blog Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
                  {blog.title}
                </h3>
                
                <p 
                  className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: blog.description?.replace(/<[^>]*>?/gm, '') || "" 
                  }}
                />

                {/* Blog Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{getReadingTime(blog.description)} min read</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-primary font-medium group-hover:translate-x-1 transition-transform">
                    <span>Read More</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Detail Modal */}
      {showBlogModal && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-brand-light to-brand-primary/20">
              {selectedBlog.Image ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/${selectedBlog.Image}`}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen size={64} className="text-brand-primary/30" />
                </div>
              )}
              <button
                onClick={() => setShowBlogModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedBlog.title}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              {/* Blog Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-brand-primary" />
                  <span>{formatDate(selectedBlog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-brand-primary" />
                  <span>{getReadingTime(selectedBlog.description)} min read</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} className="text-brand-primary" />
                  <span>Leaf Homeo Expert</span>
                </div>
              </div>

              {/* Blog Description */}
              <div 
                className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
              />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-light text-brand-primary rounded-xl font-medium hover:bg-brand-primary hover:text-white transition-all">
                  <Heart size={18} />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}