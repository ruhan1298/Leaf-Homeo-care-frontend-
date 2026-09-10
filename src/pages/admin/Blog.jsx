import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Plus,
  X,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  FileText,
  Calendar,
  Tag,
  User,
  ChevronDown,
  Eye,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "../../api/blogApi";

const ENTRIES_OPTIONS = [5, 10, 25, 50];

// ReactQuill modules for toolbar
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

// ReactQuill formats
const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike', 'color', 'background',
  'list', 'bullet', 'align', 'link', 'image'
];

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "type", label: "Type" },
  { key: "description", label: "Description" },
  { key: "Image", label: "Image" },
  { key: "createdAt", label: "Created At" },
  { key: "actions", label: "Actions" },
];

const emptyForm = {
  id: null,
  title: "",
  description: "",
  type: "Patient",
  Image: null,
};

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBlogs();
      console.log("Blogs response:", response);
      if (response.status === 1 || response.blogs) {
        setBlogs(response.blogs || []);
      } else {
        // Handle error response
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to fetch blogs",
        });
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch blogs",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleAddClick = () => {
    setFormData(emptyForm);
    setPreviewImage(null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleEditClick = (blog) => {
    setFormData({
      id: blog.id,
      title: blog.title || "",
      description: blog.description || "",
      type: blog.type || "Patient",
      Image: null,
    });
    setPreviewImage(blog.Image ? `${import.meta.env.VITE_API_URL}/${blog.Image}` : null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleViewClick = (blog) => {
    setSelectedBlog(blog);
    setShowViewModal(true);
  };

  const handleDeleteClick = async (blog) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${blog.title}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteBlog(blog.id);
        console.log("Delete response:", response);
        if (response.status === 1) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: response.message || "Blog deleted successfully",
          });
          fetchBlogs();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.message || "Failed to delete blog",
          });
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete blog",
        });
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Title is required",
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        Image: imageFile,
      };

      console.log("Submitting blog data:", payload);

      let response;
      if (formData.id) {
        response = await updateBlog(payload);
      } else {
        response = await createBlog(payload);
      }

      console.log("API response:", response);

      if (response.status === 1) {
        Swal.fire({
          icon: "success",
          title: formData.id ? "Updated!" : "Created!",
          text: response.message || `Blog ${formData.id ? "updated" : "created"} successfully`,
        });
        setShowModal(false);
        fetchBlogs();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || `Failed to ${formData.id ? "update" : "create"} blog`,
        });
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to ${formData.id ? "update" : "create"} blog`,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / entriesPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTypeBadgeColor = (type) => {
    return type === "Doctor"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-green-50 text-green-700 border-green-200";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage blog posts</p>
          </div>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
          >
            <Plus size={18} />
            <span>Add Blog</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-light rounded-xl">
                <FileText size={20} className="text-brand-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
                <p className="text-xs text-gray-500">Total Blogs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {blogs.filter((b) => b.type === "Patient").length}
                </p>
                <p className="text-xs text-gray-500">Patient Blogs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-xl">
                <User size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {blogs.filter((b) => b.type === "Doctor").length}
                </p>
                <p className="text-xs text-gray-500">Doctor Blogs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
              >
                {ENTRIES_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-500">entries</span>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {COLUMNS.map((column) => (
                    <th
                      key={column.key}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-gray-500">
                      No blogs found
                    </td>
                  </tr>
                ) : (
                  paginatedBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{blog.title || "N/A"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeBadgeColor(
                            blog.type
                          )}`}
                        >
                          {blog.type || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div 
                          className="text-sm text-gray-600 max-w-xs truncate"
                          dangerouslySetInnerHTML={{ 
                            __html: blog.description?.replace(/<[^>]*>?/gm, '') || "N/A" 
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        {blog.Image ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}/${blog.Image}`}
                            alt={blog.title}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon size={20} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          {formatDate(blog.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewClick(blog)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditClick(blog)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(blog)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {paginatedBlogs.length} of {filteredBlogs.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {formData.id ? "Edit Blog" : "Add New Blog"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <FieldLabel required>Title</FieldLabel>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <FieldLabel required>Type</FieldLabel>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <FieldLabel>Description</FieldLabel>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <ReactQuill
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter blog description..."
                    style={{ minHeight: '200px' }}
                    className="bg-white"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <FieldLabel>Image</FieldLabel>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-primary transition-colors">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500 mb-2">
                        Drag and drop an image, or click to select
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block px-4 py-2 bg-brand-primary text-white rounded-lg cursor-pointer hover:bg-brand-primary/90 transition-colors"
                      >
                        Select Image
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : formData.id ? "Update Blog" : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Blog Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedBlog.Image && (
                <div>
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${selectedBlog.Image}`}
                    alt={selectedBlog.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
              )}

              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeBadgeColor(
                    selectedBlog.type
                  )}`}
                >
                  <Tag size={14} className="mr-1.5" />
                  {selectedBlog.type}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedBlog.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  {formatDate(selectedBlog.createdAt)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Description
                </h4>
                <div 
                  className="text-gray-700 blog-content"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default BlogManagement;